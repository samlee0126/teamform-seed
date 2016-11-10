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

	$scope.tableInfo = [];
	$scope.tableInfoTemp = [];
	$scope.major = "";
	$scope.gradYear = "";

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

	firebase.auth().onAuthStateChanged(function(user) {
	  if (user) {
		var eid = getURLParameter("q");
		// get member information from database by uid
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
			if (eid == null || eid == "") {
				window.location.href = "index.html";
				console.log("no this event");
				return;
			}
			
			var status = data.child("events").child(eid).child("status").val();
			
			if (status != null ) {
				
				if (status == "waiting")
					$("#waiting").removeClass("hide");
				else if (status == "confirmed")
					$("#confirmed").removeClass("hide");
				else if (status == "rejected")
					$("#rejected").removeClass("hide");
				else
					$("#no_status").removeClass("hide");
				
			}else {
				window.location.href = "index.html";	// future: the case user type url directly
				console.log("no this event");
				return;				
			}
				
			// update $scope
			$scope.$apply();
		});	
		
		// get table information from database by tid
		var refPathTable = "tables";
		retrieveOnceFirebase(firebase, refPathTable, function(data) {
			data.forEach(function(childData) {
				if(childData.child("event").val() == eid) {
					$scope.tableInfo.push(childData.val());
					// used for filtering and sorting, remains unchanged
					$scope.tableInfoTemp.push(childData.val());
				}
			});
			$scope.$apply();
		});
	  } else {
		// No user is signed in.
		console.log("YEAH - You did not login lol");
		sessionStorage.setItem("urlAfterLogin","member.html?q=" + getURLParameter("q"));
		window.location.href = "signIn.html"; // default redirect page is index
	  }

	});

	// filter tables
	$scope.filterTable = function() {
		// get selected value(s)
		var filterValue = $('#filter-select').val();

		// update and acquire data from tableInfoTemp
		$scope.tableInfo = JSON.parse(JSON.stringify($scope.tableInfoTemp));

		// if no filter selected
		if (filterValue == null) return;

		// if one or more filter(s) is/are selected
		for (var i = 0; i < filterValue.length; i++) {
			switch(filterValue[i]) {
				case "available":
					// for each table, if it is full, then remove it
					for (var j = 0; j < $scope.tableInfo.length; j++) {
						if ($scope.tableInfo[j].full) {
							$scope.tableInfo.splice(j, 1);
							j--;
						}
					}
					break;
				case "department":
					// for each table
					for (var k = 0; k < $scope.tableInfo.length; k++) {
						// if no tags, then remove the table
						if ($scope.tableInfo[k].tags == null) {
							$scope.tableInfo.splice(k, 1);
						}
						// check each tag
						// if one of the tags meets myMajor, then do not remove the table
						var toBeRemoved = true;
						for (var key in $scope.tableInfo[k].tags) {
							if ($scope.tableInfo[k].tags[key] == $scope.major) toBeRemoved = false;
						}
						if (toBeRemoved) {
							$scope.tableInfo.splice(k, 1);
							k--;
						}
					}
					break;
				case "grad-year":
					// for each table
					for (var g = 0; g < $scope.tableInfo.length; g++) {
						// if no tags, then remove the table
						if ($scope.tableInfo[g].tags == null) {
							$scope.tableInfo.splice(g, 1);
						}
						// check each tag
						// if one of the tags meets myGradYear, then do not remove the table
						var toBeRemoved = true;
						for (var key in $scope.tableInfo[g].tags) {
							if ($scope.tableInfo[g].tags[key] == $scope.gradYear) toBeRemoved = false;
						}
						if (toBeRemoved) {
							$scope.tableInfo.splice(g, 1);
							g--;
						}
					}
					break;
			}
		}
	};

	
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
