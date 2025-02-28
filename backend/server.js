


const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const { PythonShell } = require('python-shell');


const { spawn } = require('child_process');
const app = express();
const port = 5001; // Server running on port 5001



// Middleware

app.use(cors({
  origin: 'http://localhost:5173', // O nly allow frontend running on port 5173
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allow only GET and POST methods
  allowedHeaders: ['Content-Type', 'Authorization']// Allow only the necessary headers
}));
app.use(bodyParser.json()); // Parse incoming JSON requests


// MongoDB connection

mongoose.connect('mongodb://127.0.0.1:27017/FocusFlow', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("Connected to MongoDB");
}).catch(err => {
  console.error("Failed to connect to MongoDB", err);
});

// Define User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true }, 
});

// Define Task Schema
const taskSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Linking task to a user
  title: { type: String, required: true }, // Task title
  note: { type: String, default: '', }, // Additional notes for the task
  priority: { type: String, enum: ['low', 'med', 'high'], default: 'low' }, // Task priority with default
  deadline: { type: Date,default: new Date('2099-12-31'), }, // Deadline for the task
  source: { type: String }, // Source or origin of the task
  completed: { type: Boolean, default: false }, // Completion status
}, { timestamps: true }); // Adds createdAt and updatedAt fields

// User model
const User = mongoose.model('User', userSchema);

// Task model
const Task = mongoose.model('Task', taskSchema);











// To Register 
app.post('/api/register', async (req, res) => {
  const { username, password, email } = req.body;

  try {
    // Check if username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.json({ success: false, message: 'Username already exists' });
    }

    // Create new user
    const newUser = new User({ username, password, email });
    await newUser.save();

    return res.json({ success: true, userId: newUser._id });
  } catch (err) {
    console.error('Error during registration:', err);
    return res.status(500).json({ success: false, message: 'Server error during registration' });
  }
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if the user exists with matching username and password
    const user = await User.findOne({ username, password });
    if (!user) {
      return res.status(404).json({ success: false, message: 'Invalid credentials' });
    }

    // Fetch tasks for the logged-in user in the same query
    const tasks = await Task.find({ userId: user._id });

    // Send success response with user ID and tasks
    return res.json({ success: true, userId: user._id, tasks });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ success: false, message: 'Server error during login' });
  }
});

// API route for adding a task
app.post('/api/addtasks', async (req, res) => {
  console.log('Incoming task payload:', req.body);
  const { userId,title, note, priority, deadline, source } = req.body;

  try {
    // Create new task
    const newTask = new Task({
      userId, 
      title,
      note,
      priority,
      deadline,
      source,
      completed: false,
    });

    // Save task to database
    await newTask.save();
    console.log("New task from",source,"saved in database");
    // Send a response back with the new task data
    return res.json({ success: true, task: newTask });
  } catch (err) {
    console.error('Error adding task:', err);
    return res.status(500).json({ success: false, message: 'Server error while adding task' });
  }
});
// API route for deleting task
app.delete('/api/deletetask/:id', async (req, res) => {
  const { id } = req.params; // Extract task ID from URL parameters
  console.log('Incoming delete request for task ID:', id);

  try {
    // Find and delete the task by ID
    const deletedTask = await Task.findByIdAndDelete(id);

    // If no task is found, return an appropriate response
    if (!deletedTask) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    // Send a success response
    return res.json({ success: true, message: 'Task deleted successfully' });
  } catch (err) {
    console.error('Error deleting task:', err);
    return res.status(500).json({ success: false, message: 'Server error while deleting task' });
  }
});

// API route for editing a task
app.put('/api/edittask/:id', async (req, res) => {
  const { id } = req.params; // Extract task ID from URL parameters
  const { title, note, priority, deadline, completed } = req.body; // Extract updated task data from the request body

  console.log('Incoming edit request for task ID:', id, 'with data:', req.body);

  try {
    // Find and update the task by ID with the new data
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { title, note, priority, deadline, completed },
      { new: true } // Return the updated task document
    );

    // If no task is found, return an appropriate response
    if (!updatedTask) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    // Send a success response with the updated task data
    return res.json({ success: true, task: updatedTask });
  } catch (err) {
    console.error('Error updating task:', err);
    return res.status(500).json({ success: false, message: 'Server error while updating task }' });
  }
});

app.put('/api/toggleTask/:taskId', async (req, res) => {
  const { taskId } = req.params;
  try {
      const task = await Task.findById(taskId);
      if (!task) {
          return res.status(404).json({ success: false, message: 'Task not found' });
      }

      // Toggle the 'completed' status
      task.completed = !task.completed;
      await task.save();

      res.status(200).json({ success: true, message: 'Task toggled', task });
  } catch (err) {
      console.error('Error toggling task:', err);
      res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.post('/api/get-suggestions', async (req, res) => {
  const { prompt } = req.body; // Get the user input prompt
  const pythonEnv = { ...process.env, GROQ_API_KEY: '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' };

  const childPython = await spawn('python3',['abc.py',prompt],{ env: pythonEnv });
  let output = '';
  childPython.stdout.on('data', (data) => {
     console.log('Python script output:', data.toString());
     output += data.toString();
   });
   childPython.on('close', (code) => {
    res.send({ result: output });
  });
    
   
  
  // return res.json([]);
  // childPython.stderr.on('data', (data) => {
  //   console.error('Python script error:', data.toString());
  // });
  
  // childPython.on('close', (code) => {
  //   console.log(`Python script finished with exit code ${code}`);
  // });
  
});


// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
  

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
