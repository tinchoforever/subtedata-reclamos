'use strict';

/* Filters */
angular.module('initApp').factory('statsService', function($http, $filter) {

	var factory = {

		
		loadAll: function(cb){
			var file = 'reclamos.csv';
		    factory.dataset = [];
		    factory.tipos = [];
		    factory.all = [];
		    factory.years = [2014, 2015, 2016, 2017];
		    
		    async.each(factory.years, function(z, callback) {
		    	var url = 'data/' + z+ '/' + file;
		      	d3.csv(url, function(data){
		      		console.log(data.length);
		      		   		factory.dataset.push({
			      			year:z,
			      			data:data
			      		});	
			      		factory.all = factory.all.concat(data);
			  		callback();
				});
			  // return year;
			}, function(results, err) {
			    
   	    		factory.reclamosTema = d3.nest()
		        .key(function(d) {
		          d.Tema = d.Tema.toLowerCase().trim();
		          return d.Tema;
		        })
		        .entries(factory.all);


				factory.subtemas = d3.nest()
		        .key(function(d) {
		          d["Sub Tema"] = d["Sub Tema"].toLowerCase().trim().replace('- subte','').trim();
		          return d["Sub Tema"];
		        })
		        .entries(factory.all);

		  
		        factory.estaciones = d3.nest()
			        .key(function(d) {
			          return d["Estación"].toLowerCase().trim();
			        })
			        .entries(factory.all);
		 		factory.lineas = d3.nest()
			        .key(function(d) {
			        	if (!d['Línea']){
			        		console.log('no linea', d);
			        	}
			        	else {
			        		d['Línea'] = d['Línea'].replace('LINEA','').trim();
			        		
			        	}
			          
			          return d['Línea'];
			        })
		        .entries(factory.all);


		        factory.lineas.map(function(l){
		        	//year
		        	// Año,Fecha,Mes,Día de la semana,Día,Tema,Sub Tema,Línea,Estación
		        	l.years = d3
		        		.nest()
			        	.key(function(d) {
        					return d['Año'];
		        		})
		        		.entries(l.values);
		        		//MESES
			        	l.years.map(function(y){
			        		y.months = d3
			        		.nest()
				        	.key(function(d) {
	        					return d['Mes'];

			        		})
			        		.entries(y.values);
			        	//temas 
		        		y.months.map(function(m){
			        		 m.temas = d3.nest()
			        			.key(function(d) {
					         	 d["Sub Tema"] = d["Sub Tema"].toLowerCase().trim().replace('- subte','').trim();
		          				return d["Sub Tema"];
					        })
					        .entries(m.values);
					        //ordeno de mayor a menor
					        m.temas = m.temas.sort(function(a,b){
  								return -a.values.length+  b.values.length
  							});
		        		});
		        	});

		        });



			 	cb();
			});
		},			
	}


	return factory;
});
