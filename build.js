const WORKSPACE_NAME = "example-workspace";

const fs = require("fs"),
    Handlebars = require("handlebars"),
    Metalsmith = require('metalsmith'),
    collections = require('metalsmith-collections'),
    discoverPartials = require("metalsmith-discover-partials"),
    layouts = require('metalsmith-layouts'),
    render = require("./lib/render");

console.log("Processing exported Slack data...");
const slackData = require("./lib/data")();

// Remove src/channels/
fs.rmSync("./src/channels/*.html", { recursive: true, force: true });

console.log("Generating templates...");
// Index
fs.writeFileSync(`./src/channels/index.html`, 
`---
layout: channel_index.hbs
---`);

// All other channels
Object.keys(slackData.channels).forEach(channelName => {
    fs.writeFileSync(`./src/channels/${channelName}.html`, `---
layout: channel.hbs
name: ${channelName}
---`);
});

console.log("Transforming templates...");
Handlebars.registerHelper("view_channel", render);
Metalsmith(__dirname)
    .metadata({
        workspaceName: WORKSPACE_NAME,
        slack: slackData
    })
    .source('./src')
    .destination('./build')
    .clean(true)
    .use(collections({
        channels: {
            pattern: 'channels/*.html',
            filterBy: function(channelFile){
                return channelFile.path != "channels\\index.html" 
            }
        }
    }))
    .use(discoverPartials())
    .use(layouts({
        engine: 'handlebars'
    }))
    .build(err => {
        if (err) {
            throw err;
        } else {
            console.log("Successfully generated to build/ - test with `npm start`");
        }
    });
