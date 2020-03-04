module.exports = {
    inputBase: "tests/resources/hash",
    outputBase: "tests/resources/hash",
    output: {
        "output/1/build.{{hash}}.txt?": {
          id: "build",
          input: "input/files/**.txt",
          order:1
        },
        "output/2/hash.txt": {
            input: "input/hash/**.txt",
            order:2,
            parse:true
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