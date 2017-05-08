/**
 * Master Controller
 */

angular.module('RDash')
    .controller('RiskCtrl', ['$scope', '$cookieStore', 'backend', RiskCtrl]);

function RiskCtrl($scope, $cookieStore, backend) {


    var self = this;
    self.cells = null;

    self.currentCell = null;

    self.init = function(){
      $scope.loading = true;
      backend.get("/risk/cells").
      then(function(users){
        console.log(users);
        self.cells = users;
        $scope.loading = false;
      }).catch(function(error){
        console.log(error);
        $scope.loading = false;
      });
    }



    self.showCell = function(cellName){
      if(self.cells){
        for(var i = 0; i < self.cells.length; i++){
          if(self.cells[i].name == cellName){
            self.currentCell = self.cells[i];
            return;
          }
        }

      }
    }
}
