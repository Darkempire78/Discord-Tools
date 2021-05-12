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
    constructor(guild, collapsibleState) {
        this.guild = guild;
        this.label = guild.name;
        this.description = "";
        this.collapsibleState = collapsibleState;
        this.positionDetails = [];

        this.convertPositionToTreeItems();
    }

    convertPositionToTreeItems() {
        this.guild.channels.cache.forEach(channel => {
            if (channel.type == 'category') {
                let category = new vscode.TreeItem(channel.name, vscode.TreeItemCollapsibleState.Expanded);
                this.positionDetails.push(category)
            }
        })
    }

    getPositionDetails() {
        return this.positionDetails;
    }
}

module.exports = DiscordTreeViewProvider;