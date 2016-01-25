// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'Loop' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('Loop', ['ionic', 'ui.calendar', 'firebase'])

//manages the parent-child view states
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
        templateUrl: 'main.html',
        controller: 'MainCtrl'
    })
    
    $stateProvider.state('app.mycalendar', {
        url: '/mycalendar',
        views: {
            mycalendar: {    
                templateUrl: 'mycalendar.html',
                controller: 'MyCalendarCtrl'
            }
        }
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
        url: '/loop/:index',
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
    
$stateProvider.state('app.settings', {
        url: '/settings',
        views: {
            settings: {
                templateUrl: 'settings.html',
                controller: 'SettingsCtrl'
            }
        }
    })
                         
})

//services are substitutable objects wired together using dependency injection and are used to organise and share code across app
//service factory function generates the single object or function that represents the service to the rest of the app
app.factory('loopsService', function() {
    //private variable loops, outside of return
  var loops = [
      {title: "Family", done: false},
      {title: "Futsal Buddies", done: false},
      {title: "Uniten", done: false}
   ]

  return {
    loops,
      //allows grabbing a single loop by index
    getloop: function(index) {
      return loops[index]
    }
  }
})

//create a loops factory with a get method
app.factory('loopsFactory', ["$firebaseObject", function($firebaseObject) {
    return function(loop) {
        //create a reference to the database node where we store data
        var ref = new Firebase("https://vivid-heat-1234.firebaseio.com");
        var loopRef = ref.child(loop);
        
        //return as a synchronized object
        return $firebaseObject(loopRef);
    };
}])

app.controller('MainCtrl', function($scope) {
// .fromTemplateUrl() method
//$ionicPopover.fromTemplateUrl('my-popover.html', {
  //  scope: $scope
  //}).then(function(popover) {
    //$scope.popover = popover;
  //});
})

//this controller waits for the state to be completely resolved before instantiation
app.controller('LoopsCtrl', function($scope, $ionicPopover, $ionicPopup, loopsFactory) {
    //scope for left side tab delete
    $scope.data = {
        showDelete: false
    };
    $scope.loops = loopsFactory("loops");
        //$scope.loops = loopsService.loops;
        // from TemplateUrl() method
    $ionicPopover.fromTemplateUrl('loops-popover.html', {
        scope: $scope
    }).then(function(popover) {
        $scope.popover = popover;
    });
    //scope onItemDelete minus tab on nav-bar, with popup confirm
    $scope.onItemDelete = function(key) {
       var ref = new Firebase('https://vivid-heat-1234.firebaseio.com/loops');
        var newRef = ref.child(key);
        var confirmPopup = $ionicPopup.confirm({
            title: 'Delete Loop',
            template: 'Are you sure you want to close this loop?',
            cancelText: 'No',
            cancelType: 'button-default',
            okText: 'Yes',
            okType: 'button-positive'
        });
        confirmPopup.then(function(res) {
            if(res) {
                newRef.remove()
            } else
                {
                    
                }
        });
    };
    //function to splice loop array (TO REDESIGN THIS ELEMENT)
    $scope.DeleteLoop = function(loop) {  
 $scope.loops.splice($scope.loops.indexOf(loop), 1);
    };
    //showConfirm popup to delete loop
    $scope.showConfirm = function() {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Delete Loop',
            template: 'Are you sure you want to close this loop?',
            cancelText: 'No',
            cancelType: 'button-default',
            okText: 'Yes',
            okType: 'button-positive'
        });
        confirmPopup.then(function(res) {
            if(res) {
                $scope.DeleteLoop(); //does not delete the correct loop yet!
            } else {
                //revert back, no action
            }
        });
    };
    //function to add loop to list
    $scope.addLoop = function(newLoop) {
        var ref = new Firebase('https://vivid-heat-1234.firebaseio.com/loops/');
        //var loopRef = ref.child("loops");
        ref.push({
            name: newLoop
    });
        newLoop = '';
        console.log(newLoop);
    };
})

