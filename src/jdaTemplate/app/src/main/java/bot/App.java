package bot;

import bot.command.HelloCommand;
import net.dv8tion.jda.api.JDA;
import net.dv8tion.jda.api.JDABuilder;
import net.dv8tion.jda.api.interactions.commands.build.CommandData;
import net.dv8tion.jda.api.requests.restaction.CommandListUpdateAction;

import javax.security.auth.login.LoginException;
import java.util.HashMap;
import java.util.Map;

public class App {
    private static Map<String, Command> commands = new HashMap<>();

    public static void addCommand(Command cmd) {
        commands.put(cmd.getName(), cmd);
    }

    public static Map<String, Command> getCommands() {
        return commands;
    }

    public static void main(String[] args) throws LoginException {
        JDA bot = JDABuilder.createDefault(args[0])
                .addEventListeners(new SlashCommandListener())
                .build();

        addCommand(new HelloCommand());

        CommandListUpdateAction update = bot.updateCommands();

        for (Command command : commands.values()) {
            update.addCommands(new CommandData(command.getName(), command.getDescription()).addOptions(command.getOptions()));
        }

        update.queue();
    }
}
