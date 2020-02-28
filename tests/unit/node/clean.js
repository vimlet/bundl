const {
  suite,
  test,
  before
} = intern.getInterface("tdd");
const {
  assert
} = intern.getPlugin("chai");
const {
  promisify
} = require("util");

const fs = require("fs");
const path = require("path");
const rimraf = promisify(require("rimraf"));
const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);
const statFile = promisify(fs.stat);
const readdir = promisify(fs.readdir);
const exists = promisify(fs.exists);
const mkdir = promisify(fs.mkdir);

const bundl = require("../../../src/index.js");

const resources = path.join(__dirname, "../../resources");

suite("bundl-clean", () => {

  before(async () => {
      if (!await exists(path.join(resources, `clean/outputbase/1`))) {
          try {                
              await mkDirRecursive(path.join(resources, `clean/outputbase/1`));
          } catch (error) {                
              // Ignore error since sibling files will try to create the same directory
          }
      }
      if (!await exists(path.join(resources, `clean/outputFolder/1`))) {
          try {                
              await mkDirRecursive(path.join(resources, `clean/outputFolder/1`));
          } catch (error) {                
              // Ignore error since sibling files will try to create the same directory
          }
      }
      if (!await exists(path.join(resources, `clean/outputArray/1`))) {
          try {                
              await mkDirRecursive(path.join(resources, `clean/outputArray/1`));
          } catch (error) {                
              // Ignore error since sibling files will try to create the same directory
          }
      }
      await writeFile(path.join(resources, `clean/outputbase/1/trash.txt`), "content");
      await writeFile(path.join(resources, `clean/outputFolder/1/trash.txt`), "content");
      await writeFile(path.join(resources, `clean/outputArray/1/trash.txt`), "content");
      await writeFile(path.join(resources, `clean/inputHash/a.txt`), new Date());
      await bundl.build(require(path.join(resources, "clean/bundlOutputbase.config.js")));
      await bundl.build(require(path.join(resources, "clean/bundlFolder.config.js")));
      await bundl.build(require(path.join(resources, "clean/bundlArray.config.js")));
      await bundl.build(require(path.join(resources, "clean/bundlHash.config.js")));
  });

  test("clean outputbase", async () => {
      var result1 = JSON.stringify(await readdir(path.join(resources, `clean/outputbase/1`)));
      var expected1 = `["build.txt"]`;;
      assert.strictEqual(result1, expected1, `clean outputbase mismatch - 1`);
      var result2 = JSON.stringify(await readdir(path.join(resources, `clean/outputbase/2`)));
      var expected2 = `["clean.txt"]`;;
      assert.strictEqual(result2, expected2, `clean outputbase mismatch - 2`);
  });
  test("clean single folder", async () => {
      var result1 = JSON.stringify(await readdir(path.join(resources, `clean/outputFolder/1`)));
      var expected1 = `["build.txt"]`;;
      assert.strictEqual(result1, expected1, `clean outputFolder mismatch - 1`);
      var result2 = JSON.stringify(await readdir(path.join(resources, `clean/outputFolder/2`)));
      var expected2 = `["clean.txt"]`;;
      assert.strictEqual(result2, expected2, `clean outputFolder mismatch - 2`);
  });
  test("clean array folder", async () => {
      var result1 = JSON.stringify(await readdir(path.join(resources, `clean/outputArray/1`)));
      var expected1 = `["build.txt"]`;;
      assert.strictEqual(result1, expected1, `clean outputFolder mismatch - 1`);
      var result2 = JSON.stringify(await readdir(path.join(resources, `clean/outputArray/2`)));
      var expected2 = `["clean.txt"]`;;
      assert.strictEqual(result2, expected2, `clean outputFolder mismatch - 2`);
  });
  test("clean hash", async () => {
      var result1 = (await readdir(path.join(resources, `clean/outputHash/1`))).length;        
      var expected1 = 1;
      assert.strictEqual(result1, expected1, `clean outputHash mismatch - 1`);
      var result2 = JSON.stringify(await readdir(path.join(resources, `clean/outputHash/2`)));
      var expected2 = `["clean.txt"]`;;
      assert.strictEqual(result2, expected2, `clean outputHash mismatch - 2`);
  });

});


async function mkDirRecursive(folder) {
  return new Promise(async (resolve, reject) => {
    try {
      var existingFolder = await getExistingPath(folder);
      while (existingFolder.pending.length > 0) {
        var current = existingFolder.pending.pop();
        existingFolder.base = path.join(existingFolder.base, current);
        try {
          await mkdir(existingFolder.base);
        } catch (error) {
          // If folder exists, do nothing
          if (error.code != 'EEXIST') {
            reject(error);
          }
        }
      }
      resolve();
    } catch (error) {
      reject(error);
    }
  });
}

// @function getExistingPath (private) [Get exiting path from a folder and returns it with an array of folder to create inside]
async function getExistingPath(folder) {
  return new Promise(async (resolve, reject) => {
    try {
      var pending = [];
      var subFolder = folder;
      while (!await exists(subFolder)) {
        pending.push(path.basename(subFolder));
        subFolder = path.dirname(subFolder);
      }
      resolve({
        pending: pending,
        base: subFolder
      });
    } catch (error) {
      reject(error);
    }
  });
}