function BackendService($q, http){
  var self = this;
  self.http = http;
  console.log(self.http);
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

  }
}

angular.module('RDash').service('backend', ['$q', '$http', function($q, $http) {
  return new BackendService($q, $http);
}]);
