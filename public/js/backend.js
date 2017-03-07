function BackendService(http){
  var self = this;
  self.http = http;
  console.log(self.http);
  self.get = function(path){
    return new Promise(function (fulfill, reject){
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

angular.module('RDash').service('backend', ['$http', function($http) {
  return new BackendService($http);
}]);
