import * as building from "./building";
import * as attaching from "./attaching";
import * as finishing from "./finishing";
import * as htmlPlatform from "./html-platform";

export function setPlatform(platform) {
  building.setPlatform(platform);
  attaching.setPlatform(platform);
  finishing.setPlatform(platform);
}

export {
  building,
  attaching,
  finishing,
  htmlPlatform
};
