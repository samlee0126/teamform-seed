angular.module('teamform-team-app', ['firebase'])
.controller('TeamCtrl', ['$scope', '$firebaseObject', '$firebaseArray', '$window', function($scope, $firebaseObject, $firebaseArray, $window) {
    // Call Firebase initialization code defined in site.js
    console.log("it is team controller!");

    $scope.isLogin = true;
    $scope.requestedMembers = [];
    $scope.members = [];

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

    var tid;

    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            $scope.showLogButton(user);
            var eid = getURLParameter("q");
            var uid = user.uid;

            // check the url contains eid or not
            if (eid == null || eid == "") {
                window.location.href = "index.html";
                console.log("no this event");
                return;
            }




            // get member information from database by uid
            var refPathMem = "members/" + uid;
            retrieveOnceFirebase(firebase, refPathMem, function(data) {
                // check the eid is valid or not
                var eventObj = data.child("events").child(eid).val();

                if (eventObj){

                } else {
                    window.location.href = "index.html";	// future: the case user type url directly
                    console.log("no this event");
                    return;
                }

                tid = data.child("events").child(eid).child("tid").val();

                var refPathTable = "tables/" + tid;
                var noOfMembers;
                console.log(refPathTable);
                retrieveOnceFirebase(firebase, refPathTable, function(data) {
                    //get one table information
                    $scope.tableName = data.child("tableName").val();
                    $scope.table = data.val();
                    // for counting number of members
                  	$scope.numberOfMembers = function(table) {
                  		if (!angular.isObject(table.members)) {
                  			return 0;
                  		}
                      noOfMembers = Object.keys(table.members).length;
                  		return noOfMembers;
                  	};
                    //check whether there is any request
                    var requestExist = data.child("requestedMembers").val()
                    if(requestExist != null)
                      $("#newRequest").removeClass("hide");

                      //extract the information of members in the request list
                      var refPathRequest = "tables/" + tid +"/requestedMembers";
                      retrieveOnceFirebase(firebase, refPathRequest, function(data) {
                        data.forEach(function(childData) {
                          refPathMem = "members/";
                          retrieveOnceFirebase(firebase, refPathMem, function(data) {
                      			data.forEach(function(memData) {
                      				if(memData.key == childData.key) {
                      					$scope.requestedMembers.push(memData.val());
                      				}
                      			});
                            $scope.$apply();
                          });
                        });
                      });

                    //extract the information of members in the member list
                    var refPathRequest = "tables/" + tid +"/members";
                    retrieveOnceFirebase(firebase, refPathRequest, function(data) {
                      data.forEach(function(childData) {
                        refPathMem = "members/";
                        retrieveOnceFirebase(firebase, refPathMem, function(data) {
                    			data.forEach(function(memData) {
                    				if(childData.val() != "leader" && memData.key == childData.key) {
                    					$scope.members.push(memData.val());
                    				}
                    			});
                          $scope.$apply();
                        });
                      });
                    });


                    // update $scope
                    $scope.$apply();

                    var refPathEvent = "events/" + eid;
                    retrieveOnceFirebase(firebase, refPathEvent, function(data) {
                        //get one event information
                        $scope.eventName = data.child("eventName").val();
                        $scope.maxForTable = data.child("maxForEachTable").val();
                        //check whether the table is confirmed
                        refPathConfirmTables = refPathEvent + "/confirmTables";
                        retrieveOnceFirebase(firebase, refPathConfirmTables, function(data) {
                    			data.forEach(function(confirmTableData) {
                    				if(confirmTableData.key == tid && confirmTableData.val() == true) {
                    					$("#confirmed").removeClass("hide");
                    				}
                    			});
                          $scope.$apply();
                        });
                        //check whether the table is fulled
                        if(noOfMembers == $scope.maxForTable)
                          $("#full").removeClass("hide");
                       // update $scope
                        $scope.$apply();
                    });

                    //change table password & name
                    $scope.newTableName="";
                    $scope.newTablePassword="";
                    $scope.tablePasswordOff="";
                    $scope.changeTable = function () {
                        var newTableName = $scope.newTableName;
                        var newTablePassword = $scope.newTablePassword;
                        //check whether the input is empty
                        if($scope.newTableName.length<=0)
                            newTableName = data.child("tableName").val();
                        if($scope.newTablePassword.length<=0)
                            newTablePassword = data.child("password").val();
                        //check whether the leader turn off password
                        if($scope.tablePasswordOff==true)
                            newTablePassword = "";
                        var refPathTable = "tables/" + tid;
                        console.log(refPathTable);
                        var refTable = firebase.database().ref(refPathTable);
                        refTable.update({ "tableName" : newTableName, "password" : newTablePassword}, function(){
                            // refresh page
                            window.location.href = "leader.html?q=" + eid;
                        });
                    };
                    //change leader of the table
                    $scope.newLeader="";
                    $scope.changeLeader = function () {
                        var newLeaderName = $scope.newLeader;
                        var newLeaderId;
                        //check whether the selection is not empty
                        if($scope.newLeader!="") {
                          var refPathRequest = "members/";
                          retrieveOnceFirebase(firebase, refPathRequest, function(data) {
                            data.forEach(function(childData) {
                              if(childData.child("name").val() == newLeaderName) {
                                newLeaderId = childData.key;
                                var updates = {};
                                //update the role and status of the current leader in members/
                                updates[uid + '/events/' + eid +'/role'] = "member";
                                updates[uid + '/events/' + eid +'/status'] = "confirmed";
                                //update the role and status of the new leader in members/
                                updates[newLeaderId + '/events/' + eid +'/role'] = "leader";
                                updates[newLeaderId + '/events/' + eid +'/status'] = "nostatus";
                                var refPathMem = "members/";
                                firebase.database().ref(refPathMem).update(updates);

                                var refPathTable = "tables/" + tid;
                                var refTable = firebase.database().ref(refPathTable);
                                updates= {};
                                //update the role of the new leader in tables/
                                updates['/members/' + newLeaderId] = "leader"
                                //update the role of the previous leader in tables/
                                updates['/members/' + uid] = true
                                refTable.update(updates,function(){
                                  window.location.href = "event.html?q=" + eid;
                                });
                              }
                            });
                          });
                        }
                        else {
                          window.location.href = "leader.html?q=" + eid;
                        }
                    };

                });
            });


        //did not login successfully
        } else {
            // No user is signed in.
            console.log("YEAH - You did not login lol");
            sessionStorage.setItem("urlAfterLogin","event.html?q=" + getURLParameter("q"));
            window.location.href = "signIn.html"; // default redirect page is index
        }

    });


}]);
