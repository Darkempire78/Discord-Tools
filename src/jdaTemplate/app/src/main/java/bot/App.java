package bot;

import net.dv8tion.jda.api.JDA;
import net.dv8tion.jda.api.JDABuilder;
import net.dv8tion.jda.api.interactions.commands.build.CommandData;
import net.dv8tion.jda.api.requests.restaction.CommandListUpdateAction;

import javax.security.auth.login.LoginException;
import java.util.ArrayList;

public class App {
    public static final ArrayList<Command> commands = new ArrayList<>();

    static {
        // Add commands here
    }

    public static void main(String[] args) throws LoginException {
        JDA bot = JDABuilder.createDefault(args[0])
                .addEventListeners(new SlashCommandListener())
                .build();

        CommandListUpdateAction update = bot.updateCommands();

        for (Command command : commands) {
            update.addCommands(new CommandData(command.getName(), command.getDescription()).addOptions(command.getOptions()));
        }

        update.queue();
    }
}
