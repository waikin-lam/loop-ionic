// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'Loop' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('Loop', ['ionic', 'ui.calendar'])

app.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/sign-in')
    
    // when a state is "active", all of its ancestor states are implicitly active as well.
    $stateProvider.state('signin', {
        url: '/sign-in',
        templateUrl: 'sign-in.html',
        controller: 'SignInCtrl'
    })

    $stateProvider.state('app', {
        abstract: true,
        templateUrl: 'main.html'
    })
    
    $stateProvider.state('app.loops', {
        // abstract state will never be directly be activated but provides inherited properties to its common children states.
        abstract: true,
        url: '/loops',
        // views property sets up multiple views within a single state.
        views: {
            loops: {
                template: '<ion-nav-view></ion-nav-view>'
            }
        }   
})
    
    $stateProvider.state('app.loops.index', {
        url: '',
        templateUrl: 'loops.html',
        controller: 'LoopsCtrl'
})
    
    $stateProvider.state('app.loops.detail', {
        url: '/loop',
        templateUrl: 'loop.html',
        controller: 'loopCtrl',
        // resolve - to provide controller with content or data that is custom to the state.
        resolve: {
            //injection of service into resolve function. Service then returns a promise. $stateParams get access to url parameters.
            loop: function($stateParams, loopsService) {
                //getloop is a service method that uses $http to fetch loopsService
        return loopsService.getloop($stateParams.loop)
            }
        }
})
    
    $stateProvider.state('app.help', {
        url: '/help',
        views: {
            help: {
            templateUrl: 'help.html'
            }
        }
})
})

app.factory('loopsService', function() {
  var loops = [
      {title: "Take out the trash", done: true},
      {title: "Do laundry", done: false},
      {title: "Start cooking dinner", done: false}
   ]

  return {
    loops: loops,
    getloop: function(index) {
      return loops[index]
    }
  }
})

//this controller waits for the state to be completely resolved before instantiation
app.controller('LoopsCtrl', function($scope, loopsService) {
      $scope.loops = loopsService.loops
})

app.controller('loopCtrl', function($scope, loop) {
    $scope.loop = loop;
    $scope.eventSources = []
})

app.controller('SignInCtrl', function($scope, $state) {
    $scope.signIn = function(user) {
        console.log('Sign-In', user);
        $state.go('app.loops.index')
    };
})

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})