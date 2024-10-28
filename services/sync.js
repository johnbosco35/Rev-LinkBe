const V1Api = require("../helper/classcube-core-api-v1");
const Sync = require("../helper/sync");

async function sync(req) {
  const v1Api = new V1Api();
  const synchronize = new Sync(req.code, v1Api);

  return synchronize.sync();
}

module.exports = {
  sync,
};
