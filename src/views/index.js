import * as building from "./building";
import * as attaching from "./attaching";
import * as finishing from "./finishing";

export function setPlatform(platform) {
  attaching.setPlatform(platform);
}

export {
  building,
  attaching,
  finishing
};
