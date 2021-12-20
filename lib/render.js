const Handlebars = require("handlebars"),
    moment = require("moment"),
    text = require("./text");

module.exports = function (channelName, slack) {
    let result = "<ul class='messages'>";
    console.log("Processing " + channelName)
    if (channelName in slack.channels) {
        slack.channels[channelName].messages.forEach(message => {
            result += renderItem(message, slack.users);
        });
    } else {
        var message =  "Channel data not found.";
        result += message;
        console.error(message)
    }
    
    result += "</ul>";
    return new Handlebars.SafeString(result);
};

var emptyAvatar = "https://www.gravatar.com/avatar/"+ Date.now() +"?s=32&d=identicon&r=PG"

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
    if (p) {
        return p.image_512 ||
            p.image_192 ||
            p.image_72 ||
            p.image_48 ||
            p.image_32 ||
            p.image_24 || emptyAvatar
    }
    return emptyAvatar
    
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
