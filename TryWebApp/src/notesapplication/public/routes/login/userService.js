module.factory("UserService", function($http, $rootScope, $timeout) {
    var service = {};
    service.userName = "";
    service.loggedIn = false;

    service.login = function(login, password) {
        $http.post("/login", {login:login, password:password})
            .success(function(res) {
                if (res) {
                    service.loggedIn = true;
                    service.userName = login;
                    console.log("logged in!");
                } else {
                    console.log("wrong user/password!");
                    $rootScope.wrongPassword = true;
                    $timeout(function() {
                        $rootScope.wrongPassword = false;
                    }, 1000);
                }
            });
    }

    return service;
});