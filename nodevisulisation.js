// Global vairables
const {exec, execFile} = require("child_process");
const fs = require('fs');
var filename = "JSONfiles\\NetworkProject.JSON";
var countingsimulationloop = 0;
var firstItteration = true;
var parentObj = JSON.parse(fs.readFileSync("JSONfiles\\NetworkProject.JSON"));

// Set the max timestep to be the size of the nodeStatis array in parent file
document.getElementById("time").setAttribute("max",parentObj.nodes[0].status.length-1);

// Set Canvas variable specifics
var canvas = d3.select("#network"),
    total = parseInt(parentObj.numNodes),
    width = canvas.attr("width"),
    height = canvas.attr("height"),
    r = 8,
    xCoordinates = new Array(total),
    yCoordinates = new Array(total);

// Main simulation function
async function simulationModel(filename) {
    ctx = canvas.node().getContext("2d");
    // Definning simulation characteristics
    simulation = d3.forceSimulation()
        .force("x", d3.forceX(width / 2)) // ----Locking x plane to the middle------
        .force("y", d3.forceY(height / 2)) // ---- Locking y plane to the middle ----
        .force("collide", d3.forceCollide(r))
        .force("charge", d3.forceManyBody()
            .strength(-200))
        .force("link", d3.forceLink()
            .id(function (d) { return d.name; }));

    d3.json(filename, function(err, graph){ 
        if (err) throw err;

        simulation
            .nodes(graph.nodes)
            .on("tick", update)
            .force("link")
            .links(graph.links);

        // Used to alow user to move the ndoes
        canvas
            .call(d3.drag()
            .container(canvas.node())
            .subject(dragsubject)
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));

        // Function runs until alpha value of d3 is 0 and nodes are no longer moving
        function update() {
            countingsimulationloop ++; // Tracking update loop
            // Nodes will no longer be moving so export their positions
            if(firstItteration && countingsimulationloop > 297){
                firstItteration = false;
                exportNodeLocations(20, parentObj.numNodes);
            }
            
            // Clearing the canvas each time a draw is done
            ctx.clearRect(0, 0, width, height);
            // Drawing the links
            ctx.beginPath();
            graph.links.forEach(drawLink);
            ctx.stroke();
            graph.nodes.forEach(drawNode)
            
        }
    });
    // Drawing a node at the calculated position
    function drawNode(d) {
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.arc(d.x, d.y, r, 0, 2 * Math.PI);
        xCoordinates[d.name] = d.x;
        yCoordinates[d.name] = d.y;
        ctx.fillStyle = "yellow";
        ctx.fillText(d.name, d.x+10, d.y+3);
        ctx.fill()
    }
    // Drawing links specified in JSON file
    function drawLink(l) {
        ctx.moveTo(l.source.x, l.source.y);
        ctx.lineTo(l.target.x, l.target.y);
    }
    // Function to allow nodes to be moved after alpha value is 0
    function dragsubject(){
        return simulation.find(d3.event.x, d3.event.y)
    }
}

// Start the simulation of boot
simulationModel(filename);

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////// Functions used to move the node and show infomraiton panel ///////////
function dragstarted() {
    var nodeclicked = d3.event.subject.name; //Node that was clicked
    //Getting information panel
    var infoPage = document.getElementById("draggable");
    var timestep = document.getElementById("time").value;

    // Read the status vairables for all the nodes in the cluster and update the corrisponding status array
    var currFile = JSON.parse(fs.readFileSync(filename));
    const statusArray = new Array(8).fill(0);
    var arrayOfNodes = currFile.nodes[nodeclicked].nodeInClusters;
    arrayOfNodes.forEach(node => {
        statusArray[parentObj.nodes[node].status[timestep]]++;
    })

    infoPage.style.display = "block";
    document.getElementById("title").innerHTML = "Node: " + nodeclicked
    // Write the status of he nodes to the screen
    document.getElementById("Susceptible").innerHTML = "Susceptible: " + statusArray[0]
    document.getElementById("Latent_1").innerHTML = "Latent_1: " + statusArray[1]
    document.getElementById("Latent_2").innerHTML = "Latent_2: " + statusArray[2]
    document.getElementById("Symptomatic_0").innerHTML = "Symptomatic_0: " + statusArray[3]
    document.getElementById("Symptomatic_1").innerHTML = "Symptomatic_1: " + statusArray[4]
    document.getElementById("Symptomatic_2").innerHTML = "Symptomatic_2: " + statusArray[5]
    document.getElementById("Recovered").innerHTML = "Recovered: " + statusArray[6]
    document.getElementById("Dead").innerHTML = "Dead: " + statusArray[7]

    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d3.event.subject.fx = d3.event.subject.x;
    d3.event.subject.fy = d3.event.subject.y;
}

