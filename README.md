[![CodeFactor](https://www.codefactor.io/repository/github/darkempire78/discord-tools/badge)](https://www.codefactor.io/repository/github/darkempire78/discord-tools)
<img src="https://img.shields.io/visual-studio-marketplace/i/Darkempire78.discord-tools?color=red&label=Install&logo=visual-studio-code">

# Discord Tools

Discord Tools is a Visual Studio Code extension to code Discord bots more easily.

- **GITHUB :** https://github.com/Darkempire78/Discord-Tools
- **DOWNLOAD :** https://marketplace.visualstudio.com/items?itemName=Darkempire78.discord-tools

## Supported Languages

- [x] Javascript ([Discord.js](https://discord.js.org/#/))
- [x] Python ([Discord.py](https://discordpy.readthedocs.io/en/latest/))
- [x] Java ([JDA](https://github.com/DV8FromTheWorld/JDA))
- [ ] Soon...


## Features

### Generate a template Discord bot : 
- Open the command palette (Ctrl+Shift+P) and choose : `Generate a <language> template bot (Discord.<language>)`

<img src="images/video1.gif" width="500"/>

### Generate code easily :

### Available Snippets

#### Javascript ([Discord.js](https://discord.js.org/#/)) :

- `djs.index` : Create a basic Discord bot index.js file.
- `djs.cmd` : Create a basic Discord command.
- `djs.cmd+` : Create a complex Discord command.
- `djs.embed` : Create a basic Discord embed.
- `djs.embed+` : Create a complex Discord embed.
- `djs.on` : Create a default Discord bot on.
- `djs.guildmemberadd` : Create a default Discord bot guildMemberAdd.
- `djs.guildmemberremove` : Create a default Discord bot guildMemberRemove.

#### Javascript Preview :
<img src="images/video2.gif" width="500"/>

#### Python ([Discord.py](https://discordpy.readthedocs.io/en/latest/)) :

- `dpy.main` : Create a basic Discord bot main.py file.
- `dpy.cog` : Create a basic Discord cog.
- `dpy.cmd` : Create a basic Discord command.
- `dpy.cmd+` : Create a complex Discord command.
- `dpy.embed` : Create a basic Discord embed.
- `dpy.embed+` : Create a complex Discord embed.
- `dpy.onmessage` : CCreate a default Discord bot on_message.
- `dpy.onmemberjoin` : Create a default Discord bot on_member_join.
- `dpy.onmemberremove` : Create a default Discord bot on_member_remove.
- `dpy.onguildjoin` : Create a default Discord bot on_guild_join.
- `dpy.onguildremove` : Create a default Discord bot on_guild_remove.
- **and 59 other events...**

#### Python Preview :
<img src="images/video3.gif" width="500"/>

#### Java ([JDA](https://github.com/DV8FromTheWorld/JDA)) :

- `jda.main` : Create a basic Discord bot main function.
- `jda.cmd` : Create a basic Discord command.
- `jda.embed` : Create a basic Discord embed.
- `jda.embed+` : Create a complex Discord embed.
- `jda.onmessagereceived` : Create a default Discord bot on.

#### Java Preview :
<img src="images/video4.gif" width="500"/>

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.


## Release Notes

### 1.1.1 (Lastest update)
- change of snippet prefixes to `dpy` (Discord.py), `djs` (Discord.js) and `jda` (JDA)
- 59 new Discord.py events added
### 1.1.0
- New language supported : Java (JDA)
### 1.0.1
- Several corrections
### 1.0.0
- Initial release


## License

This project is under [GPLv3](https://github.com/Darkempire78/Raid-Protect-Discord-Bot/blob/master/LICENSE).
