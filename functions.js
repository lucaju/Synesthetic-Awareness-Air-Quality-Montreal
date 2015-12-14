var air;

var activeView = "#home-page";

var stationsDataset = [	
	{
		id:1,
		name:"Jardin Botanique",
		neighbourhood: "Rosemont-La Petite-Patrie",
		latitude: 45.56221,
		longitude: -73.571785
	},
	{
		id:3,
		name:"Saint-Jean-Baptiste",
		neighbourhood: "Rivière-des-Prairies",
		latitude: 45.641026,
		longitude: -73.499682
	},
	{
		id:6,
		name:"Anjou",
		neighbourhood: "Anjou",
		latitude: 45.602846,
		longitude: -73.558874
	},
	{
		id:7,
		name:"Chénier",
		neighbourhood: "Anjou",
		latitude: 45.60176,
		longitude: -73.541992
	},
	{
		id:12,
		name:"Ontario",
		neighbourhood: "Ville-Marie",
		latitude: 45.52055,
		longitude: -73.563222
	},
	{
		id:13,
		name:"Drummond",
		neighbourhood: "Ville-Marie",
		latitude: 45.497859,
		longitude: -73.573035
	},
	{
		id:17,
		name:"Caserne",
		neighbourhood: "Montréal-Nord",
		latitude: 45.593325,
		longitude: -73.637328
	},
	{
		id:28,
		name:"Échangeur Décarie",
		neighbourhood: "Mont-Royal",
		latitude: 45.502648,
		longitude: -73.663913
	},
	{
		id:29,
		name:"Parc Pilon",
		neighbourhood: "Montréal-Nord",
		latitude: 45.594576,
		longitude: -73.641535
	},
	{
		id:43,
		name:"Saint-Michel",
		neighbourhood: "St-Michel",
		latitude: 45.563697,
		longitude: -73.610447
	},
	{
		id:49,
		name:"Dorval",
		neighbourhood: "Dorval",
		latitude: 45.439119,
		longitude: -73.7333
	},
	{
		id:50,
		name:"Hochelaga-Maisonneuve",
		neighbourhood: "Hochelaga-Maisonneuve",
		latitude: 45.539928,
		longitude: -73.540388
	},
	{
		id:55,
		name:"Rivière-des-Prairies",
		neighbourhood: "Rivière-des-Prairies",
		latitude: 45.651722,
		longitude: -73.573896
	},
	{
		id:59,
		name:"Rivière-des-Prairies",
		neighbourhood: "Rivière-des-Prairies",
		latitude: 45.652701,
		longitude: -73.562951
	},
	{
		id:61,
		name:"Maisonneuve",
		neighbourhood: "Ville-Marie",
		latitude: 45.501531,
		longitude: -73.574311
	},
	{
		id:66,
		name:"Aéroport de Montréal",
		neighbourhood: "Dorval",
		latitude: 45.468297,
		longitude: -73.741185
	},
	{
		id:68,
		name:"Verdun",
		neighbourhood: "Verdun",
		latitude: 45.472854,
		longitude: -73.57296
	},
	{
		id:80,
		name:"Saint-Joseph",
		neighbourhood: "Rosemont-La Petite-Patrie",
		latitude: 45.542767,
		longitude: -73.572039
	},
	{
		id:99,
		name:"Sainte-Anne-de-Bellevue",
		neighbourhood: "Sainte-Anne-de-Bellevue",
		latitude: 45.426509,
		longitude: -73.928944
	}, ]

function LocalPollution() {
	this.stationID;

	this.name;
	this.neighbourhood;
	this.location = {};

	this.date;

	this.index;

	this.pollutants = [];
	this.latestPollutants = [];}
var localPollution;


//options
var locationNameDisplay = "name"; //name || neighbourhood
var pollutionIndexDisplay = "measure"; //index || measure

