define(['./generic-filter'], function (GenericFilter) {
	'use strict';
	return GenericFilter(function (task) {
		return task.type;
	});
});