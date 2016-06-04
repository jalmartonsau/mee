angular.module('calculator.controllers', [])

.controller('MainCtrl', function ($scope, $state) {
    $scope.user = User;
    Game.state = $state;
    $scope.join = function () {
        Game.join();
    }

})
.controller('SettingsCtrl', function ($scope, $state) {

})
.controller('GameCtrl', function ($scope, $state) {
    Game.state = $state;
    Game.scope = $scope;
    $scope.uAnswer = "";
    $scope.add = function (number) {
        $scope.uAnswer += number.toString();
    }
    $scope.submit = function () {
        var userAnswer = parseInt($scope.uAnswer);
        if (userAnswer === Game.challenge.answer) {
            // Right answer
            Game.scope = $scope;
            Game.winRequest();//Checks if user won
        } else {
            // Wrong answer
            $scope.uAnswer = "";
            Game.scope = $scope;
            Game.changePoints(-1);
        }
    }

})
.controller('LoginCtrl', function ($scope, $state) {
    $scope.data = {};

    Game.state = $state;
    if (Game.socket == null) Game.init(); 

    $scope.loadUser = function () {
        var ruser = localStorage.getItem('user');
        if (ruser != null)
            Game.signInFromMemory(JSON.parse(ruser));
    }

    $scope.login = function () {
        User.email = $scope.data.email;
        User.password = $scope.data.password;
        Game.authUser(User); // Authenticates user
    }
    $scope.fblogin = function () {
        Game.authFbUser();
    }
    $scope.signUp = function () {
        User.email = $scope.data.email;
        User.password = $scope.data.password;
        Game.signUp(User);
    }
})
