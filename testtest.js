const fs = require('fs')
fs.readFile("JSONfiles\\NetworkProject.JSON", 'utf8', (err, jsonString) => {
    if (err) {
        console.log("File read failed:", err)
        return
    }
    var test = JSON.parse(jsonString);
    console.log(test.numNodes.toString());
})