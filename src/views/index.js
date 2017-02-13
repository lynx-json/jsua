import * as _build from "./build";
import * as _attach from "./attach";
import * as _finish from "./finish";
import * as _platforms from "./platforms";
import * as html from "./platforms/html";

_platforms.register("html", html);
_platforms.set(html);

export var build = _build.build;
export var attach = _attach.attach;
export var finish = _finish.finish;
export var platforms = _platforms;
