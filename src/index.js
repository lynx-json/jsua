import * as transferring from "./transferring";
import * as building from "./building";
import * as attaching from "./attaching";
import * as finishing from "./finishing";
import * as http from "./transferring/http";
import * as data from "./transferring/data";

function fetch(url, options) {
  return Promise.resolve({ url, options })
    .then(transferring.transfer)
    .then(building.build)
    .then(attaching.attach)
    .then(finishing.finish);
}

transferring.register("https", http.transfer);
transferring.register("http", http.transfer);
transferring.register("data", data.transfer);

export {
  fetch,
  transferring,
  building,
  attaching,
  finishing
};
