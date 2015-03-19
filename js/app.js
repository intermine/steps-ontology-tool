/** Load sub modules, and get a reference to angular **/
define([
    'angular',
    './controllers',
    './services',
    './filters',
    './directives'
  ],
    function (angular) {

	'use strict';
	
	var App = angular.module('ontology-dag-tool', [
    'ontology-dag-tool.controllers',
    'ontology-dag-tool.services',
    'ontology-dag-tool.filters',
    'ontology-dag-tool.directives'
  ]);

  App.config(['$locationProvider', function (locations) {
    locations.html5Mode(true);
  }]);

});
