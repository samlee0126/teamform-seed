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
	var eid;
	var uid;
	var status;
	var JoinDisabled = false;
	$scope.hasPassword = false;
	$scope.maxForEachTable = 0;

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
	  if (user) {
		$scope.showLogButton(user);
		eid = getURLParameter("q");
		uid = user.uid;
		// get the maximum number of user in one table
		retrieveOnceFirebase(firebase, "events/" + eid + "/maxForEachTable", function(data) {
			$scope.maxForEachTable = data.val();
		});
		// get member information from database by uid
		var refPath = "members/" + uid;
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

			var role = data.child("events").child(eid).child("role").val();

			// if user is leader, cannot go to member page
			if (role != "leader") {
				// actions
			}else {

				window.location.href = "index.html";
				return;
			}
			
			status = data.child("events").child(eid).child("status").val();
			
			if (status != null ) {
				
				if (status == "waiting")
					$("#waiting").removeClass("hide");
				else if (status == "confirmed")
					$("#confirmed").removeClass("hide");
				else if (status == "rejected")
					$("#rejected").removeClass("hide");
				else if (status == "done")
					$("#done").removeClass("hide");
				else
					$("#no_status").removeClass("hide");
				
			}else {

				$("#no_status").removeClass("hide");
				//window.location.href = "index.html";	// future: the case user type url directly
				console.log("no this event");
				return;				
			}
				
			// update $scope
			$scope.$apply();
		});	
		
		// get table information from database by tid
		var tableData = {};
		retrieveOnceFirebase(firebase, "tables", function(data) {
			data.forEach(function(childData) {
				if(childData.child("event").val() == eid) {
					tableData[childData.key] = childData.val();
					tableData[childData.key].tid = childData.key;
					tableData[childData.key].showPasswordInput = false;
					tableData[childData.key].passwordPlaceholder = "Please enter password";
					tableData[childData.key].hasPassword = false;
				}
			});
			$scope.tableInfo = Object.keys(tableData).map(function(k) {return tableData[k]});
			$scope.tableInfoTemp = Object.keys(tableData).map(function(k) {return tableData[k]});
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
						if ($scope.countMembers($scope.tableInfo[j]) == $scope.maxForEachTable) {
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
	
	// sort tables
	$scope.sortTable = function() {
		// get selected value
		var sortValue = $('#sort-select').val();
		$scope.isReversed = false;
		switch (sortValue) {
			// from more seats to less
			case "seat":
				$scope.sorter = $scope.countMembers;
				break;
			// from newest from oldest
			case "time":
				$scope.sorter = $scope.orderByDate;
				$scope.isReversed = true;
				break;
			// by alphabetic order
			case "table-name":
				$scope.sorter = "tableName";
				break;
		}
	};

	// for counting number of members
	$scope.countMembers = function(table) {
		console.log(table)
		if (!angular.isObject(table.members)) {
			return 0;
		}
		return Object.keys(table.members).length;
	};

	// for sorting time and date
	$scope.orderByDate = function(dateString) {
		return Date.parse(dateString.createTime);
	};
	
	// disable join button if table is full or request is already sent
	$scope.isJoinDisabled = function(table) {
		if ($scope.countMembers(table) == $scope.maxForEachTable || status == "waiting" || status == "confirmed" || status == "done" || JoinDisabled) {
			return true;
		} else
			return false;
	};
	
	// send request
	$scope.sendRequest = function(table) {
		// if table is not disabled
		if (!$scope.isJoinDisabled(table)) {
			// if password input is incorrect
			if (table.hasPassword && document.getElementById(table.tid + "-password").value != table.password) {
				for (var i = 0; i < $scope.tableInfo.length; i++) {
					if ($scope.tableInfo[i].tid == table.tid)
						$scope.tableInfo[i].passwordPlaceholder = "Incorrect password";
					else
						$scope.tableInfo[i].passwordPlaceholder = "Please enter password";
				}
				document.getElementById(table.tid + "-password").value = "";
			}
			// if password input is correct or table has no password
			if ((table.hasPassword && document.getElementById(table.tid + "-password").value == table.password) || table.password == "" ||
			table.password == null) {
				JoinDisabled = true;
				var tid = Object.keys(table);
				// update members/{uid}/events/{eid}
				firebase.database().ref("members/" + uid + "/events/" + eid).update({
					"role": "member",
					"status": "waiting",
					"tid": table.tid
				});

				var userId = {};
				userId[uid] = true;
				// update events/{eid}/members/{uid}
				firebase.database().ref("events/" + eid + "/members").update(userId);

				// update tables/{tid}/members/{uid}
				firebase.database().ref("tables/" + table.tid + "/members").update(userId);

				// reload page to update status
				location.reload();
			}
			// if table has password
			if (table.password != "" || table.password != null) {
				for (var i = 0; i < $scope.tableInfo.length; i++) {
					if ($scope.tableInfo[i].tid == table.tid) {
						$scope.tableInfo[i].showPasswordInput = true;
						$scope.tableInfo[i].hasPassword = true;
					}
					else {
						$scope.tableInfo[i].showPasswordInput = false;
						$scope.tableInfo[i].hasPassword = false;
					}
				}

			}
		}
	};
}]);
