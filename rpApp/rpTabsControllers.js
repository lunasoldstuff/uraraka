'use strict';

var rpTabsControllers = angular.module('rpTabsControllers', []);

rpTabsControllers.controller('rpTabsCtrl', ['$scope', '$timeout', '$rootScope',
    function($scope, $timeout, $rootScope) {
        console.log('[rpTabsCtrl]');

        $scope.tabs = [];
        $scope.selectedIndex = 0;
        $scope.showTabs = false;

        $scope.tabClick = function(tab) {
            console.log('[rpTabsCtrl] tabClick(), tab: ' + tab);
            $timeout(function() {
                $rootScope.$emit('rp_tab_click', tab);

            }, 350);
        };

        var deregisterTabsChanged = $rootScope.$on('rp_tabs_changed', function(e, tabs) {
            console.log('[rpTabsCtrl] onTabsChanged(), $scope.showTabs: ' + $scope.showTabs);
            $scope.selectedIndex = 0;
            $scope.tabs = tabs;

            if ($scope.showTabs === false) {
                $timeout(function() {
                    $scope.showTabs = true;
                }, 0);

            }

        });

        var deregisterSelectedIndexChanged = $rootScope.$on('rp_tabs_selected_index_changed', function(e, selectedIndex) {
            console.log('[rpTabsCtrl] rpTabsSelectedIndexChanged, selectedIndex: ' + selectedIndex);
            $scope.selectedIndex = selectedIndex;
        });

        var deregisterShowTabs = $rootScope.$on('rp_show_tabs', function() {
            console.log('[rpTabsCtrl] onTabsShow()');
            $timeout(function() {
                $scope.showTabs = true;

            }, 0);

        });

        var degregisterHideTabs = $rootScope.$on('rp_tabs_hide', function() {
            console.log('[rpTabsCtrl] onTabsHide()');
            $timeout(function() {
                $scope.showTabs = false;

            }, 0);

        });

        $scope.$on('$destroy', function() {
            deregisterSelectedIndexChanged();
            deregisterTabsChanged();
            degregisterHideTabs();
            deregisterShowTabs();
        });

    }

]);
