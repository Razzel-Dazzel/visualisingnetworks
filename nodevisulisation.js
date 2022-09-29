const electron = require('electron');
const {exec, execFile} = require("child_process");
const path = require('path');
const fs = require('fs');
const { systemPreferences } = require('electron');
const { rejects } = require('assert');
var filename = "JSONfiles\\NetworkProject.JSON";
var countingsimulationlook = 0;

var spawn = require("child_process").spawn;
var firstItteration = true;

var canvas = d3.select("#network"),
    total = parseInt(JSON.parse(fs.readFileSync("JSONfiles\\NetworkProject.JSON")).numNodes),
    width = canvas.attr("width"),
    height = canvas.attr("height"),
    r = 8,
    xCoordinatesCheck = new Array(total).fill(0),
    yCoordinatesCheck = new Array(total).fill(0),
    xCoordinates = new Array(total),
    yCoordinates = new Array(total);

async function simulationModel(filename) {
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


    d3.json(filename, function(err, graph){ 
    //d3.json("fakedata.JSON", function (err, graph) {
        if (err) throw err;
        
        simulation
            .nodes(graph.nodes)
            .on("tick", update)
            .force("link")
            .links(graph.links);

        function update() {
            nodesStillMoving(firstItteration);
            if(firstItteration && countingsimulationlook > 297){
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

    file = fs.createWriteStream('Rmynewfile.txt');
    file.on('error', function(err) { /* error handling */ });
    xCoordinates.forEach(function callback(value, index){ file.write(value + '\t' + yCoordinates[index] + '\n'); });
    file.end();
    file.on('close',async ()=> {
        filename = ".\\JSON200\\200Cluster.JSON";
        if(!await getNodeClustes()){
            return false;
        }
        console.log("Am about to run Convert function");
        await convertClusterToJSON()
        await simulationModel(filename);
        console.log("finished running Convert function");
        
    })
}


async function getNodeClustes(){
    //c++ script takes FILE K-Clusters and number of nodes
    return new Promise((resolved, reject) => {
        const nodepositions = `Rmynewfile.txt`;
        const aaa = `20`;
        const bbb = `1000`;
        try{
            execFile("./kMeanClustering", [nodepositions, aaa, bbb], (err, stdout, stderr) =>{
                if(err){
                    console.log(err);
                } if(stderr){
                    console.log(stderr);
                }
            }) ;
            resolved(1);
        } catch(err){
            reject(err);
        }
    })
}
   

async function convertClusterToJSON(){
    // Java file takes the number of clusters that were used.
    return new Promise((resolved, reject) => {
        try{
            exec("java convertClusterToJSON \"20\"", (err, stdout, stderr) =>{
                if(err){
                    console.log(err);
                } if(stderr){
                    console.log(stderr);
                }
            }) ;
            resolved(1);
        }catch(err){
            console.log(err);
            reject(err);
        };
    })
}
