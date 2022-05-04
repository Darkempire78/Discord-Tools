package bot;

import net.dv8tion.jda.api.events.interaction.SlashCommandEvent;
import net.dv8tion.jda.api.hooks.ListenerAdapter;

public class SlashCommandListener extends ListenerAdapter {
    @Override
    public void onSlashCommand(SlashCommandEvent event) {
        try {
            App.getCommands().get(event.getName()).run(event);
        } catch (Exception e) {
            event.reply("An unknown error occurred while executing the command.").queue();

            e.printStackTrace();
        }
    }
}
