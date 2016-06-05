angular.module('calculator.controllers', [])

.controller('MainCtrl', function ($scope, $state) {
    
    $scope.user = User;
    Game.state = $state;
    $scope.join = function () {
        Game.join();
    }

})
.controller('TabCtrl', function ($scope, $state) {
    
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
    $scope.del = function () {
        $scope.uAnswer = $scope.uAnswer.slice(0, -1);
    }
    $scope.neg = function () {
        if($scope.uAnswer.length > 0)
            $scope.uAnswer = parseInt($scope.uAnswer) * (-1);
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
    $scope.$on('$stateChangeStart', function () {
        if (User.room != null && User.room.id != null)
            Game.leaveRequest();
    });

})
.controller('LoginCtrl', function ($scope, $state) {
    $scope.data = {};

    Game.state = $state;
    if (Game.socket == null) Game.init(); 

    $scope.loadUser = function () {
        var ruser = localStorage.getItem('user');
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
