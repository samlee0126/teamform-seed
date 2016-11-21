$(document).ready(function(){
	//Not allow enter in Map Fields
	$("#googlemapByAddr").on("keypress",function(e) {
		var key = e.keyCode;
		// If the user has pressed enter
		if (key == 13) {
			return false;
		}
		else {
			return true;
		}
	});

	$("#googlemapByGPS").on("keypress",function(e) {
		var key = e.keyCode;
		// If the user has pressed enter
		if (key == 13) {
			return false;
		}
		else {
			return true;
		}
	});

	//map modal
	$('#mapModal').on('show.bs.modal', function () {

		//empty the previous search words
		$('#googlemapByGPS').val('');
		$('#googlemapByAddr').val('');

		setTimeout(function () {
			google.maps.event.trigger(map, 'resize');
			google.maps.event.addListener(map, 'click', function(event) {
				marker.setPosition(event.latLng);
				var yeri = event.latLng;
				saveCoordinate(yeri.lat(), yeri.lng());
				infowindow.setContent("(" + position[0] + "," + position[1] + ")");
			});
			google.maps.event.addListener(map, 'mousemove', function(event) {
				var yeri = event.latLng;
				document.getElementById("mlat").innerHTML = "(" + yeri.lat().toFixed(6) + "," +yeri.lng().toFixed(6)+ ")";
			});
		}, 2000); //wait for modal pop up
	});

	//click this button to search map by address
	$('#searchByAddr').click(function(e){
		e.preventDefault();
		var address = document.getElementById("googlemapByAddr").value;
		if(address == "")
			return false;
		codeAddress(address);
	});

	//click this button to search map by GPS
	$('#searchByGPS').click(function(e){
		e.preventDefault();
		var gps = document.getElementById("googlemapByGPS").value;
		if(gps == "")
			return false;
		codeCoordinate(gps);
	});





});

$(document).ready(function(){


	
    var today = new Date();

    var month = today.getMonth() + 1;
    var day = today.getDate() + 1;
    var year = today.getFullYear();

    if(month < 10)
        month = '0' + month.toString();
    if(day < 10)
        day = '0' + day.toString();

    var minDate = year + '-' + month + '-' + day; 
	
    $('#date').attr('min', minDate);
    $('#deadline').attr('min', minDate);
	
	$('#date').change(function(){
		var selectedday = new Date($(this).val());

		var month = selectedday.getMonth() + 1;
		var day = selectedday.getDate() - 1;
		var year = selectedday.getFullYear();

		if(month < 10)
			month = '0' + month.toString();
		if(day < 10)
			day = '0' + day.toString();

		var maxDate = year + '-' + month + '-' + day; 
		
		$('#deadline').attr('max', maxDate);
	});
	
});

angular.module('teamform-createEvent-app', ['firebase'])
.controller('CreateEventCtrl', ['$scope', '$firebaseObject', '$firebaseArray', '$window', function($scope, $firebaseObject, $firebaseArray, $window) {
	
	$scope.events = {
		event_name: '',
		description: '',
		date: '',
		time: '',
		venue: 'HKUST',
		table_num: '',
		people_num: '',
		organizer: '',
		deadline: '',
		gps: '22.336130,114.263942'
	};
	
	// Initialize $scope.param as an empty JSON object
	$scope.param = {};
			
	// Call Firebase initialization code defined in site.js
	initalizeFirebase();


	$scope.saveGoogleMap = function () {
		var gps = $('#latlngspan').text().substr(1, $('#latlngspan').text().length-2); // (123,123) --> 123,123
		$scope.events.gps = gps;
	};
	$scope.doLogout = function () {

		firebase.auth().signOut().then(function() {
			// Sign-out successful.
			sessionStorage.setItem("urlAfterLogin","");
			sessionStorage.setItem("logout","yes");
			window.location.href= "index.html";
		}, function(error) {
			// An error happened.
			console.log(error)
		});


	};

	$scope.showLogButton = function (user) {
		if (user) {
			$scope.isLogin = true;
			$scope.isLogout = false;
			$scope.username = user.displayName;
			// update $scope
		} else {
			// No user is signed in.
			$scope.isLogin = false;
			$scope.isLogout = true;
			console.log("YEAH - You did not login lol");
		}
	};

	firebase.auth().onAuthStateChanged(function(user) {
		$scope.showLogButton(user);
		if (user) {

		}else{
			console.log("YEAH - You did not login lol");
			sessionStorage.setItem("urlAfterLogin","createEvent.html");
			window.location.href = "signIn.html"; // default redirect page is index
		}
	});
	
	var refPath, ref;

	//eventName = getURLParameter("q");
	var refEventPath = "events";	
	
	var refEvent = firebase.database().ref(refEventPath);
	
	// Link and sync a firebase object
	$scope.paramEvent = $firebaseArray(refEvent);
		
	var number = [];
	var max = 0;
	
	$scope.paramEvent.$loaded().then(function() {
		
		console.log($scope.paramEvent);
		
		for(var i = 0 ; i < $scope.paramEvent.length ; i++){
			console.log($scope.paramEvent[i].$id);
			number.push($scope.paramEvent[i].$id.substr(1));
		}
		max = Math.max.apply(null, number);
		if (!isNaN(max)) {
			max = 0;
		}
		max = max + 1
	});
	
	var refEventCreate = "events/";
	
	$scope.createEvent = function(){
				
		var dateMonth = $scope.events.date.getMonth()+1;
		if(dateMonth < 10){
			dateMonth = "0" + dateMonth;
		}
		
		var dateDate = $scope.events.date.getDate();
		if(dateDate < 10){
			dateDate = "0" + dateDate;
		}
		
		var dateYear = $scope.events.date.getFullYear();
		var deadlineMonth = $scope.events.deadline.getMonth()+1;
		if(deadlineMonth < 10){
			deadlineMonth = "0" + deadlineMonth;
		}
		
		var deadlineDate = $scope.events.deadline.getDate();
		if(deadlineDate < 10){
			deadlineDate = "0" + deadlineDate;
		}
		
		var deadlineYear = $scope.events.deadline.getFullYear();
		var timeHour = $scope.events.time.getHours();
		if(timeHour < 10){
			timeHour = "0" + timeHour;
		}
		
		var timeMin = $scope.events.time.getMinutes();
		if(timeMin < 10){
			timeMin = "0" + timeMin;
		}


		var createRef = firebase.database().ref(refEventCreate);
		createRef.child("e" + max).set({
			eventName: $scope.events.event_name,
			description: $scope.events.description,
			date: dateMonth + "-" + dateDate + "-" + dateYear,
			time: timeHour + ":" + timeMin,
			venue: $scope.events.venue,
			maxForTable: $scope.events.table_num,
			maxForEachTable: $scope.events.people_num,
			organizer: $scope.events.organizer,
			gps: $scope.events.gps,
			deadline: deadlineMonth + "-" + deadlineDate + "-" + deadlineYear,
			// numberOfCurrentTable: 0,
			// numberOfCurrentUser: 0,
			visible: true
		});
		//console.log("success");
		window.location.href= "index.html";
	};
	
	$scope.goToEvent = function(eID) {
	  $window.location.href = '../../event.html?eventID='+ eID;
	};
		
		
}]);