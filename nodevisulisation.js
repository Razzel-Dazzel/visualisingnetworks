const electron = require('electron');
const {exec, execFile} = require("child_process");
const path = require('path');
const fs = require('fs');
const { systemPreferences } = require('electron');
var filename = "JSONfiles\\NetworkProject.JSON";
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
    xCoordinatesCheck = new Array(total),
    yCoordinatesCheck = new Array(total),
    xCoordinates = new Array(total),
    yCoordinates = new Array(total);



function simulationModel(filename) {
    ctx = canvas.node().getContext("2d");
    simulation = d3.forceSimulation()
        .force("x", d3.forceX(width / 2)) // ----Locking x plane to the middle------
        .force("y", d3.forceY(height / 2)) // ---- Locking y plane to the middle ----
        .force("collide", d3.forceCollide(r))
        .force("charge", d3.forceManyBody()
            .strength(-200)) // Helps repell nodes from one another
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

            notidentical:
            if(firstItteration){
                for(i=0; i<xCoordinates.length; i++){
                    console.log(xCoordinates[i] != xCoordinatesCheck[i]);
                    if(xCoordinates[i] != xCoordinatesCheck[i] || yCoordinates[i] != yCoordinatesCheck[i]) {
                        //console.log("I am breaking!");
                        xCoordinates.forEach(function callback(value, index) { 
                            xCoordinatesCheck[index] = value;
                            yCoordinatesCheck[index] = yCoordinates[index]
                        });
                            break notidentical;
                    }
                }
                console.log("I have reached the end");
                firstItteration = false;
                exportNodeLocations();
                console.log("here");
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

async function exportNodeLocations(){ 
    console.log("Done!");
    file = fs.createWriteStream('array.txt');
    file.on('error', function(err) { /* error handling */ });
    xCoordinates.forEach(function callback(value, index){ file.write(value + '\t' + yCoordinates[index] + '\n'); });
    file.end();
    filename = ".\\JSON200\\200Cluster.JSON";
    await getNodeClustes()
    // .then( function () {
    //     convertClusterToJSON();
    // })
    // .then( async () => {
    //     await new Promise(resolve => setTimeout(resolve, 10000)).then( function () {
    //         simulationModel(filename);
    //     });
        
    // });
}


async function getNodeClustes(){
    //c++ script takes FILE K-Clusters and number of nodes
    const nodepositions = `Rmynewfile.txt 20 1000`;
    try{
        await execFile("./kMeanClustering", ["nodepositions", 20, 1000], (err, stdout, stderr) =>{
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
