/**
 * Master Controller
 */

angular.module('RDash')
    .controller('MeCtrl', ['$scope', '$timeout', '$cookieStore', 'backend', MeCtrl]);

function MeCtrl($scope, $timeout, $cookieStore, backend) {


    var self = this;
    self.saving = false;

    self.init = function(){
      $scope.userPromise.then(function(me){
        self.name = $scope.user.name;
        self.picture = $scope.user.picture;
        self.color = $scope.user.playerColor;
      });
    };

    self.save = function(){
      self.saving = true;
      console.log(self.color);
      backend.post("/users/me", {"name": self.name, "picture": self.picture, "playerColor": self.color}).then(function(result){
        $timeout( function(){
          self.saving = false;
        }, 1000 );
        $scope.updateUser();
      }).catch(function(error){
        self.saving = false;
        console.log(error);
      });
    }
}
