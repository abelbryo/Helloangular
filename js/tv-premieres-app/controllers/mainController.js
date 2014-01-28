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

                // Add each episodes to results array
                angular.forEach(value.episodes, function(tvshow, index){
                   tvshow.date = date;
                   $scope.results.push(tvshow);
                   
                   // loop through each genre
                   angular.forEach(tvshow.show.genres, function(genre, index){
                       var exists = false; 
                       angular.forEach($scope.availableGenres, function(avGenre, index){
                           if(avGenre == genre) {
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

    $scope.setGenreFilter = function(genre){
        $scope.genreFilter = genre;
    };

    $scope.customOrder = function(tvshow){
        switch($scope.orderField) {
            case "Air Date":
                return tvshow.episode.first_aired;
            case "Rating":
                return tvshow.episode.ratings.percentage;
        }
    };
});

// Adding a custom filter - filter by Genre
app.filter('isGenre', function(){
    return function(input, genre){
        if(typeof genre === 'undefined' || genre === null) {
            return input;
        }else{
            var out = [];
            for(var a = 0; a < input.length; a++){
                for(var b = 0; b < input[a].show.genres.length; b++){
                    if(input[a].show.genres[b] == genre){
                        out.push(input[a]);
                    }
                }
            }
            return out;
        }
    };
});