//--- Initiatie
function initiate() {

	$("#seeBT").click( function() { triggerSee(); });
	$("#listenBT").click( function() { triggerListen(); });
	$("#signatureBT").click( function() { triggerSignature(); });
	$(".backBT").click( function() { triggerBack(); });

	$("#location").click( function() { changeDisplayLocation($(this)); });
	$("#AQI-components").click( function() { changeUnitDisplay($(this)); });

	localPollution = new LocalPollution();

	var workingStations = filterWorkingStation(air);

	getLocation(function() {

		var closestStation = getNearestStation(workingStations, this.latitude,this.longitude);
		
		localPollution.stationID = closestStation.id;
		localPollution.name = closestStation.name;
		localPollution.neighbourhood = closestStation.neighbourhood;
		localPollution.location = {lat: closestStation.latitude, long: closestStation.longitude};

		localPollution.date = moment({month:air.journee["@attributes"].mois-1,date:air.journee["@attributes"].jour,year:air.journee["@attributes"].annee});

		localPollution.pollutants = getDatafromNearestStation(air,localPollution.stationID);
		localPollution.latestPollutants = localPollution.pollutants[localPollution.pollutants.length-1];

		updateDisplay();

		console.log(localPollution);

	});

}

//
function filterWorkingStation(data) {

	//capture error here... lack of internet connect.
	
	var stations = data.journee.station;
	var working = [];
	
	for (var i = 0; i < stations.length; i++) {
		if (stations[i]["@attributes"].donnees == "oui") {
			for (var j = 0; j < stationsDataset.length; j++) {
				if (stations[i]["@attributes"].id == stationsDataset[j].id) {
					working.push(stationsDataset[j]);
				}
			}
		}
	}

	return working;
}

//
function getLocation(callback) {

	var crd,lat,long;

	//get geo location
	var options = {
		enableHighAccuracy: true,
		timeout: 5000,
		maximumAge: 0
	};

	function success(pos) {
		crd = pos.coords;

		// console.log('Your current position is:');
		// console.log('Latitude : ' + crd.latitude);
		// console.log('Longitude: ' + crd.longitude);
		// console.log('More or less ' + crd.accuracy + ' meters.');

		if (callback && typeof(callback) === "function") callback.apply(crd);

	};

	function error(err) {
		console.warn('ERROR(' + err.code + '): ' + err.message);
	};


	navigator.geolocation.getCurrentPosition(success, error, options);
}

//
function lineDistance( point1, point2 ) {
	var xs = 0;
	var ys = 0;

	xs = point2.x - point1.x;
	xs = xs * xs;

	ys = point2.y - point1.y;
	ys = ys * ys;

	return Math.sqrt( xs + ys );
}

//
function geoDistance(user,station) {
	// var R = 6371000; // metres
	// var φ1 = user.y.toRadians();
	// var φ2 = station.y.toRadians();
	// var Δφ = (station.y-user.y).toRadians();
	// var Δλ = (station.x-user.x).toRadians();

	// var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
	//         Math.cos(φ1) * Math.cos(φ2) *
	//         Math.sin(Δλ/2) * Math.sin(Δλ/2);
	// var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

	// var d = R * c;

	// console.log("distance: " =d);
}

//
function getNearestStation(workingStations, lat,long) {
	
	var userLocation = {x:long, y:lat};

	var minDistance = 1000;
	var closerStation = 0;

	for (var i = 0; i < workingStations.length; i++) {
		var stationLocation = {x:workingStations[i].longitude, y:workingStations[i].latitude};
		var distance = lineDistance(userLocation,stationLocation);
		if (distance < minDistance) {
			minDistance = distance;
			closerStation = workingStations[i];
		}

		//geoDistance(userLocation,stationLocation);

	}

	return closerStation;	
}

//
function getDatafromNearestStation(air,stationID) {

	var dataset;

	//console.log(air.journee.station);
	for (var i = 0; i < air.journee.station.length; i++) {
		if (air.journee.station[i]["@attributes"].id == stationID) {
			dataset = air.journee.station[i];
			break;
		}
	}


	var pollutants = [];
	var time;

	//console.log(air);

	for (var i = 0; i < dataset.echantillon.length; i++) {

		var hour = dataset.echantillon[i];

		time = {};
		time.hour = +hour["@attributes"].heure;
		time.index = +hour.qualite["@attributes"].value;
		time.pollution = [];

		if (hour.polluant) {		

			for (var j = 0; j < hour.polluant.length; j++) {
				var pol = hour.polluant[j];

				var pollutant = {
					type: pol["@attributes"].nom,
					value: +pol["@attributes"].value
				}

				time.pollution.push(pollutant);
			}
		}

		pollutants.push(time);
	}

	return pollutants;
}

