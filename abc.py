import os
from groq import Groq
import json  
import sys

# Initialize the Gorg client
client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

def get_suggestions(prompt):
    try:
        # Send the request to the Gorg API
        chat_completion = client.chat.completions.create(
            messages=[
                {"role": "user", "content": prompt}
            ],
            model="llama-3.3-70b-versatile",
        )

        # Extract the AI response
        response_content = chat_completion.choices[0].message.content.strip()

        # Split the response into tasks (assuming line-separated tasks in response)
        ai_suggestions = response_content.split("\n")

        # Format the response into JavaScript-compatible const array
        suggestions = [{"title": suggestion.strip()} for suggestion in ai_suggestions if suggestion.strip()]

        # Print the suggestions in the desired format
        
        for suggestion in suggestions:
            print(f'    {json.dumps(suggestion)},')
        print("];")
    
    except Exception as e:
        # Handle and print errors
        print(f"Error: {e}")

if __name__ == "__main__":
    prompt = "just give precise  5 short one liner suggestive tasks a user can do while " + str(sys.argv[1]) + " in simple short bullet points just start naming the task  nothing else no * not serial number just plain 5 points"
    get_suggestions(prompt)



