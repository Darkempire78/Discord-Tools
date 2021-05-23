const path = require("path");
const vscode = require("vscode");

class DiscordTreeViewProvider {
    constructor(client) {
        this.guilds = client.guilds.cache;
        this.guildsTreeItems = this.convertGuildsToTreeItems(client); 
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

    convertGuildsToTreeItems(client) {
        let array = [];
        this.guilds.forEach((element) => {
            array.push(
                new GuildTreeItem(client, element, vscode.TreeItemCollapsibleState.Collapsed)
            );
        });
        return array;
    }
}

class GuildTreeItem {
    constructor(client, guild, collapsibleState) {
        this.guild = guild;
        this.label = guild.name;
        this.description = "";
        this.type = "guild",
        this.collapsibleState = collapsibleState;
        this.positionDetails = [];

        this.convertPositionToTreeItems(client);
    }

    convertPositionToTreeItems(client) {
        this.guild.channels.cache.sort((a, b) => a.position - b.position).forEach(async channel => {
            let hasPermissionInChannel = await channel.permissionsFor(client.user).has('VIEW_CHANNEL', false);
            if (hasPermissionInChannel) {
                const allowedChannelType = ["text", "news", "store"];
                // Channel without category
                if (channel.parent === null && allowedChannelType.includes(channel.type)) {
                    let channelItem = new ChannelTreeItem(channel, vscode.TreeItemCollapsibleState.None);
                    this.positionDetails.unshift(channelItem)
                }
                // Categories
                else if (channel.type == 'category') {
                    let categoryItem = new CategoryTreeItem(client, channel, vscode.TreeItemCollapsibleState.Collapsed);
                    this.positionDetails.push(categoryItem)
                }
            }
        })
    }

    getPositionDetails() {
        return this.positionDetails;
    }

    iconPath = {
        dark: path.join(__filename, '..', '..', 'resources', 'icons', 'dark', 'server.svg'),
        light: path.join(__filename, '..', '..', 'resources', 'icons', 'light', 'server.svg')
    };
}

class CategoryTreeItem {
    constructor(client, category, collapsibleState) {
        this.category = category;
        this.label = category.name;
        this.description = "";
        this.type = "category",
        this.collapsibleState = collapsibleState;
        this.positionDetails = [];

        this.convertPositionToTreeItems(client);
    }

    convertPositionToTreeItems(client) {
        this.category.children.sort((a, b) => a.position - b.position).forEach(async channel => {
            const allowedChannelType = ["text", "news", "store"];
            if (allowedChannelType.includes(channel.type)) {
                let hasPermissionInChannel = await channel.permissionsFor(client.user).has('VIEW_CHANNEL', false);
                if (hasPermissionInChannel) {
                    let channelItem = new ChannelTreeItem(channel, vscode.TreeItemCollapsibleState.None);
                this.positionDetails.push(channelItem)
                }
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
        this.type = "channel",
        this.collapsibleState = collapsibleState;
        this.positionDetails = [];
    }

    getPositionDetails() {
        return this.positionDetails;
    }

    iconPath = {
        dark: path.join(__filename, '..', '..', 'resources', 'icons', 'dark', 'channel.svg'),
        light: path.join(__filename, '..', '..', 'resources', 'icons', 'light', 'channel.svg')
    };
}

module.exports = DiscordTreeViewProvider;