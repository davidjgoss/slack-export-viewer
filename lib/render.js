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
    <div class="user_profile_picture">
        <img src="${resolveUserPicture(user)}">
    </div>
    <div class="user_message">
        <strong class="messages__user">${Handlebars.Utils.escapeExpression(user.real_name || user.name)}</strong>
        <time class="messages__timestamp">${renderTime(message.ts)}</time>
        ${text(message.text, users)}
    </div>
</li>`;
}

function resolveUserPicture(user) {
    var p = user.profile
    return p.image_512 ||
        p.image_192 ||
        p.image_72 ||
        p.image_48 ||
        p.image_32 ||
        p.image_24 || ""
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
