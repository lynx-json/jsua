import * as transferring from "./transferring";
import * as building from "./building";
import * as attaching from "./attaching";
import * as finishing from "./finishing";

function fetch(url, options) {
  return Promise.resolve({ url, options })
    .then(transferring.transfer)
    .then(building.build)
    .then(attaching.attach)
    .then(finishing.finish);
}

transferring.register("https", transferring.http);
transferring.register("http", transferring.http);
transferring.register("data", transferring.data);

export {
  fetch,
  transferring,
  building,
  attaching,
  finishing
};
