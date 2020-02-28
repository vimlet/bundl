module.exports = {
    inputBase: "tests/resources/clean",
    outputBase: "tests/resources/clean/outputHash",
    clean:true,
    output: {
        "1/build.{{hash}}.txt?": {
          id: "build",
          input: "inputHash/**.txt",
          order:1
        },
        "2/clean.txt": {
            input: "input/**.txt",
            order:2
        },
    }
}

function waitTest(amount) {
    return new Promise((resolve, reject) => {
        amount = amount || 1;
        setTimeout(() => {
            resolve("Waited for");
        }, (500 * amount));
    });
}