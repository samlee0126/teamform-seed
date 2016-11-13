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
			deadline: deadlineMonth + "-" + deadlineDate + "-" + deadlineYear,
			numberOfCurrentTable: 0,
			numberOfCurrentUser: 0,
			visible: true
		});
		//console.log("success");
		window.location.href= "../../event.html?event=e"+ max;
	};
	
	$scope.goToEvent = function(eID) {
	  $window.location.href = '../../event.html?eventID='+ eID;
	};
		
		
}]);