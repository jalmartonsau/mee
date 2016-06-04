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
        // populate user device info
        User.device.id = device.uuid;
        User.device.model = device.model;
        User.device.platform = device.platform;
        User.device.version = device.version;

        // init server interactions
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
        .state('game', {
            url: '/game',
            templateUrl: 'templates/game.html',
            controller: 'GameCtrl'
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
        .state('tab.settings', {
            url: '/settings',
            views: {
                'tab-settings': {
                    templateUrl: 'templates/settings.html',
                    controller: 'SettingsCtrl'
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
    room: null,
    facebook: null,
    device: {
        id: null,
        model: null,
        platform: null,
        version: null
    }

};

var Game = {
    host: "http://tonsau.eu:45032",
    socket: null,
    state: null,
    scope: null,
    challenge: null,
    init: function () {
        if(Game.socket == null)
            Game.socket = io.connect(this.host);

        if (Game.socket === null)
            return;

        Game.socket.on("AuthUserResponse", function (response) {
            Game.loginSuccess(response);
        });
        Game.socket.on("ChallengeResponse", function (response) {
            Game.loadChallenge(response);
        });
        Game.socket.on("JoinGameResponse", function (response) {
            if (response === null) return;
            if (response.success) {
                User.room = response.data;

                if (Game.state != null)
                    Game.state.go('game');
            }
        });
        Game.socket.on("WinResponse", function (response) {
            console.log(JSON.stringify(response));
        });
        Game.socket.on("ChangePointsResponse", function (response) {
            console.log(JSON.stringify(response));
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

            if(Game.state != null)
                Game.state.go('tab.main');

        } else if (User.facebook != null) { // Facebook first login
            Game.socket.emit("NewUserRequest", User);
            Game.socket.on("NewUserResponse", function (response) {
                if (!response.success) return;

                Game.authUser(User);
            });
        }
    },
    signUp: function(User){
        if (User.email == null) return;
        if (User.password == null) return;

        Game.socket.emit("NewUserRequest", User);
        Game.socket.on("NewUserResponse", function (response) {
            if (!response.success) return;

            Game.authUser(User);
        });
    },
    signInFromMemory: function (User) {
        Game.authUser(User);
    },
    join: function () {
        Game.socket.emit("JoinGameRequest", User);
    },
    loadChallenge: function (challenge) {
        if (Game.scope == null) return;
        if (Game.state == null) return;

        Game.challenge = challenge;
        Game.scope.uAnswer = "";
        Game.scope.game = challenge;
        if (Game.state != null)
            Game.state.go('game');
    },
    changePoints: function (amount) {
        var Data = {
            amount: amount,
            User: User
        };
        Game.socket.emit("ChangePointsRequest", Data);
    },
    winRequest: function () {
        var Data = {
            User: User,
            Challenge: Game.challenge
        };
        Game.socket.emit("WinRequest", Data);
    }
};