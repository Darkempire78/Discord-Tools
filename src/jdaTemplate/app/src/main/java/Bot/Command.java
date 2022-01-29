package Bot;

import net.dv8tion.jda.api.events.interaction.SlashCommandEvent;
import net.dv8tion.jda.api.interactions.commands.build.OptionData;

import java.util.ArrayList;

public interface Command {
    public void run(SlashCommandEvent event);
    public String getName();
    public String getDescription();

    default public ArrayList<OptionData> getOptions() {
        return new ArrayList<>();
    }
}
