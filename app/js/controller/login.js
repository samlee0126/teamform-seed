angular.module('teamform-login-app', ['firebase'])
.controller('LoginCtrl', ['$scope', '$firebaseObject', '$firebaseArray', 
    function($scope, $firebaseObject, $firebaseArray) {
		
	// Call Firebase initialization code defined in site.js
	initalizeFirebase();
	console.log("it is login page!")
	$scope.email = "";
	$scope.password = "";
	$scope.doLogin = function () {

		var email = $scope.email;
		var password = $scope.password;

		
		
		firebase.auth().signInWithEmailAndPassword(email, password).then(function(user) {
	
			/* after login */
			console.log(user);
			if (sessionStorage.getItem("urlAfterLogin")) {// e.g store the one event page user clicked 
				window.location.href = sessionStorage.getItem("urlAfterLogin");
				sessionStorage.setItem("urlAfterLogin","");
			}
			else {
				window.location.href = "index.html"; // default redirect page is index
			}
			
			
		}, function(error) {

		  // Handle Errors here.
		  var errorCode = error.code;
		  var errorMessage = error.message;
		  console.log(errorCode + ": " + errorMessage)
		  alert("You cannot login successfully!")
		  
		});
		
			
	}
			
}]);

/*
	firebase.auth().onAuthStateChanged(function(user) {
	  if (user) {
		console.log(user)
	  } else {
		// No user is signed in.
		console.log("YEAH - no user")
	  }

	});	
*/