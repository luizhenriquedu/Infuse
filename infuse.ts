import { App } from "./lib/App";

const app = new App();

app.add("POST", "/teste", (ctx) => {
    ctx.Response.end("oi pessoa");
    console.log(ctx.body);
});

app.listen(3000, () => {
    console.log(`Online at 3000`);
});
