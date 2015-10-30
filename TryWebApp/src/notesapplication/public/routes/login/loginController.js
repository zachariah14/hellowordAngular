module.controller("LoginController", function($scope, UserService) {
    $scope.loggedIn = UserService.loggedIn;
    $scope.login = function() {
        UserService.login($scope.username, $scope.password);
        console.log($scope.username + " loggedIn: " + $scope.loggedIn);
        UserService.loggedIn = $scope.loggedIn = true;
    }
});