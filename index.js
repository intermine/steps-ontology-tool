// main.js
(function () {
  require.config({
    baseUrl: './js',
    map: {
      '*': {
        css: '../bower_components/require-css/css'
      }
    },
    paths: {
      underscore: '../bower_components/underscore/underscore',
      angular: '../bower_components/angular/angular', 
      dagify: '../bower_components/dagify/app/scripts/widget',
      imjs: '../bower_components/imjs/js/im',
      "angular-route": '../bower_components/angular-route/angular-route',
      "angular-ui": '../bower_components/angular-ui-bootstrap-bower/ui-bootstrap-tpls',
      domReady: '../bower_components/requirejs-domready/domReady',
      pluralize: '../bower_components/pluralize/pluralize'
    },
    shim: {
      'angular': {
        exports: 'angular'
      },
      dagify: ['css!../bower_components/dagify/app/styles/svg.css'],
      'angular-route': ['angular'],
      'angular-ui': ['angular'],
      underscore: {exports: '_'},
    },
    priority: [ 'angular' ]
  });

  require(['domReady!', 'angular', 'app'], function(document, ng) {
    //The call to setTimeout is here as it makes loading the app considerably more reliable.
    // Depending on compilation sequence, various modules were not being found. This is dumb, and
    // a better way ought to be found.
    setTimeout(function () {ng.bootstrap(document, ['ontology-dag-tool']);}, 100);
  });
})();
