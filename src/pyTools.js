const vscode = require('vscode');

// Others
const fs = require("fs");
const path = require("path");


const pyCreateMainFile = () => {
    // Get the current folder path
    const currentFolderPath = vscode.workspace.workspaceFolders[0].uri["fsPath"]

    // Code to add in the new file
    const pyMainScript = `import discord
from discord.ext import commands
import json
import os

# Get configuration.json
with open("configuration.json", "r") as config: 
\tdata = json.load(config)
\ttoken = data["token"]
\tprefix = data["prefix"]


class Greetings(commands.Cog):
\tdef __init__(self, bot):
\t\tself.bot = bot
\t\tself._last_member = None

# Intents
intents = discord.Intents.default()
# The bot
bot = commands.Bot(prefix, intents = intents)

# Load cogs
if __name__ == '__main__':
\tfor filename in os.listdir("Cogs"):
\t\tif filename.endswith(".py"):
\t\t\tbot.load_extension(f"Cogs.{filename[:-3]}")

@bot.event
async def on_ready():
\tprint(f"We have logged in as {bot.user}")
\tprint(discord.__version__)
\tawait bot.change_presence(activity=discord.Activity(type=discord.ActivityType.watching, name =f"{bot.command_prefix}help"))

bot.run(token)`;

    // Create and write the main.py file
    fs.writeFile(path.join(currentFolderPath, "main.py"), pyMainScript, err => {
        if (err) {
            vscode.window.showErrorMessage("Failed to create the main.py file!");
        }
        vscode.window.showInformationMessage("Created main.py file!");
    });

};


