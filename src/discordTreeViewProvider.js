const vscode = require("vscode");

class DiscordTreeViewProvider {
    constructor(client) {
        this.guilds = client.guilds.cache;
        this.guildsTreeItems = this.convertGuildsToTreeItems(); 
    }

    getTreeItem(element) {
        return element;
    }

    getChildren(element) {
        if (element) {
            return element.getPositionDetails();
        } else {
            return this.guildsTreeItems;
        }
    }

    convertGuildsToTreeItems() {
        let array = [];
        this.guilds.forEach((element) => {
            array.push(
                new GuildTreeItem(element, vscode.TreeItemCollapsibleState.Expanded)
            );
        });
        return array;
    }
}

class GuildTreeItem {
    // we must provide the property label for it to show up the tree view
    constructor(guild, collapsibleState) {
        this.guild = guild;
        this.label = guild.name;
        this.collapsibleState = collapsibleState;
        this.positionDetails = [];

        this.convertPositionToTreeItems();
    }

    // Generate the channels of the guild
    convertPositionToTreeItems() {
        this.guild.channels.cache.forEach(channel => {
            let channelName = new vscode.TreeItem(channel.name);
            this.positionDetails.push(channelName)
        })
    }

    getPositionDetails() {
        return this.positionDetails;
    }
}

module.exports = DiscordTreeViewProvider;