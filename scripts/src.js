var app = angular.module('app', ['ui.router']);

app.config(function($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise("/about");

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

app.directive('navMain', function($state){
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'templates/nav-main.html',
    link: function($scope) {

      $scope.pages = [
        {
          menuName: 'About me',
          icon: 'fa-hand-spock',
          url: 'about',
          active: true
        }, {
          menuName: 'My skills',
          icon: 'fa-comment-alt',
          url: 'skills',
          active: false
        }, {
          menuName: 'Contact me',
          icon: 'fa-comment-alt',
          url: 'contact',
          active: false
        }
      ];

      $scope.navigate = function(page){
        $scope.pages.forEach(function(page){
          page.active = false;
        });
        page.active = true;
        $state.go(page.url);
      }

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

    }
  }
});

app.directive('contact', function(){
  return {
    restrict: 'E',
    replace: true,
    template: 'templates/contact.html',
    link: function($scope) {

    }
  }
});
