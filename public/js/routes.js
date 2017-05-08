'use strict';

/**
 * Route configuration for the RDash module.
 */
angular.module('RDash').config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {

        // For unmatched routes
        $urlRouterProvider.otherwise('/');

        // Application routes
        $stateProvider
            .state('index', {
                url: '/',
                templateUrl: 'templates/home.html'
            })
            .state('users', {
                url: '/users',
                templateUrl: 'templates/users.html'
            })
            .state('me', {
                url: '/me',
                templateUrl: 'templates/me.html'
            })
            .state('risk', {
                url: '/games/risk',
                templateUrl: 'games/risk/risk.html'
            });
    }
]);
