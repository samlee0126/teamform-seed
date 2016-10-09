angular.module('teamform-index-app', ['firebase'])
.controller('FeedbackCtrl', ['$scope', '$firebaseObject', '$firebaseArray', 
    function($scope, $firebaseObject, $firebaseArray) {
		
	// Call Firebase initialization code defined in site.js
	initalizeFirebase();


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