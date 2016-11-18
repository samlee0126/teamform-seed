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

    $scope.showLogButton = function (user) {
        if (user) {
            $scope.isLogin = true;
            $scope.isLogout = false;
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
                    var role = data.child("events").child(eid).child("role").val();
                    var status = data.child("events").child(eid).child("status").val();
                    // check if the non-admin user is member or leader in this event

                    if (role == "member") {

                        if (status == "rejected") {
                            $scope.noRole = true;
                            $scope.memberIconShown = true;
                            $scope.leaderIconShown = true;
                            $scope.adminIconShown = false;
                        }

                        $scope.memberIconShown = true;
                        $scope.leaderIconShown = false;
                        $scope.adminIconShown = false;
                    } else if (role == "leader") {
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
                $scope.time = data.child("time").val();
                $scope.venue = data.child("venue").val();
                $scope.organizer = data.child("organizer").val();
                $scope.gps = data.child("gps").val();

                // Google map
                if ($scope.gps){
                    google.maps.event.trigger(map, 'resize');
                    codeCoordinate($scope.gps);
                }

                //setup for the clock
                var deadline = new Date(Date.parse($scope.deadline)+86340000);
                initializeClock('clockdiv1', deadline);
                var eventTime = new Date(Date.parse($scope.date + " " + $scope.time));
                initializeClock('clockdiv2', eventTime);
                //setup for vacancy-bar
                var tab = data.child("confirmTables").val();
                var confirmedTab = tableCount(tab);
                var maxTab = data.child("maxForTable").val();
                $scope.confirmed = confirmedTab;
                $scope.maxTab = maxTab;
                var floatToFixed = +((confirmedTab / maxTab) * 100).toFixed(2);
                var bindString = floatToFixed + "%";
                $scope.occupancy = bindString;
                
                if(confirmedTab==0){
                    $scope.zero=true;
                    $scope.betweenZeroFull=false;
                    $scope.fullBar=false;
                }
                else if(confirmedTab==maxTab){
                    $scope.zero=false;
                    $scope.betweenZeroFull=false;
                    $scope.fullBar=true;
                }
                else{
                    $scope.zero=false;
                    $scope.betweenZeroFull=true;
                    $scope.fullBar=false;
                }
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
 

//sidebar - Countdown Clock   
function getTimeRemaining(endtime) {
  var t = Date.parse(endtime) - Date.parse(new Date());
  var seconds = Math.floor((t / 1000) % 60);
  var minutes = Math.floor((t / 1000 / 60) % 60);
  var hours = Math.floor((t / (1000 * 60 * 60)) % 24);
  var days = Math.floor(t / (1000 * 60 * 60 * 24));
  return {
    'total': t,
    'days': days,
    'hours': hours,
    'minutes': minutes,
    'seconds': seconds
  };
}


function initializeClock(id, endtime) {
  var clock = document.getElementById(id);
  var daysSpan = clock.querySelector('.days');
  var hoursSpan = clock.querySelector('.hours');
  var minutesSpan = clock.querySelector('.minutes');
  var secondsSpan = clock.querySelector('.seconds');

  function updateClock() {
    var t = getTimeRemaining(endtime);
    if(t.days<0){
        daysSpan.innerHTML = ('00').slice(-2);
        hoursSpan.innerHTML = ('00').slice(-2);
        minutesSpan.innerHTML = ('00').slice(-2);
        secondsSpan.innerHTML = ('00').slice(-2);
    }
    else{
        if(t.days<100){
         daysSpan.innerHTML = ('0' + t.days).slice(-2);
        }
        else{
         daysSpan.innerHTML = t.days;
        }
        hoursSpan.innerHTML = ('0' + t.hours).slice(-2);
        minutesSpan.innerHTML = ('0' + t.minutes).slice(-2);
        secondsSpan.innerHTML = ('0' + t.seconds).slice(-2);
    }
    

    if (t.total <= 0) {
      clearInterval(timeinterval);
    }
  }

  updateClock();
  var timeinterval = setInterval(updateClock, 1000);
}

//sidebar - vacancy status
function tableCount(obj){
    var num=0;
    for(var table in obj){
        num++;
    }
    return num;
}
}]);


