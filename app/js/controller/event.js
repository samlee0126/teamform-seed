

angular.module('teamform-event-app', ['firebase'])
.controller('eventCtrl', ['$scope', '$firebaseObject', '$firebaseArray', '$window', function($scope, $firebaseObject, $firebaseArray, $window) {
    // Call Firebase initialization code defined in site.js
    console.log("it is event controller!");
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
            $scope.eid = getURLParameter("q");

            // check the url contains eid or not
            if (eid == null || eid == "") {
                window.location.href = "index.html";
                console.log("no this event");
                return;
            }




            // get member information from database by uid
            var refPathMem = "members/" + user.uid;
            retrieveOnceFirebase(firebase, refPathMem, function(data) {
                // user name
                if ( data.child("name").val() != null ) {
                    $scope.name = data.child("name").val();
                } else {
                    $scope.name = "N/A";
                }
                // check the eid is valid or not
                var eventObj = data.child('events').child(eid);
                console.log(eventObj.val());
                if (eventObj){

                } else {
                    window.location.href = "index.html";	// future: the case user type url directly
                    console.log("no this event");
                    return;
                }

                //check if the user is admin or non-admin
                var userRole = data.child("userRole").val();
                if (!userRole) {
                    var status = data.child("events").child(eid).child("role").val();
                    // check if the non-admin user is member or leader in this event

                    if (status == "member") {
                        $scope.memberIconShown = true;
                        $scope.leaderIconShown = false;
                        $scope.adminIconShown = false;
                    } else if (status == "leader") {
                        $scope.memberIconShown = false;
                        $scope.leaderIconShown = true;
                        $scope.adminIconShown = false;
                    } else {
                        $scope.noRole = true;
                        $scope.memberIconShown = true;
                        $scope.leaderIconShown = true;
                        $scope.adminIconShown = false;
                    }
                } else {
                    $scope.memberIconShown = false;
                    $scope.leaderIconShown = false;
                    $scope.adminIconShown = true;
                }


                // update $scope
                $scope.$apply();
            });

            var refPathEvent = "events/" + eid;
            retrieveOnceFirebase(firebase, refPathEvent, function(data) {
                //get one event information
                $scope.date = data.child("date").val();
                $scope.deadline = data.child("deadline").val();
                $scope.description = data.child("description").val();
                $scope.eventName = data.child("eventName").val();
                $scope.maxForEachTable = data.child("maxForEachTable").val();
                $scope.numberOfCurrentTable = data.child("numberOfCurrentTable").val();


                // update $scope
                $scope.$apply();
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