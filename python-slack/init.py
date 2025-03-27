from slack_sdk import WebClient
from slack_sdk.errors import SlackApiError

from dotenv import load_dotenv
import os

channel_name = "fodder-playlist-submissions"

def init():
    load_dotenv()
    
    bot_token = os.getenv("SLACK_BOT_TOKEN")
    if not bot_token:
        raise ValueError("Bot Token not found")

    client = WebClient(token=bot_token)

    try:
        channel_id = None

        all_channels = client.conversations_list(
            types="private_channel"
        )

        for channel in all_channels["channels"]:
            if channel["name"] == channel_name:
                channel_id = channel["id"]

                print("fodder channel already exists!")

                break

        if channel_id == None:
            create_channel = client.conversations_create(
                name=channel_name,
                is_private=True
            )

            channel_id = create_channel["channel"]["id"]

            message_response = client.chat_postMessage(
                channel=channel_id,
                text="This is a new channel for Radio Fodder playlist submissions"
            )

        users = client.users_list()
        admin_ids = []

        for user in users["members"]:
            if user["is_admin"] == True:
                print("Admin", user["name"])
                
                admin_ids.append(user["id"])

        invite_admins = client.conversations_invite(channel=channel_id, users=f"{",".join(admin_ids)}")

    except SlackApiError as e:
        print("err", e.response["error"] )

    
