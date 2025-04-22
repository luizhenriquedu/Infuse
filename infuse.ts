import { App } from "./lib/App";

const app = new App();

app.parseJson();

app.use(async (ctx, next) => {
    console.log(ctx.body);
    await next();
});

app.add("POST", "/teste", (ctx) => {
    console.log("Depois");
    ctx.Response.end("oi pessoa");
});

app.listen(3000, () => {
    console.log(`Online at 3000`);
});
