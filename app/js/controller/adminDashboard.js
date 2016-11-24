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
		deadline: '',
		gps: '',
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
		$scope.events.date = eventObj.date;
		$scope.events.time = eventObj.time;
		$scope.events.venue = eventObj.venue;
		$scope.events.organizer = eventObj.organizer;
		$scope.events.table_confirmed = count;
		$scope.events.max_table = eventObj.maxForTable;
		$scope.events.max_member = eventObj.maxForEachTable;

		//for editFunction
		$scope.newNameField = eventObj.eventName;
        $scope.newDescriptionField = eventObj.description;
        $scope.newVenueField = eventObj.venue;
		$scope.newTableNumField = eventObj.maxForTable;
		$scope.newOrganizerField = eventObj.organizer;
		$scope.newGPSField = eventObj.gps;
		$scope.newDateField = new Date(eventObj.date);
		$scope.newDeadlineField = new Date(eventObj.deadline);
		var timeField = new Date(1970,1,1,eventObj.time.substr(0,2),eventObj.time.substr(3,5));
		$scope.newTimeField = timeField;

		var progress = $scope.events.table_confirmed / $scope.events.max_table * 100;
		$("#confirmed_bar").css("width",progress + "%");
		$scope.$apply();
		
		
    });

    $scope.saveGoogleMap = function () {
		var gps = $('#latlngspan').text().substr(1, $('#latlngspan').text().length-2); // (123,123) --> 123,123
		$scope.newGPSField = gps;
	};

	$scope.saveChange = function(){
				
		var dateMonth = $scope.newDateField.getMonth()+1;
		if(dateMonth < 10){
			dateMonth = "0" + dateMonth;
		}
		
		var dateDate = $scope.newDateField.getDate();
		if(dateDate < 10){
			dateDate = "0" + dateDate;
		}
		
		var dateYear = $scope.newDateField.getFullYear();
		var deadlineMonth = $scope.newDeadlineField.getMonth()+1;
		if(deadlineMonth < 10){
			deadlineMonth = "0" + deadlineMonth;
		}
		
		var deadlineDate = $scope.newDeadlineField.getDate();
		if(deadlineDate < 10){
			deadlineDate = "0" + deadlineDate;
		}
		
		var deadlineYear = $scope.newDeadlineField.getFullYear();
		var timeHour = $scope.newTimeField.getHours();
		if(timeHour < 10){
			timeHour = "0" + timeHour;
		}
		
		var timeMin = $scope.newTimeField.getMinutes();
		if(timeMin < 10){
			timeMin = "0" + timeMin;
		}


		firebase.database().ref("/events/" + eid).update({
			eventName: $scope.newNameField,
			description: $scope.newDescriptionField,
			date: dateMonth + "-" + dateDate + "-" + dateYear,
			time: timeHour + ":" + timeMin,
			venue: $scope.newVenueField,
			maxForTable: $scope.newTableNumField,
			organizer: $scope.newOrganizerField,
			gps: $scope.newGPSField,
			deadline: deadlineMonth + "-" + deadlineDate + "-" + deadlineYear,
		});
		//console.log("success");
		window.location.reload();
	};
	
	
	
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