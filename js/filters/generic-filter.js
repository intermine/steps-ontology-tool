define([], function () {

	'use strict';

	return function FacetFilter (getField) { // filter factory factory
    return function getFilter (facets) {   // filter factory
      return function matches (x) {        // the filter
        return !facets || facets.length === 0 || facets.some(function (f) { return f.value === getField(x); });
      };
    }
	}
});
