module.exports = {
    inputBase: "tests/resources/clean",
    outputBase: "tests/resources/clean/outputArray",
    clean:["1"],
    output: {
        "1/build.txt?": {
          id: "build",
          input: "input/**.txt",
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