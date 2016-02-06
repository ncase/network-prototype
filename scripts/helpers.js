// Random Range
var _random = function(A,B){
	if(B===undefined){
		return Math.random()*A; // from 0 to A
	}else{
		return (B-A)*Math.random() + A; // from A to B
	}
};

// Chance
var _chance = function(chance){
	return(Math.random()<chance);
};

// Shuffle (Cloned) Array
// The Fisher-Yates Shuffle
/*var _shuffle = function(arr){

	// Clone
	var array = arr.slice(0);

	// Vars
	var currentIndex = array.length, temporaryValue, randomIndex;

	// While there remain elements to shuffle...
	while (0 !== currentIndex) {

		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		// And swap it with the current element.
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;

	}

	return array;

}*/