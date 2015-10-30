module.controller('NotesController',
    function($scope, $http, $routeParams, $location, Note) {
        $scope.notes = [];
        $scope.activeSection = $routeParams.activeSection;

        /*$scope.add = function() {
            if ($scope.text.length == 0) return;
            var note = {
                text: $scope.text,
                id: $scope.id,
                lastUpdated: $scope.lastUpdated,
            };
            note.order = $scope.order;
            note.section = $scope.activeSection;

            $http.post("/notes", note)
                .success(function() {
                    $scope.text = "";
                    update();
                });
        };*/

        //REST impl of add
        $scope.add = function() {
            if ($scope.text.length == 0) return;

            var note = new Note();
            note.text = $scope.text;
            note.section = $scope.activeSection;
            note.$save(function() {
                $scope.text = "";
                update();
            })
        };

        $scope.addFirst = function() {
            var note = {
                text: $scope.text
            }
            $http.post("/notes/top", note)
                .success(function() {
                    $scope.text = "";
                    update();
                });
        };

        $scope.sendToTop = function(order) {
            $http.post("/notes/top", {params: {order:order}})
                .success(function() {
                    update();
                });
        };

        $scope.remove = function(id) {
            $http.delete("/notes", {params: {id:id}})
                .success(function() {
                    update();
                });
        };

        $scope.showSection = function(section) {
            $location.path(section.title);
            $scope.activeSection = section.title;
            update();
        };

        $scope.writeSections = function() {
            console.log($scope.sections);
            if ($scope.sections && $scope.sections.length > 0) {
                $http.post("/sections/replace", $scope.sections);
            }
        };

        $scope.addSection = function() {
            if ($scope.newSection.length == 0) return;

            //check for duplicates
            for (var i=0; i<$scope.sections.length; i++) {
                if ($scope.sections[i].title==$scope.newSection) {
                    return;
                }
            }

            var section = {title: $scope.newSection};
            if ($scope.sections.length) {
                $scope.sections.unshift(section);
            } else {
                $scope.sections = [];
                $scope.sections.push(section);
            }

            $scope.activeSection = section;
            $scope.newSection = "";
            $scope.writeSections();
            update();
        };

        //update version for section impl
        /*var update = function() {
            var params = {params: {section: $scope.activeSection}};
            $http.get("/notes", params)
                .success(function(notes) {
                    $scope.notes = notes;
                });
        };*/

        //update version for REST
        var update = function() {
            $scope.notes = Note.query({
                section:$scope.activeSection
            });
        };

        /*var update = function() {
            $http.get("/notes")
                .success(function(notes) {
                    $scope.notes = notes;
                });
        };*/

        var readSections = function() {
            $http.get("/sections")
                .success(function(sections) {
                    $scope.sections = sections;

                    if (!$scope.activeSection && $scope.sections.length > 0) {
                        $scope.activeSection = $scope.sections[0].title;
                    }

                    update();
                });
        };

        readSections();
        update();
});

module.factory('Note', function($resource) {
    return $resource('/notes')
});