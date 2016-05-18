// Ionic calculator App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'calculator' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'calculator.services' is found in services.js
// 'calculator.controllers' is found in controllers.js
angular.module('calculator', ['ionic', 'calculator.controllers', 'calculator.services'])

.run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
    });
})

.config(function ($stateProvider, $urlRouterProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider

      // setup an abstract state for the tabs directive
        .state('tab', {
            url: "/tab",
            abstract: true,
            templateUrl: "templates/tabs.html"
        })
        .state('login', {
            url: '/login',
            templateUrl: 'templates/login.html',
            controller: 'LoginCtrl'
        })
        .state('tab.main', {
            url: '/main',
            views: {
                'tab-main': {
                    templateUrl: 'templates/main.html',
                    controller: 'MainCtrl'
                }
            }
        })
        .state('tab.history', {
            url: '/history',
            views: {
                'tab-history': {
                    templateUrl: 'templates/history.html',
                    controller: 'HistoryCtrl'
                }
            }
        })

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/login');

});

