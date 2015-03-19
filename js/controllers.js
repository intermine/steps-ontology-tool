define(['angular', 'underscore', './controllers/ontology-dag'], function (angular, _, OntologyDagCtrl) {

  'use strict';

	var Controllers = angular.module('ontology-dag-tool.controllers', [])
                           .controller('DemoCtrl',        DemoCtrl)
                           .controller('FacetCtrl',       FacetCtrl)
                           .controller('HeadingCtrl',     HeadingCtrl)
                           .controller('MessagesCtrl',    MessagesCtrl)
                           .controller('SearchInputCtrl', SearchInputCtrl)
                           .controller('OntologyDagCtrl', OntologyDagCtrl);

  /*
   * Controller for the search input.
   */
  function SearchInputCtrl (scope, location) {
    this.location = location;
  }
  SearchInputCtrl.$inject = ['$scope', '$location'];
  SearchInputCtrl.prototype.searchFor = function (term) {
    this.location.search('q', term);
  };

  /*
   * Control for the header.
   */
  function HeadingCtrl (scope) {
    var self = this;
    scope.$watch('state.results', function (results) {
      self.results = results;
    });
  }
  HeadingCtrl.prototype.selectAll = function () {
    this.results.forEach(function (r) {
      r.selected = true;
    });
  };
  HeadingCtrl.$inject = ['$scope'];

  /*
   * Controller for the facets.
   */
  function FacetCtrl () {
  }
  FacetCtrl.prototype.facetCount = function (facetGroup) {
    return Object.keys(facetGroup).length;
  };

  /*
   * Controller for the messages.
   */
  function MessagesCtrl () {
    this.collapsed = true;
  }

  /*
   * The demo controller.
   * Just collects messages issued by 'has'
   */
  function DemoCtrl (scope, timeout, location, queryParams) {

    console.log(queryParams);
    var searchTerm = scope.searchTerm = (queryParams.q || 'eve');
    scope.step     = {
      data: {
        service: {root: 'http://www.flymine.org/query/service'}
      }
    };
    scope.step.data.query = getQuery(searchTerm);
    scope.messages = {ids: {}};
    scope.wantedMsgs = {ids: {}};

    scope.sumAvailable = scope.sumSelected = 0;
    
    scope.$watch('messages', function () {
      var sum = 0;
      _.values(scope.messages.ids).forEach(function (data) {
        sum += data.request.ids.length;
      });
      scope.sumAvailable = sum;
    });

    scope.$on('$locationChangeSuccess', function () {
      var searchTerm = location.search()['q'];
      if (!searchTerm) return;
      console.log("Term is now", searchTerm);
      scope.step.data.query = getQuery(searchTerm);
    });

    function getQuery(searchTerm) {
      return {
        select: ['Gene.id'],
        where: [['Gene', 'LOOKUP', searchTerm]]
      };
    }

    scope.$on('has', function (event, message) {
      // this horror is one of the best arguments for using react.
      if (message.data) {
        scope.messages[message.what][message.key] = message.data;
      } else {
        delete scope.messages[message.what][message.key];
      }
      timeout(function () { // need a new reference to trigger update.
        scope.messages = _.extend({}, scope.messages); 
      });
    });

  }
  DemoCtrl.$inject = ['$scope', '$timeout', '$location', 'queryParams'];

});
