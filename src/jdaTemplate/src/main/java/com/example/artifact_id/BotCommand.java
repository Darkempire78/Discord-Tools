package com.example.artifact_id;

import net.dv8tion.jda.api.events.message.guild.GuildMessageReceivedEvent;

public interface BotCommand {
	void run(GuildMessageReceivedEvent event,String[] args);
	String getHelp();
}
