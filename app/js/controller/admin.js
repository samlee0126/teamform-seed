
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
	var refEventPath = "events";	
	var refFeedbackPath = "Feedback";	
	
	refEvent = firebase.database().ref(refEventPath);
	refFeedback = firebase.database().ref(refFeedbackPath);
	
	// Link and sync a firebase object
	$scope.paramEvent = $firebaseArray(refEvent);
	$scope.paramFeedback = $firebaseArray(refFeedback);

	$scope.goToEvent = function(eID) {
	  $window.location.href = '../../event.html?q='+ eID;
	};
	
	$scope.hideEvent = function(eID) {
		
		var createRef = firebase.database().ref("event/" + eID);
		createRef.set({
			visible: false
		});
		
	};
	
	$scope.showEvent = function(eID) {
		
		var createRef = firebase.database().ref("event/" + eID);
		createRef.set({
			visible: true
		});
		
	};
		
		
}]);