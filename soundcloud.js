var app = angular.module("soundcloud", ['ngSanitize'])
var scapi = "https://crossorigin.me/https://api.soundcloud.com/resolve.json?url="
var client = "&client_id=30cba84d4693746b0a2fbc0649b2e42c"

app.controller("descriptionController", ["$http", function($http) {
  var sc = this
  sc.showJSON = false
  sc.html = []
  sc.submit = function() {
    var callURL = scapi + sc.url + client
    $http.get(callURL)
      .success(function(response) {
        sc.trackJSON = response
        sc.html = JSONtoHTML(response.description)
      })
      .error(function(response) {
        console.log(response)
      })
  }
  sc.toggleJSON = function() {
    sc.showJSON = !sc.showJSON
  }
}])

var JSONtoHTML = function(string) {
  this.HTML = string.split('\n')
  this.HTML.forEach(function(item, index, array) {
    if(item == '') {
      array[index] = '<br>'
    } else if(item.indexOf('http') !== -1) {
      array[index] = addATags(item)
    }
  })
  return this.HTML
}

var addATags = function(string) {
  this.linkStart = string.indexOf('http')
  this.beforeLink = string.substring(0, this.linkStart)
  this.link = string.substring(this.linkStart)
  this.rest = ''
  if(this.link.indexOf(' ') !== -1) {
    this.rest = this.link.substring(this.link.indexOf(' '))
    this.link = this.link.substring(0, this.link.indexOf(' '))
  }
  return this.beforeLink + '<a target="_blank" href=\"' + this.link + '\">' + this.link + '</a>' + this.rest
}
