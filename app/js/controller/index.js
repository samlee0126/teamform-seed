/*

$(document).ready(function(){


    $("#btn_admin").click(function(){
    	var val = $('#input_text').val();
    	if ( val !== '' ) {
    		var url = "admin.html?q=" + val;
    		window.location.href= url ;
    		return false;
    	}
    });

    $("#btn_leader").click(function(){
    	var val = $('#input_text').val();
    	if ( val !== '' ) {
    		var url = "team.html?q=" + val;
    		window.location.href= url ;
    		return false;
    	}
    });

    $("#btn_member").click(function(){
    	var val = $('#input_text').val();
    	if ( val !== '' ) {
    		var url = "member.html?q=" + val;
    		window.location.href= url ;
    		return false;
    	}
    });


});
*/

angular.module('teamform-index-app', ['firebase'])
	.controller('IndexPageCtrl', ['$scope', '$firebaseObject', '$firebaseArray',
		function($scope, $firebaseObject, $firebaseArray) {

            $scope.isLogout = false;

			// Call Firebase initialization code defined in site.js
			initalizeFirebase();
            firebase.auth().onAuthStateChanged(function(user) {
				$scope.showLogButton(user);
                $scope.$apply();
            });

			// list all events
			var refPathEvent = "events/";
			retrieveOnceFirebase(firebase, refPathEvent, function(data) {
				$scope.events = data.val();
				//alert(Object.keys($scope.events['e1'].tables).length);
				$scope.$apply();
				console.log($scope.events)
			});

			$scope.countTables = function(tables) {
				if(!angular.isObject(tables)){
					return 0;
				}
				return Object.keys(tables).length;
			};

			$scope.countLikes = function(likes) {
				if(!angular.isObject(likes)){
					return 0;
				}
				return Object.keys(likes).length;
			};

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

			$scope.clickLike = function (eid) {

				console.log(eid);
				if (firebase.auth().currentUser) {

					var refPathLike = "events/" + eid + "/likes/" + firebase.auth().currentUser.uid;
					var refLike = firebase.database().ref(refPathLike);

					refLike.set(true, function(){
						// list all events
						var refPathEvent = "events/";
						retrieveOnceFirebase(firebase, refPathEvent, function(data) {
							$scope.events = data.val();
							$scope.$apply();
						});
					});


				} else {
					alert("Oh! Please login before you like the event")
				}



			}

	}])
	.controller('FeedbackCtrl', ['$scope', '$firebaseObject', '$firebaseArray',
		function($scope, $firebaseObject, $firebaseArray) {

			// Call Firebase initialization code defined in site.js



			$scope.feedbackDetails = {
				"Name" : '',
				"Email" : '',
				"Content" : ''
			};

			$scope.submitFeedback = function() {


				var feedbackEmail = $.trim( $scope.feedbackEmail );
				var feedbackName = $.trim( $scope.feedbackName );
				var feedbackContent = $.trim( $scope.feedbackContent );
				var feedbackTime = new Date().toUTCString();

				if ( feedbackContent !== '') {

					var newFeedback = {
						'Name': feedbackName,
						'Email': feedbackEmail,
						'Content': feedbackContent,
						'CreateTime': feedbackTime
					};
					console.log(newFeedback);
					var refPath = "Feedback";
					var ref = firebase.database().ref(refPath);

					ref.push(newFeedback, function(){
						window.location.href= "index.html";
					});

				}
			}


		}]);