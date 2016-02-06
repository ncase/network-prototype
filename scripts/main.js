
// Set up graphics
var model = Snap("#model");
var connectionsSVG = model.group();
var nodesSVG = model.group();

// Run custom code, yeah yeah eval() is evil, sue me.
var _setupNode;
function resetCode(){
	eval("_setupNode = function(me){ "+document.getElementById("code").value+"}");
}

// Create the Node Class
function Node(config){

	var self = this;
	self.config = config;

	// SVG Graphics
	self.x = config.x;
	self.y = config.y;
	self.graphics = nodesSVG.group();
	self.graphics.transform("translate("+self.x+","+self.y+")");

	// Change State
	self.setState = function(state){
		self.state = state;
		self.draw();
	};

	//////////////////////
	// TO REPLACE SORTA //
	//////////////////////

	self.state = "";
	self.init = function(){};
	self.update = function(){};
	self.draw = function(){};

	//////////////////////
	// HELPER FUNCTIONS //
	//////////////////////

	self.getNeighbors = function(){
		return Connection.getNodesFrom(self);
	};
	self.getNeighborsWithState = function(state){
		var neighbors = self.getNeighbors();
		var results = [];
		for(var i=0;i<neighbors.length;i++){
			var n = neighbors[i];
			if(n.state==state) results.push(n);
		}
		return results;
	};
	self.isAnyNeighbor = function(state){
		return (self.getNeighborsWithState(state).length>0);
	};
	self.getProportionOfNeighbors = function(state){
		var count = self.getNeighborsWithState(state).length;
		var total = self.countNeighbors();
		if(total==0) return 0;
		return count/total;
	};
	self.countNeighbors = function(){
		return self.getNeighbors().length;
	};
	self.forEachNeighbor = function(callback){
		var neighbors = self.getNeighbors();
		for(var i=0;i<neighbors.length;i++){
			var n = neighbors[i];
			callback(n);
		}
	};

	///////////////////////
	// NOW SET IT ALL UP //
	///////////////////////

	_setupNode(self);

}

// Create Connection Class
function Connection(config){
	var self = this;
	self.config = config;
	self.from = config.from;
	self.to = config.to;

	// SVG Graphics
	var n1 = self.from;
	var n2 = self.to;
	self.graphics = connectionsSVG.line(n1.x,n1.y,n2.x,n2.y).attr({
		stroke: "#666",
    	strokeWidth: 2,
	});

}
Connection.add = function(from,to){
	connections.push(new Connection({
		from: from,
		to: to
	}));
};
Connection.addBidirectional = function(n1,n2){
	Connection.add(n1,n2);
	Connection.add(n2,n1);
};
Connection.getConnectionsFrom = function(node){
	var results = [];
	for(var i=0;i<connections.length;i++){
		var c = connections[i];
		if(c.from==node) results.push(c);
	}
	return results;
};
Connection.getNodesFrom = function(node){
	var connections = Connection.getConnectionsFrom(node);
	var results = [];
	for(var i=0;i<connections.length;i++){
		results.push(connections[i].to);
	}
	return results;	
};

/////////////////////
//// INITIALIZE /////
/////////////////////

window.SPACE = 50;
window.WOBBLE = 15;
window.RADIUS = 70;
function init(){
	
	// Empty arrays
	window.nodes = [];
	window.connections = [];

	// Clear out SVG
	nodesSVG.clear();
	connectionsSVG.clear();

	// Reset Code
	resetCode();

	// Generate a random griddish graph
	for(var x=SPACE;x<500;x+=SPACE){
		for(var y=SPACE;y<500;y+=SPACE){
			nodes.push(new Node({
				x: x+_random(-WOBBLE,WOBBLE),
				y: y+_random(-WOBBLE,WOBBLE),
			}));
		}
	}

	// Connect 'em all. (if they're close enough)
	for(var i=0;i<nodes.length;i++){
		var node1 = nodes[i];
		for(var j=0;j<nodes.length;j++){
			if(j==i) continue;
			var node2 = nodes[j];
			
			// are they close enough?
			var dx = node1.x-node2.x;
			var dy = node1.y-node2.y;
			var distSquared = dx*dx+dy*dy;
			if(distSquared<RADIUS*RADIUS){

				// Make new connection, both ways
				Connection.addBidirectional(node1,node2);

			}
			
		}
	}

	// Initialize 'Em All.
	for(var i=0;i<nodes.length;i++){
		var n = nodes[i];
		n.init();
		n.draw();
	}

}

window.onload = function(){
	resetCode();
	_setupNode(new Node({x:-100,y:-100})); // HACK
	init();
};

// Update Loop
function update(){

	// just update them all in sequence. synchrony is a lie.
	var i = Math.floor(Math.random()*nodes.length);
	var n = nodes[i];
	n.update();
	n.draw();

}
setInterval(function(){
	update();
	update();
	update();
	update();
	update();
},1000/60);
