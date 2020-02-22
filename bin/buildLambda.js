#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

let html = fs.readFileSync(path.join(__dirname, "..", "build", "index.html"));
let lambdaBody = "exports.handler = async (event) => {\n" +
    "    // TODO implement\n" +
    "    const response = {\n" +
    "        statusCode: 200,\n" +
    "        headers: { " +
    "               'Content-Type': 'text/html; charset=UTF-8'\n" +
    "        },\n" +
    "        body:'" + html + "' \n" +
    "    };\n" +
    "    return response;\n" +
    "};\n";
let lambdaDir = path.join(__dirname,"..", "build", "_lambda");
if(!fs.existsSync(lambdaDir)){
    fs.mkdirSync(lambdaDir);
}
fs.writeFileSync(
    path.join(lambdaDir, "index.js"),
    lambdaBody
);