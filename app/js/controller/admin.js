$(document).ready(function(){
	/*
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
	
	
	$('#admin_page_controller').hide();
	$('#text_event_name').text("Error: Invalid event name ");
	var eventName = getURLParameter("q");
	if (eventName != null && eventName !== '' ) {
		$('#text_event_name').text("Event name: " + eventName);
		
	}*/

});

angular.module('teamform-admin-app', ['firebase'])
.controller('AdminCtrl', ['$scope', '$firebaseObject', '$firebaseArray', '$window', function($scope, $firebaseObject, $firebaseArray, $window) {
	
	$scope.events = {
		event_name: '',
		description: '',
		date: '',
		time: '',
		venue: '',
		table_num: '',
		people_num: '',
		organizer: '',
		deadline: ''
	}
	
	// Initialize $scope.param as an empty JSON object
	$scope.param = {};
			
	// Call Firebase initialization code defined in site.js
	initalizeFirebase();
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
	var refPath, ref, eventName;

	//eventName = getURLParameter("q");
	refEventPath = "events";	
	refFeedbackPath = "Feedback";	
	
	refEvent = firebase.database().ref(refEventPath);
	refFeedback = firebase.database().ref(refFeedbackPath);
	
	// Link and sync a firebase object
	$scope.paramEvent = $firebaseArray(refEvent);
	$scope.paramFeedback = $firebaseArray(refFeedback);
		
	
	/*
	var number = [];
	var max = 0;
	
	$scope.paramEvent.$loaded().then(function() {
		
		console.log($scope.paramEvent);
		
		for(var i = 0 ; i < $scope.paramEvent.length ; i++){
			console.log($scope.paramEvent[i].$id);
			number.push($scope.paramEvent[i].$id.substr(1));
		}
		max = Math.max.apply(null, number);
		max = max + 1
	});
	
	refEventCreate = "events/";
	
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
		
		
		createRef = firebase.database().ref(refEventCreate);
		createRef.child("e" + max).set({
			eventName: $scope.events.event_name,
			description: $scope.events.description,
			date: dateMonth + "-" + dateDate + "-" + dateYear,
			time: timeHour + ":" + timeMin,
			venue: $scope.events.venue,
			maxForTable: $scope.events.table_num,
			maxForEachTable: $scope.events.people_num,
			organizer: $scope.events.organizer,
			deadline: deadlineMonth + "-" + deadlineDate + "-" + deadlineYear
		});
		
		window.location.href= "../../index.html";
	};
	
	$scope.goToEvent = function(eID) {
	  $window.location.href = '../../event.html?eventID='+ eID;
	};
	
	
	$scope.param = $firebaseArray(refEvent);
	//alert(JSON.stringify($scope.param));
	$scope.param.$loaded()
		.then( function(data) {
			
			// Fill in some initial values when the DB entry doesn't exist			
			if(typeof $scope.param.maxTeamSize == "undefined"){				
				$scope.param.maxTeamSize = 10;
			}			
			if(typeof $scope.param.minTeamSize == "undefined"){				
				$scope.param.minTeamSize = 1;
			}
			
			// Enable the UI when the data is successfully loaded and synchornized
			$('#admin_page_controller').show(); 				
		}) 
		.catch(function(error) {
			// Database connection error handling...
			//console.error("Error:", error);
		});
		
	
	refPath = eventName + "/team";	
	$scope.team = [];
	$scope.team = $firebaseArray(firebase.database().ref(refPath));
	
	
	refPath = eventName + "/member";
	$scope.member = [];
	$scope.member = $firebaseArray(firebase.database().ref(refPath));
	
	

	$scope.changeMinTeamSize = function(delta) {
		var newVal = $scope.param.minTeamSize + delta;
		if (newVal >=1 && newVal <= $scope.param.maxTeamSize ) {
			$scope.param.minTeamSize = newVal;
		} 
		
		$scope.param.$save();

		
	}

	$scope.changeMaxTeamSize = function(delta) {
		var newVal = $scope.param.maxTeamSize + delta;
		if (newVal >=1 && newVal >= $scope.param.minTeamSize ) {
			$scope.param.maxTeamSize = newVal;
		} 
		
		$scope.param.$save();
		
		
	}

	$scope.saveFunc = function() {

		$scope.param.$save();
		
		// Finally, go back to the front-end
		window.location.href= "index.html";
	}
	*/
	
		
}]);