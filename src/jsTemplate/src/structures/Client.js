/** Template by raazdev | https://github.com/chethanyadav456/discord-js-bot */

const { Client, GatewayIntentBits, Collection } = require("discord.js");
const { readdirSync } = require("fs");
const mongoose = require('mongoose');
const Logger = require('cololog');

class ApexBot extends Client {
    constructor() {
        super({
            shards: "auto",
            allowedMentions: {
                parse: ["roles", "users", "everyone"],
                repliedUser: false
            },
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.DirectMessages
            ]
        });
        this.commands = new Collection();
        this.slashCommands = new Collection();
        this.config = require("../config.js");
        this.owner = this.config.ownerID;
        this.prefix = this.config.prefix;
        this.embedColor = this.config.embedColor;
        this.aliases = new Collection();
        this.logger = new Logger('Bot');
        this.emoji = require("../utils/emoji.js");
        if (!this.token) this.token = this.config.token;
        /**
         *  Mongose for data base
         */
        const dbOptions = {
            useNewUrlParser: true,
            autoIndex: false,
            connectTimeoutMS: 10000,
            family: 4,
            useUnifiedTopology: true,
        };
        mongoose.connect(this.config.mongourl, dbOptions);
        mongoose.Promise = global.Promise;
        mongoose.connection.on('connected', () => {
            this.logger.log('[DB] DATABASE CONNECTED');
        });
        mongoose.connection.on('err', (err) => {
            console.log(`Mongoose connection error: \n ${err.stack}`, "error");
        });
        mongoose.connection.on('disconnected', () => {
            console.log('Mongoose disconnected');
        });

        /**
         * Error Handler
         */
        this.on("disconnect", () => console.log("Bot is disconnecting..."))
        this.on("reconnecting", () => console.log("Bot reconnecting..."))
        this.on('warn', error => console.log(error));
        this.on('error', error => console.log(error));
        process.on('unhandledRejection', error => console.log(error));
        process.on('uncaughtException', error => console.log(error))


        /**
        * Client Events
        */
        readdirSync("./src/events").forEach(file => {
            const event = require(`../events/${file}`);
            this.on(event.name, (...args) => event.run(this, ...args));
        });
        /**
        * Import all commands
        */
        readdirSync("./src/commands/").forEach(dir => {
            const commandFiles = readdirSync(`./src/commands/${dir}/`).filter(f => f.endsWith('.js'));
            for (const file of commandFiles) {
                const command = require(`../commands/${dir}/${file}`);
                this.logger.log(`Loading ${command.category} commands ${command.name}`);
                this.commands.set(command.name, command);
            }
        })
        /**
        * SlashCommands 
        */
        const data = [];

        readdirSync("./src/slashCommands/").forEach((dir) => {
            const slashCommandFile = readdirSync(`./src/slashCommands/${dir}/`).filter((files) => files.endsWith(".js"));

            for (const file of slashCommandFile) {
                const slashCommand = require(`../slashCommands/${dir}/${file}`);

                if (!slashCommand.name) return console.error(`slashCommandNameError: ${slashCommand.split(".")[0]} application command name is required.`);

                if (!slashCommand.description) return console.error(`slashCommandDescriptionError: ${slashCommand.split(".")[0]} application command description is required.`);

                this.slashCommands.set(slashCommand.name, slashCommand);
                this.logger.log(`Client SlashCommands Command (/) Loaded: ${slashCommand.name}`);
                data.push(slashCommand);
            }
        });
        this.on("ready", async () => {
            await this.application.commands.set(data).then(() => this.logger.log(`Client Application (/) Registered.`)).catch((e) => console.log(e));
        });
    }
    connect() {
        return super.login(this.token);
    };
};
module.exports = ApexBot;

/** Template by raazdev | https://github.com/chethanyadav456/discord-js-bot */