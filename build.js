const fs = require("fs"),
    rimraf = require("rimraf"),
    Handlebars = require("handlebars"),
    Metalsmith = require('metalsmith'),
    collections = require('metalsmith-collections'),
    discoverPartials = require("metalsmith-discover-partials"),
    layouts = require('metalsmith-layouts'),
    render = require("./lib/render");

console.log("Processing exported Slack data...");
const slackData = require("./lib/data")();
rimraf.sync("./src/channels/*.html");
Object.keys(slackData.channels).forEach(channelName => {
    fs.writeFileSync(`./src/channels/${channelName}.html`, `---
layout: channel.hbs
name: ${channelName}
---`);
});

console.log("Generating site...");
Handlebars.registerHelper("view_channel", render);
Metalsmith(__dirname)
    .metadata({
        workspaceName: "example-workspace",
        slack: slackData
    })
    .source('./src')
    .destination('./build')
    .clean(true)
    .use(collections({
        channels: {
            pattern: 'channels/*.html'
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
