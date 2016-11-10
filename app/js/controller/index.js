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

angular.module('teamform-index-app', ['firebase'])
	.controller('IndexPageCtrl', ['$scope', '$firebaseObject', '$firebaseArray',
		function($scope, $firebaseObject, $firebaseArray) {



			// Call Firebase initialization code defined in site.js
			initalizeFirebase();

			//Check User Exist
			firebase.auth().onAuthStateChanged(function(user) {
				if (user) {
					// show logout button

					console.log("HI")


				} else {
					// No user is signed in.
					console.log("YEAH - You did not login lol");

				}
				// update $scope
				$scope.$apply();
			});

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
				var feedbackTime = new Date().toUTCString();;

				if ( feedbackContent !== '') {

					var newFeedback = {
						'Name': feedbackName,
						'Email': feedbackEmail,
						'Content': feedbackContent,
						'CreateTime': feedbackTime
					};
					console.log(newFeedback)
					var refPath = "Feedback";
					var ref = firebase.database().ref(refPath);

					ref.push(newFeedback, function(){
						window.location.href= "index.html";
					});

				}
			}


		}]);