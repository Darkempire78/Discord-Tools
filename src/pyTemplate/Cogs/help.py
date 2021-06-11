import discord
from discord.ext import commands
from random import randint

class HelpCog(commands.Cog, name="help command"):
	def __init__(self, bot:commands.Bot):
		self.bot = bot
  

	@commands.command(name = 'help',
					usage="(commandName)",
					description = "Display the help message.")
	@commands.cooldown(1, 2, commands.BucketType.member)
	async def help (self, ctx, commandName:str=None):

		commandName2 = None
		stop = False

		if commandName is not None:
			for i in self.bot.commands:
				if i.name == commandName.lower():
					commandName2 = i
					break 
				else:
					for j in i.aliases:
						if j == commandName.lower():
							commandName2 = i
							stop = True
							break
						if stop is True:
							break 

			if commandName2 is None:
				await ctx.channel.send("No command found!")   
			else:
				embed = discord.Embed(title=f"**{commandName2.name.upper()} COMMAND :**", description="", color=randint(0, 0xffffff))
				embed.set_thumbnail(url=f'{self.bot.user.avatar_url}')
				embed.add_field(name=f"**NAME :**", value=f"{commandName2.name}", inline=False)
				aliases = ""
			if len(commandName2.aliases) > 0:
				for aliase in commandName2.aliases:
					aliases = aliase
			else:
				commandName2.aliases = None
				aliases = None
				embed.add_field(name=f"**ALIASES :**", value=f"{aliases}", inline=False)
				if commandName2.usage is None:
					commandName2.usage = ""
				embed.add_field(name=f"**USAGE :**", value=f"{self.bot.command_prefix}{commandName2.name} {commandName2.usage}", inline=False)
				embed.add_field(name=f"**DESCRIPTION :**", value=f"{commandName2.description}", inline=False)
				await ctx.channel.send(embed=embed)             
		else:
			embed = discord.Embed(title=f"__**Help page of {self.bot.user.name}**__", description=f"**{self.bot.command_prefix}help (command)** : Display the help list or the help data for a specific command.", color=randint(0, 0xffffff))
			embed.set_thumbnail(url=f'{self.bot.user.avatar_url}')
			embed.add_field(name=f"__COMMANDS :__", value=f"**{self.bot.command_prefix}command <parameters>** : Command description.", inline=False)
			await ctx.channel.send(embed=embed)

def setup(bot:commands.Bot):
	bot.remove_command("help")
	bot.add_cog(HelpCog(bot))