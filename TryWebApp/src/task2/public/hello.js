angular.module("myapp", [])
    .controller("HelloController", function($scope, $http, $interval) {
        $scope.greeting = "";
        $scope.update = function() {
            if ($scope.name) {
                $http.get("/greeting",
                    {params:
                        {name: $scope.name}
                    })
                    .success(function(res) {
                        $scope.greeting = res;
                    });

                $scope.greeting = "Hello, " + $scope.name + "!";
            }
        };
        $interval($scope.update, 200);
        /*$scope.$watch("name", function() {
            $scope.update();
        });*/
});
