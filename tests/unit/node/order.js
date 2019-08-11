const { suite, test, before } = intern.getInterface("tdd");
const { assert } = intern.getPlugin("chai");
const { promisify } = require("util");
const fs = require("fs");
const path = require("path");
const rimraf = promisify(require("rimraf"));
const readFile = promisify(fs.readFile);

const bundl = require("../../../src/index.js");
const resources = path.join(__dirname, "../../resources");

suite("bundl-order", () => {

	test("dummy", async () => {
		assert.strictEqual(true, true, "Expected equal");
	});

});