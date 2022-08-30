const electron = require('electron');
const path = require('path');
const fs = require('fs');
var filename = "JSONfiles\\NetworkProject.JSON";
var firstItteration = true;
//var filename = "JSON200\\200Cluster.JSON";
var canvas = d3.select("#network"),
    total = 9-1;
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
            if(firstItteration =  true){
                for(i=0; i<xCoordinates.length; i++){
                    if(xCoordinates[i] != xCoordinatesCheck[i]) {
                        xCoordinates.forEach(function callback(value, index) { xCoordinatesCheck[index] = value});
                        break;
                    }
                }
                for(i=0; i<yCoordinates.length; i++){
                    if(yCoordinates[i] != yCoordinatesCheck[i]) {
                        yCoordinates.forEach(function callback(value, index) { yCoordinatesCheck[index] = value});
                        break;
                    }
                }
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
        // xCoordinates = [d.x, ...xCoordinates.slice(0, total)]
        // yCoordinates = [d.y, ...yCoordinates.slice(0, total)]
    }

    function drawLink(l) {
        ctx.moveTo(l.source.x, l.source.y);
        ctx.lineTo(l.target.x, l.target.y);
    }
}
simulationModel(filename)

function exportNodeLocations(){ 
    file = fs.createWriteStream('array.txt');
    file.on('error', function(err) { /* error handling */ });
    xCoordinates.forEach(function callback(value, index){ file.write(value + '\t' + yCoordinates[index] + '\n'); });
    file.end();
    filename = "JSON200\\200Cluster.JSON";
    // Need to new run kMeansClustering.exe
    // Teke that output of kMeansClustering.exe and put that into Cluster JSON converter
    // Update filename to be 
}

