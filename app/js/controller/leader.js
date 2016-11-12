angular.module('teamform-team-app', ['firebase'])
.controller('TeamCtrl', ['$scope', '$firebaseObject', '$firebaseArray', '$window', function($scope, $firebaseObject, $firebaseArray, $window) {
    // Call Firebase initialization code defined in site.js
    console.log("it is team controller!");

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


    var tid;

    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {

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
                console.log(refPathTable);
                retrieveOnceFirebase(firebase, refPathTable, function(data) {
                    //get one table information
                    $scope.tableName = data.child("tableName").val();
                    $scope.numberOfMembers = data.child("numberOfMembers").val();
                    //check whether there is any request
                    var requestExist = data.child("requestedMembers").val()
                    if(requestExist != null)
                      $("#newRequest").removeClass("hide");

                      //extract the information of members in the request list
                      var refPathRequest = "tables/" + tid +"/requestedMembers";
                      retrieveOnceFirebase(firebase, refPathRequest, function(data) {
                        data.forEach(function(childData) {
                          console.log(childData.val());
                          refPathMem = "members/";
                          retrieveOnceFirebase(firebase, refPathMem, function(data) {
                      			data.forEach(function(memData) {
                      				if(memData.key == childData.val()) {
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
                        console.log(childData.val());
                        refPathMem = "members/";
                        retrieveOnceFirebase(firebase, refPathMem, function(data) {
                    			data.forEach(function(memData) {
                    				if(memData.key == childData.val()) {
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
                        //check whether the table is fulled
                        if($scope.numberOfMembers == $scope.maxForTable)
                          $("#full").removeClass("hide");
                       // update $scope
                        $scope.$apply();
                    });


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
