'use strict';

angular.module('initApp')
  .controller('mainController', function ($scope, $rootScope, $location) {
    var file = 'reclamos.csv';
    $scope.dataset = [];
    $scope.tipos = [];
    $scope.all = [];
    var years = ['2014', '2015', '2016', '2017'];
    for (var i = 0; i < years.length; i++) {
    	var y = years[i];
    	var currentUrl = 'data/' + y + '/' + file;
    	(function(yy,url){
    	d3.csv(url, function(data){
    		$scope.$apply(function(){
	      		$scope.dataset.push({
	      			year:yy,
	      			data:data
	      		});	
	      		$scope.all = $scope.all.concat(data);
	      		$scope.reclamosTema = d3.nest()
			        .key(function(d) {
			          d.Tema = d.Tema.toLowerCase().trim();
			          return d.Tema;
			        })
			        .entries($scope.all);

					$scope.subtemas = d3.nest()
			        .key(function(d) {
			          d["Sub Tema"] = d["Sub Tema"].toLowerCase().trim().replace('- subte','').trim();
			          return d["Sub Tema"];
			        })
			        .entries($scope.all);

		  
		        $scope.estaciones = d3.nest()
			        .key(function(d) {
			          return d["Estación"].toLowerCase().trim();
			        })
			        .entries($scope.all);
			 	$scope.lineas = d3.nest()
			        .key(function(d) {
			          return d["Línea"].toLowerCase().trim();
			        })
			        .entries($scope.all);
			 
      		});


    	});
    	})(y,currentUrl);

    }
    	


}).directive('onFinishRender', function($timeout) {
    return {
      restrict: 'A',
      link: function(scope, element, attr) {
        if (scope.$last === true) {
          $timeout(function() {
            scope.$emit(attr.onFinishRender);
          });
        }
      }
    }
  });