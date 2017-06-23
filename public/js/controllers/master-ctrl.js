/**
 * Master Controller
 */

angular.module('RDash')
    .controller('MasterCtrl', ['$scope', '$cookieStore', '$interval', 'backend', MasterCtrl]);

function MasterCtrl($scope, $cookieStore, $interval, backend) {
    /**
     * Sidebar Toggle & Cookie Control
     */
    var mobileView = 992;

    $scope.user = null;

    $interval(function(){
      backend.ping().then(function(){
        //Else Ping was fine
      }).catch(function(error){
        $scope.addNotification(error);
      });

    }, 2000);

    $scope.updateUser = function(){
      $scope.userPromise = backend.get("/users/me");
      $scope.userPromise.then(function(me){
        console.log(me);
        $scope.user = me.db;
      }).catch(function(error){
        console.log(error);
      });
    };
    $scope.updateUser();

    $scope.notifications = [];

    $scope.addNotification = function(notification){
      console.log(notification);
      if($scope.notifications.indexOf(notification) == -1){
        $scope.notifications.push(notification);
        console.log("yay");
      }
    }



    $scope.getWidth = function() {
        return window.innerWidth;
    };

    $scope.$watch($scope.getWidth, function(newValue, oldValue) {
        if (newValue >= mobileView) {
            if (angular.isDefined($cookieStore.get('toggle'))) {
                $scope.toggle = ! $cookieStore.get('toggle') ? false : true;
            } else {
                $scope.toggle = true;
            }
        } else {
            $scope.toggle = false;
        }

    });

    $scope.toggleSidebar = function() {
        $scope.toggle = !$scope.toggle;
        $cookieStore.put('toggle', $scope.toggle);
    };

    window.onresize = function() {
        $scope.$apply();
    };
}
