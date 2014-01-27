app.controller("mainController", function($scope, $http) {

    $scope.apiKey = "600d5c56de4f60c73ea49855370daa30";
    $scope.results = [];
    $scope.filterText = null;
    $scope.genreFilter = null;
    $scope.availableGenres = [];

    $scope.init = function() {
        var today = new Date();
        var apiDate = today.getFullYear() + ("0" + (today.getMonth() + 1)).slice(-2) + "" + ("0" + today.getDate()).slice(-2);
        $scope.URL = 'http://api.trakt.tv/calendar/premieres.json/' + $scope.apiKey +'/' + apiDate +'/' + 30 + '/?callback=JSON_CALLBACK';

        $http.jsonp($scope.URL)
        .success(function(data) {
            angular.forEach(data, function(value, index) {
                var date = value.date;

                angular.forEach(value.episodes, function(tvshow, index){
                   tvshow.date = date;
                   $scope.results.push(tvshow);
                   // Loop through each genre for this episode
                   angular.forEach(tvshow.show.genres, function(genre, index){
                       var exists = false;
                       angular.forEach($scope.availableGenres, function(avGenre, index){
                           if(avGenre === genre){
                                exists = true;
                            }
                        });
                       if(exists === false){
                          $scope.availableGenres.push(genre);
                        }
                    });

                });

            });

            console.log($scope.results);

        }).error(function(error) {
            console.log("Something has gone wrong. " + error);
        });
    };

});
