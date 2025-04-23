import { App } from "../lib/App";
import { Controller } from "../lib/decorators/controllerDecorator";
import { HttpPost } from "../lib/decorators/createMethodDecorator";
import { HttpContext } from "../interfaces/HttpContext";
import { BaseController } from "../lib/classes/BaseController";
import { FromBody } from "../lib/decorators/FromBodyDecorator";
import { Use } from "../lib/decorators/useMiddlewareDecorator";

class Config {
    declare port: number;
}
const app = new App();
app.parseJson();
const config = app
    .addConfigLoader(Config)
    .AddJsonConfig(__dirname + "/config.json")
    .Build();

class User {
    public email: string | undefined = "";
    public password: string | undefined = "";
}

@Controller("get/")
class TestController extends BaseController {
    @Use(async (ctx, next) => {
        if (ctx.body.email) return next();
        throw new Error("No email provided");
    })
    @HttpPost("t")
    getLog(ctx: HttpContext, @FromBody() user: User) {
        ctx.response.end(`${user.email} --- ${JSON.stringify(user)}`);
    }
}

app.setDefaultErrorHandler(async (ctx, e) => {
    console.error(e);
    ctx.response.setHeader("Content-Type", "application/json");
    ctx.response.end(
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
