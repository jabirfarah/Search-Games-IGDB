# Search IGDB

Allows you to search for hundreds of thousands of games right from Raycast!

# Instructions

1. Follow the instructions in the [Getting Started](https://api-docs.igdb.com/#account-creation) section of the IGDB API documentation. Doing so should give you a Client ID and a Client Secret.
2. Once you have your Client ID and Client Secret make a POST request using the following link (making sure to replace the {CLIENT_ID} & {CLIENT_SECRET} with your own):

https://id.twitch.tv/oauth2/token?client_id={CLIENT_ID}&client_secret={CLIENT_SECRET}&grant_type=client_credentials


3. This will give you your app access token, enter this app access token as well as your Client ID into Raycast and now you should be good to go!