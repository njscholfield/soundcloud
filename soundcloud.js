var app = angular.module("soundcloud", [])
var scapi = "https://crossorigin.me/https://api.soundcloud.com/resolve.json?url="
var client = "&client_id=30cba84d4693746b0a2fbc0649b2e42c"

app.controller("descriptionController", ["$http", function($http) {
  var sc = this
  sc.showJSON = false
  sc.submit = function() {
    var callURL = scapi + sc.url + client
    $http.get(callURL)
      .success(function(response) {
        sc.trackJSON = response
      })
      .error(function(response) {
        console.log(response)
      })
  }
  sc.toggleJSON = function() {
    sc.showJSON = !sc.showJSON
  }
}])