// UPDATE DISPLAY
function updateDisplay() {

	backgroundColor();

	changeDisplayLocation($("#location"));

	// $("#date").text(localPollution.date.format("MMM DD, YYYY"));

	//time
	// $("#time").text(localPollution.latestPollutants.hour + ":00");

	//index
	$("#indexNumber").text(localPollution.latestPollutants.index);

	//polutants
	changeUnitDisplay($("#AQI-components"));

	// $.each(localPollution.latestPollutants.pollution, function(i,pollution) {

	// 	var iPollutant = getPollutantMeasure(pollution.type,pollution.value);

	// 	$("#AQI-components").append(
	// 		'<div class="pollution col-xs-6">'
	// 			+ '<div class="hair col-xs-3 key">' + iPollutant.title + '</div>'
	//   			// + '<div class="value col-xs-6">' + iPollutant.indexValue + '</div>'
	//   			+ '<div class="col-xs-9 value">' + iPollutant.measureValue + '<span class="AQI-components-unit"> ' + iPollutant.measureUnit +'</span></div>'
	//   		+ '</div>');


	// });
}

function changeDisplayLocation(target) {

	if (locationNameDisplay == "name") {
		locationNameDisplay = "neighbourhood";
		$("#station").text(localPollution.neighbourhood);

	} else if (locationNameDisplay == "neighbourhood") {
		locationNameDisplay = "name";
		$("#station").text(localPollution.name);
	}

}

function changeUnitDisplay(target) {

	if (pollutionIndexDisplay == "index") {
		pollutionIndexDisplay = "measure";
	} else if (pollutionIndexDisplay == "measure") {
		pollutionIndexDisplay = "index";
	};

	$("#AQI-components").empty();

	$.each(localPollution.latestPollutants.pollution, function(i,pollution) {

		var iPollutant = getPollutantMeasure(pollution.type,pollution.value);

		$("#AQI-components").append(
			'<div class="pollution col-xs-6">'
				+ '<div class="hair col-xs-3 key">' + iPollutant.title + '</div>'
	  			// + '<div class="value col-xs-6">' + iPollutant.indexValue + '</div>'
	  			+ '<div class="col-xs-9 value">' + iPollutant.measureValue + '<span class="AQI-components-unit"> ' + iPollutant.measureUnit +'</span></div>'
	  		+ '</div>');

	});
}

function getPollutantMeasure(pollutant, value) {

	var pol = {};

	pol.title = pollutant;
	pol.indexValue = value;
	pol.referenceValue = 0;

	switch (pollutant) {
		case "SO2":
			pol.title = "SO<sub>2</sub>";
			pol.referenceValue = 500;
			pol.measureUnit = "µg/m3";
			break;
		case "CO":
			pol.referenceValue = 35;
			pol.measureUnit = "mg/m3";
			break;
		case "O3":
			pol.title = "O<sub>3</sub>";
			pol.referenceValue = 160;
			pol.measureUnit = "µg/m3";
			break;
		case "NO2":
			pol.title = "NO<sub>2</sub>";
			pol.referenceValue = 400;
			pol.measureUnit = "µg/m3";
			break;
		case "PM":
			pol.referenceValue = 35;
			pol.measureUnit = "µg/m3";
			break;
		default:
			pol.referenceValue = 0;
			break;
	}

	if (pollutionIndexDisplay == "index") {
		pol.measureValue = value;
		pol.measureUnit = "";
	} else {
		pol.measureValue = (pol.referenceValue * value) / 50;
	}

	return pol;
}

//
function backgroundColor() {

	var color = "#FFFFFF";

	if (localPollution.latestPollutants.index < 26) {
		//blue
		color = "-webkit-linear-gradient(top, rgba(28,116,188,1) 0%, rgba(23,84,128,1) 100%)";
	} else  if (localPollution.latestPollutants.index < 51) {
		//orange-brown
		color = "-webkit-linear-gradient(top, rgba(214,150,0,1) 0%, rgba(153,102,0,1) 100%)";
	} else {
		//red
		color = "-webkit-linear-gradient(top, rgba(186,28,60,1) 0%, rgba(130,23,48,1) 100%)";
	}

	$("#app-container").css("background", color);
}


//----------- CONTROLS

//-------- SEE
function triggerSee() {
	$(activeView).hide();
	$("#see-page").show();
	activeView = "#see-page";
	
	builtSeeView();
}

//-------- Listen
function triggerListen() {
	$(activeView).hide();
	$("#listen-page").show();
	activeView = "#listen-page";

	builtListenView();
}

//-------- Signature
function triggerSignature() {
	$(activeView).hide();
	$("#signature-page").show();
	activeView = "#signature-page";

	builtSignatureView();
}

