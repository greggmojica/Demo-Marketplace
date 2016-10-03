'use strict';

angular.module('store', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/store', {
    templateUrl: 'public/store/store.html',
    controller: 'storeCtrl'
  });
}])

.factory("shoppingcart", [function() {
    return {};
}])

.controller('storeCtrl', ["$scope","$http", "myService", function ($scope, $http, myService) {
  $scope.categories = [];
  $scope.products = [];

if (myService.get().length > 0) {
  console.log('items in cart');
}
  $http({
    method: 'GET',
    url: 'https://stage.services.firstdata.com//v1/categories'
  }).then(function successCallback(response) {
      for (var i = 0; i < response.data.length; i++) {
        //console.log(response.data[i]);
        $scope.categories.push(response.data[i]);
      }
    }, function errorCallback(response) {
        //alert('An error occurred. Please refresh the page');
    });

    $http({
      method: 'GET',
      url: 'https://dev.services.firstdata.com/v1/products/386/company/'
    }).then(function successCallback(response) {
      //console.log('%o', response);
        for (var i = 0; i < response.data.length; i++) {
          //console.log(response.data[i]);
          $scope.products.push(response.data[i]);
        }
      }, function errorCallback(response) {
        //alert('1 error occurred. Please refresh the page');
      });

}]);
