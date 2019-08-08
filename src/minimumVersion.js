const minimumNodeVersion = require("minimum-node-version");
 minimumNodeVersion.default().then(
    version => console.log(version)
);