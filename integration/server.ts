import { App } from "../lib/App";
import { Controller } from "../lib/decorators/controllerDecorator";
import { HttpGet, HttpPost } from "../lib/decorators/createMethodDecorator";
import { HttpContext } from "../interfaces/HttpContext";
import { BaseController } from "../lib/classes/BaseController";

class Config {
    declare port: number;
}
const app = new App();
app.parseJson();
const config = app
    .addConfigLoader(Config)
    .AddJsonConfig(__dirname + "/config.json")
    .Build();

@Controller("get/")
class TestController extends BaseController {
    @HttpPost("t")
    getLog(ctx: HttpContext) {
        const { email } = ctx.body;
        if (!email) throw new Error("error");
        ctx.Response.end("oi");
    }
}

app.setDefaultErrorHandler(async (ctx, e) => {
    console.log(e);
    ctx.Response.setHeader("Content-Type", "application/json");
    ctx.Response.end(
        JSON.stringify({
            name: e.name,
            message: e.message,
            stack: e.stack,
        })
    );
});
app.loadControllers();

app.listen(config.port, (err) => {
    console.log(`Online on: ${config.port}`);
});
