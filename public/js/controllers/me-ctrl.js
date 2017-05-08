/**
 * Master Controller
 */

angular.module('RDash')
    .controller('MeCtrl', ['$scope', '$cookieStore', 'backend', MeCtrl]);

function MeCtrl($scope, $cookieStore, backend) {


    var self = this;

    self.init = function(){
      $scope.userPromise.then(function(me){
        self.name = $scope.user.name;
        self.picture = $scope.user.picture;
      });
    };

    self.save = function(){
      backend.post("/users/me", {"name": self.name, "picture": self.picture}).then(function(result){
        $scope.updateUser();
      }).catch(function(error){
        console.log(error);
      });
    }
}
