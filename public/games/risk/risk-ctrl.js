/**
 * Master Controller
 */

angular.module('RDash')
    .controller('RiskCtrl', ['$scope', '$cookieStore', '$interval', 'backend', RiskCtrl]);

function RiskCtrl($scope, $cookieStore, $interval, backend) {


    var self = this;
    self.cells = null;
    self.players = [];
    self.playerNames = [];
    self.currentCell = null;

    self.init = function(){
      $scope.loading = true;
      backend.get("/risk/cells").
      then(function(users){
        self.cells = users;
        $scope.loading = false;

        backend.get("/users").
        then(function(users){
          self.players = users;
          self.playerNames = users.map(function(player){ return player.name; });
          self.playerNames.push("[Nobody]");
          self.colorCells();

          self.interval = $interval(self.refreshCells, 5000);
        }).catch(function(error){
          console.log(error);
        });
      }).catch(function(error){
        console.log(error);
        $scope.loading = false;
      });
    }


    $scope.$on('$destroy',function(){
      if(self.interval){
        $interval.cancel(self.interval);
      }
    });

    self.refreshCells = function(){
      backend.get("/risk/cells").
      then(function(users){
        self.cells = users;
        self.colorCells();
        if(self.currentCell){
          var cell = self.getCell(self.currentCell.name);
          if(cell.revisionId != self.currentCell.revisionId){
            self.disableSave = true;
            self.showCell(self.currentCell.name);
            self.cellWarning = "This cell has been updated!";
          }
        }
      }).catch(function(error){
        console.log(error);
        $scope.addNotification("Could not refresh risk board");
      });
    }

    self.colorCells = function(){
      for(var i = 0; i < self.cells.length; i++){
        var cell = self.cells[i];
        player = self.getPlayer(null, cell.owner);
        if(player && player.playerColor){
          cell.style = {
            "background-color": self.hexToRGB(player.playerColor, 0.5)
          }
          console.log(player.playerColor);
        }
      }
    }

    self.hexToRGB = function(hex, alpha) {
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

    self.getTroopDailyValue = function(id){
      return Math.floor(self.getCellsOwnedBy(id).length / 2) + 2;
    }

    self.getCellsOwnedBy = function(id){
      var cells = [];
      if(self.cells){
        for(var i = 0; i < self.cells.length; i++){
          if(self.cells[i].owner == id){
            cells.push(self.cells[i]);
          }
        }
      }
      return cells;
    }

    self.showCell = function(cellName){
      self.cellWarning = null;
      var cell = self.getCell(cellName);
      if(cell){
        self.currentCell = cell;
        self.currentCell.ownerName = self.getPlayer(null, cell.owner).name;
        self.playerChosen = self.currentCell.ownerName;
        self.troopsAmount = self.currentCell.troops;
        return;
      }
    }

    self.updateCell = function(){
      self.saving = true;
      self.savingError = null;
      var player = self.getPlayer(self.playerChosen);
      backend.post("/risk/cells", {"name": self.currentCell.name, "owner": player.id, "troops": self.troopsAmount, "revisionId": self.currentCell.revisionId}).then(function(result){
        for(var i = 0; i < self.cells.length; i++){
          if(self.cells[i].name == result.name){
            self.cells[i] = result;
            self.currentCell = self.cells[i];
            self.playerChosen = self.getPlayer(null, result.owner).name;
            self.currentCell.ownerName = self.playerChosen;
            self.troopsAmount = self.currentCell.troops;
            self.colorCells();
            self.saving = false;
            return;
          }
        }
      }).catch(function(error){
        self.saving = false;
        self.savingError = error.data;
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
