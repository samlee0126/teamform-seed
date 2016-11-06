/*
$(document).ready(function(){

	$('#member_page_controller').hide();
	$('#text_event_name').text("Error: Invalid event name ");
	var eventName = getURLParameter("q");
	if (eventName != null && eventName !== '' ) {
		$('#text_event_name').text("Event name: " + eventName);
		$('#member_page_controller').show();
	}

});
*/
angular.module('teamform-member-app', ['firebase'])
.controller('MemberCtrl', ['$scope', '$firebaseObject', '$firebaseArray', function($scope, $firebaseObject, $firebaseArray) {
	
	// TODO: implementation of MemberCtrl
	
	// Call Firebase initialization code defined in site.js
	initalizeFirebase();

	firebase.auth().onAuthStateChanged(function(user) {
	  if (user) {

		//get member information from database by uid
		var refPath = "members/" + user.uid;
		retrieveOnceFirebase(firebase, refPath, function(data) {
			// user name			
			if ( data.child("name").val() != null ) {
				$scope.name = data.child("name").val();
			} else {
				$scope.name = "N/A";
			}
			
			// user major
			if (data.child("major").val() != null ) {
				$scope.major = data.child("major").val();
			}
			else {
				$scope.major = "N/A";
			}
			
			// user grad year
			if (data.child("gradYear").val() != null ) {
				$scope.gradYear = data.child("gradYear").val();
			}
			else {
				$scope.gradYear = "N/A";
			}
			
			// user request status
			// Use jquery because angular hide/show in this project is very slow
			// Need time to check why angularjs is too show now (may be too many request?)
			var eid = getURLParameter("q");
			if (eid == null || eid == "") {
				window.history.back();
				console.log("no this event")
				return;
			}
				
			var status = data.child("events").child(eid).child("status").val();
			if (status == "waiting")
				$("#waiting").removeClass("hide");
			else if (status == "confirmed")
				$("#confirmed").removeClass("hide");
			else
				$("#rejected").removeClass("hide");
			
			// update $scope
			$scope.$apply();
		});		
		
	  } else {
		// No user is signed in.
		console.log("YEAH - You did not login lol")
		window.location.href = "signIn.html"; // default redirect page is index
	  }

	});	
	


	
/*		
	$scope.userID = "";
	$scope.userName = "";	
	$scope.teams = {};
	
	

	$scope.loadFunc = function() {
		var userID = $scope.userID;
		if ( userID !== '' ) {
			
			var refPath = getURLParameter("q") + "/member/" + userID;
			retrieveOnceFirebase(firebase, refPath, function(data) {
								
				if ( data.child("name").val() != null ) {
					$scope.userName = data.child("name").val();
				} else {
					$scope.userName = "";
				}
				
				
				if (data.child("selection").val() != null ) {
					$scope.selection = data.child("selection").val();
				}
				else {
					$scope.selection = [];
				}
				$scope.$apply();
			});
		}
	}
	
	$scope.saveFunc = function() {
		
		
		var userID = $.trim( $scope.userID );
		var userName = $.trim( $scope.userName );
		
		if ( userID !== '' && userName !== '' ) {
									
			var newData = {				
				'name': userName,
				'selection': $scope.selection
			};
			
			var refPath = getURLParameter("q") + "/member/" + userID;	
			var ref = firebase.database().ref(refPath);
			
			ref.set(newData, function(){
				// complete call back
				//alert("data pushed...");
				
				// Finally, go back to the front-end
				window.location.href= "index.html";
			});
			
			
		
					
		}
	}
	
	$scope.refreshTeams = function() {
		var refPath = getURLParameter("q") + "/team";	
		var ref = firebase.database().ref(refPath);
		
		// Link and sync a firebase object
		$scope.selection = [];		
		$scope.toggleSelection = function (item) {
			var idx = $scope.selection.indexOf(item);    
			if (idx > -1) {
				$scope.selection.splice(idx, 1);
			}
			else {
				$scope.selection.push(item);
			}
		}
	
	
		$scope.teams = $firebaseArray(ref);
		$scope.teams.$loaded()
			.then( function(data) {
								
							
							
			}) 
			.catch(function(error) {
				// Database connection error handling...
				//console.error("Error:", error);
			});
			
		
	}
	
	
	$scope.refreshTeams(); // call to refresh teams...
*/		
}]);