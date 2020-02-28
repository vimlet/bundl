module.exports = {
    outputBase: "output",
    inputBase: "input",
    watch:"input",
    clean:["output/1","output/2"],
    output: {
        "1/build.{{hash}}.txt?": {
          id: "build",
          input: "**.txt",
          order:1
        },
        "2/hash.txt": {
            input: "**.txt",
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