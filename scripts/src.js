var app = angular.module('app', ['ui.router']);

app.config(function($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise('about');

  $stateProvider.state({
    name: 'about',
    url: '/about',
    template: '<about></about>',
    onExit: function(aboutTextAnimationFactory) {
      aboutTextAnimationFactory.stop();
    }
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

app.run(function($rootScope, $state, navMainFactory) {

  $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
    navMainFactory.setActivePage(toState);
  });

});

app.factory('navMainFactory', function($state) {

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

app.factory('aboutTextAnimationFactory', function($interval) {

  var _watchers = [],
      _callWatchers = function() {
        _watchers.forEach(function(watcher){
          watcher(_text);
        });
      },
      _texts = [],
      _animation = null,
      _text = '',
      _curTextIndex = 0,
      _curTextCharIndex = 1,
      _pauseAtEndOfStringDelay = 6,
      _pauseAtEndOfStringDelayCounter = 0,
      incrementCurTextIndex = function() {
        _curTextIndex = (_curTextIndex == _texts.length - 1) ? 0 : _curTextIndex + 1;
        _curTextCharIndex = 1;
        _pauseAtEndOfStringDelayCounter = 0;
        _cursorCounter = 0;
      },
      incrementCurTextCharIndex = function() {
        if(_curTextCharIndex < _texts[_curTextIndex].length) _curTextCharIndex++;
        if(_curTextCharIndex == _texts[_curTextIndex].length) {
          (_pauseAtEndOfStringDelayCounter < _pauseAtEndOfStringDelay) ? _pauseAtEndOfStringDelayCounter++ : incrementCurTextIndex();
        }
      }

  return {
    registerWatcher: function(watcher) {
      _watchers.push(watcher);
    },
    setTexts: function(texts) {
      _texts = texts;
    },
    start: function() {
      _animation = $interval(function() {
        _text = _texts[_curTextIndex].slice(0, _curTextCharIndex);
        incrementCurTextCharIndex();
        _callWatchers();
      }, 200);
    },
    stop: function() {
      $interval.cancel(_animation);
      _animation = undefined;
      _text = '';
      _curTextIndex = 0;
      _curTextCharIndex = 1;
      _pauseAtEndOfStringDelay = 6;
      _pauseAtEndOfStringDelayCounter = 0;
    }
  }
})

app.directive('navMain', function(navMainFactory) {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'templates/nav-main.html',
    link: function($scope) {

      navMainFactory.registerWatcher(function(pages) {
        $scope.pages = pages;
      });

      navMainFactory.setPages([
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

      $scope.navigate = navMainFactory.navigate;

    }
  }
});

app.directive('about', function(aboutTextAnimationFactory) {

  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'templates/about.html',
    link: function($scope) {

      aboutTextAnimationFactory.setTexts([
        'Hello World!',
        'I\'m a software engineer',
        'I love to code'
      ]);

      aboutTextAnimationFactory.registerWatcher(function(text) {
        $scope.animatedText = text;
      });

      aboutTextAnimationFactory.start();

    }
  }
});

app.directive('skills', function() {
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

app.directive('contact', function() {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'templates/contact.html',
    link: function($scope) {

    }
  }
});
