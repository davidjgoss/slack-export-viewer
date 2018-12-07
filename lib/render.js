const Handlebars = require("handlebars"),
    moment = require("moment"),
    text = require("./text");

module.exports = function (channelName, slack) {
    let result = "<ul class='messages'>";
    slack.channels[channelName].messages.forEach(message => {
        result += renderItem(message, slack.users);
    });
    result += "</ul>";
    return new Handlebars.SafeString(result);
};

function renderItem(message, users) {
    const user = resolveUser(message.user, users);
    return `<li class="messages__item">
    <strong class="messages__user">${Handlebars.Utils.escapeExpression(user.real_name || user.name)}</strong>
    <time class="messages__timestamp">${renderTime(message.ts)}</time>
    ${text(message.text, users)}
</li>`;
}

function resolveUser(userId, users) {
    return users[userId] || {
        name: "unknown",
        real_name: "(Unknown)"
    };
}

function renderTime(tsString) {
    return moment(Number(tsString) * 1000).format("Do MMM YYYY HH:mm");
}
