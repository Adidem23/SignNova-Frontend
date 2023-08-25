const { run } = require("hardhat");

async function automateCompile() {
  await run("compile");
}

automateCompile()
  .then(() => {
    console.log("Compilation completed.");
    process.exit(0);
  })
  .catch(error => {
    console.error("Compilation failed:", error);
    process.exit(1);
  });
