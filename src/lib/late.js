const promisify = require("util").promisify;
const fs = require("fs");
const writeFile = promisify(fs.writeFile);
const exists = promisify(fs.exists);
const mkdir = promisify(fs.mkdir);
const parse = require("./parse");
const path = require("path");

async function processLateMetaHash(hashes, result) {
  if (result.parse) {
    result.content = await parse(result.content, {
      data: {
        hashParse: true,
        hashes: hashes
      }
    });
  }
  return result;
};

async function writeResult(result, config) {
  // console.log("4",result);
  if (!await exists(result.outputParent)) {
    console.log("NO EXISTE");

    try {
      // await mkdir(result.outputParent, {
      //   recursive: true
      // }, () => {});
      // await createDir(result);
      console.log("result.outputParent:::", result.outputParent);
      await mkDirRecursive(result.outputParent);
      console.log("DONE");

    } catch (error) {
      // Ignore error since sibling files will try to create the same directory
      // console.log("SSSSSS");
      // console.log(error);

    }
  }


  async function mkDirRecursive(folder, previous) {
    return new Promise(async (resolve, reject) => {
      console.log("1", folder);
      if (await exists(folder)) {
        console.log("2", folder);

        if (previous) {
          if (!await exists(previous)) {
            console.log("3", folder);

            await mkdir(previous, (error) => {
              // console.log("ERROR:::",error);

              if (!error) {
                console.log("4", folder);

                resolve();
              } else {
                if (error.code === 'EEXIST') {
                  console.log("AQIU");
                  
                  resolve();
                } else {
                  reject(error);
                }
              }
            });
          } else {
            console.log("4.5", folder);

            resolve();
          }
        } else {
          console.log("5", folder);

          resolve();
        }
      } else {
        console.log("6", folder);

        var subFolder = path.dirname(folder);
        console.log("SUB:::", subFolder);

        return await mkDirRecursive(subFolder, folder);
        // return mkDirRecursive(folder);
      }
    });
  }

  // async function existSubFolder(folder){
  //   return new Promise((resolve, reject) => {
  //     if (await exists(folder)) {
  //       resolve();
  //     }else{

  //     }
  //   });
  // }

  // async function createDir(result, origin) {
  //   return new Promise(async (resolve, reject) => {
  //     var folder = result.outputParent;
  //     if (origin) {
  //       folder = origin;
  //     }

  //     if (!await exists(folder)) {
  //       await mkdir(folder, {
  //         recursive: true
  //       }, (error) => {
  //         if (error) {
  //           if (error.code === "ENOENT") {
  //             console.log("SISISI");
  //             console.log(error);
  //             // console.log("ERRPATJ:::",error.path);
  //             // console.log("SUBDIR:::",path.dirname(error.path));

  //             return createDir(result, path.dirname(error.path));
  //           } else {
  //             reject(error);
  //           }
  //         } else {
  //           // resolve();
  //           if (origin) {
  //             return createDir(result);
  //           } else {
  //             resolve();
  //           }
  //         }
  //       });
  //     } else {
  //       if (origin) {
  //         return createDir(result);
  //       } else {
  //         resolve();
  //       }
  //     }


  //   });
  // }


  await writeFile(result.outputPath, result.content);
  if (!("log" in config) || config.log) {
    console.log(`-> ${result.outputPath}`);
  }
}

module.exports.process = async (results, hashes, config) => {
  let latePromises = [];

  results.map(result => {
    let late = async () => {
      // Use meta to replace hashes
      result = await processLateMetaHash(hashes, result);
      // Write results to disk
      await writeResult(result, config);
      return result;
    };
    latePromises.push(late());
  });

  await Promise.all(latePromises);
};