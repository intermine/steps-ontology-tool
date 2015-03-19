define([
    'underscore',
    'dagify',
    '../logic/methods'
    ], function (_, Dagify, methods) {

	'use strict';	
	
  var config = {
    timeout: 200,
    defaultCategory: {
      genomic: 'organism.name'
    },
    categoryName: {
      genomic: 'Organism'
    }
  };
  var connect = intermine.Service.connect;
  // Cache for searches.
  var _searches = {};

  // Return an angularjs controller.
	return ['$scope', '$q', '$cacheFactory', 'connectTo', DagCtrl];
	
  /**
   * @param {Scope} $scope An angularjs scope.
   * @param {Q} $q A Q-like interface.
   * @param {Mines} Mines A mines resource.
   */
	function DagCtrl ($scope, $q, getCache, connectTo) {

    var cache = getCache('ontology-dag.graph');
    var widget = $scope.component = new Dagify(
      {opts: {rankdir: 'bt'}},
      methods
    );

    /** Watches **/

    // Graph depends on the service and the query.
    $scope.$watch('step.data.query', loadGraph);
    $scope.$watch('service', loadGraph);

    $scope.$watch('step.data.service.root', function (root) {
      if (!root) return $scope.service = null;
      connectTo(root).then(function (service) {
        $scope.service = service;
      });
    });

    /** Helper function declarations **/

    function loadGraph() {
      // Wait until we have both a query and a service to run it on.
      if (!($scope.step && $scope.step.data && $scope.step.data.query && $scope.service)) {
        console.log('cannot load graph yet');
        return;

      }
      var queryDefinition = $scope.step.data.query;
      console.log('Loading graph', queryDefinition);
      $q.when($scope.service.query(queryDefinition)).then(function (query) {
        var key = getGraphKey(query), graph = cache.get('key')
        if (graph) {
          return setGraph(graph);
        } else {
          var getGeneIds = fetchGeneIds(query);
          var getNodes = getGeneIds.then(fetchNodes);
          var getEdges = getNodes.then(fetchEdges);
          return $q.all([getNodes, getEdges]).then(function (resolved) {
            var nodes = resolved[0];
            var edges = resolved[1];
            setGraph(cache.put(key, {nodes: nodes, edges: edges}));
          });
        }
      }).then(null, function (err) {
        console.error(err);
      });
    }

    function getGraphKey(query) {
      return $scope.service.root + ':' + query.toXML();
    }

    // Query should be a query for gene.id
    function fetchGeneIds (query) {
      var s = $scope.service;
      return s.values(query);
    }

    function fetchNodes (ids) {
      var s = $scope.service;
      var q = {
        from: 'Gene',
        select: [
          'primaryIdentifier',
          'goAnnotation.ontologyTerm.parents.identifier',
          'goAnnotation.ontologyTerm.parents.name'
        ],
        where: [
          {path: 'Gene', op: 'IN', ids: ids}
        ]
      };
      return s.rows(q).then(function (rows) {
        var terms = rows.map(function (row) {
          return {gene_pid: row[0], identifier: row[1], name: row[2]};
        });
        var byTerm = _.groupBy(terms, 'identifier');
        return _.keys(byTerm).map(function (identifier) {
          var first = byTerm[identifier][0];
          var merged = {
            identifier: identifier,
            name: first.name,
            genes: _.pluck(byTerm[identifier], 'gene_pid')
          };
          return merged;
        });
      });
    }

    function fetchEdges (nodes) {
      var s = $scope.service;
      var idents = nodes.map(function (n) { return n.identifier });
      // TODO - continue
      var q = {
        from: 'OntologyRelation',
        select: [
          'relationship',
          'childTerm.identifier',
          'parentTerm.identifier'
        ],
        where: {
          direct: true,
          'childTerm.identifier': {'ONE OF': idents}
        }
      };
      return s.rows(q).then(function (rows) {
        return rows.map(function (row) {
          return {relationship: row[0], child: row[1], parent: row[2]};
        });
      });
    }

    function setGraph(graph) {
      widget.nodes.reset(graph.nodes, {silent: true});
      widget.edges.reset(graph.edges);
      return graph;
    }
  }


});
