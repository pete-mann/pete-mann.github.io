var app = angular.module('app', ['ui.router']);

app.config(function($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise('about');

  $stateProvider.state({
    name: 'about',
    url: '/about',
    template: '<about></about>'
  })
  .state({
    name: 'skills',
    url: '/skills',
    template: '<skills></skills>'
  })
  .state({
    name: 'contact',
    url: '/contact',
    template: '<contact></contact>'
  })
});

app.run(function($rootScope, $state, menuMain){

  $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
    menuMain.setActivePage(toState);
  });

});

app.factory('menuMain', function($state){

  var _watchers = [],
      _callWatchers = function() {
        _watchers.forEach(function(watcher){
          watcher(_pages);
        });
      },
      _pages = [];

  return {
    registerWatcher: function(watcher) {
      _watchers.push(watcher);
    },
    setPages: function(pages) {
      _pages = pages;
      _callWatchers();
    },
    navigate: function(toPage) {
      $state.go(toPage.url);
      _callWatchers();
    },
    setActivePage: function(toPage) {
      _pages.forEach(function(page, index){
        page.active = (toPage.url.includes(page.url)) ? true : false;
      });
    }
  }
})

app.directive('navMain', function(menuMain){
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'templates/nav-main.html',
    link: function($scope) {

      menuMain.registerWatcher(function(pages) {
        $scope.pages = pages;
      });

      menuMain.setPages([
        {
          menuName: 'About me',
          icon: 'far fa-hand-spock',
          url: 'about',
          active: true
        }, {
          menuName: 'My skills',
          icon: 'fas fa-code',
          url: 'skills',
          active: false
        }, {
          menuName: 'Contact me',
          icon: 'far fa-comment-alt',
          url: 'contact',
          active: false
        }
      ]);

      $scope.navigate = menuMain.navigate;

    }
  }
});

app.directive('about', function(){
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'templates/about.html',
    link: function($scope) {

    }
  }
});

app.directive('skills', function(){
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'templates/skills.html',
    link: function($scope) {

      $scope.tabs = [
        {
          id: 'frontEnd',
          tabName: 'Front End',
          actiave: true
        }, {
          id: 'backEnd',
          tabName: 'Back End',
          actiave: false
        }, {
          id: 'dataPersistence',
          tabName: 'Data Persistence',
          actiave: false
        }
      ];

      $scope.selectTab = function(tab){
        $scope.tabs.forEach(function(tab){
          tab.active = false;
        });
        tab.active = true;
      }

    }
  }
});

app.directive('contact', function(){
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'templates/contact.html',
    link: function($scope) {

    }
  }
});
