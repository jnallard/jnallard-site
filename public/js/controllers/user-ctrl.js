/**
 * Master Controller
 */

angular.module('RDash')
    .controller('UserCtrl', ['$scope', '$cookieStore', 'backend', UserCtrl]);

function UserCtrl($scope, $cookieStore, backend) {


    var self = this;
    self.users = null;

    self.init = function(){
      $scope.loading = true;
      backend.get("/users").
      then(function(users){
        console.log(users);
        self.users = users;
        $scope.$apply();
        $scope.loading = false;
      }).catch(function(error){
        console.log(error);
        $scope.loading = false;
      });
    }
}
