angular.module("myapp", [])
    .controller("HelloController", function($scope) {
        $scope.greeting = "";
        $scope.greeting2 = "Hello, ";
        $scope.update = function() {
            if ($scope.name) {
                $scope.greeting = $scope.greeting2 + $scope.name + "!";
            }
        };
});
