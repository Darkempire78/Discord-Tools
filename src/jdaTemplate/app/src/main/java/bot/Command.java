package bot;

import net.dv8tion.jda.api.events.interaction.SlashCommandEvent;
import net.dv8tion.jda.api.interactions.commands.build.OptionData;
import net.dv8tion.jda.api.requests.restaction.interactions.ReplyAction;

import java.util.ArrayList;

public interface Command {
    public void run(SlashCommandEvent event);
    public String getName();
    public String getDescription();

    default public ArrayList<OptionData> getOptions() {
        return new ArrayList<>();
    }
}
