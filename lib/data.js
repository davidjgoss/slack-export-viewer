const fs = require("fs"),
    _flatten = require("lodash/flatten");

module.exports = function () {
    const users = {}, channels = {};
    JSON.parse(fs.readFileSync("./data/users.json", {encoding: "utf-8"}))
        .forEach(user => {
            users[user.id] = user;
        });
    fs.readdirSync("./data")
        .filter(objectName => !objectName.includes("."))
        .map(channelName => {
            const channelPath = `./data/${channelName}`;
            return {
                name: channelName,
                messages: _flatten(fs.readdirSync(channelPath).map(fileName => {
                    return JSON.parse(fs.readFileSync(`${channelPath}/${fileName}`, {encoding: "utf-8"}))
                        .filter(message => !message.subtype);
                }))
            };
        })
        .forEach(channel => {
            channels[channel.name] = channel;
        });
    return {
        users,
        channels
    };
};
