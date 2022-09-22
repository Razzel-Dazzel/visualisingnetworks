const electron = require('electron');
const {exec, execFile} = require("child_process");
const path = require('path');
const fs = require('fs');
const { systemPreferences } = require('electron');
var filename = "JSONfiles\\NetworkProject.JSON";
var countingsimulationlook = 0;
// var totaltest;
// fs.readFile("JSONfiles\\NetworkProject.JSON", 'utf8', (err, jsonString) => {
//     if (err) {
//         console.log("File read failed:", err)
//         return
//     }
//     var jsonObj = JSON.parse(jsonString);
//     totaltest = jsonObj.numNodes.toString();
// })

//var filename = "JSON200\\200Cluster.JSON";
var spawn = require("child_process").spawn;
var firstItteration = true;
//var filename = "JSON200\\200Cluster.JSON";
var canvas = d3.select("#network"),
    total = 1000, //total = JSON.parse(filename).nodenumber, //TRY AND FIND OUT HOW TO READ IN DATA AND WAIT FOR THIS REPLY
    width = canvas.attr("width"),
    height = canvas.attr("height"),
    r = 8,
    xCoordinatesCheck = new Array(total).fill(0),
    yCoordinatesCheck = new Array(total).fill(0),
    xCoordinates = new Array(total),
    yCoordinates = new Array(total);



function simulationModel(filename) {
    ctx = canvas.node().getContext("2d");
    simulation = d3.forceSimulation()
        .force("x", d3.forceX(width / 2)) // ----Locking x plane to the middle------
        .force("y", d3.forceY(height / 2)) // ---- Locking y plane to the middle ----
        .force("collide", d3.forceCollide(r))
        .force("charge", d3.forceManyBody()
            .strength(-200))
            //.alphaDecay(0) // Helps repell nodes from one another
        .force("link", d3.forceLink()
            .id(function (d) { return d.name; }));

    // graph.nodes.forEach(function (d) {
    //   d.x = Math.random() * width;
    //   d.y = Math.random() * height;
    // });
    d3.json(filename, function(err, graph){ 
    //d3.json("fakedata.JSON", function (err, graph) {
        if (err) throw err;
        
        simulation
            .nodes(graph.nodes)
            .on("tick", update)
            .force("link")
            .links(graph.links);

        function update() {
            console.log("HIT!!!!!!!!");
            nodesStillMoving(firstItteration);
            //if(firstItteration == false) {console.log("IT HAPPENED!")}
            console.log(countingsimulationlook);
            if(firstItteration && countingsimulationlook > 297){
                console.log("IN HERE");
                firstItteration = false;
                exportNodeLocations();
            }
            // Clearing the canvas each time a draw is done
            ctx.clearRect(0, 0, width, height);
            // Drawing the links
            ctx.beginPath();
            graph.links.forEach(drawLink);
            ctx.stroke();

            // Drawing the nodes
            ctx.beginPath();
            graph.nodes.forEach(drawNode)
            
            //ctx.style("fill","red");
            ctx.fill()
        }
    });

    function drawNode(d) {
        ctx.moveTo(d.x, d.y);
        ctx.arc(d.x, d.y, r, 0, 2 * Math.PI);
        xCoordinates[d.name] = d.x;
        yCoordinates[d.name] = d.y;

        if(d.name == 6){
            ctx.fillStyle = "red";
        }
    }

    function drawLink(l) {
        ctx.moveTo(l.source.x, l.source.y);
        ctx.lineTo(l.target.x, l.target.y);
    }
}


simulationModel(filename);

function nodesStillMoving(firstItteration){
    if(firstItteration === true){
        countingsimulationlook ++;
        for(i=0; i<xCoordinates.length; i++){
            if(xCoordinates[i] != xCoordinatesCheck[i] || yCoordinates[i] != yCoordinatesCheck[i]) {
                xCoordinates.forEach(function callback(value, index) { 
                    xCoordinatesCheck[index] = value;
                    yCoordinatesCheck[index] = yCoordinates[index]
                });
                return false;                   
            }
        }
        return true;
    }
    return false;
}



async function exportNodeLocations(){
    var x_values = 0;
    var y_values = 0;
    xCoordinates.forEach(function callback(value, index){ 
        x_values = value + xCoordinatesCheck[index];
        y_values = yCoordinates[index] + yCoordinatesCheck[index];
    });
    console.log(x_values/total + " : " + y_values/total);
    
    console.log("Done!");
    file = fs.createWriteStream('Rmynewfile.txt');
    file.on('error', function(err) { /* error handling */ });
    xCoordinates.forEach(function callback(value, index){ file.write(value + '\t' + yCoordinates[index] + '\n'); });
    file.end();
    filename = ".\\JSON200\\200Cluster.JSON";
    await getNodeClustes()
    .then( async function () {
        await convertClusterToJSON();
    })
    .then( async () => {
        await new Promise(resolve => setTimeout(resolve, 10000)).then( function () {
            simulationModel(filename);
        });
        
    });
}


async function getNodeClustes(){
    //c++ script takes FILE K-Clusters and number of nodes
    const nodepositions = `Rmynewfile.txt`;
    const aaa = `20`;
    const bbb = `1000`;
    try{
        await execFile("./kMeanClustering", [nodepositions, aaa, bbb], (err, stdout, stderr) =>{
            if(err){
                console.log(err);
            } if(stderr){
                console.log(stderr);
            }
        }) ;
        return 1;
    } catch(err){
        console.log(err);
    }
    
}

async function convertClusterToJSON(){
    // Java file takes the number of clusters that were used.
    try{
        await exec("java convertClusterToJSON \"20\"", (err, stdout, stderr) =>{
            if(err){
                console.log(err);
            } if(stderr){
                console.log(stderr);
            }
        }) ;
    }catch(err){
        console.log(err);
    };
}