app.controller('loopCtrl', function($scope, loop, $ionicPopover) {
    //$scope.loop = loop;
    $scope.eventSources = [];
    // from TemplateUrl() method
    $ionicPopover.fromTemplateUrl('loop-popover.html', {
        scope: $scope
    }).then(function(popover) {
        $scope.popover = popover;
    });
    //function to add event details to loops
    $scope.addEvent = function(eventName, eventDate, eventLocation) {
      var ref = new Firebase('https://vivid-heat-1234.firebaseio.com/loops/');
      var newRef = ref.child(key);
      ref.push({
            title: eventName,
            date: eventDate,
            location: eventLocation
        });
        eventName: '';
        eventDate: '';
        eventLocation: '';
        console.log(eventName);
    };
})


app.controller('MyCalendarCtrl', function($scope, $ionicPopover) {
    $scope.eventSources = [];
        $ionicPopover.fromTemplateUrl('my-popover.html', {
        scope: $scope
    }).then(function(popover) {
        $scope.popover = popover;
    });
    //config calendar
    $scope.uiConfig = {
        calendar: {
            height: 350,
            editable: true,
            events: {
                url: 'https://vivid-heat-1234.firebaseio.com',
                error: function() {
                    alert('there was an error while fetching events!');
                }
            },
        dayClick: $scope.alertEventOnClick,
        eventDrop: $scope.alertOnDrop,
        eventResize: $scope.alertOnResize
      }
    };
})

app.controller('SignInCtrl', function($scope, $state) {

    $scope.data = {};
    
    $scope.signupEmail = function() {
        var ref = new Firebase("https://vivid-heat-1234.firebaseio.com");
        
        ref.createUser({
            email: $scope.data.email,
            password: $scope.data.password }, function(error, userData) {
            if (error) {
                console.log("Error creating user:", error);
            } else {
                console.log("Successfully created user account with uid:", userData.uid);
            $state.go('app.loops.index');
            }
        });
    };
    
    $scope.loginEmail = function() {
        var ref = new Firebase("https://vivid-heat-1234.firebaseio.com");
        
        ref.authWithPassword({
            email: $scope.data.email,
            password: $scope.data.password }, function(error, authData) {
            if (error) {
                console.log("Login Failed!", error);
            } else {
                console.log("Authenticated successfully with payload:", authData);
            }
            $state.go('app.loops.index');
        });
    };
})

//controller for settings tab
app.controller('SettingsCtrl', function($scope, $state) {
    $scope.logOut = function() {
        var ref = new Firebase("https://vivid-heat-1234.firebaseio.com");
        ref.unauth();
        $state.go('signin');
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

//custom directive to hide tab bar
.directive('hideTabBar', function($timeout) {
  var style = angular.element('<style>').html(
    '.has-tabs.no-tabs:not(.has-tabs-top) { bottom: 0; }\n' +
    '.no-tabs.has-tabs-top { top: 44px; }');
  document.body.appendChild(style[0]);
  return {
    restrict: 'A',
    compile: function(element, attr) {
      var tabBar = document.querySelector('.tab-nav');
      return function($scope, $element, $attr) {
        var scroll = $element[0].querySelector('.scroll-content');
        $scope.$on('$ionicView.beforeEnter', function() {
          tabBar.classList.add('slide-away');
          scroll.classList.add('no-tabs');
        })
        $scope.$on('$ionicView.beforeLeave', function() {
          tabBar.classList.remove('slide-away');
          scroll.classList.remove('no-tabs')
        });
      }
    }
  };
})
//end of custom directive

//hides previous/next/done bar that appears above keyboard
.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {    
        if(window.cordova) {
            cordova.plugins && cordova.plugins.Keyboard && cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if(window.StatusBar) {
            StatusBar.styleDefault();
    }
    });
})

//keyboard custom directive
.directive('input', function($timeout) {
    return {
        restrict: 'E',
        scope: {
            'returnClose': '=',
            'onReturn': '&',
            'onFocus': '&',
            'onBlur': '&'
        },
        link: function(scope, element, attr){
            element.bind('focus', function(e){
                if(scope.onFocus){
                    $timeout(function(){
                        scope.onFocus();
                    });
                }        
            });
            element.bind('blur', function(e){
                if(scope.onBlur){
                    $timeout(function(){
                        scope.onBlur();
                    });
                }
            });
            element.bind('keydown', function(e){
                if(e.which == 13){
                    if(scope.returnClose) element[0].blur();
                    if(scope.onReturn){
                        $timeout(function(){
                            scope.onReturn();
                        });                        
                    }
                } 
            });   
        }
    }
});

