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
        url: "/:loop",
        templateUrl: 'loop.html',
        controller: 'loopCtrl',
        // in Angular digest cycle, the controller code is run last
        // this resolve step is an easy way to make data available before the route is rendered
        // resolve - to provide controller with content or data that is custom to the state.
        // resolve is an object whose keys map to values that can be injected in the state's controller
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
app.factory('loopsService', function($firebaseObject) {
    //private variable loops, outside of return
  var loops = []
  return {
    loops: loops,
      //allows grabbing a single loop by index
    getloop: function(index) {
      return loops[index]
    }
  }
    //var ref = new Firebase('https://vivid-heat-1234.firebaseio.com/loops');
    //return {
    //getLoop: function(key) {
      //return $firebaseObject(ref.child(key));
    //}
  //}
})

//create a loops factory with a get method
app.factory('loopsFactory', ["$firebaseObject", function($firebaseObject) {
    //create a reference to the database node where we store data
    var ref = new Firebase("https://vivid-heat-1234.firebaseio.com/");
    
    return function(loop) { 
        var loopRef = ref.child(loop);
        //return as a synchronized object
        return $firebaseObject(loopRef);
    };
}])

// (NOT USED) create a userID service
app.factory('userService', function() {
    var userID = [];
    
    return {
        userID: function() {
        //obtain authenticated details
        var ref = new Firebase("https://vivid-heat-1234.firebaseio.com");
        ref.onAuth(function(userData){
        if (userData) {
            var userID = userData.uid;
            console.log(userID); //successful
            } else {
            };
        });
            console.log(userID); //empty
            return userID;
            
      }
    };
})

app.controller('MainCtrl', function($scope) {
// .fromTemplateUrl() method
//$ionicPopover.fromTemplateUrl('my-popover.html', {
  //  scope: $scope
  //}).then(function(popover) {
    //$scope.popover = popover;
  //});
})

//this controller waits for the state to be completely resolved before instantiation
app.controller('LoopsCtrl', function($scope, $ionicPopover, $ionicPopup, loopsFactory, userService) {
    
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
    
    //function to add loop to list and save it to multiple locations in the database
    $scope.addLoop = function(newLoop) {
        var root = new Firebase("https://vivid-heat-1234.firebaseio.com");
        var uid = {};
        //retrieve user unique id from users node
        var userData = root.getAuth();
        var uid = userData.uid;
        console.log(uid); //success!
        
        // an atomic update to various locations upon introduction of a new loop
        // generate a new push ID for the new loop
        var newLoopRef = root.child("/loops").push();
        var newLoopKey = newLoopRef.key();
        
        // create the data we want to update
        var newLoopName = {};
        newLoopName["/loops/" + newLoopKey] = {
            name: newLoop
        };
        root.child("members").child(newLoopKey).child(uid).set(true);
        root.child("users").child(uid).child("loops").child(newLoopKey).set(true);
        
        // perform a deep-path update
        root.update(newLoopName, function(error) {
            if (error) {
                console.log("Error updating data:", error)
            }
        });
    };
})

app.controller('loopCtrl', function($scope, loop, $ionicPopover, $stateParams, loopsService) {
    $scope.loop = loop;
    console.log($stateParams);
    
    //attempt to designate loop URL with unique ID
    //var key = $stateParams.id;
    //$scope.loop = loopsService.getLoop(key);
    //var ref = new Firebase("https://vivid-heat-1234.firebaseio.com/loops");
    //ref.once("value", function(snapshot) {
        //var data = snapshot.val();
        
    //})
    //initialize calendar view
    $scope.eventSources = [];
    
    // from TemplateUrl() method
    $ionicPopover.fromTemplateUrl('loop-popover.html', {
        scope: $scope
    }).then(function(popover) {
        $scope.popover = popover;
    });
    //function to add event details to loops
    $scope.addEvent = function(eventName, eventDate, eventLocation) {
      var root = new Firebase('https://vivid-heat-1234.firebaseio.com');
        root.child('uid').set(eventName);
        
    };
})


app.controller('MyCalendarCtrl', ["$scope", "$timeout", "$ionicPopover", function($scope, $timeout, $ionicPopover) {
    
    $ionicPopover.fromTemplateUrl('my-popover.html', {
    scope: $scope
    }).then(function(popover) {
        $scope.popover = popover;
    });
    
    $scope.name = [];
    $scope.title = [];
    $scope.date = [];
    $scope.location = [];
    
    $scope.events = [{
        title: 'Lunch',
        start: '2016-02-07',
        end: '2016-01-30',
        allDay: false
    }];
        //$scope.eventSources = [$scope.events];

    //config calendar
    $scope.uiConfig = {
        calendar: {
            height: 350,
            editable: true,
            },
        dayClick: $scope.alertEventOnClick,
        eventDrop: $scope.alertOnDrop,
        eventResize: $scope.alertOnResize
      };
    
    $scope.loopRef = new Firebase("https://vivid-heat-1234.firebaseio.com/loops");
    
    $scope.saveData = function() {
        $scope.loopRef.push({name: $scope.name.loopName, title:$scope.title.eventTitle, start:$scope.date.eventDate, location:$scope.location.eventLocation});
        console.log($scope.name.loopName, $scope.title.eventTitle, $scope.date.eventDate);
        $scope.name = "";
        $scope.title = "";
        $scope.date = "";
        $scope.location = "";
    };
    
    $scope.loopRef.on('value', function(allSnapshot) {
        $timeout(function() {
        allSnapshot.forEach(function(snapshot) {
        
            var key = snapshot.key();
            var names = snapshot.child("name").val();
            var event = snapshot.child("Events").val();
            var titles = snapshot.child("Events/title").val();
            var starts = snapshot.child("Events/start").val();
            var allDay = snapshot.child("Events/allDay").val();
            var sticks = snapshot.child("Events/stick").val();
            //console.log(title);
            $scope.events.push({ name:names, title:titles, start:starts, stick:sticks});
            //console.log($scope.events);
        });
        });
        //console.log($scope.events);
    })
    console.log($scope.events);
    $scope.eventSources = [$scope.events];
    //allLoopsSnapshot.forEach(function(loopSnapshot) {
            //var key = loopSnapshot.key();
            //var name = loopSnapshot.child("name").val();
            //var date = loopSnapshot.child("start").val();
            //var allDay = loopSnapshot.child("allDay").val();
        //});
    //});
}])

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
                console.log("Successfully created user account with uid:", userData);
                
               //To alert successful signup and proceed to login (limited by username.uid apparent bug??) //$state.go('app.loops.index');
            }
        });
    };
    
    $scope.loginEmail = function() {
        var ref = new Firebase("https://vivid-heat-1234.firebaseio.com");
        
        ref.authWithPassword({
            email: $scope.data.email,
            password: $scope.data.password }, function(error, userData) {
            if (error) {
                console.log("Login Failed!", error);
            } else {
                console.log("Authenticated successfully with payload:", userData);
                ref.child("/users").child(userData.uid).set({
                    name: $scope.data.email.replace(/@.*/, '')
                });
                
                $state.go('app.loops.index');
            }
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