//-------- Back
function triggerBack() {

	if (activeView == "#see-page") {
		
	} else if (activeView == "#listen-page") {
		stopListenSound();
		$("#listen-wave").empty();
		waveContainerCollections = [];

	} else if (activeView == "#signature-page") {
		signNoise.pause();
		signNoiseInterval.stop();
		$("#sign-wave").empty();
	}

	$(activeView).hide();
	$("#home-page").show();
	activeView = "#home-page";
}

//--------------------  SEE VIEW ----------------

function builtSeeView() {
	$(".internal-title").offset({top:$("#app-container").height() - 120});
	$(".internal-index").offset({top:$("#app-container").height() - 100});
	$(".internal-index").text(localPollution.latestPollutants.index);

	videoEffect();

	$("#video").height($("#app-container").height());
}


// Put event listeners into place
window.addEventListener("DOMContentLoaded", function() {
	// Grab elements, create settings, etc.
	// var canvas = document.getElementById("canvas"),
	// 	context = canvas.getContext("2d"),
		video = document.getElementById("video"),
		videoObj = { "video": true },
		errBack = function	(error) {
			console.log("Video capture error: ", error.code); 
		};

	// Put video listeners into place
	if(navigator.getUserMedia) { // Standard
		navigator.getUserMedia(videoObj, function(stream) {
			video.src = stream;
			video.play();
		}, errBack);
	} else if(navigator.webkitGetUserMedia) { // WebKit-prefixed
		navigator.webkitGetUserMedia(videoObj, function(stream){
			video.src = window.URL.createObjectURL(stream);
			video.play();
		}, errBack);
	}
	else if(navigator.mozGetUserMedia) { // Firefox-prefixed
		navigator.mozGetUserMedia(videoObj, function(stream){
			video.src = window.URL.createObjectURL(stream);
			video.play();
		}, errBack);
	}
	}, false);


function videoEffect() {

	// declare our variables
	var seriously, // the main object that holds the entire composition
	    vignette, // a vignette effect
	    noise, // a vignette effect
	    target; // a wrapper object for our target canvas

	seriously = new Seriously();

	// now do the same for the target canvas
	target = seriously.target('#canvasPollution');
	target.height = $("#app-container").height();


	vignette = seriously.effect('vignette');
	noise = seriously.effect('noise');

	// connect any node as the source of the target. we only have one.
	vignette.source = '#video';
	noise.source = '#video';

	target.source = noise;

	seriously.go();

	var value = (localPollution.latestPollutants.index/50);
	noise.amount = value;

}

//--------------------  LISTEN VIEW ----------------

var noiseCollection = [];
var freqCollection = [];

var waveContainerCollections = [];
var waveCollection = [];

var waveSplit = false;

function builtListenView() {

	waveSplit = false;

	//title
	$(".internal-title").offset({top:$("#app-container").height() - 120});
	$(".internal-index").offset({top:$("#app-container").height() - 100});
	$(".internal-index").text(localPollution.latestPollutants.index);

	//sound
	playSound();

	//wave
	showWave();

	//controllers
	$("#wave-container").click( function() { changeListenWave($(this)); });
}

function stopListenSound() {
	for (var i = 0; i < noiseCollection.length; i++) {
		noiseCollection[i].pause();
		// noiseCollection[i].removeAll();
	}

	for (var i = 0; i < waveCollection.length; i++) {
		waveCollection[i].stop();
	}
}

function changeListenWave(target) {

	waveSplit = !waveSplit;

	playSound()
	showWave();
}

function playSound() {

	stopListenSound();

	noiseCollection = [];
	freqCollection = [];

	var rangeFreq = 4186 - 32.7;

	if (waveSplit == false) {

		var airQIndexFreq = (rangeFreq/100) * localPollution.latestPollutants.index;
		freqCollection.push(airQIndexFreq);
		
		var noiseIndex = T("sin", {freq:airQIndexFreq}).play();
		noiseCollection.push(noiseIndex);

	} else if (waveSplit == true) {

		for (var i = 0; i < localPollution.latestPollutants.pollution.length; i++) {
			var polFreq = (rangeFreq/100) * localPollution.latestPollutants.pollution[i].value;
			freqCollection.push(polFreq);

			var noisePol = T("sin", {freq:polFreq}).play();
			noiseCollection.push(noisePol);
		}

	}
}

