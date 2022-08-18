const electron = require('electron');
const path = require('path');
const fs = require('fs');
var filename = "JSONfiles\\NetworkProject_2.JSON";
var canvas = d3.select("#network"),
    total = 1000-1;
    width = canvas.attr("width"),
    height = canvas.attr("height"),
    r = 8,
    xCoordinates = new Array(total),
    yCoordinates = new Array(total);

ctx = canvas.node().getContext("2d");
simulation = d3.forceSimulation()
    .force("x", d3.forceX(width / 2)) // ----Locking x plane to the middle------
    .force("y", d3.forceY(height / 2)) // ---- Locking y plane to the middle ----
    .force("collide", d3.forceCollide(r))
    .force("charge", d3.forceManyBody()
        .strength(-50)) // Helps repell nodes from one another
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
        // Clearing the canvas each time a draw is done
        ctx.clearRect(0, 0, width, height);
        // Drawing the links
        ctx.beginPath();
        graph.links.forEach(drawLink);
        ctx.stroke();

        // Drawing the nodes
        ctx.beginPath();
        graph.nodes.forEach(drawNode);
        ctx.fill();
    }
});

function drawNode(d) {
    ctx.moveTo(d.x, d.y);
    ctx.arc(d.x, d.y, r, 0, 2 * Math.PI);
    xCoordinates = [d.x, ...xCoordinates.slice(0, total)]
    yCoordinates = [d.y, ...yCoordinates.slice(0, total)]
}

function drawLink(l) {
    ctx.moveTo(l.source.x, l.source.y);
    ctx.lineTo(l.target.x, l.target.y);
}

function exportNodeLocations(){ 
    //console.log("Button Pressed");
    //var fs = require('fs');  
    //var file = fs.createWriteStream('G:\\My Drive\\Bachelor of Engineering (Honours)\\ 2022\\Sem1\\EGH400-1\\Project\\testingwrite.txt', {overwrite: false});
    //file.on('error', function(err){console.log(err);});
    // xCoordinates.forEach((x, index) => {fs.writeFileSync('myfile.txt', x + "\t" + yCoordinates[index] + '\n');});
    // //file.end();
    // JSON.stringify(xCoordinates)
    console.log('HERE!')
    fs.open('Rmynewfile.txt', 'w', function (err, file) {
        if (err) throw err;
        console.log('Saved!!!!');
      });
    for(let i = 0; i < xCoordinates.length; i++){
        fs.appendFile("Rmynewfile.txt", `${xCoordinates[i]}\t${yCoordinates[i]}\n`, function (err) {
            if (err) throw err;
            console.log('Update!');
        });
    }
  }

