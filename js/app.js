var app = angular.module('app', ['ui.router', 'ngAnimate']);

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

      $scope.skills = {
        frontEnd: {
          text: 'I like Bootstrap',
          skillsList: [
            {
              icon: 'fab fa-html5',
              text: 'HTML'
            }, {
              icon: 'fab fa-css3-alt',
              text: 'CSS'
            }, {
              icon: 'fab fa-less',
              text: 'LESS'
            }, {
              icon: 'fab fa-angular',
              text: 'Angular 1'
            }, {
              icon: '',
              text: 'Bootstrap 3'
            }, {
              icon: '',
              text: 'jQuery'
            }, {
              icon: 'fab fa-js',
              text: 'Javascript'
            }, {
              icon: 'fab fa-html5',
              text: 'HTML'
            }, {
              icon: 'fab fa-npm',
              text: 'NPM'
            }
          ]
        },
        backEnd: {
          text: 'I like Expressjs',
          skillsList: [
            {
              icon: 'fab fa-node',
              text: 'Node JS'
            }, {
              icon: '',
              text: 'Express JS'
            }, {
              icon: 'fab fa-linux',
              text: 'Unix & Linux'
            }, {
              icon: 'fab fa-github',
              text: 'Github & GIT'
            }, {
              icon: 'fab fa-docker',
              text: 'Docker & Vagrant'
            }, {
              icon: 'fab fa-digital-ocean',
              text: 'Digital Ocean'
            }, {
              icon: '',
              text: 'PHP'
            }, {
              icon: '',
              text: 'MYSQL'
            }, {
              icon: '',
              text: 'MongoDB'
            }, {
              icon: '',
              text: 'Apache'
            }, {
              icon: '',
              text: 'Nginx'
            }
          ]
        },
        devOps: {
          text: 'I like Nodejs',
          skillsList: [
            {
              icon: 'fab fa-node',
              text: 'Node JS'
            }
          ]
        }
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
