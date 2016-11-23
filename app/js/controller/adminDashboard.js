angular.module('teamform-adminDashboard-app', ['firebase','ngDragDrop'])
.controller('AdminDashboardCtrl', ['$scope', '$firebaseObject', '$firebaseArray', '$window', function($scope, $firebaseObject, $firebaseArray, $window) {
	
	// Call Firebase initialization code defined in site.js
	initalizeFirebase();
	
	var eid = getURLParameter("q");
	var refEventPath = "events/";
	var	refTablePath = "tables/";
	var ref;
	
	//refEvent = firebase.database().ref(refEventPath);
	
	// Link and sync a firebase object
	//$scope.paramEvent = $firebaseArray(refEvent);
		
		
	$scope.events = {
		name: '',
		description: '',
		date: '',
		time: '',
		venue: '',
		table_confirmed: '',
		max_table: '',
		max_member: '',
		organizer: '',
		deadline: ''
	};
	
			
	$scope.tables = new Array();
	
	$scope.requestTable = new Array();
				
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
	
		
    retrieveOnceFirebase(firebase, refEventPath, function(data) {
        // check the eid is valid or not
		var eventObj = data.child(eid).val();
		var count = 0;
		
		
		for(var j in eventObj.tables){
			var tableID2 = j;
			$scope.getRequestTable(tableID2, eventObj);
		}	
		$scope.$apply();
		
		for(var i in eventObj.confirmTables){
			var tableID = i;
			$scope.getConfirmTable(tableID, eventObj);					
			count++;
		}
		$scope.$apply();
		
		$scope.events.name = eventObj.eventName;
		$scope.events.description = eventObj.description;
		$scope.events.date = eventObj.date;
		$scope.events.time = eventObj.time;
		$scope.events.venue = eventObj.venue;
		$scope.events.organizer = eventObj.organizer;
		$scope.events.table_confirmed = count;
		$scope.events.max_table = eventObj.maxForTable;
		$scope.events.max_member = eventObj.maxForEachTable;
		
		var progress = $scope.events.table_confirmed / $scope.events.max_table * 100;
		$("#confirmed_bar").css("width",progress + "%");
		$scope.$apply();
		
		
    });
	
	
	
	$scope.getConfirmTable = function(tableID, eventObj){
				
		retrieveOnceFirebase(firebase, refTablePath, function(data){
			var tableObj = data.child(tableID).val();
						
			var count_member = 0;
			var check_full = true;
			
			for(var j in tableObj.members){
				count_member++;
			}
			
			if(count_member < eventObj.maxForEachTable){
				check_full = false;
			}else{
				check_full = true;
			}
			
			$scope.tables.push({
				"id": tableID,
				"name": tableObj.tableName,
				"member_confirmed": count_member,
				"number_tags": tableObj.tags,
				"full": check_full
			});
						
			$scope.$apply();
		});
		
	}
	
	
	$scope.getRequestTable = function(tableID2, eventObj){
				
		retrieveOnceFirebase(firebase, refTablePath, function(data){	
			var tableObj = data.child(tableID2).val();
			
			var confirmedObj = $scope.tables;
			
			var count_member = 0;
			var check_full = true;
			
			for(var j in tableObj.members){
				count_member++;
			}
			
			if(count_member < eventObj.maxForEachTable){
				check_full = false;
			}else{
				check_full = true;
			}
			if(confirmedObj.length != 0){
				for(var r in confirmedObj){
					if(confirmedObj[r].id == tableID2){
						break;
					}else if(r == confirmedObj.length-1){	
						$scope.requestTable.push({
							"id": tableID2,
							"name": tableObj.tableName,
							"member_confirmed": count_member,
							"number_tags": tableObj.tags,
							"full": check_full
						});
					}else{
						continue;
					}
				}
			}else{
				$scope.requestTable.push({
					"id": tableID2,
					"name": tableObj.tableName,
					"member_confirmed": count_member,
					"number_tags": tableObj.tags,
					"full": check_full
				});
			}
			
			$scope.$apply();
		});
	}
		
}]);