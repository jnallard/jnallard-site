/**
 * Master Controller
 */

angular.module('RDash')
    .controller('RiskCtrl', ['$scope', '$cookieStore', '$interval', 'backend', RiskCtrl]);

function RiskCtrl($scope, $cookieStore, $interval, backend) {


    var self = this;

    self.resetBoard = function(){
      self.cells = null;
      self.cellNames = [];
      self.neighbors = {};
      self.players = [];
      self.playerNames = [];
      self.currentCell = null;
      self.largeMap = false;
    };
    self.resetBoard();

    self.getRows = function(){
      if(!self.largeMap){
        return  ["A", "B", "C", "D", "E"];
      }
      return ["A", "B", "C", "D", "E", "F", "G"];
    }

    self.getColumns = function(cellRow){
      var array = [];
      var columnCount = 6;
      if(self.largeMap){
        columnCount = 12;
      }
      for(var i = 0; i < columnCount; i++){
        array.push(cellRow + (i + 1));
      }
      return array;
    }

    self.init = function(){
      $scope.loading = true;
      backend.get("/risk/games/").then(function(games){
        self.games = games;
        self.game = games[0];
        self.loadGame();
      }).catch(function(){

      });
    };

    self.loadGame = function(){
      self.resetBoard();
      self.largeMap = self.game.size == "large";
      self.currentCell = null;
      $scope.loading = true;
      backend.get("/risk/games/" + self.game.id + "/cells").then(function(cells){
        self.cells = cells;
        self.cellNames = self.cells.map(function(cell){ return cell.name;});
        $scope.loading = false;

        backend.get("/users").then(function(users){
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
      self.getLinks();
    }

    self.getLinks = function(){
      self.neighbors = {};
      backend.get("/risk/games/" + self.game.id + "/links").
      then(function(links){
        self.links = links;

        for(var i = 0; i < links.length; i++){
          var link = links[i];
          self.addNeighbor(link.cell1, link.cell2);
          self.addNeighbor(link.cell2, link.cell1);
        }

        if(self.currentCell){
          self.currentNeighbors = self.getNeighbors(self.currentCell.name);
        }

      }).catch(function(error){
        console.log(error);
      });
    }

    self.getNeighbors = function(cellName){
      if(!self.neighbors[cellName]){
        return [];
      }
      return self.neighbors[cellName].map(function(neighbor){return neighbor});
    }

    self.addNeighbor = function(thisCell, neighbor){
      if(!self.neighbors[thisCell]){
        self.neighbors[thisCell] = [];
      }

      self.neighbors[thisCell].push(neighbor);
    }

    self.isNeighbor = function(cellName){
      if(!self.currentCell){
        return false;
      }
      var neighborList = self.neighbors[self.currentCell.name];
      return neighborList != null && neighborList.indexOf(cellName) != -1;
    }


    $scope.$on('$destroy',function(){
      if(self.interval){
        $interval.cancel(self.interval);
      }
    });

    self.refreshCells = function(){
      backend.get("/risk/games/" + self.game.id + "/cells").
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

    self.getCellDiplomacy = function(cellName){
      var cell = self.getCell(cellName);
      if(!cell || !cell.owner){
        return 0; //Unowned
      }
      if(cell.owner != $scope.user.id){
        return -1; //Enemy
      }
      return 1; //Owns cell
    }

    self.showCell = function(cellName){
      self.currentNeighbors = [];
      self.cellWarning = null;
      var cell = self.getCell(cellName);
      if(cell){
        self.currentCell = cell;
        self.currentCell.ownerName = self.getPlayer(null, cell.owner).name;
        self.playerChosen = self.currentCell.ownerName;
        self.troopsAmount = self.currentCell.troops;
        self.cellActive = self.currentCell.active;
        self.newCellDescription = self.currentCell.description;
        self.currentNeighbors = self.getNeighbors(self.currentCell.name);
        return;
      }
    }

    self.updateCell = function(){
      self.saving = true;
      self.savingError = null;
      var player = self.getPlayer(self.playerChosen);
      backend.post("/risk/games/" + self.game.id + "/cells", {"name": self.currentCell.name, "owner": player.id,
      "troops": self.troopsAmount, "description": self.newCellDescription, "active": self.cellActive, "revisionId": self.currentCell.revisionId}).then(function(result){
        for(var i = 0; i < self.cells.length; i++){
          if(self.cells[i].name == result.name){
            self.cells[i] = result;
            self.currentCell = self.cells[i];
            self.playerChosen = self.getPlayer(null, result.owner).name;
            self.currentCell.ownerName = self.playerChosen;
            self.troopsAmount = self.currentCell.troops;
            self.newCellDescription = self.currentCell.description;
            self.cellActive = self.currentCell.active;
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

    self.updateLinks = function(){
      self.saving = true;
      self.savingLinksError = null;
      backend.post("/risk/games/" + self.game.id + "/links", {"target": self.currentCell.name, "neighbors": self.currentNeighbors}).then(function(result){
        self.currentNeighbors = [];
        self.saving = false;
        self.getLinks();

      }).catch(function(error){
        self.saving = false;
        self.savingLinksError = error.data;
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

    self.rollDice = function(){
      return Math.floor(getRandom() * 6) + 1;
    }

    self.battle = function(attackingCount, defendingCount){
      var result = {};
      result.startingAttackers = attackingCount;
      result.startingDefenders = defendingCount;
      result.remainingAttackers = attackingCount;
      result.remainingDefenders = defendingCount;

      result.fights = [];

      var fightNumber = 0;

      while(result.remainingAttackers > 0 && result.remainingDefenders > 0){
        var fight = self.fight(Math.min(result.remainingAttackers, 3), Math.min(result.remainingDefenders, 2));
        fightNumber++;
        result.remainingAttackers -= fight.attackersLost;
        result.remainingDefenders -= fight.defendersLost;
        fight.remainingAttackers = result.remainingAttackers;
        fight.remainingDefenders = result.remainingDefenders;
        fight.fightNumber = fightNumber;
        result.fights.push(fight);
      }
      return result;
    }

    self.fight = function(attacking, defending){
      var result = {};
      result.attackingDice = Array.apply(null, {length: attacking}).map(self.rollDice).sort(sortNumber);
      result.defendingDice = Array.apply(null, {length: defending}).map(self.rollDice).sort(sortNumber);
      result.attackersLost = 0;
      result.defendersLost = 0;
      for(var i = 0; i < attacking && i < defending; i++){
        if(result.attackingDice[i] > result.defendingDice[i]){
          result.defendersLost += 1;
        }
        else{
          result.attackersLost += 1;
        }
      }
      return result;
    }

    function sortNumber(a,b) {
      return b - a;
    }

    function getRandom() {
      var randomCounts = 10;
      var randoms = Array.apply(null, {length: randomCounts}).map(Math.random);
      return randoms[Math.floor(Math.random() * randomCounts)];

    }
}
