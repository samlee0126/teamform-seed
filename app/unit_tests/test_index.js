/**
 * Created by IT-dogs on 12/11/2016.
 */
describe('Test feedback', function() {


    beforeEach(module('teamform-index-app','firebase'));
    var $controller;


    beforeEach(inject(function(_$controller_,_$firebaseObject_,_$firebaseArray_){
        $controller = _$controller_;
        $firebaseObject = _$firebaseObject_;
        $firebaseArray = _$firebaseArray_;
    }));


    describe('submitFeedback Coverage Test', function() {

        it('normal flow of user', function() {

            var $scope = {};
            var controller = $controller('IndexPageCtrl',{$scope: $scope, $firebaseObject: $firebaseObject, $firebaseArray: $firebaseArray});
            var user = true;
            //logout
            $scope.showLogButton(user);
            expect($scope.isLogin).toEqual(true);
            expect($scope.isLogout).toEqual(false);
            firebase.app().delete().then(function() {
                console.log("[DEFAULT] App is Gone Now");
            });
            // without login
            user = false;
            $scope.showLogButton(user);
            expect($scope.isLogin).toEqual(false);
            expect($scope.isLogout).toEqual(true);

            // table count in the event list for one event
            expect($scope.countTables({"table":"321"})).toEqual(1);
            expect($scope.countTables("null")).toEqual(0);

            firebase.app().delete().then(function() {
                console.log("[DEFAULT] App is Gone Now");
            });

        });



        it('normal flow of sending feedback form', function() {
            /*initalizeFirebase();*/
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

            firebase.app().delete().then(function() {
                console.log("[DEFAULT] App is Gone Now");
            });

        });
    });


});


// it('user login, logout button show', function() {
//
//     var $scope = {};
//     var controller = $controller('IndexPageCtrl',{$scope: $scope, $firebaseObject: $firebaseObject, $firebaseArray: $firebaseArray});
//
//     firebase.app().delete().then(function() {
//         console.log("[DEFAULT] App is Gone Now");
//     });
//
// });


// it('only one table', function() {
//
//     var $scope = {};
//     var controller = $controller('IndexPageCtrl',{$scope: $scope, $firebaseObject: $firebaseObject, $firebaseArray: $firebaseArray});
//
//
//     expect($scope.countTables({"table":"321"})).toEqual(1);
//
//     firebase.app().delete().then(function() {
//         console.log("[DEFAULT] App is Gone Now");
//     });
//
// });
//
// it('no table', function() {
//
//     var $scope = {};
//     var controller = $controller('IndexPageCtrl',{$scope: $scope, $firebaseObject: $firebaseObject, $firebaseArray: $firebaseArray});
//
//     expect($scope.countTables("null")).toEqual(0);
//
//     firebase.app().delete().then(function() {
//         console.log("[DEFAULT] App is Gone Now");
//     });
//
// });