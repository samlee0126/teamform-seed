	angular.module('teamform-createTable-app', ['firebase'])
				.controller('CreateTableCtrl', ['$scope', '$firebaseObject', '$firebaseArray',
					function($scope, $firebaseObject, $firebaseArray) {

						// Call Firebase initialization code defined in site.js
						console.log("it is register page!");
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

						// var refPathEvent = "events/e1";
						// retrieveOnceFirebase(firebase, refPathEvent, function(data) {
						// 	$scope.eventName = data.child("eventName").val();
						// 	$scope.$apply();
						// 	console.log($scope.eventName)
						// });

						firebase.auth().onAuthStateChanged(function(user) {
							if (user) {
								var eid = getURLParameter("q");
								$scope.uid = user.uid;
								$scope.eid = getURLParameter("q");

								// check the url contains eid or not
								if (eid == null || eid == "") {
									window.location.href = "index.html";
									console.log("no this event");
									return;
								}
								// get member information from database by uid
								var refPath = "members/" + user.uid;
								retrieveOnceFirebase(firebase, refPath, function(data) {


									var role = data.child("events").child(eid).child("role").val();

									// no role in event
									if (role != "member" && role != "leader" ) {
										// actions
									}else {

										window.location.href = "index.html";
										return;
									}
									// update $scope
									$scope.$apply();
								});
								// Get Event Name to Display in the form
								var refPathEvent = "events/" + eid;
								retrieveOnceFirebase(firebase, refPathEvent, function(data) {
									$scope.eventName = data.child("eventName").val();
									$scope.$apply();
									console.log($scope.eventName)
								});

							} else {
								// No user is signed in.
								console.log("YEAH - You did not login lol");
								sessionStorage.setItem("urlAfterLogin","member.html?q=" + getURLParameter("q"));
								window.location.href = "signIn.html"; // default redirect page is index
							}

						});





						// Create a table and send it to firrebase
						$scope.name = "";
						$scope.email = "";
						$scope.password = "";
						$scope.doCreateTable = function () {

							/* To Sam : Please change this part to table information */
							var tableName = $scope.tableName;
							var password = $scope.password;
							var createTime = new Date().toUTCString();
							var tag1 = $scope.tag1;
							var tag2 = $scope.tag2;
							var tag3 = $scope.tag3;
							var eid = $scope.eid;
							var uid = $scope.uid;

							//generate tid key
							var myRef = firebase.database().ref().push();
							var tid = myRef.key;

							var newTableData = {
								'tags': {
									'tag1': tag1,
									'tag2': tag2,
									'tag3': tag3
								},
								'tableName': tableName,
								'password': password,
								'numberOfMembers': 1,
								//'local': local,
								'leader': uid,
								'createTime': createTime,
								'event': eid

							};
							// please change the correct path after testing
							var refPathTable = "tables/" + tid ;

							var reftable = firebase.database().ref(refPathTable);

							reftable.set(newTableData, function(){

								// update event json
								var refPathEvent = "events/" + eid + "/tables/" + tid;
								var refEvent = firebase.database().ref(refPathEvent);

								refEvent.set({ active : true}, function(){
									// Finally, go back to the front-end
									//window.location.href = "index.html";
								});

								var refPathMember = "members/" + $scope.uid + "/events/" + eid;
								var refMember = firebase.database().ref(refPathMember);

								// save the role and tid in this event for member
								refMember.update({ role : "leader", tid : tid}, function(){
									// Finally, go back to the front-end
									window.location.href = "leader.html?q=" + eid;
								});


							});







						};



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
