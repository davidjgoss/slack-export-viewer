import test from "ava";
import text from "./text";

test("should swap in @channel mention", t => {
    const rendered = text("Hey <!channel> lunch is here!", {}).trim();
    t.is(`<p>Hey <span class="messages__mention">@channel</span> lunch is here!</p>`, rendered);
});

test("should swap in @here mention", t => {
    const rendered = text("Hey <!here> lunch is here!", {}).trim();
    t.is(`<p>Hey <span class="messages__mention">@here</span> lunch is here!</p>`, rendered);
});

test("should swap in unknown user mention", t => {
    const rendered = text("Hey <@U123ABC> you broke the build!", {}).trim();
    t.is(`<p>Hey <span class="messages__mention">@unknown</span> you broke the build!</p>`, rendered);
});

test("should swap in known user mention", t => {
    const rendered = text("Hey <@U123ABC> you broke the build!", {
        "U123ABC": {
            name: "lukerogers",
            real_name: "Luke Rogers"
        }
    }).trim();
    t.is(`<p>Hey <span class="messages__mention">@lukerogers</span> you broke the build!</p>`, rendered);
});

test("should swap in other channel mention as link", t => {
    const rendered = text("Check out <#C6LS2M1CM|foo-details> for details on the foo initiative", {}).trim();
    t.is(`<p>Check out <a href="/channels/foo-details.html" class="messages__mention">#foo-details</a> for details on the foo initiative</p>`, rendered);
});

test("should process markdown", t => {
    const rendered = text("This is *awesome*!", {}).trim();
    t.is(`<p>This is <em>awesome</em>!</p>`, rendered);
});

test("should escape raw html in source text", t => {
    const rendered = text("This is <em>awesome</em>!", {}).trim();
    t.is(`<p>This is &lt;em&gt;awesome&lt;/em&gt;!</p>`, rendered);
});

test("should avoid double escaping markup in code snippets", t => {
    const rendered = text("This is `&lt;em&gt;awesome&lt;/em&gt;`!", {}).trim();
    t.is(`<p>This is <code>&lt;em&gt;awesome&lt;/em&gt;</code>!</p>`, rendered);
});
