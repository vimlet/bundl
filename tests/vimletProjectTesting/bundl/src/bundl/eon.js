module.exports = async function (entry, bundl) {
    await bundl.run.exec("npx", {
        args: ["eon-cli", "build"],
        execHandler: function (out, error) {
            console.log(out || error);
        }
    });
    return entry;
};