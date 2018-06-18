'use strict';

angular.module('initApp')
  .controller('temasController', function ($scope,$rootScope, statsService) {

	$scope.changeOption = function(){
		if ($scope.selectedEstacion != 'TODAS'){
			$scope.selectLinea = 'TODAS';
		}
		else if ($scope.selectLinea != 'TODAS'){
			$scope.selectedEstacion = 'TODAS';
		}
		$scope.serve =  $scope.getFilteredData();
		$scope.primerosTres = $scope.serve.reverse().slice(0,3);
		$scope.ultimosTres = $scope.serve.reverse().slice(0,3);
		$scope.labels = $scope.serve.map(function(t){
			return t.categoria;
		});
		$scope.data = $scope.serve.map(function(t){
			return t.valor;
		})
		
		reloadGraph($scope.serve);
    $scope.getFilteredEstacion();

    };
    $scope.$watch('currentMapEstacion', function(){
    	$scope.getFilteredEstacion();
    })

    $scope.getFilteredEstacion = function(){
      $scope.currentMove = statsService.reclamosTema
      	.map(function(t,i){
  			return {
  					categoria: t.key, 
  					valor: t.values.filter(function(i){

  						var filterYear = true;
  						var filterLinea = true;
  						var filterEstacion = true; 
  						
  						if (!isNaN(parseInt($scope.selectedYear))){
  							filterYear = parseInt(i["Año"]) == $scope.selectedYear;
  						}
  						
							filterEstacion = i["Estación"].toUpperCase().trim()  ==  $scope.currentMapEstacion.estacion;
							filterLinea = true;
  					


  						return filterYear && filterLinea && filterEstacion;
  					}).length
  				}
  			})
      	.sort(function(a,b){
  			return a.valor - b.valor;
  		}).reverse();
    };

    $scope.getFilteredData = function(){
      return  statsService.estaciones
      	.map(function(t,i){
  			return {
  					categoria: t.key, 
  					valor: t.values.filter(function(i){

  						var filterYear = true;
  						var filterLinea = true;
  						var filterEstacion = true; 
  						
  						if (!isNaN(parseInt($scope.selectedYear))){
  							filterYear = parseInt(i["Año"]) == $scope.selectedYear;
  						}

  						if ($scope.selectedLinea != "TODAS"){
  							filterLinea = i["Línea"] == $scope.selectedLinea;
  							filterEstacion = true;
  						}
  						else if ($scope.selectedEstacion != "TODAS"){
  							filterEstacion = i["Estación"].toLowerCase().trim()  == $scope.selectedEstacion;
  							filterLinea = true;
  						}


  						return filterYear && filterLinea && filterEstacion;
  					}).length
  				}
  			})
      	.sort(function(a,b){
  			return a.valor - b.valor;
  		});
    };
  statsService.loadAll(function(){
  	$scope.$apply(function(){
  		$scope.reclamos =statsService;
  		$scope.selectedYear = 'TODOS';
    	$scope.selectOptions = [$scope.selectedYear].concat(statsService.years);
    	$scope.selectedLinea = 'TODAS';
    	$scope.selectLineaOptions = ['TODAS'].concat(statsService.lineas.map(function(m){
    		return m.key;
    	}).sort());
    	$scope.selectedEstacion = 'TODAS';
    	$scope.selectEstacionOption = ['TODAS'].concat(statsService.estaciones.map(function(m){
    		return m.key;
    	}).sort());
  		setTimeout(function(){
        $scope.changeOption();
      },1200);
  	});
  });
});