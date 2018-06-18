'use strict';

angular.module('initApp')
  .controller('temasController', function ($scope,statsService) {

  statsService.loadAll(function(){
  	$scope.$apply(function(){
  		$scope.reclamos =statsService;
  	});
  });
});