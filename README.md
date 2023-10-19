# Discord translator bot

Simple Discrord bot, that can be used to translate messages to another language right in discord

Use prefix '!' to call:

- !help - bot usage
- ping - shows current latency
- !t [language] [text] - translates text to choosed language. Language parameter has to be set as language code (like ru, en, de etc.)

**NOTE**
Get started:
- use [Git](https://git-scm.com) to clone this bot in your own repository: ```git clone https://github/8hrsk/ds-translator-bot.git```;
- edit `config.json` or create `.env` instead with your credentials;
- use ```npm start``` to start bot. If you have vps/vds, use `pm2` process manager to start bot on your server.
