const express = require('express');
const app = express();
const BodyParser = require('body-parser');
const PORT = 6789;
const cors = require('cors');
const fs = require('fs');
const fs1 = require('fs-extra');
const path = require('path');
const solc = require('solc');
const { spawn } = require("child_process");


app.use(BodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors(({
    origin: "http://localhost:5173",
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
})))

app.get("/", (req, res) => {
    const pathtoFileForExecution = path.join('../Hardhat/scripts/', 'CustomFile.js')
    const childProcess = spawn("node", [pathtoFileForExecution]);

    childProcess.stdout.on("data", data => {
        console.log(`Script output: ${data}`);
    });

    childProcess.stderr.on("data", data => {
        console.error(`Script error: ${data}`);
    });

    childProcess.on("close", code => {
        console.log(`Script process exited with code ${code}`);
    });

    res.send("<h1>Helloo!!!!</h1>")

});

// This is are  Compiler Functions  Start  //
const buildPath = path.resolve(__dirname, 'build');

function compilingPreparations() {
    const buildPath = path.resolve(__dirname, 'build');
    fs1.removeSync(buildPath);
    return buildPath;
}

function compileSources(config) {
    try {
        return JSON.parse(solc.compile(JSON.stringify(config)), getImports);
    } catch (e) {
        console.log(e);
    }
}

function getImports(dependency) {
    const basePath = path.resolve(__dirname, 'contracts');
    const filePath = path.join(basePath, dependency);
    if (fs.existsSync(filePath)) {
        return { contents: fs.readFileSync(filePath, 'utf8') };
    }

    return { error: 'File not found' };
}

function createConfiguration() {
    return {
        language: 'Solidity',
        sources: {
            'Dog.sol': {
                content: fs.readFileSync(path.resolve(__dirname, 'contracts', 'Dog.sol'), 'utf8')
            },
        },
        settings: {
            outputSelection: {
                '*': {
                    '*': ['*']
                }
            }
        }
    };
}

function errorHandling(compiledSources) {
    if (!compiledSources) {
        console.error('>>>>>>>>>>>>>>>>>>>>>>>> ERRORS <<<<<<<<<<<<<<<<<<<<<<<<\n', 'NO OUTPUT');
    } else if (compiledSources.errors) { // something went wrong.
        console.error('>>>>>>>>>>>>>>>>>>>>>>>> ERRORS <<<<<<<<<<<<<<<<<<<<<<<<\n');
        compiledSources.errors.map(error => console.log(error.formattedMessage));
    }
}
function writeOutput(compiled, buildPath) {
    fs1.ensureDirSync(buildPath);

    for (let contractFileName in compiled.contracts) {
        const contractName = contractFileName.replace('.sol', '');
        console.log('Writing: ', contractFileName + '.json');
        fs1.outputJsonSync(
            path.resolve(buildPath, contractFileName + '.json'),
            compiled.contracts[contractFileName][contractFileName]
        );
    }
}

//   This is compiler function ends //

function RunFile() {
    const pathtoFileForExecution = path.join('../Hardhat/scripts/', 'CustomFile.js')
    const childProcess = spawn("node", [pathtoFileForExecution]);

    childProcess.stdout.on("data", data => {
        console.log(`Script output: ${data}`);
    });

    childProcess.stderr.on("data", data => {
        console.error(`Script error: ${data}`);
    });

    childProcess.on("close", code => {
        console.log(`Script process exited with code ${code}`);
    });
}


app.post("/file", async (req, res) => {
    const FileInput1 = req.body.file;
    const pathtofile = path.join('../Hardhat/Contracts/', 'Input.sol');
    fs.writeFileSync(pathtofile, FileInput1);
    RunFile();
    res.status(200).send("ok Done");
});



app.listen(PORT, () => {
    console.log(`Server is On Baby ${PORT}`)
})