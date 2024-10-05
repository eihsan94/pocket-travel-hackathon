import os
import json
import re
from mistralai import Mistral

# Set the API key and model to use
api_key = '98ytikwtsR46VLzJgYqgHjv9KJjdIR8e'
model = "mistral-large-latest"

# Create a client to interact with the Mistral API
client = Mistral(api_key=api_key)

# Variable to store conversation history, including a system message to define the assistant's behavior
conversation_history = [
    {
        "role": "system",
        "content": "You are an agent that identifies location, the days of the plan, and the starting date from the user-provided information. \
        You need to infer the according country code, the according country code by yourself.\
        If all information is recognized, please ignore the user's original question and return a JSON output that includes 'location', 'country', 'country code','length', 'starting date', \
        and exit the loop. \
        If any information is missing, prompt the user for the missing details (DO NOT mention JSON). \
        Please DO NOT repeatly asked the information the user has been provided!\
        If user mention a x days plan, it menas that the user it gonna stay x days in somewhere.\
        The default year should be 2024 if the user did not mention.\
        Please infer the according country from the location by yourself, if you can not, please ask the user which accoring country is.\
        Please DO NOT ask the user about the country code, please infer the according country code from the country according to the Google GL Parameter.\
        The JSON format should be: \
        ```json\n{\n  \"location\": string,\n  \"country\": string,\n \"countryCode\": string,\n \"days\": int (number),\n  \"startingDate\": \"xxxx-xx-xx\",\n}```"
    }
]

# Start a loop to allow continuous conversation
while True:
    # Get user input
    user_input = input("You: ")

    # Add the user's input to the conversation history
    conversation_history.append({
        "role": "user",
        "content": user_input
    })

    # Call the API to get a response to identify the required information
    chat_response = client.chat.complete(
        model=model,
        messages=conversation_history
    )

    # Extract the model's response
    response_content = chat_response.choices[0].message.content
    print(f"Bot: {response_content}")

    # Check if the response contains all required information
    if "location" in response_content and "days" in response_content and "startingDate" in response_content and "country" in response_content and "countryCode" in response_content:
        # Extract the JSON from the response content using regex
        json_match = re.search(r'```json\n({.*?})\n```', response_content, re.DOTALL)
        if json_match:
            json_string = json_match.group(1)
            extracted_info = json.loads(json_string)
            print("Extracted Information as Dictionary: ")
            print(extracted_info)
            break
    else:
        # Add the assistant's response to the conversation history
        conversation_history.append({
            "role": "assistant",
            "content": response_content
        })