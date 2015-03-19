define([], function () { return {
  // Nodes are OntologyTerms
  getNodeLabel: function (node) {
    return node.name;
  },
  getNodeID: function (node) {
    return node.identifier;
  },
  // Edges are OntologyRelations
  getEdgeSource: function (edge) {
    return edge.child;
  },
  getEdgeTarget: function (edge) {
    return edge.parent;
  },
  getEdgeLabel: function (edge) {
    return edge.relationship;
  }
}});