function showWave() {

	$("#listen-wave").empty();
	waveContainerCollections = [];

	var freq = 0;

	for (var i = 0; i < freqCollection.length; i++) {
		freq += freqCollection[i];
	}

	
	// if (wave != null) wave.stop();

	if (waveSplit == false) {

		$("#wave-container").css("margin-top","50%");

		var wave = new SiriWave({
			    container: document.getElementById('listen-wave'),
			    width: $("#app-container").width(),
			    height: 100,
			    color: '#FFF',
			    speed: 0.12,
			    amplitude: 1,
			    frequency: freq/50
			});

		wave.start();

		waveContainerCollections.push(wave);


	} else if (waveSplit == true) {

		$("#wave-container").css("margin-top","10%");

		for (var i = 0; i < localPollution.latestPollutants.pollution.length; i++) {
			
			$("#listen-wave").append(
			'<div id="waveDiv'+ i +'"></div>'
			);

			var waveDiv = $("#waveDiv"+i);
			waveDiv.height(65);

			waveDiv.append(
				'<div class="wave-pollutant-title">'+ localPollution.latestPollutants.pollution[i].type +'</div>'
				);

			waveDiv.append(
				'<div class="wave-pollutant-index">'+ localPollution.latestPollutants.pollution[i].value +'</div>'
				);

			var wave = new SiriWave({
			    container: document.getElementById("waveDiv"+i),
			    width: $("#app-container").width(),
			    height: 50,
			    color: '#FFF',
			    speed: 0.02*localPollution.latestPollutants.pollution[i].value,
			    amplitude: 1,
			    frequency: freqCollection[i]/50
			});

			wave.start();

			waveContainerCollections.push(wave);


		}

	}


		// var SW9 = new SiriWave9({
	// 	container: document.getElementById('wave'),
	// 	width: 320,
	// 	height: 200,
	// 	speed: 0.2,
	// 	amplitude: 1,
	// 	autostart: true,
	// });

	// console.log(SW9);
}


//--------------------  SIGNATURE VIEW ----------------

var signNoise;
var signNoiseInterval;

function builtSignatureView() {
	$(".internal-title").offset({top:$("#app-container").height() - 120});
	$(".internal-index").offset({top:$("#app-container").height() - 100});
	$(".internal-index").text(localPollution.latestPollutants.index);
	
	$( document ).load( "getAirQualityData.php", function(responseText) {
		parseSignatureData(JSON.parse(responseText));
	});
}

function parseSignatureData(data) {

	var signatureData = [];

	var localPollutionHistory = new LocalPollution();
	localPollutionHistory.pollutants = getDatafromNearestStation(data,localPollution.stationID);

	//parse only index by hour
	for (var i = 0; i < localPollutionHistory.pollutants.length; i++) {
		signatureData.push({
			hour:localPollutionHistory.pollutants[i].hour,
			index:localPollutionHistory.pollutants[i].index
		})
	}

	playSignature(signatureData);
	showSignWave(signatureData);
}

function playSignature(signatureData) {

	var rangeFreq = 4186 - 32.7;

	var freqs = T(function(count) {

		var fs = [];

		for (var i = 0; i < signatureData.length; i++) {
			fs.push(signatureData[i].index*(rangeFreq/100));
		}

	  return fs[count % 24];
	});

	signNoise = T("sin", {freq:freqs, mul:0.15}).play();

	signNoiseInterval = T("interval", {interval:20}, freqs).start();
}

function showSignWave(signatureData) {

	$("#sign-wave").empty();

	var rangeFreq = 4186 - 32.7;

	// var wave = new SiriWave9({
	// 	container: document.getElementById('sign-wave'),
	// 	width: $("#app-container").width(),
	// 	height: 100,
	// 	speed: 0.2,
	// 	amplitude: 1,
	// });

	// wave.start();

	var wave = new SiriWave({
		    container: document.getElementById('sign-wave'),
		    width: $("#app-container").width(),
		    height: 100,
		    color: '#FFF',
		    speed: 0.12,
		    amplitude: 1,
		    frequency: 3
		});

	wave.start();

	var hour = 0;

	setInterval(update, 20);

	function update() {

		if (hour < 23) {
			hour++;
		} else {
			hour = 0;
		}

		wave.frequency = signatureData[hour].index * (rangeFreq/50);
		wave.speed = signatureData[hour].index * 0.02,
		wave.amplitude = signatureData[hour].index * 0.05;
	}
}








