function BackendService($q, http){
  var self = this;
  self.http = http;
  console.log(self.http);

  self.ping = function(){
    return new $q(function (fulfill, reject){
      self.http({
        method: 'GET',
        url: '/'
      }).then(function successCallback(response) {
        console.log(response);
        if(response.data && response.data.includes("Sign In with Auth0")){
          reject("You have been logged out. Please refresh the page.");
          return;
        }
        fulfill(response);
      }, function errorCallback(response) {
        reject("Cannot connect to server.");
      });
    });

  };

  self.get = function(path){
    return new $q(function (fulfill, reject){
      self.http({
        method: 'GET',
        url: path,
        headers: {
          //cookie: document.cookie
        }
      }).then(function successCallback(response) {
          fulfill(response.data)
      }, function errorCallback(response) {
        reject(response);
      });
    });

  };

  self.post = function(path, json){
    return new $q(function (fulfill, reject){
      self.http({
        method: 'POST',
        url: path,
        data: json,
        headers: {
          "content-type": "application/json"
        }
      }).then(function successCallback(response) {
          fulfill(response.data)
      }, function errorCallback(response) {
        reject(response);
      });
    });
  }
}

angular.module('RDash').service('backend', ['$q', '$http', function($q, $http) {
  return new BackendService($q, $http);
}]);
