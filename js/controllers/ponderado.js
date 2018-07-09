'use strict';

angular.module('initApp')
  .controller('ponderadoController', function ($scope, $rootScope,$timeout, $location, statsService) {
   $scope.options = {
        responsive: true,
        color:['#97BBCD', '#DCDCDC', '#F7464A', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360']
    };


  
	$scope.changeOption = function(){
		if ($scope.selectedLinea != 'TODAS'){
      $scope.selectEstacionOption = ['TODAS'].concat(
        statsService.estaciones.filter(function(m){
          return m.values[0]["Línea"].toLowerCase()  === $scope.selectedLinea.toLowerCase();
        }).map(function(m){
          return m.key;
      }).sort());
		}
    else {
      $scope.selectEstacionOption = ['TODAS'].concat(statsService.estaciones.map(function(m){
        return m.key;
      }).sort());
    }

		$scope.serve =  $scope.getFilteredData();
		
    $scope.primerosTres = angular.copy($scope.serve)
                  .sort(function(a,b){
                    return -a.valor + b.valor;
                  }).slice(0,3);
		$scope.ultimosTres = angular.copy($scope.serve)
                  .sort(function(a,b){
                    return +a.valor - b.valor;
                  }).slice(0,3);
    $scope.all = 0;
    $scope.serve.map(function(d){
      $scope.all += d.valor;
    });
    if (!$scope.labels){
      
      var meterColor = d3.scale.linear().domain([0,$scope.serve.length])
                .range([d3.rgb("#dcdcdc"), d3.rgb("#9c0c15")]);

		  $scope.labels = $scope.serve.map(function(t){
			  return toTitleCase(t.categoria);
		  });
      $scope.colors = $scope.serve.map(function(t,i){
        return meterColor(i);
      });

    }
    var total = 0;
		$scope.data = $scope.serve.map(function(t){
      total +=t.valor;
			return t.valor;
		})

    $scope.ordered = $scope.serve.map(function(t){
      t.categoria = toTitleCase(t.categoria);
      t.percentage = Math.round((t.valor * 100 / total) * 100) / 100;
      return t;
    }).sort(function(a,b){
       return d3.descending(a.valor,b.valor);
    });
		
		

    };

    $scope.getFilteredData = function(){
      return  statsService.reclamosTema
      	.map(function(t,i){
  			return {
  					categoria: t.key, 
  					valor: t.values.filter(function(i){

  						var filterYear = true;
  						var filterLinea = true;
  						var filterEstacion = true; 
              var filterMonth = true; 
  						
  						if (!isNaN(parseInt($scope.selectedYear))){
  							filterYear = parseInt(i["Año"]) == $scope.selectedYear;
  						}
              var mes = window.nombresMeses.indexOf($scope.selectedMes);
              if (mes != -1){
               filterMonth = parseInt(i["Mes"]) == (mes+1); 
              }

  						
  					  if ($scope.selectedEstacion != "TODAS"){
  							filterEstacion = i["Estación"].toLowerCase().trim()  == $scope.selectedEstacion;
  							filterLinea = true;
  						}
              else if ($scope.selectedLinea != "TODAS"){
                filterLinea = i["Línea"] == $scope.selectedLinea;
                filterEstacion = true;
              }


  						return filterYear && filterLinea && filterEstacion && filterMonth;
  					}).length
  				}
  			}).sort(function(a,b){
          return d3.ascending(a.categoria,b.categoria);
        });

    };
 	
  


  statsService.loadAll(function(){
  	$scope.$apply(function(){
  		$scope.selectedYear = 'TODOS';
    	$scope.selectOptions = [$scope.selectedYear].concat(statsService.years);
    	$scope.selectedLinea = 'TODAS';
    	$scope.selectLineaOptions = ['TODAS'].concat(statsService.lineas.map(function(m){
    		return m.key;
    	}).sort());
      $scope.selectedMes = 'TODOS';
      $scope.selectMesOption = ['TODOS'].concat(window.nombresMeses);
    	$scope.selectedEstacion = 'TODAS';
    	$scope.selectEstacionOption = ['TODAS'].concat(statsService.estaciones.map(function(m){
    		return m.key;
    	}).sort());
  		$scope.changeOption();
  	});
  });

});