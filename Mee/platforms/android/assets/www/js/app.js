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
        Game.init();
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

var User = {
    loggedIn: false,
    id: null,
    email: null,
    password: null,
    points: null,
    facebook: null,
    device: {
        id: "test"
    }

};

var Game = {
    host: "http://tonsau.eu:45032",
    socket: null,
    init: function () {
        Game.socket = io.connect(this.host);

        if (Game.socket === null)
            return;

        Game.socket.on("AuthUserResponse", function (response) {
            Game.loginSuccess(response);
        });

    },
    authUser: function (User) {
        if (User.email == null) return;
        if (User.password == null) return;

        Game.socket.emit("AuthUserRequest", User);
    },
    authFbUser: function () { // loging in with fb
        facebookConnectPlugin.login(['email'],
        function (response) {
            if (response == null && response.authResponse == null) return;

            facebookConnectPlugin.api('/me?fields=email,first_name,last_name&access_token=' + response.authResponse.accessToken, null,
            function (response) {
                User.facebook = response;
                User.email = response.email;
                User.id = response.id;
                User.password = response.id;
                
                Game.socket.emit("AuthUserRequest", User);
            },
            function (response) {
                // Error
            });
        },
        function (response) {
            // Error
        })
    },
    loginSuccess: function (response) {
        if (response == null) return;

        if (response.success) { // auth succeeded
            User.id = response.data.id;
            User.points = response.data.points;
            User.email = response.data.email;
            localStorage.setItem("user", JSON.stringify(User)); // Keep user in local storage.
            User.loggedIn = true;
        } else if (User.facebook != null) { // Facebook first login
            Game.socket.emit("NewUserRequest", User);
            Game.socket.on("NewUserResponse", function (response) {
                if (!response.success) return;

                Game.authUser(User);
            });
        }
    }
};