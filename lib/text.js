const Handlebars = require("handlebars"),
    marked = require("marked");

module.exports = function(rawText, users) {
    return marked(rawText, {
        sanitize: true,
        sanitizer: Handlebars.Utils.escapeExpression
    })
        .replace(/&lt;#C[A-Z0-9]+\|([A-Za-z0-9\-_]+)&gt;/g, (matched, channelName) => {
            return `<a href="/channels/${channelName}.html" class="messages__mention">#${channelName}</a>`;
        })
        .replace(/&lt;@(U[A-Z0-9]+)&gt;/g, (matched, userId) => {
            return `<span class="messages__mention">@${resolveUser(userId, users).name}</span>`;
        })
        .replace(/&lt;!(channel|here)&gt;/g, (matched, variant) => {
            return `<span class="messages__mention">@${variant}</span>`;
        })
        .replace(/&amp;lt;/g, () => "&lt;")
        .replace(/&amp;gt;/g, () => "&gt;");
};

function resolveUser(userId, users) {
    return users[userId] || {
        name: "unknown",
        real_name: "(Unknown)"
    };
}
