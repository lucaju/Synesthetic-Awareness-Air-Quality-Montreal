<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="initial-scale=1,user-scalable=no,maximum-scale=1">
	<meta name="apple-mobile-web-app-capable" content="yes">

	<title>$ynestetic @wareness</title>
	<meta name="author" content="Luciano Frizzera">	
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" integrity="sha384-1q8mTJOASx8j1Au+a5WDVnPi2lkFfwwEAa8hDDdjZlpLegxhjVME1fgjWPGmkzs7" crossorigin="anonymous">

	
<link href='https://fonts.googleapis.com/css?family=Work+Sans:300,200' rel='stylesheet' type='text/css'>

	<link href='style.css' rel='stylesheet' type='text/css'>

	<script src="//code.jquery.com/jquery-1.11.3.min.js"></script>
	
	<script src="functions.js" type="text/javascript"></script>
	<script src="lib/moment.js" type="text/javascript"></script>
	<script src="lib/timbre/timbre.dev.js" type="text/javascript"></script>
	<!--<script src="lib/timbre/subcollider.js"></script>-->

	<script src="lib/wave/siriwave.js"></script>
	<script src="lib/wave/siriwave9.js"></script>
</head>

<body>
<?php $air=simplexml_load_file("http://ville.montreal.qc.ca/rsqa/servlet/makeXmlActuel"); ?>

<div id="app-container">
	<div id="home-page">
		<div id="header">
			<div>
				<h4 id="project-title"><small>$ynestetic @wareness</small></h4>
				<h1 id="title" class="hair">Air Quality</h1>
			</div>

			<p id="location"><span id="city" class="hair">Montreal - </span><span id="station"></span> <span class="glyphicon glyphicon-map-marker" aria-hidden="true"></span></p>

			<!-- <p id="moment">
				<span id="date"></span> <span id="time"></span>
			</p> -->

		</div>

		<div id="AQI">
			<div id="key" class="hair col-xs-6">
				<p>index</p>
			</div>
			<div id="value" class="col-xs-6">
				 <p id="indexNumber"></p>
			</div>
		</div>

		<div id="AQI-components"></div>

		<div id="nav">
			<ul class="nav nav-pills nav-justified">
				<li id="seeBT" role="presentation"><a href="#">see »</a></li>
				<li id="listenBT" role="presentation"><a href="#">listen »</a></li>
				<li id="signatureBT" role="presentation"><a href="#">audio signature »</a></li>
			</ul>
		</div>
		
	</div>

	<div id="see-page">
				
		<div id="imagePollution">
			<video id="video" autoplay></video>
			<canvas id="canvasPollution"></canvas>
		</div>

		<div class="hair">
			<ul class="nav nav-pills">
				<li class="backBT" role="presentation"><a href="#">&laquo; back</a></li>
			</ul>
		</div>


		<div class="internal-title hair">
			<p>Air<br/>Quality</p>
		</div>
		
		<div class="internal-index">
			<p id="indexNumber"></p>
		</div>

	</div>

	<div id="listen-page">
		<div class="hair">
			<ul class="nav nav-pills">
				<li class="backBT" role="presentation"><a href="#">&laquo; back</a></li>
			</ul>
		</div>

		<div id="wave-container">
			<div id="listen-wave" class="wave"></div>
		</div>

		<div class="internal-title hair">
			<p>Air<br/>Quality</p>
		</div>
		<div class="internal-index">
			<p id="indexNumber"></p>
		</div>
		
	</div>

	<div id="signature-page">
		<div class="hair">
			<ul class="nav nav-pills">
				<li class="backBT" role="presentation"><a href="#">&laquo; back</a></li>
			</ul>
		</div>

		<div id="sign-wave-container">
			<div id="sign-wave" class="wave"></div>
		</div>


		<div class="internal-title hair">
			<p>Air<br/>Quality</p>
		</div>

		<div class="internal-index">
			<p id="indexNumber"></p>
		</div>

	</div>
</div>



</script>
	<script src="lib/seriously/seriously.js"></script>
    <script src="lib/seriously/effects/seriously.vignette.js"></script>
    <script src="lib/seriously/effects/seriously.hue-saturation.js"></script>
    <script src="lib/seriously/effects/seriously.split.js"></script>
    <script src="lib/seriously/effects/seriously.noise.js"></script>
<script>

$(document).ready(function(){
	air = <?php echo json_encode($air); ?>;

	$("#app-container").height($(window).height());
	$("#app-container").width($(window).width());

	$("#see-page").hide();
	$("#listen-page").hide();
	$("#signature-page").hide();
	initiate();

});
</script>


</body>
</html>