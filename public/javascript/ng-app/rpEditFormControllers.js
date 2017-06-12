'use strict';

var rpEditFormControllers = angular.module('rpEditFormControllers', []);

rpEditFormControllers.controller('rpEditButtonCtrl', ['$scope', '$timeout',
    function ($scope, $timeout) {
        console.log('[rpEditButtonCtrl]');

        $scope.parentCtrl.isEditing = false;
        //$timeout(angular.noop, 0);

        $scope.toggleEditing = function () {
            $scope.parentCtrl.isEditing = !$scope.parentCtrl.isEditing;
            //$timeout(angular.noop, 0);
        };

    }
]);

rpEditFormControllers.controller('rpEditFormCtrl', [
    '$scope',
    '$timeout',
    'rpEditUtilService',

    function ($scope, $timeout, rpEditUtilService) {

        $scope.formatting = false;

        $scope.submit = function () {
            console.log('[rpEditFormCtrl] submit(), $scope.editText: ' + $scope.editText);
            $scope.inputIsDisabled = true;

            $scope.isSubmitting = true;
            //$timeout(angular.noop, 0);

            rpEditUtilService($scope.editText, $scope.redditId, function (err, data) {
                if (err) {
                    console.log('[rpEditFormCtrl] err');

                } else {
                    $scope.parentCtrl.completeEditing();

                }

            });

        };

        $scope.toggleFormatting = function () {
            $scope.formatting = !$scope.formatting;
        }
    }
]);