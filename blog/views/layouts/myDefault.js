(function(angular){
  //1:声明模块

  var app = angular.module('mainApp',[
    'ngRoute',

  ]);
  //2:配置路由
  app.config(['$routeProvider',function($routeProvider){
      $routeProvider.when('/',{
        templateUrl:'./index.html',
        controller : 'mainController',
      })
  }]);

//   appModule.config(function($interpolateProvider) {
//   $interpolateProvider.startSymbol('{[{');
//   $interpolateProvider.endSymbol('}]}');
// });
  //3:创建控制器
  app.controller('mainController',['$scope','$route',function($scope,$route){
    $scope.myName = 'abcdef';
  }]);

})(angular);
