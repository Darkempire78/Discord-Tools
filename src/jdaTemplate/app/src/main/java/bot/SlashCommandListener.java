package bot;

import net.dv8tion.jda.api.events.interaction.SlashCommandEvent;
import net.dv8tion.jda.api.hooks.ListenerAdapter;

public class SlashCommandListener extends ListenerAdapter {
    @Override
    public void onSlashCommand(SlashCommandEvent event) {
        for (Command command : App.getCommands()) {
            if (command.getName().equals(event.getName())) {
                command.run(event);
            }
        }
    }
}
