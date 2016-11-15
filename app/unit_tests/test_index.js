/**
 * Created by IT-dogs on 12/11/2016.
 */
describe('Test feedback', function() {


    beforeEach(module('teamform-index-app','firebase'));
    var $controller;

    beforeEach(inject(function(_$controller_){
        // The injector unwraps the underscores (_) from around the parameter names when matching
        $controller = _$controller_;
    }));


    describe('submitFeedback Coverage Test', function() {



        it('logout button shown if user login', function() {

            var $scope = {};
            var controller = $controller('IndexPageCtrl', { $scope: $scope });
            expect($scope.isLogin).toEqual(true);

            firebase.app().delete().then(function() {
                console.log("[DEFAULT] App is Gone Now");
            });

        });

        it('successfully sent feedback', function() {
            initalizeFirebase();
            var $scope = {};
            var controller = $controller('FeedbackCtrl', { $scope: $scope });
            $scope.feedbackEmail = "mary@gmail.com";
            $scope.feedbackName = "mary chan";
            $scope.feedbackContent = "hello this is a good website";
            $scope.feedbackTime = new Date().toUTCString();

            $scope.submitFeedback();

            var newFeedback = {
                'Name': $scope.feedbackName,
                'Email': $scope.feedbackEmail,
                'Content': $scope.feedbackContent,
                'CreateTime': $scope.feedbackTime
            };

            expect($scope.submitFeedback.newFeedback).toEqual(newFeedback);



        });
    });


});


/*
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
 console.log(newFeedback)
 var refPath = "Feedback";
 var ref = firebase.database().ref(refPath);

 ref.push(newFeedback, function(){
 window.location.href= "index.html";
 });

 }
 }


 }]);
 */