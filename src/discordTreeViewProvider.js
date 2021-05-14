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
                let categoryItem = new CategoryTreeItem(channel, vscode.TreeItemCollapsibleState.Expanded);
                this.positionDetails.push(categoryItem)
            }
        })
    }

    getPositionDetails() {
        return this.positionDetails;
    }
}

class CategoryTreeItem {
    constructor(category, collapsibleState) {
        this.category = category;
        this.label = category.name;
        this.description = "";
        this.collapsibleState = collapsibleState;
        this.positionDetails = [];

        this.convertPositionToTreeItems();
    }

    convertPositionToTreeItems() {
        this.category.children.forEach(channel => {
            const allowedChannelType = ["text", "news", "store"];
            if (allowedChannelType.includes(channel.type)) {
                let channelItem = new ChannelTreeItem(channel, vscode.TreeItemCollapsibleState.None);
                this.positionDetails.push(channelItem)
            }
        });
            
    }

    getPositionDetails() {
        return this.positionDetails;
    }
}

class ChannelTreeItem {
    constructor(channel, collapsibleState) {
        this.channel = channel;
        this.label = channel.name;
        this.description = "";
        this.collapsibleState = collapsibleState;
        this.positionDetails = [];
    }

    getPositionDetails() {
        return this.positionDetails;
    }
}

module.exports = DiscordTreeViewProvider;