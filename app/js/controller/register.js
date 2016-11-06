angular.module('teamform-register-app', ['firebase'])
.controller('RegisterCtrl', ['$scope', '$firebaseObject', '$firebaseArray', 
    function($scope, $firebaseObject, $firebaseArray) {
		
	// Call Firebase initialization code defined in site.js
	initalizeFirebase();
	console.log("it is register page!")
	$scope.name = ""
	$scope.email = "";
	$scope.password = "";
	$scope.doRegister = function () {

		var email = $scope.email;
		var password = $scope.password;
		var name = $scope.name;
		var gender = $scope.gender;
		var createTime = new Date().toUTCString();
		var major = $scope.major;
		var gradYear = $scope.gradYear;
		var local = $scope.local;
		
		
		firebase.auth().createUserWithEmailAndPassword(email, password).then(function(user) {
	
			/* update the datebase of members*/
			user.updateProfile({
			  displayName: name
			}).then(function() {
				
				
				if (user != null) {
				  console.log(user.displayName);
				  console.log(user.email);
				  console.log(user.uid);
					var newData = {
						'name': name,
						'gender': gender,
						'email': email,
						'major': major,
						'local': local,
						'gradYear': gradYear,
						'createTime': createTime,
						'event': ""
						
					};

					var refPath = "members/" + user.uid;	
					var ref = firebase.database().ref(refPath);

					ref.set(newData, function(){
						// Finally, go back to the front-end
						window.location.href= "index.html";
					});
				}

			}, function(error) {
			  // An error happened.

			});	
			
			
			
			
		}, function(error) {

		  // Handle Errors here.
		  var errorCode = error.code;
		  var errorMessage = error.message;
		  console.log(errorCode + ": " + errorMessage)
		  alert("The email is already used! please use another email to register")
		  
		});
		
		

		
		
		
			
			
	}


	
/*	

		firebase.auth().signInWithEmailAndPassword("abc123@gmail.com", "321321321").catch(function(error) {

		  // Handle Errors here.
		  var errorCode = error.code;
		  var errorMessage = error.message;
		  console.log(errorCode + ": " + errorMessage)
		  alert("The email is already used! please use another email to register")
		});
		
		
	firebase.auth().onAuthStateChanged(function(user) {
	  if (user) {
		console.log("YEAH - user")
	  } else {
		// No user is signed in.
		console.log("YEAH - no user")
	  }
		user.updateProfile({
		  displayName: "Jane PK. User",
		  photoURL: "https://example.com/jane-q-user/profile.jpg"
		}).then(function() {
			if (user != null) {
			  console.log(user.displayName);
			  console.log(user.email);
			  console.log(user.photoURL);
			  console.log(user.uid);  // The user's ID, unique to the Firebase project. Do NOT use
							   // this value to authenticate with your backend server, if
							   // you have one. Use User.getToken() instead.
			}
		  console.log("YEAH3")
		}, function(error) {
		  // An error happened.
		  console.log("YEAH2")
		});
		

	});
	
/*

var ref = new Firebase("https://<YOUR-FIREBASE-APP>.firebaseio.com");
ref.onAuth(function(authData) {
  if (authData && isNewUser) {
    // save the user's profile into the database so we can list users,
    // use them in Security and Firebase Rules, and show profiles
    ref.child("users").child(authData.uid).set({
      provider: authData.provider,
      name: getName(authData)
    });
  }
});

*/

/*
			var newData = {				
				'name': userName,
				'selection': $scope.selection
			};
			
			var refPath = getURLParameter("q") + "/member/" + userID;	
			var ref = firebase.database().ref(refPath);	

*/			
}]);