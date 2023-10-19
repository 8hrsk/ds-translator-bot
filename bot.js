const { 
        Client, 
        Events, 
        GatewayIntentBits, 
        Collection, 
        Partials, 
        messageLink, 
        REST, 
        Routes, 
        SlashCommandBuilder, 
        ApplicationCommand 
    } = require('discord.js')

const path = require('path')
const fs = require('fs')
const translate = require('google-translate-api-x');

const { TOKEN, clientId, version } = require(path.join(__dirname + '/config.json'))

const { Guilds, GuildMembers, GuildMessages, MessageContent } = GatewayIntentBits;
const { User, Message, guildMember, ThreadMember } = Partials;

const client = new Client(({
    intents: [ Guilds, GuildMembers, GuildMessages, MessageContent ],
    partials: [ User, Message, guildMember, ThreadMember ]
}))

const translator = {
    Translate: async (text, arg) => {
        let lang = arg
        if (lang.length = 0) {
            lang = 'nolang'
        }
        lang = lang.toLowerCase()
        let result = 'Maybe something went wrong X/'
        try {
            let translation = await translate(text, { to: lang, client: 'gtx', forceBatch: false })
            result = translation.text
            return result
        } catch (error) {
            return result = false
        }
    }
}

function includes(array, element) { // create includes function
    for (let i = 0; i < array.length; i++) {
        if (element == array[i]) {
            return true
        }
    }
    return false
}

// ! ephermal 'true' for replying with message that can be seen only by target

const langsSupported = Array('probably all') //! Used to be array for supported language. Garbage code

const commands = { //TODO Refactor into Class
    help: (message) => {
        message.reply({ content: '```Hi! I\'am a Discord translator bot.```\nNow you can use translation functions between probably all existing languages\n !ping - check workload\n !t LANG (like ru, en, de, etc.) text - translates text to needed language', ephermal: true})
    },

    t: async (message, args, author, channel, textToTranslate) => {
        let result

        result = await translator.Translate(textToTranslate, args[0])

        if (result == false) {
            message.reply('```Sorry :( An error occured```')
        }

        if (!result == false) {
            message.reply('```' + textToTranslate + '```' + ' become\n```' + result + '```');
        }
    },

    load: (message) => {
        let guildsTotal = client.guilds.cache.map(guild => guild.id).length;
        message.reply(`My current latency is ${Math.round(client.ws.ping)}ms\nRight now I'm in ${guildsTotal} guilds`)
    },

    translate: async (message, args, author, channel, textToTranslate) => {
        let result 
        result = await translator.Translate(textToTranslate, args[0])

        if (result == false) {
            message.reply({ content: '```Sorry :( An error occured```', ephermal: true })
        }

        if (!result == false) {
            message.reply({ content: '```' + textToTranslate + '```' + ' become\n```' + result + '```', ephermal: true });
        }

        message.reply()
    }
}

const prefix = '!'

client.on('messageCreate', (message) => {
    if (message.author.bot) return; // no bots
    if (!message.content.startsWith(prefix)) return; // no mess without prefix
  
    const commandBody = message.content.slice(prefix.length);
    const args = commandBody.split(' ');
    const command = args.shift().toLowerCase();
    const author = message.author.toString();
    const channel = message.channel

    let textToTranslate
    if (args[0] == '-e' || '-r') {
        textToTranslate = commandBody.slice(5);
    }

    if (command in commands) {
        commands[command](message, args, author, channel, textToTranslate);
    } else {
        message.reply({ content: 'I don\'t know this command yet :(\nContact `@8hoursking#0232` if you have ideas', ephermal: true });
    }
})

const appCommands = [];

const commandsPath = path.join(__dirname, 'appCommands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (let file of commandFiles) { //! Garbage code now
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
    
	if ('data' in command && 'execute' in command) {
		appCommands.push(command.data.toJSON());
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

client.on(Events.InteractionCreate, interaction => {
    interaction.reply(`Bot current version: ${version}, supported languages: ${langsSupported}.\nType !help for command list`)
});

const rest = new REST().setToken(TOKEN);

(async () => {
	try {
		console.log(`Started refreshing ${appCommands.length} application (/) commands.`);
		const data = await rest.put(
			Routes.applicationCommands(clientId),
			{ body: appCommands },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		console.error(error);
	}
})();

client.once(Events.ClientReady, () => {
    try {
        console.log(`logged in to ${client.user.tag}`);
    } catch (error) {
        console.log(`[WARNING] We ran into an error: ${error}`);
    }
})

client.login(TOKEN)