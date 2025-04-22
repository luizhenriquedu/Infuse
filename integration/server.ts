import { App } from "../lib/App";
import { Controller } from "../lib/decorators/controllerDecorator";
import { HttpGet } from "../lib/decorators/createMethodDecorator";
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
    @HttpGet("t")
    getLog(ctx: HttpContext) {
        console.log("hello");
    }
}

app.loadControllers();

app.listen(config.port, (err) => {
    console.log(`Online on: ${config.port}`);
});
