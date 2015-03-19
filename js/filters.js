define([
  'angular',
  'underscore',
  'pluralize'
	], function (ng, _, pluralize) {
		
	'use strict';

  var Filters = ng.module('ontology-dag-tool.filters', []);

  // Return an array of values, each of which has a $key property.
  Filters.filter('mappingToArray', function() { return function(obj) {
    if (!(obj instanceof Object)) return obj;
    return _.map(obj, function(val, key) {
      return Object.defineProperty(val, '$key', {__proto__: null, value: key});
    });
  }});

  Filters.filter('pluralize', function () { return function (thing, n) {
    return pluralize(thing, n, true);
  }});

  return Filters;
});
