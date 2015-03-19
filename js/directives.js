define(['angular'], function (ng) {
  var Directives = ng.module('ontology-dag-tool.directives', []);

  // Mimics the operation of the similar tool in steps.
  Directives.directive('backboneView', function () {
    return {
      restrict: 'E',
      scope: {
        component: '=',
        eventHandler: '&'
      },
      link: function (scope, element) {
        var view = scope.component;
        var el = element[0];

        view.setElement(el);
        view.render();

        view.on('all', function (evt) {
          var args = [].slice.call(arguments, 1);
          scope.eventHandler({event: evt, data: args});
        });
        element.on('$destroy', function () {
          view.remove();
        });
      }
    };
  });

  Directives.directive('blurOnClick', function () {
    return {
      restrict: 'A',
      link: function (scope, $element) {
        var el = $element[0];
        if (el.blur) {
          $element.on('click', el.blur.bind(el));
        }
      }
    };
  });

  return Directives;
});
