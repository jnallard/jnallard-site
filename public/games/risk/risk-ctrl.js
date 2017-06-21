/**
 * Master Controller
 */

angular.module('RDash')
    .controller('RiskCtrl', ['$scope', '$cookieStore', 'backend', RiskCtrl]);

function RiskCtrl($scope, $cookieStore, backend) {


    var self = this;
    self.cells = null;
    self.players = [];
    self.playerNames = [];
    self.currentCell = null;

    self.init = function(){
      $scope.loading = true;
      backend.get("/risk/cells").
      then(function(users){
        console.log(users);
        self.cells = users;
        $scope.loading = false;

        backend.get("/users").
        then(function(users){
          console.log(users);
          self.players = users;
          self.playerNames = users.map(function(player){ return player.name; });
          self.playerNames.push("[Nobody]");
          self.colorCells();
        }).catch(function(error){
          console.log(error);
        });
      }).catch(function(error){
        console.log(error);
        $scope.loading = false;
      });
    }

    self.colorCells = function(){
      for(var i = 0; i < self.cells.length; i++){
        var cell = self.cells[i];
        console.log(cell);
        player = self.getPlayer(null, cell.owner);
        console.log(player);
        if(player && player.playerColor){
          cell.style = {
            "background-color": hexToRGB(player.playerColor, 0.5)
          }
          console.log(player.playerColor);
        }
      }
    }

    function hexToRGB(hex, alpha) {
      console.log(hex);
      var r = parseInt(hex.slice(1, 3), 16),
        g = parseInt(hex.slice(3, 5), 16),
        b = parseInt(hex.slice(5, 7), 16);

      if (alpha) {
        return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
      } else {
        return "rgb(" + r + ", " + g + ", " + b + ")";
      }
    }

    self.getCell = function(cellName){
      if(self.cells){
        for(var i = 0; i < self.cells.length; i++){
          if(self.cells[i].name == cellName){
            return self.cells[i];
          }
        }
      }
      return null;
    }

    self.showCell = function(cellName){
      var cell = self.getCell(cellName);
      if(cell){
        self.currentCell = cell;
        self.currentCell.ownerName = self.getPlayer(null, cell.owner).name;
        self.playerChosen = self.currentCell.ownerName;
        self.troopChangeAmount = 0;
        return;
      }
    }

    self.updateCell = function(){
      self.saving = true;
      var player = self.getPlayer(self.playerChosen);
      backend.post("/risk/cells", {"name": self.currentCell.name, "owner": player.id, "troops": self.currentCell.troops + self.troopChangeAmount}).then(function(result){
        for(var i = 0; i < self.cells.length; i++){
          if(self.cells[i].name == result.name){
            self.cells[i] = result;
            self.currentCell = self.cells[i];
            self.playerChosen = self.getPlayer(null, result.owner).name;
            self.troopChangeAmount = 0;
            self.colorCells();
            self.saving = false;
            return;
          }
        }
      }).catch(function(error){
        self.saving = false;
        console.log(error);
      });
    }

    self.getPlayer = function(playerName, id){
      for(var i = 0; i < self.players.length; i++){
        if(self.players[i].name == playerName || self.players[i].id == id){
          return self.players[i];
        }
      }
      return {name: "[Nobody]"};
    }
}
