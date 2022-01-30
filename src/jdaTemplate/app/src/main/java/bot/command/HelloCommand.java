package bot.command;

import bot.Command;

import net.dv8tion.jda.api.events.interaction.SlashCommandEvent;

public class HelloCommand implements Command {
    @Override
    public void run(SlashCommandEvent event) {
        event.reply("Hello World!").queue();
    }

    @Override
    public String getName() {
        return "hello";
    }

    @Override
    public String getDescription() {
        return "Hello World!";
    }
}
