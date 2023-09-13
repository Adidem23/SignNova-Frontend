const { run, artifacts } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function automateCompile() {
  await run("compile");

  ReadCompiledArtifacts();
}

async function ReadCompiledArtifacts() {
  const artifactsPath = path.join(__dirname, "../artifacts/contracts/Input.sol/");
  const artifactFiles = fs.readdirSync(artifactsPath).filter(file => file.endsWith(".json"));

  for (const artifactFile of artifactFiles) {
    const contractName = path.basename(artifactFile, ".json");
    const artifactPath = path.join(artifactsPath, artifactFile);
    const artifactContent = fs.readFileSync(artifactPath, "utf-8");

    const outputFile = path.join(__dirname, `../../Frontend/src/Components/Input.json`);
    fs.writeFileSync(outputFile, artifactContent, "utf-8");

    console.log(`Artifact content written to: ${outputFile}`);
    console.log("===============================");

  }

}


automateCompile()
  .then(() => {
    console.log("Compilation and Writing ABI is Done");
    process.exit(0);
  })
  .catch(error => {
    console.error("Compilation and Writing ABI is Not Done:", error);
    process.exit(1);
  });
