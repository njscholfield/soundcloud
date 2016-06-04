(function() {
  var app = angular.module("soundcloud", ['ngSanitize'])
  var scapi = "https://api.soundcloud.com/resolve.json?url="
  var client = "&client_id=30cba84d4693746b0a2fbc0649b2e42c"

  app.controller("descriptionController", ["$http", function($http) {
    var sc = this
    sc.showJSON = false
    sc.html = []
    sc.submit = function() {
      var callURL = scapi + sc.url + client
      $http.get(callURL)
        .then(function success(response) {
          processJSON(response)
        }, function error(response) {
          if(response.status === 403) {
            sc.trackJSON = {"error": "The information for this track is not available", "code": 403}
          } else if(response.status === 404) {
            sc.trackJSON = {"error": "Invalid URL, please try again", "code": 404}
          } else {
            $http.jsonp(callURL + '&callback=JSON_CALLBACK')
              .then(function success(response) {
                processJSON(response)
              }, function error(response) {
                sc.trackJSON = {"error": "Something went wrong... This could have been caused by a track for which the information is not available or a server/network problem. Please try again.", "code": "JSONP Response Code " + response.status}
              })
          }
          console.log(response.status + ' ' + response.statusText)
        })
        function processJSON(response) {
          sc.trackJSON = response.data
          sc.html = JSONtoHTML(sc.trackJSON.description)
          sc.tags = processTags(sc.trackJSON.tag_list)
          sc.imgURL = sc.trackJSON.artwork_url.replace('large', 't500x500')
        }
    }
    sc.toggleJSON = function() {
      sc.showJSON = !sc.showJSON
    }
  }])

  var JSONtoHTML = function(string) {
    var HTML = string.split('\n')
    HTML.forEach(function(item, index, array) {
      if(item == '') {
        array[index] = '<br>'
      } else if(item.indexOf('http') !== -1) {
        array[index] = addATags(item)
      }
    })
    return HTML
  }

  var addATags = function(string) {
    var linkStart = string.indexOf('http')
    var beforeLink = string.substring(0, linkStart)
    var link = string.substring(linkStart)
    var rest = ''
    if(link.indexOf(' ') !== -1) {
      rest = link.substring(link.indexOf(' '))
      link = link.substring(0, link.indexOf(' '))
    }
    return beforeLink + '<a target="_blank" href=\"' + link + '\">' + link + '</a>' + rest
  }

  var processTags = function(string) {
    var tags = string.split(' ')
    var result = []
    for(var i = 0; i < tags.length; i++) {
      var text = tags[i]
      if(text.indexOf('\"') !== -1) {
        do {
          text = text + ' ' + tags[i + 1]
          i++
        } while(tags[i].indexOf('\"') === -1)
        text = text.slice(1, -1)
      }
      result.push(text)
    }
    return result
  }
})()