const pyCreateTemplateBot = () => {

    // Get the current folder path
    const currentFolderPath = vscode.workspace.workspaceFolders[0].uri["fsPath"]

    // CREATE FOLDERS
    // Create the Cogs folder
    fs.mkdir(path.join(currentFolderPath, "Cogs"), function(err) {
        if (err) {
            vscode.window.showErrorMessage("Failed to create the Cogs folder!");
        }
        vscode.window.showInformationMessage("Created Cogs folder!"); 
    });

    // CREATE FILES

    // Create the main.py file 
    pyCreateMainFile();

    // Create the configuration.json file
    const configurationJson = `{
\t"token": "",
\t"prefix": ""
}`;
    fs.writeFile(path.join(currentFolderPath, "configuration.json"), configurationJson, err => {
        if (err) {
            vscode.window.showErrorMessage("Failed to create the configuration.json file!");
        }
        vscode.window.showInformationMessage("Created configuration.json file!"); 
    });

    // Create the help command
    const pyHelpCommand = `import discord
from discord.ext import commands
from random import randint

class HelpCog(commands.Cog, name="help command"):
\tdef __init__(self, bot:commands.Bot):
\t\tself.bot = bot
  

\t@commands.command(name = 'help',
\t\t\t\t\tusage="(commandName)",
\t\t\t\t\tdescription = "Display the help message.")
\t@commands.cooldown(1, 2, commands.BucketType.member)
\tasync def help (self, ctx, commandName:str=None):

\t\tcommandName2 = None
\t\tstop = False

\t\tif commandName is not None:
\t\t\tfor i in self.bot.commands:
\t\t\t\tif i.name == commandName.lower():
\t\t\t\t\tcommandName2 = i
\t\t\t\t\tbreak 
\t\t\t\telse:
\t\t\t\t\tfor j in i.aliases:
\t\t\t\t\t\tif j == commandName.lower():
\t\t\t\t\t\t\tcommandName2 = i
\t\t\t\t\t\t\tstop = True
\t\t\t\t\t\t\tbreak
\t\t\t\t\t\tif stop is True:
\t\t\t\t\t\t\tbreak 

\t\t\tif commandName2 is None:
\t\t\t\tawait ctx.channel.send("No command found!")   
\t\t\telse:
\t\t\t\tembed = discord.Embed(title=f"**{commandName2.name.upper()} COMMAND :**", description="", color=randint(0, 0xffffff))
\t\t\t\tembed.set_thumbnail(url=f'{self.bot.user.avatar_url}')
\t\t\t\tembed.add_field(name=f"**NAME :**", value=f"{commandName2.name}", inline=False)
\t\t\t\taliases = ""
\t\t\tif len(commandName2.aliases) > 0:
\t\t\t\tfor aliase in commandName2.aliases:
\t\t\t\t\taliases = aliase
\t\t\telse:
\t\t\t\tcommandName2.aliases = None
\t\t\t\taliases = None
\t\t\t\tembed.add_field(name=f"**ALIASES :**", value=f"{aliases}", inline=False)
\t\t\t\tif commandName2.usage is None:
\t\t\t\t\tcommandName2.usage = ""
\t\t\t\tembed.add_field(name=f"**USAGE :**", value=f"{self.bot.command_prefix}{commandName2.name} {commandName2.usage}", inline=False)
\t\t\t\tembed.add_field(name=f"**DESCRIPTION :**", value=f"{commandName2.description}", inline=False)
\t\t\t\tawait ctx.channel.send(embed=embed)             
\t\telse:
\t\t\tembed = discord.Embed(title=f"__**Help page of {self.bot.user.name}**__", description=f"**{self.bot.command_prefix}help (command)** : Display the help list or the help data for a specific command.", color=randint(0, 0xffffff))
\t\t\tembed.set_thumbnail(url=f'{self.bot.user.avatar_url}')
\t\t\tembed.add_field(name=f"__COMMANDS :__", value=f"**{self.bot.command_prefix}command <parameters>** : Command description.", inline=False)
\t\t\tawait ctx.channel.send(embed=embed)

def setup(bot:commands.Bot):
\tbot.remove_command("help")
\tbot.add_cog(HelpCog(bot))`;
    fs.writeFile(path.join(currentFolderPath, "Cogs/help.py"), pyHelpCommand, err => {
        if (err) {
            vscode.window.showErrorMessage("Failed to create the help.py file!");
        }
        vscode.window.showInformationMessage("Created help.py file!");
    });

    // Create the ping command
    const pyPingCommand = `import discord
from discord.ext import commands
import time


class PingCog(commands.Cog, name="ping command"):
\tdef __init__(self, bot:commands.bot):
\t\tself.bot = bot
        
\t@commands.command(name = "ping",
\t\t\t\t\tusage="",
\t\t\t\t\tdescription = "Display the bot's ping.")
\t@commands.cooldown(1, 2, commands.BucketType.member)
\tasync def ping(self, ctx):
\t\tbefore = time.monotonic()
\t\tmessage = await ctx.send("🏓 Pong !")
\t\tping = (time.monotonic() - before) * 1000
\t\tawait message.edit(content=f"🏓 Pong !  \`{int(ping)} ms\`")

def setup(bot:commands.Bot):
\tbot.add_cog(PingCog(bot))`;
    fs.writeFile(path.join(currentFolderPath, "Cogs/ping.py"), pyPingCommand, err => {
        if (err) {
            vscode.window.showErrorMessage("Failed to create the ping.py file!");
        }
        vscode.window.showInformationMessage("Created ping.py file!");
    });

    // Create the on_command_error
    const pyOnCommandError = `import discord
from discord.ext import commands
from discord.ext.commands import MissingPermissions, CheckFailure, CommandNotFound
import time


class OnCommandErrorCog(commands.Cog, name="on command error"):
\tdef __init__(self, bot:commands.Bot):
\t\tself.bot = bot
        
\t@commands.Cog.listener()
\tasync def on_command_error(self, ctx:commands.Context, error:commands.CommandError):
\t\tif isinstance(error, commands.CommandOnCooldown):
\t\t\tday = round(error.retry_after/86400)
\t\t\thour = round(error.retry_after/3600)
\t\t\tminute = round(error.retry_after/60)
\t\t\tif day > 0:
\t\t\t\tawait ctx.send('This command has a cooldown, be sure to wait for '+str(day)+ "day(s)")
\t\t\telif hour > 0:
\t\t\t\tawait ctx.send('This command has a cooldown, be sure to wait for '+str(hour)+ " hour(s)")
\t\t\telif minute > 0:
\t\t\t\tawait ctx.send('This command has a cooldown, be sure to wait for '+ str(minute)+" minute(s)")
\t\t\telse:
\t\t\t\tawait ctx.send(f'This command has a cooldown, be sure to wait for {error.retry_after:.2f} second(s)')
\t\telif isinstance(error, CommandNotFound):
\t\t\treturn
\t\telif isinstance(error, MissingPermissions):
 \t\t\tawait ctx.send(error.text)
\t\telif isinstance(error, CheckFailure):
\t\t\tawait ctx.send(error.original.text)
\t\telse:
\t\t\tprint(error) 

def setup(bot):
\tbot.add_cog(OnCommandErrorCog(bot))`;
    fs.writeFile(path.join(currentFolderPath, "Cogs/onCommandError.py"), pyOnCommandError, err => {
        if (err) {
            vscode.window.showErrorMessage("Failed to create the onCommandError.py file!");
        }
        vscode.window.showInformationMessage("Created onCommandError.py file!");
    });
};


// Exports
exports.pyCreateTemplateBot = pyCreateTemplateBot;
