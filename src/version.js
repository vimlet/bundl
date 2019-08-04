const semver = require("semver");
const packagejson = require("../package.json");
const version = packagejson.engines.node;

if (!semver.satisfies(process.version, version)) {
  console.log(`Required node version ${version} not satisfied with current version ${process.version}.`);
  process.exit(1);
}