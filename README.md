# Who's Been Here?

A Discord bot to keep a journal of voice channel members. 

<center>
    <img src="https://i.imgur.com/vXP8fmZ.png" width="350">
</center>

Testausserveri ry's use-case for such bot is to track present members of an association's meeting for a record. We paste the generated data to a spreadsheet, which matches an user id to a real name. The final list of participants can be included in the minutes of the meeting.

## Usage

Quick and easy way to run this bot
```
$ DISCORD_TOKEN=**yourtoken** npx whosbeenhere
```

You can also put your token in an `.env` file, and run the npx command from the same direcotry.

The bot will create a `logs/` directory and begin logging joined members to files inside it.

## Development

1. Clone this repository
2. Install dependencies using `npm install`
3. Configure your `.env` file using your Discord bot token
4. Run the app using `npm start`