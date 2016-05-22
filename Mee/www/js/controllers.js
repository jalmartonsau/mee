angular.module('calculator.controllers', [])

.controller('MainCtrl', function ($scope, $state) {
    $scope.user = User;
})
.controller('SettingsCtrl', function ($scope, $state) {

})
.controller('LoginCtrl', function ($scope, $state) {
    $scope.data = {};

    Game.state = $state;
    if (Game.socket == null) Game.init(); 

    var ruser = localStorage.getItem('user');
    if (ruser != null)
        Game.signInFromMemory(JSON.parse(ruser));

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