function dragged() {
    d3.event.subject.fx = d3.event.x;
    d3.event.subject.fy = d3.event.y;
}

function dragended() {
    if (!d3.event.active) simulation.alphaTarget(0);
    d3.event.subject.fx = null;
    d3.event.subject.fy = null;
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Function to get the x and y locations of all nodes being displayed and generate a new file and load it to screen
async function exportNodeLocations(clusterSize, clusterNodeCount){
    file = fs.createWriteStream('Rmynewfile.txt');
    file.on('error', function(err) { /* error handling */ });
    xCoordinates.forEach(function callback(value, index){ file.write(value + '\t' + yCoordinates[index] + '\n'); });
    file.end();
    // When the positions have been written run the clustering algorithim
    file.on('close',async ()=> {
        filename = ".\\JSON200\\200Cluster.JSON";
        if(!await getNodeClustes(clusterSize, clusterNodeCount)){
            return false;
        }
        // Convert the clustered file to a JSON file
        await convertClusterToJSON(20)
        // Update the node arrays to reflect the new number of nodes being used
        xCoordinates = new Array(total),
        yCoordinates = new Array(total);
        // Start simulation again with new JSON file
        await simulationModel(filename);
    });
}

// Function to run kMeanClustering.exe and wait for it to finsih before continuing
async function getNodeClustes(clusterSize, clusterNodeCount){
    //c++ script takes FILE K-Clusters and number of clusters and number of nodes
    return new Promise((resolved, reject) => {
        const nodepositions = `Rmynewfile.txt`;
        const numClusters = clusterSize;
        const numNodes = clusterNodeCount;
        try{
            execFile("./kMeanClustering", [nodepositions, numClusters, numNodes], (err, stdout, stderr) =>{
                if(err){
                    console.log(err);
                    reject(err);
                } if(stderr){
                    console.log(stderr);
                    reject(err);
                }
                resolved(1);
            }) ;
        } catch(err){
            reject(err);
        }
    })
}
   
// Function to run convertClusterToJSON and wait for it to finsih before continuing
async function convertClusterToJSON(clustersize){
    // Java file takes the cluster size.
    return new Promise((resolved, reject) => {
        try{
            exec(`java convertClusterToJSON "${clustersize}"`, (err, stdout, stderr) =>{
                if(err){
                    console.log(err);
                    reject(err);
                } if(stderr){
                    console.log(stderr);
                    reject(err);
                }
                resolved(1);
            }) ;
        }catch(err){
            console.log(err);
            reject(err);
        };
    })
}

// Function used to take the current selected supernode and generate a new JSON file based on the nodes the supernode contains
function inspectCluster(){
    var selectedNode = parseInt(document.getElementById("title").innerText.split(" ")[1]);
    var currFile = JSON.parse(fs.readFileSync(filename));
    var locationsNeeded = currFile.nodes[selectedNode].nodeInClusters
    var xLocation = [];
    var yLocation = [];
    const allFileContents = fs.readFileSync('Rmynewfile.txt', 'utf-8');
    allFileContents.split("\n").forEach((line, value) => {
        if(value in locationsNeeded){
            var xy = line.split('\t');
            xLocation.push(xy[0]);
            yLocation.push(xy[1]);
        }
    });

    file = fs.createWriteStream('Rmynewfile.txt');
    file.on('error', function(err) { /* error handling */ });
    xLocation.forEach(function callback(value, index){ file.write(value + '\t' + yLocation[index] + '\n'); });
    file.end();
    
    file.on('close',async ()=> {
        filename = ".\\JSON200\\200Cluster_0.JSON";
        if(!await getNodeClustes(4, locationsNeeded.length)){
            return false;
        }
        console.log(filename);
        await convertClusterToJSON(4)
        xCoordinates = new Array(locationsNeeded.length),
        yCoordinates = new Array(locationsNeeded.length);
        await simulationModel(filename);
        console.log("finished running Convert function");
    });
}

// Jquery function to allow user to move the information panel around in the event it is covering data
$(function() {
    $("#draggable").draggable().css("position", "absolute");;
});

// Close the information panel
$( "#close" ).click(function() {
    var infoPage = document.getElementById("draggable")
    infoPage.style.display = "none";
});

