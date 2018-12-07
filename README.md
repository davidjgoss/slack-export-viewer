# slack-export-viewer

> Take a standard export of public data from Slack and generate a static website where you can browse it.

## Installation

```bash
npm install
```

## Scope

This provides a way to browse messages from public channels as exported from Slack. It won't help you with private channels, DMs, files or anything else.

## Usage

Take your [exported data from Slack](https://get.slack.help/hc/en-us/articles/220556107-How-to-read-Slack-data-exports) and drop it into the `data` directory. It should have a folder for each channel, plus a few JSON files including a `users.json`:

```
--data
----general
----random
----users.json
--src
--lib
```

Next, edit the constant on the first line of `build.js` to be the name of your workspace (this will be used in the masthead of the site):

```javascript
const WORKSPACE_NAME = "my-fancy-workspace";
```

Now you can generate your site:

```bash
npm run build
```

Depending on the amount of data, this could take between a couple of seconds and a few minutes. Once it's finished, the generated site is output to the `build` directory. You can quickly test it with a local webserver:

```bash
npm start
```

There's also a `Dockerfile` to generate an image that serves the site via Nginx from port 80.

*Note: The site needs to be served at the root of the host, not in a subfolder.*

## Code

This thing uses:

- [Metalsmith](https://github.com/segmentio/metalsmith) (with plugins) as the static site generator
- [Handlebars](https://handlebarsjs.com/) for templating
- [Marked](https://github.com/markedjs/marked) to process Markdown
- [AVA](https://github.com/avajs/ava) for testing

Stability-wise, it's a little rough around the edges. Actually it's pretty rough all the way through; it was basically thrown together in an afternoon. But if it helps you that's cool, and maybe submit a PR if you fix something bad and have the time.
