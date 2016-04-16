// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'Loop' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('Loop', ['ionic', 'ngCordova', 'ui.calendar', 'firebase'])

app.run(function($ionicPlatform) {
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
      //StatusBar.styleDefault();
        //change status bar text color to light text, for dark backgrounds
        StatusBar.styleLightContent();
        StatusBar.styleColor(2);
    }
  });
})

//hides previous/next/done bar that appears above keyboard
/*app.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {    
        if(window.cordova) {
            cordova.plugins && cordova.plugins.Keyboard && cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }*/
        /*if(window.StatusBar) {
            //StatusBar.styleDefault();
            StatusBar.styleColor(2);
        }*/
    //});
//})

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

//cordova status bar
/*.run(function($cordovaStatusbar) {
    $cordovaStatusbar.overlaysWebView(true);
    $cordovaStatusbar.style(1);
})*/

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

//manages the parent-child view states
app.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/sign-in')
    
    // when a state is "active", all of its ancestor states are implicitly active as well.
    $stateProvider.state('signin', {
        url: '/sign-in',
        templateUrl: 'sign-in.html',
        controller: 'SignInCtrl'
    })
    
    $stateProvider.state('signup', {
        url: '/sign-up',
        templateUrl: 'signup.html',
        controller: 'signUpCtrl'
    })
    
    $stateProvider.state('forgotpassword', {
        url: '/forgotpassword',
        templateUrl: 'forgotpassword.html',
        controller: 'forgotPasswordCtrl'
    })

    $stateProvider.state('app', {
        abstract: true,
        cache: false,
        templateUrl: 'main.html',
        controller: 'MainCtrl'
    })
    
    $stateProvider.state('app.mycalendar', {
        url: '/mycalendar',
        cache: false,
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
        //cache: false,
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
        cache: false,
        templateUrl: 'loops.html',
        controller: 'LoopsCtrl'
    })
    
    $stateProvider.state('app.loops.detail', {
        url: '/:key',
        cache: false,
        templateUrl: 'loop.html',
        controller: 'loopCtrl',
        // in Angular digest cycle, the controller code is run last
        // this resolve step is an easy way to make data available before the route is rendered
        // resolve - to provide controller with content or data that is custom to the state.
        // resolve is an object whose keys map to values that can be injected in the state's controller
        //resolve: {
            //injection of service into resolve function. Service then returns a promise. $stateParams get access to url parameters.
            //loop: function($stateParams, loopsService) {
                //getloop is a service method that uses $http to fetch loopsService
        //return loopsService.getloop($stateParams.loop)
            //}
        //}
    })
    
    $stateProvider.state('app.link', {
        url: '/link',
        views: {
            link: {
                templateUrl: 'link.html',
                controller: 'LinkCtrl'
            }
        }
    })

    $stateProvider.state('app.settings', {
        abstract: true,
        url: '/settings',
        views: {
            settings: {
                template: '<ion-nav-view></ion-nav-view>'
            }
        }   
    })
    
    $stateProvider.state('app.settings.index', {
        url: '',
        //cache: false,
        templateUrl: 'settings.html',
        controller: 'SettingsCtrl'
    })
    
    $stateProvider.state('app.settings.changepassword', {
        url: '/changepassword',
        cache: false,
        templateUrl: 'changepassword.html',
        controller: 'changePasswordCtrl'
    })
    
    $stateProvider.state('app.settings.linkphone', {
        url: '/linkphone',
        cache: false,
        templateUrl: 'linkphone.html',
        controller: 'linkphoneCtrl'
    })
})

//services are substitutable objects wired together using dependency injection and are used to organise and share code across app
//service factory function generates the single object or function that represents the service to the rest of the app

//factory to get Contacts
/*app.factory('Contacts', function($cordovaContacts) {
    var contacts;
    
    return {
        getContacts: function() {
            var options = {};
            options.filter = "";
            options.multiple = true;
            
            //get the phone contacts
            return
            $cordovaContacts.find(options);
        }
    }
})*/

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
})

//create a loops factory with a get method
app.factory('loopsFactory', ["$firebaseObject", function($firebaseObject) {
    //create a reference to the database node where we store data
    var ref = new Firebase("https://vivid-heat-1234.firebaseio.com/loops");
    
    return {
        getLoops: function() { 
        //return as a synchronized object
        return $firebaseObject(ref);
        },
  }
}])

//loops factory with firebaseArray
app.factory('loopsArray', ["$firebaseArray", function($firebaseArray) {
    var ref = new Firebase("https://vivid-heat-1234.firebaseio.com/loops");
    
    return $firebaseArray(ref);
}])

//user factory
app.factory('usersService', ["$firebaseArray", function($firebaseArray){
    var users = new Firebase("https://vivid-heat-1234.firebaseio.com/users");
    
    return $firebaseArray(users);
}])

//members factory
app.factory('membersArray', ["$firebaseArray", function($firebaseArray) {
    var members = new Firebase("https://vivid-heat-1234.firebaseio.com/members");
    
    return $firebaseArray(members);
}])

//events factory
app.factory('eventsArray', ["$firebaseArray", function($firebaseArray) {
    var events = new Firebase("https://vivid-heat-1234.firebaseio.com/events");
    
    return $firebaseArray(events);
}])

//factory to return only phone numbers from users' tree
app.factory('phoneNos', ["$firebaseArray", "$q", function($firebaseArray, $q) {
    var users = new Firebase("https://vivid-heat-1234.firebaseio.com/users");
    //var phoneNumbers = [];
    var val = [];
    var deferred = $q.defer();
    users.once("value",function (dataSnapshot) {
        var val = dataSnapshot.val();
        deferred.resolve(val);
    })
    return deferred.promise;
    return val;
}])

app.controller('MainCtrl', function($scope) {
    
})

//this controller waits for the state to be completely resolved before instantiation
app.controller('LoopsCtrl', function($scope, $ionicPopover, $ionicPopup, loopsFactory, $ionicListDelegate, usersService, loopsArray, membersArray, eventsArray) {
    
    var ref = new Firebase('https://vivid-heat-1234.firebaseio.com');
    
    var uid = {};
    //retrieve user unique id from users node
    var userData = ref.getAuth();
    var uid = userData.uid;
    console.log(uid); //success!
    
    //retrieve user name
    var name = []; 
    ref.child('/users').child(uid).once('value', function(snapshot) {
        name.length = 0;
        var userVal = snapshot.val();
        name.push(userVal.name);
    })
    
    
    //initialize arrays for list of loops
    $scope.loops = [];
    var loopUIDfromUser = [];
    var loopObject = [];
    var loopsToDisplay = [];
    var eventsObject = [];
    var loopWithoutEvent = [];
    
    //filter list of loops to show only those users are authorized to see
    
    // get current time
    var currentDate = new Date();
    var currentDateInMS = currentDate.getTime();
    console.log(currentDateInMS);
    
    //--
    // to get loopUID from users tree
    function getLoopUIDfromUserPromise(uid) {
        loopUIDfromUser.length = 0;
        return ref.child('users').child(uid).child('loops').once('value').then(function(loopIDfrUser) {
            //console.log(loopIDfrUser.val()); //loop IDs of which user is a member of
            var user = loopIDfrUser.val();
            angular.forEach(user, function (key, value) {
                //console.log(value); //returns loopID
                loopUIDfromUser.push(value);
            })
            return loopUIDfromUser;
        });
    }
    
    var loopIDfromUsers = getLoopUIDfromUserPromise(uid);
    
    // get corresponding loopUIDs from loops tree and save corresponding loop key and loop name into [loopObject] 
    // the length of [loopObject] array should be the same as the [loopUIDfromUser] array
    var loopIDfromLoops = loopIDfromUsers.then(function(loopIDfrUser) {
        //console.log(loopIDfrUser); // loop IDs of which user is a member of
        loopObject.length = 0;
        loopsToDisplay.length = 0;
        
        return ref.child('loops').once('value').then(function(loopIDfrLoops){
            var loopsTree = loopIDfrLoops.val();
            //console.log(loopsTree);
            angular.forEach(loopsTree, function (key, value) {
                //console.log(key); //yields loop object 
                //console.log(value); //yields loopID
                loopObject.push({key: value, name: key.name});
            })
            //console.log(loopObject);
            angular.forEach(loopIDfrUser, function (key) {
                //console.log(key);
                for (var i=0; i<loopObject.length; i++) {
                    if (key === loopObject[i].key) {
                        loopsToDisplay.push(loopObject[i]);
                    }
                }
            })
            //console.log(loopsToDisplay);
            return loopsToDisplay;
        });
    })
    
    // get events by loopID and compare each events against one another to obtain the closest upcoming event for display on view
    var eventsTree = loopIDfromUsers.then(function(loopIDfrUser){
        var loops = [];
        eventsObject.length = 0;
        
        //console.log(loopIDfrUser);
        for (var i=0; i<loopIDfrUser.length; i++) {
            var key = loopIDfrUser[i];
            //console.log(key)
        }
        
        angular.forEach(loopIDfrUser, function (key) {
           var keyArray = [];
           var tempStartTime = [];
           var tempEventObject = [];
            
           return ref.child('events').child(key).once('value').then(function(events) {
               //console.log(key);
               var events = events.val();
               //console.log(events);
               
               for (var eventID in events) {
                    if (events.hasOwnProperty(eventID)) {
                        //console.log(eventID); // logs eventID
                        //console.log(events[eventID]); //logs event object one by one, by loop ID
                        
                        //convert event start time to that in milliseconds
                        var dateInFull = new Date(events[eventID].start);
                        var dateInMS = dateInFull.getTime();
                        //console.log(dateInMS);
                        
                        // compare event start time to current start time, both in ms, with - implying event is in the past, and + implying upcoming event(s)
                        var diff = dateInMS - currentDateInMS;
                        //console.log(diff);
                        
                        // check if loop has already an existing event with a dummy [keyArray] array
                        var index = keyArray.indexOf(key);
                        //console.log(index);
                        
                        // if loop has not been evaluated before and the event is one in the future
                        if (index === -1 && diff > 0) {
                            console.log(false);
                            keyArray.push(key);
                            //console.log(keyArray);
                            tempEventObject.length = 0;
                            tempStartTime.push(diff);
                            //console.log(tempStartTime);
                            tempEventObject.push({key:key, start:events[eventID].start, title:events[eventID].title});
                            //console.log(tempEventObject);
                            
                        } else if (index > -1 && diff > 0 && diff < tempStartTime[0]) {
                            console.log(true);
                            tempStartTime.length = 0;
                            tempStartTime.push(diff);
                            //console.log(tempStartTime);
                            tempEventObject.length = 0;
                            tempEventObject.push({key:key, start:events[eventID].start, title:events[eventID].title});
                            //console.log(tempEventObject);
                        } else if (index === -1 && diff < 0) {
                            tempEventObject.length = 0;
                            tempEventObject.push({key: key, title: "null"});
                            //console.log(tempEventObject);
                        }
                        //console.log(eventsObject);
                    } 
               }
               //console.log(tempEventObject);
               //to filter out loops with no events yet
               if (tempEventObject.length === 1) {
               eventsObject.push(tempEventObject[0]);
               }
               //console.log(eventsObject);
            })
           return eventsObject;
        })  
    });
    
    //method to filter loops without a single event
    var loopWithoutEvents = loopIDfromLoops.then(function(loopIDfrLoops) {
        var loopID = [];
               
        //utility function to check if an object is empty
        function isEmpty(obj) {
            for (var key in obj) {
                if (obj.hasOwnProperty(key))
                    return false;
            }
            return true;
        }
        
        loopWithoutEvent.length = 0;
        
        angular.forEach(loopIDfrLoops, function (key, value) {
            var object = key;
            var loopID = object.key;
            
            return ref.child('events').child(loopID).once('value').then(function(events){
                var events = events.val();
                console.log(events);
                
                // if {events} is empty
               if(isEmpty(events)) {
                   console.log(object);
                   loopWithoutEvent.push({key: object.key, name: object.name, title: 'null'});
                   //console.log("events is empty");
               }
                console.log(loopWithoutEvent);
            })
            return loopWithoutEvent;
        })
    })
    
    Promise.all([loopIDfromUsers, loopIDfromLoops, eventsObject, loopWithoutEvent]).then(function(results) {
        var loopContents = [];
        
        console.log(results);
        var overlapLoops = results[1];
        var events = results[2];
        console.log(overlapLoops);
        console.log(events);
        var test = overlapLoops.concat(events);
        console.log(test);
        //remove duplicates
        for (var i=0; i<test.length; ++i) {
            for (var j=i+1; j<test.length; ++j) {
                if(test[i].key === test[j].key) {
                    loopContents.push({key: test[i].key, name: test[i].name, title: test[j].title, start: test[j].start});
                    test.splice(j--, 1);
                }
            }  
        }
        //console.log(test);
        console.log(loopContents);
        var emptyLoop = results[3];
        console.log(emptyLoop);
        
        $scope.loops = loopContents.concat(emptyLoop);
        console.log($scope.loops);
    });
    
    //scope for left side tab delete
    $scope.data = {
        showDelete: false
    };
    
    //close ion delete buttons
    /*$scope.closeDeleteButtons = function() {
        $ionicListDelegate.showDelete(false);
    };*/
    
    // from TemplateUrl() method
    $ionicPopover.fromTemplateUrl('loops-popover.html', {
        scope: $scope
    }).then(function(popover) {
        $scope.popover = popover;
    });
    
    $scope.closePopover = function() {
        $scope.popover.hide();
    };
    
    //scope onItemDelete minus tab on nav-bar, with popup confirm
    $scope.onItemDelete = function(key) {
        var loopKey = ref.child('/loops').child(key);
        var lastMember = ref.child('/members').child(key);
        var member = ref.child('/members').child(key).child(uid);
        var user = ref.child('/users').child(uid).child('/loops').child(key);
        var events = ref.child('/events').child(key);
        var changes = ref.child('/changes').child(key);
        
        var confirmPopup = $ionicPopup.confirm({
            title: 'Delete Loop',
            template: 'Are you sure you want to close this loop?',
            cancelText: 'No',
            cancelType: 'button-default',
            okText: 'Yes',
            okType: 'button-dark'
        });
        
        confirmPopup.then(function(res) {
            var totalMembers = [];
            var loopers = new Firebase("https://vivid-heat-1234.firebaseio.com/members/" + key);
    
            loopers.once("value", function(snapshot) {
                var membersOfLoop = snapshot.val();
                //console.log(membersOfLoop);
                var totalMembers = Object.keys(membersOfLoop).length;
                console.log(totalMembers);
                if (totalMembers==1 && res) {
                    //check if there are more than 1 user in the loop; if there's more than 1, remove only user from the loop otherwise delete loop entirely
                    console.log(true);
                    loopKey.remove();
                    lastMember.remove();
                    user.remove();
                    events.remove();
                    changes.remove();
                    //return;
                } else {
                    console.log(false);
                    member.remove();
                    user.remove();
                    ref.child("changes").child(key).child(currentDateInMS).set(name + " " + "left the loop");
                    //return;
                }
            })
            //------- Copied piece of code to call data from Firebase and filter loops
            var loopIDfromUsers = getLoopUIDfromUserPromise(uid);
    
            // get corresponding loopUIDs from loops tree and save corresponding loop key and loop name into [loopObject] 
            // the length of [loopObject] array should be the same as the [loopUIDfromUser] array
            var loopIDfromLoops = loopIDfromUsers.then(function(loopIDfrUser) {
                //console.log(loopIDfrUser); // loop IDs of which user is a member of
                loopObject.length = 0;
                loopsToDisplay.length = 0;
                return ref.child('loops').once('value').then(function(loopIDfrLoops){
                    var loopsTree = loopIDfrLoops.val();
                    //console.log(loopsTree);
                    angular.forEach(loopsTree, function (key, value) {
                        //console.log(key); //yields loop object 
                        //console.log(value); //yields loopID
                        loopObject.push({key: value, name: key.name});
                    })
                    //console.log(loopObject);
                    angular.forEach(loopIDfrUser, function (key) {
                        //console.log(key);
                        for (var i=0; i<loopObject.length; i++) {
                            if (key === loopObject[i].key) {
                                loopsToDisplay.push(loopObject[i]);
                            }
                        }
                    })
                    //console.log(loopsToDisplay);
                    return loopsToDisplay;
                });
            })
    
            // get events by loopID and compare each events against one another to obtain the closest upcoming event for display on view
            var eventsTree = loopIDfromUsers.then(function(loopIDfrUser){
                var loops = [];
                eventsObject.length = 0;
                //console.log(loopIDfrUser);
                for (var i=0; i<loopIDfrUser.length; i++) {
                    var key = loopIDfrUser[i];
                    //console.log(key)
                }
                angular.forEach(loopIDfrUser, function (key) {
                    var keyArray = [];
                    var tempStartTime = [];
                    var tempEventObject = [];
    
                    return ref.child('events').child(key).once('value').then(function(events) {
                        //console.log(key);
                        var events = events.val();
                        //console.log(events);
               
                        for (var eventID in events) {
                            if (events.hasOwnProperty(eventID)) {
                                //console.log(eventID); // logs eventID
                                //console.log(events[eventID]); //logs event object one by one, by loop ID
                        
                                //convert event start time to that in milliseconds
                                var dateInFull = new Date(events[eventID].start);
                                var dateInMS = dateInFull.getTime();
                                //console.log(dateInMS);
                        
                                // compare event start time to current start time, both in ms, with - implying event is in the past, and + implying upcoming event(s)
                                var diff = dateInMS - currentDateInMS;
                                //console.log(diff);
                        
                                // check if loop has already an existing event with a dummy [keyArray] array
                                var index = keyArray.indexOf(key);
                                //console.log(index);
                        
                                // if loop has not been evaluated before and the event is one in the future
                                if (index === -1 && diff > 0) {
                                    //console.log(false);
                                    keyArray.push(key);
                                    //console.log(keyArray);
                                    tempEventObject.length = 0;
                                    tempStartTime.push(diff);
                                    //console.log(tempStartTime);
                                    tempEventObject.push({key:key, start:events[eventID].start, title:events[eventID].title});
                                    //console.log(tempEventObject);
                            
                                } else if (index > -1 && diff > 0 && diff < tempStartTime[0]) {
                                    //console.log(true);
                                    tempStartTime.length = 0;
                                    tempStartTime.push(diff);
                                    //console.log(tempStartTime);
                                    tempEventObject.length = 0;
                                    tempEventObject.push({key:key, start:events[eventID].start, title:events[eventID].title});
                                //console.log(tempEventObject);
                                } else if (index === -1 && diff < 0) {
                                    tempEventObject.length = 0;
                                    tempEventObject.push({key: key, title: "null"});
                                    //console.log(tempEventObject);
                                }
                                //console.log(eventsObject);
                            } 
                        }
                        //console.log(tempEventObject);
                        //to filter out loops with no events yet
                        if (tempEventObject.length === 1) {
                            eventsObject.push(tempEventObject[0]);
                        }
                        //console.log(eventsObject);
                    })
                return eventsObject;
                })  
            });
    
            //method to filter loops without a single event
            var loopWithoutEvents = loopIDfromLoops.then(function(loopIDfrLoops) {
                var loopID = [];
               
                //utility function to check if an object is empty
                function isEmpty(obj) {
                    for (var key in obj) {
                        if (obj.hasOwnProperty(key))
                        return false;
                    }
                    return true;
                }
            
                loopWithoutEvent.length = 0;
                angular.forEach(loopIDfrLoops, function (key, value) {
                    var object = key;
                    var loopID = object.key;
            
                    return ref.child('events').child(loopID).once('value').then(function(events){
                        var events = events.val();
                        console.log(events);
                
                        // if {events} is empty
                        if(isEmpty(events)) {
                            console.log(object);
                            loopWithoutEvent.push({key: object.key, name: object.name, title: 'null'});
                            //console.log("events is empty");
                        }
                        console.log(loopWithoutEvent);
                    })
                    return loopWithoutEvent;
                })
            })
    
            Promise.all([loopIDfromUsers, loopIDfromLoops, eventsObject, loopWithoutEvent]).then(function(results) {
                var loopContents = [];
        
                console.log(results);
                var overlapLoops = results[1];
                var events = results[2];
                console.log(overlapLoops);
                console.log(events);
                var test = overlapLoops.concat(events);
                console.log(test);
                for (var i=0; i<test.length; ++i) {
                    for (var j=i+1; j<test.length; ++j) {
                        if(test[i].key === test[j].key) {
                            loopContents.push({key: test[i].key, name: test[i].name, title: test[j].title, start: test[j].start});
                            test.splice(j--, 1);
                        }
                    }  
                }
                //console.log(test);
                console.log(loopContents);
                var emptyLoop = results[3];
                console.log(emptyLoop);
        
                $scope.loops = loopContents.concat(emptyLoop);
                console.log($scope.loops);
            });
            //------- end of copied code
            //$scope.closeDeleteButtons();
        });
    }
    //Edit popup
    $scope.editPopup = function(key) {
        $scope.edit = {};
        
        var editNamePopup = $ionicPopup.show({
            template: '<input type="name" ng-model="edit.name">',
            title: 'Edit Name of Loop',
            scope: $scope,
            buttons: [
                { text: 'Cancel',
                  onTap: $ionicListDelegate.closeOptionButtons()
                },
                {
                  text: '<b>Save</b>',
                  type: 'button-dark',
                  onTap: function(e) {
                    if(!$scope.edit.name) {
                    //don't allow the user to close unless he enters new loop name
                        e.preventDefault();
                    } else {
                        return $scope.edit.name;    
                        }
                    }
                }
            ]
        });
        
        editNamePopup.then(function(res1) {
            console.log('Tapped!', res1);
            if (res1 != null) {
                var loopName = ref.child('/loops').child(key).child('name');
                loopName.set(res1);
                ref.child('changes').child(key).child(currentDateInMS).set(name + " " + "changed loop name to" + " " + res1);
                $ionicListDelegate.closeOptionButtons();
            } else {
                //do nothing
            }
        })
    }
    
    //function to splice loop array with option button
    //showConfirm popup to delete loop
    $scope.showConfirm = function(key) {
        var loopKey = ref.child('/loops').child(key);
        var lastMember = ref.child('/members').child(key);
        var member = ref.child('/members').child(key).child(uid);
        var user = ref.child('/users').child(uid).child('/loops').child(key);
        var events = ref.child('/events').child(key);
        var changes = ref.child('/changes').child(key);
        
        var confirmPopup = $ionicPopup.confirm({
            title: 'Delete Loop',
            template: 'Are you sure you want to close this loop?',
            cancelText: 'No',
            cancelType: 'button-default',
            okText: 'Yes',
            okType: 'button-dark'
        });
        console.log(key);
        
        confirmPopup.then(function(res) {
            var totalMembers = [];
            var loopers = new Firebase("https://vivid-heat-1234.firebaseio.com/members/" + key);
    
            loopers.once("value", function(snapshot) {
                var membersOfLoop = snapshot.val();
                //console.log(membersOfLoop);
                var totalMembers = Object.keys(membersOfLoop).length;
                console.log(totalMembers);
                
                if(totalMembers==1 && res) {
                    //to delete loop and associated data linkages
                    console.log(true);
                    loopKey.remove();
                    lastMember.remove();
                    user.remove();
                    events.remove();
                    changes.remove();
                    //return;
                } else if (totalMembers != 1 && res) {
                    console.log(false);
                    member.remove();
                    user.remove();
                    ref.child("changes").child(key).child(currentDateInMS).set(name + " " + "left the loop");
                    //return;
                } else {
                    $ionicListDelegate.closeOptionButtons();
                    return;
                }
            });
            //------- Copied piece of code to call data from Firebase and filter loops
            var loopIDfromUsers = getLoopUIDfromUserPromise(uid);
    
            // get corresponding loopUIDs from loops tree and save corresponding loop key and loop name into [loopObject] 
            // the length of [loopObject] array should be the same as the [loopUIDfromUser] array
            var loopIDfromLoops = loopIDfromUsers.then(function(loopIDfrUser) {
                //console.log(loopIDfrUser); // loop IDs of which user is a member of
                loopObject.length = 0;
                loopsToDisplay.length = 0;
                return ref.child('loops').once('value').then(function(loopIDfrLoops){
                    var loopsTree = loopIDfrLoops.val();
                    //console.log(loopsTree);
                    angular.forEach(loopsTree, function (key, value) {
                        //console.log(key); //yields loop object 
                        //console.log(value); //yields loopID
                        loopObject.push({key: value, name: key.name});
                    })
                    //console.log(loopObject);
                    angular.forEach(loopIDfrUser, function (key) {
                        //console.log(key);
                        for (var i=0; i<loopObject.length; i++) {
                            if (key === loopObject[i].key) {
                                loopsToDisplay.push(loopObject[i]);
                            }
                        }
                    })
                    //console.log(loopsToDisplay);
                    return loopsToDisplay;
                });
            })
    
            // get events by loopID and compare each events against one another to obtain the closest upcoming event for display on view
            var eventsTree = loopIDfromUsers.then(function(loopIDfrUser){
                var loops = [];
                eventsObject.length = 0;
                console.log(loopIDfrUser);
                for (var i=0; i<loopIDfrUser.length; i++) {
                    var key = loopIDfrUser[i];
                    console.log(key)
                }
                angular.forEach(loopIDfrUser, function (key) {
                    var keyArray = [];
                    var tempStartTime = [];
                    var tempEventObject = [];
    
                    return ref.child('events').child(key).once('value').then(function(events) {
                        console.log(key);
                        var events = events.val();
                        console.log(events);
               
                        for (var eventID in events) {
                            if (events.hasOwnProperty(eventID)) {
                                //console.log(eventID); // logs eventID
                                //console.log(events[eventID]); //logs event object one by one, by loop ID
                        
                                //convert event start time to that in milliseconds
                                var dateInFull = new Date(events[eventID].start);
                                var dateInMS = dateInFull.getTime();
                                //console.log(dateInMS);
                        
                                // compare event start time to current start time, both in ms, with - implying event is in the past, and + implying upcoming event(s)
                                var diff = dateInMS - currentDateInMS;
                                //console.log(diff);
                        
                                // check if loop has already an existing event with a dummy [keyArray] array
                                var index = keyArray.indexOf(key);
                                console.log(index);
                        
                                // if loop has not been evaluated before and the event is one in the future
                                if (index === -1 && diff > 0) {
                                    console.log(false);
                                    keyArray.push(key);
                                    console.log(keyArray);
                                    tempEventObject.length = 0;
                                    tempStartTime.push(diff);
                                    //console.log(tempStartTime);
                                    tempEventObject.push({key:key, start:events[eventID].start, title:events[eventID].title});
                                    console.log(tempEventObject);
                            
                                } else if (index > -1 && diff > 0 && diff < tempStartTime[0]) {
                                    console.log(true);
                                    tempStartTime.length = 0;
                                    tempStartTime.push(diff);
                                    //console.log(tempStartTime);
                                    tempEventObject.length = 0;
                                    tempEventObject.push({key:key, start:events[eventID].start, title:events[eventID].title});
                                //console.log(tempEventObject);
                                } else if (index === -1 && diff < 0) {
                                    tempEventObject.length = 0;
                                    tempEventObject.push({key: key, title: "null"});
                                    console.log(tempEventObject);
                                }
                                //console.log(eventsObject);
                            } 
                        }
                        console.log(tempEventObject);
                        //to filter out loops with no events yet
                        if (tempEventObject.length === 1) {
                            eventsObject.push(tempEventObject[0]);
                        }
                        console.log(eventsObject);
                    })
                return eventsObject;
                })  
            });
    
            //method to filter loops without a single event
            var loopWithoutEvents = loopIDfromLoops.then(function(loopIDfrLoops) {
                var loopID = [];
               
                //utility function to check if an object is empty
                function isEmpty(obj) {
                    for (var key in obj) {
                        if (obj.hasOwnProperty(key))
                        return false;
                    }
                    return true;
                }
            
                loopWithoutEvent.length = 0;
                angular.forEach(loopIDfrLoops, function (key, value) {
                    var object = key;
                    var loopID = object.key;
            
                    return ref.child('events').child(loopID).once('value').then(function(events){
                        var events = events.val();
                        console.log(events);
                
                        // if {events} is empty
                        if(isEmpty(events)) {
                            console.log(object);
                            loopWithoutEvent.push({key: object.key, name: object.name, title: 'null'});
                            //console.log("events is empty");
                        }
                        console.log(loopWithoutEvent);
                    })
                    return loopWithoutEvent;
                })
            })
    
            Promise.all([loopIDfromUsers, loopIDfromLoops, eventsObject, loopWithoutEvent]).then(function(results) {
                var loopContents = [];
        
                console.log(results);
                var overlapLoops = results[1];
                var events = results[2];
                console.log(overlapLoops);
                console.log(events);
                var test = overlapLoops.concat(events);
                console.log(test);
                for (var i=0; i<test.length; ++i) {
                    for (var j=i+1; j<test.length; ++j) {
                        if(test[i].key === test[j].key) {
                            loopContents.push({key: test[i].key, name: test[i].name, title: test[j].title, start: test[j].start});
                            test.splice(j--, 1);
                        }
                    }  
                }
                //console.log(test);
                console.log(loopContents);
                var emptyLoop = results[3];
                console.log(emptyLoop);
        
                $scope.loops = loopContents.concat(emptyLoop);
                console.log($scope.loops);
            });
            //------- end of copied code
        })
    }
    
    //function to add loop to list and save it to multiple locations in the database
    $scope.addLoop = function(newLoop) {
        var root = new Firebase("https://vivid-heat-1234.firebaseio.com");
        var uid = {};
        //retrieve user unique id from users node
        var userData = root.getAuth();
        var uid = userData.uid;
        //console.log(uid); //success!
        
        //get user name 
        console.log(name); //success!
        
        //get current datetime
        console.log(currentDateInMS);
        
        //generate random color for individual loop
        function getRandomColor() {
            var letters = '0123456789ABCDEF'.split('');
            var color = '#';
            for (var i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        }
        var color = getRandomColor();
        
        // an atomic update to various locations upon introduction of a new loop
        // generate a new push ID for the new loop
        
        var newLoopRef = root.child("/loops").push();
        var newLoopKey = newLoopRef.key();
        
        // create the data we want to update
        var newLoopName = {};
        newLoopName["/loops/" + newLoopKey] = {
            name: newLoop,
            color: color
        };
        root.child("members").child(newLoopKey).child(uid).set(true);
        root.child("users").child(uid).child("loops").child(newLoopKey).set(true); 
        root.child("changes").child(newLoopKey).child(currentDateInMS).set("Loop created by " + name);
        
        // perform a deep-path update
        root.update(newLoopName, function(error) {
            if (error) {
                console.log("Error updating data:", error)
            }
        });
        //clear input field
        this.newLoop = null;
        
        //close popover on submit
        $scope.closePopover();
        
        //------- Copied piece of code to call data from Firebase and filter loops
        var loopIDfromUsers = getLoopUIDfromUserPromise(uid);
    
        // get corresponding loopUIDs from loops tree and save corresponding loop key and loop name into [loopObject] 
        // the length of [loopObject] array should be the same as the [loopUIDfromUser] array
        var loopIDfromLoops = loopIDfromUsers.then(function(loopIDfrUser) {
            //console.log(loopIDfrUser); // loop IDs of which user is a member of
            loopObject.length = 0;
            loopsToDisplay.length = 0;
            return ref.child('loops').once('value').then(function(loopIDfrLoops){
                var loopsTree = loopIDfrLoops.val();
                //console.log(loopsTree);
                angular.forEach(loopsTree, function (key, value) {
                    //console.log(key); //yields loop object 
                    //console.log(value); //yields loopID
                    loopObject.push({key: value, name: key.name});
                })
                //console.log(loopObject);
                angular.forEach(loopIDfrUser, function (key) {
                    //console.log(key);
                    for (var i=0; i<loopObject.length; i++) {
                        if (key === loopObject[i].key) {
                            loopsToDisplay.push(loopObject[i]);
                        }
                    }
                })
                //console.log(loopsToDisplay);
                return loopsToDisplay;
            });
        })
    
        // get events by loopID and compare each events against one another to obtain the closest upcoming event for display on view
        var eventsTree = loopIDfromUsers.then(function(loopIDfrUser){
            var loops = [];
            eventsObject.length = 0;
            //console.log(loopIDfrUser);
            for (var i=0; i<loopIDfrUser.length; i++) {
                var key = loopIDfrUser[i];
                console.log(key)
            }
            angular.forEach(loopIDfrUser, function (key) {
                var keyArray = [];
                var tempStartTime = [];
                var tempEventObject = [];
            
                return ref.child('events').child(key).once('value').then(function(events) {
                    console.log(key);
                    var events = events.val();
                    console.log(events);
               
                    for (var eventID in events) {
                        if (events.hasOwnProperty(eventID)) {
                            //console.log(eventID); // logs eventID
                            //console.log(events[eventID]); //logs event object one by one, by loop ID
                        
                            //convert event start time to that in milliseconds
                            var dateInFull = new Date(events[eventID].start);
                            var dateInMS = dateInFull.getTime();
                            //console.log(dateInMS);
                        
                            // compare event start time to current start time, both in ms, with - implying event is in the past, and + implying upcoming event(s)
                            var diff = dateInMS - currentDateInMS;
                            console.log(diff);
                        
                            // check if loop has already an existing event with a dummy [keyArray] array
                            var index = keyArray.indexOf(key);
                            console.log(index);
                        
                            // if loop has not been evaluated before and the event is one in the future
                            if (index === -1 && diff > 0) {
                                //console.log(false);
                                keyArray.push(key);
                                //console.log(keyArray);
                                tempEventObject.length = 0;
                                tempStartTime.push(diff);
                                //console.log(tempStartTime);
                                tempEventObject.push({key:key, start:events[eventID].start, title:events[eventID].title});
                                //console.log(tempEventObject);
                            
                            } else if (index > -1 && diff > 0 && diff < tempStartTime[0]) {
                                //console.log(true);
                                tempStartTime.length = 0;
                                tempStartTime.push(diff);
                                //console.log(tempStartTime);
                                tempEventObject.length = 0;
                                tempEventObject.push({key:key, start:events[eventID].start, title:events[eventID].title});
                                //console.log(tempEventObject);
                            } else if (index === -1 && diff < 0) {
                                tempEventObject.length = 0;
                                tempEventObject.push({key: key, title: "null"});
                                //console.log(tempEventObject);
                            }
                            //console.log(eventsObject);
                        } else {
                        //
                        }
                    }
                console.log(tempEventObject);
                //to filter out loops with no events yet
                if (tempEventObject.length === 1) {
                    eventsObject.push(tempEventObject[0]);
                    }
                console.log(eventsObject);
                })
            return eventsObject;
            })  
        });
    
        //method to filter loops without a single event
        var loopWithoutEvents = loopIDfromLoops.then(function(loopIDfrLoops) {
            var loopID = [];
               
            //utility function to check if an object is empty
            function isEmpty(obj) {
                for (var key in obj) {
                    if (obj.hasOwnProperty(key))
                        return false;
                }
                return true;
            }
            
            loopWithoutEvent.length = 0;
            angular.forEach(loopIDfrLoops, function (key, value) {
                var object = key;
                var loopID = object.key;
            
                return ref.child('events').child(loopID).once('value').then(function(events){
                    var events = events.val();
                    //console.log(events);
                
                    // if {events} is empty
                    if(isEmpty(events)) {
                        //console.log(object);
                        loopWithoutEvent.push({key: object.key, name: object.name, title: 'null'});
                        //console.log("events is empty");
                    }
                    //console.log(loopWithoutEvent);
                })
                return loopWithoutEvent;
            })
        })
    
        Promise.all([loopIDfromUsers, loopIDfromLoops, eventsObject, loopWithoutEvent]).then(function(results) {
            var loopContents = [];
        
            console.log(results);
            var overlapLoops = results[1];
            var events = results[2];
            console.log(overlapLoops);
            console.log(events);
            var test = overlapLoops.concat(events);
            console.log(test);
            for (var i=0; i<test.length; ++i) {
                for (var j=i+1; j<test.length; ++j) {
                    if(test[i].key === test[j].key) {
                        loopContents.push({key: test[i].key, name: test[i].name, title: test[j].title, start: test[j].start});
                        test.splice(j--, 1);
                    }
                }  
            }
            //console.log(test);
            console.log(loopContents);
            var emptyLoop = results[3];
            console.log(emptyLoop);
        
            $scope.loops = loopContents.concat(emptyLoop);
            console.log($scope.loops);
        });
        //------- end of copied code
    }
})

app.controller('loopCtrl', function($scope, $ionicPopover, $stateParams, $timeout, $ionicModal, $ionicPopup, $firebaseArray, $firebaseObject, $ionicListDelegate, usersService, $ionicSlideBoxDelegate, $cordovaContacts, phoneNos) {
    
    //get phone numbers from phoneNos factory
    /*phoneNos.then(function(data){
        var test = data;
        console.log(test);
    })*/ //somehow this gets loaded up last
    
    // UI router: push key() as URL
    var loopId = $stateParams.key;
    //console.log(loopId); //success
    
    // method to retrieve loop name if and when key === key
    $scope.title = [];
    var ref = new Firebase('https://vivid-heat-1234.firebaseio.com/loops');
    ref.on("value", function(snapshot) {
        $timeout(function() {
        snapshot.forEach(function(childSnapshot) {
          if (loopId === childSnapshot.key()) {  
              var title = childSnapshot.child("name").val();
              $scope.title.push(title);
              //console.log($scope.title);
              
              return true;
          }  else {
              //console.log("error pushing title into variable");
              }
        })
      })
    })
    
    //get auth uid and user name
    var userID = {};
    //retrieve user unique id from users node
    var userData = ref.getAuth();
    var userID = userData.uid;
    console.log(userID); //success!
    
    // get current time
    var currentDate = new Date();
    var currentDateInMS = currentDate.getTime();
    console.log(currentDateInMS);
    
    //retrieve user name
    var root = new Firebase('https://vivid-heat-1234.firebaseio.com');
    var userName = []; 
    root.child('/users').child(userID).once('value', function(snapshot) {
        userName.length = 0;
        var userVal = snapshot.val();
        userName.push(userVal.name);
        console.log(userName);
    })
    
    //$scope to initialize today's date, to be passed to view
    $scope.todaysDate = [];
    
    //$scope to initialize events
    var events = new Firebase('https://vivid-heat-1234.firebaseio.com/events/' + loopId);
    var sortEvents = events.orderByChild("start");
    $scope.events = $firebaseArray(sortEvents);
    console.log($scope.events);
    
    //$scope to initialize calendar
    $scope.eventSources = [$scope.events];
    
    //initialize events sorted by date, to be passed to view
    $scope.eventsByDate = [];
    
    //calendar configuration
    $scope.uiConfig = {
        calendar: {
            fixedWeekCount: false,
            //height: "auto",
            contentHeight: "350",
            editable: true,
            selectable: true,
            select: function(start, end, jsEvent, view) {
                var start = moment(start).format();
                //console.log(start);
                //ties to eventDate in addEvent modal for default value
                $scope.eventDate = new Date(start);
                //console.log($scope.eventDate);
            },
            dayClick: function(date, jsEvent, view) {
                this.addTouch();
                //push Date into $scope.todaysDate to be passed into view
                var todaysDate = date.format('Do MMMM YYYY');
                $scope.todaysDate.length = 0;
                $scope.todaysDate.push(todaysDate);
                
                //push Events into list
                $scope.eventsByDate.length = 0;
                var truncatedDate = date.format('YYYY-MM-DD');
                //console.log(truncatedDate); // 2016-02-11
                var eventsByDate = new Firebase("https://vivid-heat-1234.firebaseio.com/events/" + loopId);
                eventsByDate.orderByChild("start").on("child_added",function(eventsSnapshots) {
                    
                    var singleEvent = eventsSnapshots.val();
                    var key = eventsSnapshots.key();
                    //console.log(key); //unique ID of events
                    var singleEventDate = moment(singleEvent.start).format();
                    //console.log(singleEventDate); //logs datetime in ISO format by order of eventkey i.e. whichever came first
                    //console.log(singleEventDate);
                        
                    if (singleEventDate.includes(truncatedDate)) {
                        //retrieve event date, time, title and location and push to array $scope.eventsByDate
                        var singleEventTime = moment(singleEventDate).format('hh:mm a');
                        //console.log(singleEventTime);
                        $scope.eventsByDate.push({key: key, title: singleEvent.title, location: singleEvent.location, time: singleEventTime, start: singleEventDate});
                        console.log($scope.eventsByDate); 
                    } else {
                        //do nothing
                    }
                })
            },
            /*eventClick: function(event, jsEvent, view) {
                this.addTouch();
            },*/
            eventDrop: function(event, delta, revertFunc) {
                /*alert(event.title + " was dropped on " + event.start.format());
                if (!confirm("Are you sure about this change?")) {
                    revertFunc();
                }*/
                //console.log(event.start._d.toISOString()); //new time
                //console.log(event.start._i); //original time
                //console.log(event); //event from eventDrop function
                //console.log(event);
                
                //update Firebase event Start parameter
                events.on("value", function(eventSnapshots){
                    eventSnapshots.forEach(function(eventChild) {
                        
                        var loopChildKey = eventChild.key();
                        console.log(loopChildKey);
                        var loopChildVal = eventChild.val();
                        console.log(loopChildVal.title);
                        //console.log(loopChild.key());
                        
                        if(event.$id === loopChildKey) {
                            console.log(true); //true
                            //replace loopChild.start with event.start.d.toISOString()
                            var key = eventChild.key();
                            console.log(key);
                            
                            var newStart = event.start._d.toISOString();
                            console.log(newStart);
                            events.child(key).update({start: newStart});
                            root.child("changes").child(loopId).child(currentDateInMS).set(userName + " " + "rescheduled event:" + " " + loopChildVal.title);
                            return
                        } else {
                            // do nothing
                        }
                        
                    })  
                })
            },
            timezone: 'local',
            firstDay: 1,
            header: {
                left: 'prev',
                center: 'title',
                right: 'next'
            },
            eventRender: function(event, element, view) {
                element.qtip({
                    content: {
                        title: event.title,
                        text: event.location
                    },
                    style: {
                        classes: 'qtip-light qtip-rounded',
                    },
                    show: {
                        solo: true,
                    },
                    hide: 'unfocus',
                    position: {
                        viewport: true,
                    }
                });
                element.addTouch();
            },
        },
    },
    
    $ionicPopover.fromTemplateUrl('users.html', {
        scope: $scope
    }).then(function(addUserPopup) {
        $scope.addUserPopup = addUserPopup;
    });
    
    // function to close popover
    $scope.closePopover = function() {
        $scope.popover.hide();
    };
    
    $ionicModal.fromTemplateUrl('loop-popover.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(addEventModal) {
        $scope.addEventModal = addEventModal;
    });
    $scope.openAddEventModal = function(event, $index) {
        $scope.addEventModal.show();
    
        //function to add event details to loop in Firebase
        $scope.addEvent = function(eventName, eventDate, eventLocation) {
            //extract color from /loops tree
            var colorRef = new Firebase("https://vivid-heat-1234.firebaseio.com/loops/" + loopId);
            var color = colorRef.on("value", function(data) {
                var loopColor = data.val();
                //console.log(loopColor.color);
        
                var datetime = eventDate.toISOString();
                //an atomic update to various locations upon introduction of a new event
                $scope.events.$add({
                    title: eventName,
                    start: datetime,
                    stick: true,
                    location: eventLocation,
                    allDay: false,
                    color: loopColor.color
                })
                root.child("changes").child(loopId).child(currentDateInMS).set(userName + " " +  "added new event:" + " " + eventName);
            })
        
            //re-up calendar with added event
            $scope.eventSources = [$scope.events];
        
            //clear input fields
            this.eventName = null;
            this.eventDate = null;
            this.eventLocation = null;
        };
    }
    $scope.closeAddEventModal = function() {
        $scope.addEventModal.hide();
    };
        
    //$ionicModal for event editing
    $ionicModal.fromTemplateUrl('edit-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;
    });
    $scope.openModal = function(event, $index) {
        $scope.modal.show();
        //console.log(event); //logs event object
        //console.log(event.title); //logs event title
        //console.log(event.start); //logs event start
        //console.log(event.location); //logs event location
        
        //edit event; it is possible to proceed even with one input only with the other 2 fields remaining the same
        var key = event.key;
        $scope.eventSources = [$scope.events];
        $scope.updateEvent = function(updateTitle, updateDateTime, updateLocation) {
            var update = $scope.events.$getRecord(key);
            console.log(updateTitle);
            console.log(updateDateTime);
            console.log(updateLocation);
            
            if (updateTitle == null && updateDateTime == null && updateLocation == null) {
                //combination 1 - no input at all
                console.log(1);
                update.title = event.title;
                update.start = event.start;
                update.location = event.location;
            } else if (updateTitle != null && updateDateTime != null && updateLocation != null) {
                //combination 2 - all input
                console.log(2);
                var datetime = updateDateTime.toISOString();
                update.title = updateTitle;
                update.start = datetime;
                update.location = updateLocation;
            } else if (updateTitle != null && updateDateTime != null && updateLocation == null) {
                //combination 3 - title and datetime input
                console.log(3);
                var datetime = updateDateTime.toISOString();
                update.title = updateTitle;
                update.start = datetime;
                update.location = event.location;
            } else if (updateTitle != null && updateDateTime == null && updateLocation != null) {
                //combination 4 - title and location input
                console.log(4);
                update.title = updateTitle;
                update.start = event.start;
                update.location = updateLocation;
            } else if (updateTitle == null && updateDateTime != null && updateLocation != null) {
                //combination 5 - datetime and location input
                console.log(5);
                var datetime = updateDateTime.toISOString();
                update.title = event.title;
                update.start = datetime;
                update.location = updateLocation;
            } else if (updateTitle != null && updateDateTime == null && updateLocation == null) {
                //combination 6 - title input only
                console.log(6);
                update.title = updateTitle;
                update.start = event.start;
                update.location = event.location;
            } else if (updateTitle == null && updateDateTime != null && updateLocation == null) {
                //combination 7 - datetime input only
                console.log(7);
                var datetime = updateDateTime.toISOString();
                update.title = event.title;
                update.start = datetime;
                update.location = event.location;
            } else if (updateTitle == null && updateDateTime == null && updateLocation != null) {
                //combination 8 - location input only
                console.log(8);
                update.title = event.title;
                update.start = event.start;
                update.location = updateLocation;
            }            
            console.log(update.title);
            console.log(update.start);
            console.log(update.location);
            $scope.events.$save(update).then(function(sortEvents) {
                 console.log($scope.eventsByDate[$index]);
                var time = moment(update.start).format('hh:mm a');
                //console.log(time);
                $scope.eventsByDate[$index].title = update.title;
                $scope.eventsByDate[$index].time = time;
                $scope.eventsByDate[$index].start = update.start;
                $scope.eventsByDate[$index].location = update.location;
          
                //notification of event edit
                root.child("changes").child(loopId).child(currentDateInMS).set(userName + " " + "edited event: " + event.title);
                
                //clear [$scope.events] & reload events
                //console.log($scope.events.length);
                $scope.events.splice(0, $scope.events.length);
                //console.log($scope.events);
                
                var newSortEvents = events.orderByChild("start");
                $scope.reloadEvents = $firebaseArray(newSortEvents);
                $scope.reloadEvents.$loaded().then(function(events) {
                    //console.log(events);
                    //console.log(events.length);
                    for(var i=0; i<events.length; i++) {
                        $scope.events.push(events[i]);
                    }
                    //console.log($scope.events);
                })  
            })
            //clear inputfields
            this.updateTitle = null;
            this.updateDateTime = null;
            this.updateLocation = null;
        }  
    };
    $scope.closeModal = function() {
        $scope.modal.hide();
        $ionicListDelegate.closeOptionButtons();
    };
    
    //ionicModal to show list of members in Loop
    $ionicModal.fromTemplateUrl('users-modal.html', {
        scope:$scope,
        animation: 'slide-in-up'
    }).then(function(userModal) {
        $scope.userModal = userModal;
    });
    
    $scope.openuserModal = function() {
        $scope.userModal.show ();
        $timeout(function() {
            $ionicSlideBoxDelegate.update();
        })
    }
    
    $scope.closeuserModal = function() {
        $scope.userModal.hide();
    }
    
    //showConfirm function for popup to delete event
    $scope.showConfirm = function(event, $index) {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Delete Event',
            template: 'Are you sure you want to delete this event?',
            cancelText: 'No',
            cancelType: 'button-default',
            okText: 'Yes',
            okType: 'button-dark'
        });
            confirmPopup.then(function(res){
                if(res) {
                    console.log(event);
                    //console.log($index);
                    var eventKey = event.key;
                    //console.log(eventKey); //yields event key
                    var ref = new Firebase('https://vivid-heat-1234.firebaseio.com/events/' + loopId + '/' + eventKey);
                    ref.remove();
                    
                    //update $scope.eventsByDate to delete $index item from ng-repeat list in view
                    $scope.eventsByDate.splice($index, 1);
                    
                    //save changes in notifications
                    root.child("changes").child(loopId).child(currentDateInMS).set(userName + " " + "deleted event:" + " " + event.title);
                } else {
                    $ionicListDelegate.closeOptionButtons();
                }
            })
        }
    
    $scope.user =[];
    //search users to be added into Loop
    $scope.searchUser = function(email) {
        $scope.users = usersService;
        $scope.user.length = 0;
        console.log($scope.users);
        for(i=0; i<$scope.users.length; i++) {
            if (email === $scope.users[i].email) {
                $scope.user.push({name:$scope.users[i].name, uid: $scope.users[i].$id});
            }
        }
        console.log($scope.user);
        //clear input field
        this.email = null;
    }
    
    Array.prototype.contains = function (element) {
        for (var i=0; i < this.length; i++) {
            if (this[i] == element) {
                return true;
            }
        }
        return false;
    }
    
    //get contacts from phone
    $scope.contacts = []; //initialize scope
    $scope.phoneNo = []; //initialize scope
    $scope.contactsToShow = []; //initialize scope
    $cordovaContacts.find({filter: '', multiple: true, desiredFields: ['displayName', 'phoneNumbers']}).then(function(allContacts){
        //console.log(allContacts);
        $scope.contacts = allContacts;
        //search users by phone number saved in Firebase
        $scope.phoneNos = usersService;
        //console.log($scope.phoneNos);
        for(var i=0; i<$scope.phoneNos.length; i++) {
            if($scope.phoneNos[i].phoneNo != null) {
                //console.log($scope.phoneNos[i].$id);
                var strFirebase = $scope.phoneNos[i].phoneNo;
                var newStrFirebase = strFirebase.replace(/[^a-zA-Z0-9]/g, '');
                $scope.phoneNo.push(newStrFirebase);
            }
        }
        //console.log($scope.contacts);
        console.log($scope.phoneNo); 
        console.log($scope.contacts.length);
        for(var i=0; i<$scope.contacts.length; i++) {
            console.log($scope.contacts[i].phoneNumbers);
            if($scope.contacts[i].phoneNumbers != null) {
                for(var j=0; j<$scope.contacts[i].phoneNumbers.length; j++) {
                    //console.log($scope.contacts[i].phoneNumbers[j]);
                    //console.log($scope.contacts[i].phoneNumbers[j].value);
                    var str = $scope.contacts[i].phoneNumbers[j].value;
                    var newStr = str.replace(/[^a-zA-Z0-9]/g, '');
                    console.log(newStr);
                    if (newStr.length > 5) {
                        for(var k=0; k<$scope.phoneNo.length; k++) {
                            var index = $scope.phoneNo[k].indexOf(newStr);
                            //console.log(testIndex);
                            if (index >= 0) {
                            $scope.contactsToShow.push($scope.contacts[i]);
                            console.log($scope.contactsToShow);
                            } else {
                            //console.log(false);
                            }
                        }
                    }
                        /*if ($scope.phoneNo.includes(newStr)) {
                            console.log(true);
                            $scope.contactsToShow.push($scope.contacts[i]);
                            console.log($scope.contactsToShow);
                        } else {
                            console.log(false);
                        }*/
                }
            }  
        }
    }, function(error) {
        console.log("ERROR: " + error);
    });
    
    //add selected contact from Contact List into firebase
    $scope.addContactToFirebase = function addContactToFirebase(contact) {
        console.log(contact.phoneNumbers);
        console.log(contact.phoneNumbers.length)
        //to account for possibility of 2 or more contacts in users' contact list
        for(var i=0; i<contact.phoneNumbers.length; i++) {
            var str1 = contact.phoneNumbers[i].value;
            var newStr1 = str1.replace(/[^a-zA-Z0-9]/g, '');
            console.log(newStr1);
            //console.log($scope.contacts);
            console.log($scope.phoneNos); //from users service
            console.log($scope.phoneNos.length);
            for(var j=0; j<$scope.phoneNos.length; j++) {
                if($scope.phoneNos[j].phoneNo != null) {
                    var str2 = $scope.phoneNos[j].phoneNo;
                    var newStr2 = str2.replace(/[^a-zA-Z0-9]/g, '');
                    console.log(newStr2);
                    var index = newStr2.indexOf(newStr1);
                    if(index >= 0) {
                        console.log(index);
                        var contact$ID = $scope.phoneNos[j].$id;
                        var contactName = $scope.phoneNos[j].name;
                        //console.log(contact$ID);
                        //console.log(contactName);
                        //console.log(loopId);
                        //console.log(currentDateInMS);
                        var contactRef = new Firebase("https://vivid-heat-1234.firebaseio.com/users/" + contact$ID + "/loops");
                        var initial = false;
                        contactRef.once("value", function(snapshot) {
                            snapshot.forEach(function(childSnapshot) {
                                var key = childSnapshot.key();
                                console.log(key);
                                if(key === loopId) {
                                    //Do nothing as contact already part of group
                                    var alertPopup = $ionicPopup.alert({
                                        title: 'Alert',
                                        template: 'Contact already part of this loop',
                                        okType: 'button-dark'
                                    })
                                    initial = true;
                                } else if (key != loopId) {
                                    //
                                }
                            })
                        })
                        if (initial == false) {
                            console.log("user not part of any loop")
                            root.child("members").child(loopId).child(contact$ID).set(true);
                            root.child("users").child(contact$ID).child("loops").child(loopId).set(true);
                            root.child("changes").child(loopId).child(currentDateInMS).set(userName + " " + "added" + " " + contactName);
                            
                            var alertPopup = $ionicPopup.alert ({
                                        title: 'Alert',
                                        template: 'Successfully added user into loop',
                                        okType: 'button-dark'
                                    })
                        }                
                    } else {
                        console.log(false);
                    }
                }
            }
        }
    }
      
    //add selected user into Firebase
    $scope.addUserToFirebase = function addUserToFirebase(name, uid) {
        //console.log(name); //success
        //console.log(uid); //success
        var ref = new Firebase("https://vivid-heat-1234.firebaseio.com");
        ref.child("members").child(loopId).child(uid).set(true);
        ref.child("users").child(uid).child("loops").child(loopId).set(true);
        
        ref.child("changes").child(loopId).child(currentDateInMS).set(userName + " " + "added" + " " + name);
        
        //alert popup upon successfully added user into loop
        var alertPopup = $ionicPopup.alert ({
            title: 'Alert',
            template: 'Successfully added user into loop',
            okType: 'button-dark'
        });
    }
    
    //list of members of a loop
    $scope.membersOfLoop = [];
    var membersRef = new Firebase("https://vivid-heat-1234.firebaseio.com/members/" + loopId);
    membersRef.on("value", function(snapshot) {
        $scope.membersOfLoop.length = 0;
        $scope.users = usersService;
        
        snapshot.forEach(function(childSnapshot) {
            var uid = childSnapshot.key();
            //console.log(uid);
            for (i=0; i<$scope.users.length; i++) {
                if(uid === $scope.users[i].$id) {
                    $scope.membersOfLoop.push({name: $scope.users[i].name});
                }
            }
        })
        //console.log($scope.membersOfLoop); //success
    })
    
    //list of notifications
    $scope.notifications = [];
    var notificationsRef = new Firebase("https://vivid-heat-1234.firebaseio.com/changes/" + loopId);
    //limit to the 15 most recent notifications
    var query = notificationsRef.limitToLast(10);
    $scope.notifications = $firebaseArray(query);
    console.log($scope.notifications);
})

app.controller('MyCalendarCtrl', ["$scope", "$ionicPopover", "$timeout", "loopsFactory", "uiCalendarConfig", "loopsArray", "$ionicModal", "$firebaseArray", "$ionicPopup", "$ionicListDelegate", "$ionicLoading", function($scope, $ionicPopover, $timeout, loopsFactory, uiCalendarConfig, loopsArray, $ionicModal, $firebaseArray, $ionicPopup, $ionicListDelegate, $ionicLoading) {
    
    $scope.show = function() {
        $ionicLoading.show({
            template: '<p>Synchronising events...</p><ion-spinner></ion-spinner>'
        })
    };
    $scope.hide = function() {
        $ionicLoading.hide();
    };
    
    var ref = new Firebase('https://vivid-heat-1234.firebaseio.com');
    
    var uid = {};
    //retrieve user unique id from users node
    var userData = ref.getAuth();
    var uid = userData.uid;
    console.log(uid); //success!
    
    //get current time
    var currentDate = new Date();
    var currentDateInMS = currentDate.getTime();
    console.log(currentDateInMS);
    
    //retrieve user name
    var userName = [];
    ref.child('/users').child(uid).once('value', function (snapshot) {
        userName.length = 0;
        var userVal = snapshot.val();
        userName.push(userVal.name);
        console.log(userName);
    })
    
    /*$scope.$on('$ionicView.beforeEnter', function(){
        $scope.show($ionicLoading);
    });*/
    
    //$scope to initialize personal events
    var personal = ref.child('personalEvents').child(uid);
    var sortPersonal = personal.orderByChild('start');
    $scope.personalEvents = $firebaseArray(sortPersonal);
    console.log($scope.personalEvents);
    
    //initialize scope for consolidated Events
    
    $scope.allEvents = $scope.personalEvents;
    
    $scope.filterLoops = [];
    var loopUIDfromUser = [];
    var loopObject = [];
    var eventKeys = [];
    // test $scope / var
    $scope.eventsTest = [];
    var eventUID = [];
    
    //filter list of loops to show only those users are authorized to see
    var userRef = new Firebase('https://vivid-heat-1234.firebaseio.com/users/' + uid + '/loops');
    var loops = new Firebase('https://vivid-heat-1234.firebaseio.com/loops/');
    var allEventsRoot = new Firebase('https://vivid-heat-1234.firebaseio.com/events');
    
    /*userRef.on("child_added", function(userSnapshot) {
        var loopIDinUser = userSnapshot.key();
        console.log(loopIDinUser);
        loopUIDfromUser.push(loopIDinUser);
        //console.log(loopUIDfromUser);
        
        loops.child(loopIDinUser).on("value", function (loopSnapshot) {
            var loopKey = loopSnapshot.key();
            var loopValue = loopSnapshot.val();
            console.log(loopKey);
            console.log(loopValue);
            //to avoid error in callback when adding/deleting loop in Loops tab
            if(loopValue != null) {
                $scope.filterLoops.push({key: loopIDinUser, name: loopValue.name});
            }
            console.log($scope.filterLoops);
        })
        
        allEventsRoot.child(loopIDinUser).on("child_added", function(eventSnapshot) {            
            $timeout(function() {
              var eventKey = eventSnapshot.key();
              var eventValue = eventSnapshot.val();
              //console.log(eventKey);
              //console.log(eventValue);
              $scope.allEvents.push({title: eventValue.title, start: eventValue.start, stick: eventValue.stick, location: eventValue.location, allDay: eventValue.allDay, color: eventValue.color, key: loopIDinUser, eventKey: eventKey});
            })
        })
    })*/
    
    //get loopID from users tree signifying the loops a user are a member of
    userRef.on("value", function(userSnapshot) {
        $scope.show($ionicLoading);
        loopUIDfromUser.length = 0;
        var user = userSnapshot.val();
        //console.log(user);
        //console.log(Object.keys(user).length);
        for (var loopUID in user) {
            if (user.hasOwnProperty(loopUID)) {
                var index = loopUIDfromUser.indexOf(loopUID);
                if (index = -1) {
                    loopUIDfromUser.push(loopUID);
                }
            }
        }
        console.log(loopUIDfromUser);
        //get the list of loops
        loops.on("value", function(loopSnapshot) {
            loopObject.length = 0;
            var loop = loopSnapshot.val();
            for (var loopUID in loop) {
                if (loop.hasOwnProperty(loopUID)) {
                    //console.log(loopUID);
                    //console.log(loop[loopUID]);
                    loopObject.push({key: loopUID, name: loop[loopUID].name})
                    console.log(loopObject);
                }
            }
            //console.log(loopObject.length);
            $scope.filterLoops.length = 0;
            //filter the list of loops with the list of loops a user is a member of i.e. find commonalities
            angular.forEach(loopUIDfromUser, function (key) {
                for (var i=0; i<loopObject.length; i++) {
                    if (key === loopObject[i].key) {
                        $scope.filterLoops.push(loopObject[i]);
                    }
                }
            })
            console.log($scope.filterLoops);
        })
        //--------- TEST CODE
        console.log($scope.filterLoops);
        //var initialDataLoaded = false;
        angular.forEach($scope.filterLoops, function(key) {
            var loopUID = key.key;
            console.log(loopUID);
            var allEventsRef = new Firebase("https://vivid-heat-1234.firebaseio.com/events/" + loopUID);
            /*allEventsRef.on("child_added", function(snapshot) {
                if(initialDataLoaded) {
                    snapshot.forEach(function(child) {
                        var key11 = child.key();
                        var val11 = child.val();
                        console.log(key11);
                        console.log(val11);
                    })
                } else {
                    //ignore as child is preexisting data
                }
            })*/
            allEventsRef.on("value", function(allSnapshot) {
                allSnapshot.forEach(function(childSnapshot) {
                    var key = childSnapshot.key();
                    var val = childSnapshot.val();
                    //console.log(key); //logs event UID
                    //console.log(val); //logs event object
                    var eventIndex = eventUID.indexOf(key);
                    console.log(eventIndex);
                    if (eventIndex == -1) {
                        eventUID.push(key);
                        console.log(eventUID);
                        $scope.allEvents.push({title: val.title, start: val.start, stick: val.stick, location: val.location, allDay: val.allDay, color: val.color, key: loopUID, eventKey: key});
                    } else if (eventIndex >= 0) {
                        //Do nothing as yet
                    }
                })    
                allEventsRef.on('child_removed', function(allSnapshot) {
                    var key = allSnapshot.key();
                    var val = allSnapshot.val();
                    //console.log(key); //logs event UID
                    //console.log(val); //logs event object
                    for(var i=0; i<$scope.allEvents.length; i++) {
                        if(key === $scope.allEvents[i].eventKey) {
                            //console.log(i);
                            $scope.allEvents.splice(i,1);
                            //console.log($scope.allEvents[i]);
                        }
                    }
                })
                allEventsRef.on('child_changed', function(allSnapshot) {
                    var key = allSnapshot.key();
                    var val = allSnapshot.val();
                    //console.log(key); //logs eventUID
                    console.log(val); //logs event object
                    for(var i=0; i<$scope.allEvents.length; i++) {
                        if(key === $scope.allEvents[i].eventKey) {
                            //console.log($scope.allEvents[i].title);
                            $scope.allEvents[i].title = val.title;
                            //console.log($scope.allEvents[i].title)
                            $scope.allEvents[i].start = val.start;
                            $scope.allEvents[i].location = val.location;
                            //console.log($scope.allEvents[i].start);
                            //console.log($scope.allEvents[i].location)
                        }
                    }
                })
                console.log($scope.allEvents);
                $scope.hide($ionicLoading);
            })
        })
        /*allEventsRoot.once("value", function (allSnapshot) {
            $timeout(function() {
                allSnapshot.forEach(function(childSnapshot) {
                    var key = childSnapshot.key();
                    var val = childSnapshot.val();
                    console.log(key);
                    console.log(val);
                })
            })
        })*/
        
        //---------- END OF TEST CODE
        //get all events data from events tree
        /*allEventsRoot.on("value", function (allSnapshot) {
            $timeout(function() {
                eventKeys.length = 0;
                allSnapshot.forEach(function(childSnapshot) {
                    var key = childSnapshot.key();
                    eventKeys.push(key);
                })
                //console.log(eventKeys);
                //console.log($scope.filterLoops);
                //$scope.allEvents.length = 0;
                angular.forEach(eventKeys, function (key,value){
                    for (var i=0; i<$scope.filterLoops.length; i++) {
                        if (key === $scope.filterLoops[i].key) {
                            //console.log(key);
                            var eventData = allEventsRoot.child(key);
                            eventData.on("child_added", function(allEventsSnapshot) {
                                var allEventKey = allEventsSnapshot.key();
                                var allEventData = allEventsSnapshot.val();
                                console.log(allEventKey);
                                console.log(allEventData);
                                $scope.allEvents.push({title: allEventData.title, start: allEventData.start, stick: allEventData.stick, location: allEventData.location, allDay: allEventData.allDay, color: allEventData.color, key: key, eventKey: allEventKey});
                            })
                        }  
                    }
                })
                console.log($scope.allEvents);
                $scope.hide($ionicLoading);
                //remove duplicates
                /*var test=[];
                for (var i=0; i<$scope.allEvents.length; ++i) {
                    for (var j=i+1; j<$scope.allEvents.length; ++j) {
                        if ($scope.allEvents[i].eventKey === $scope.allEvents[j].eventKey && $scope.allEvents[i].key === $scope.allEvents[j].key || $scope.allEvents[i].$id != null) {
                            test.push($scope.allEvents[i]);
                            console.log(test);
                        }
                    }
                }*/
                
                //alert instruction if [$scope.allEvents] is empty
                /*if (loopUIDfromUser.length === 0 && $scope.filterLoops.length === 0 && $scope.allEvents.length === 0) {
                    var startPopup = $ionicPopup.alert({
                        title: 'Welcome to Loop!',
                        template: 'Add personal events here or navigate to Loop to start a joint calendar.',
                        buttons: [{
                            text: "Get Started",
                            type: 'button-dark'
                        }]
                    })
                }*/
            //})
        //})
    })
   
    $ionicPopover.fromTemplateUrl('my-popover.html', {
        scope: $scope
    }).then(function(popover) {
        $scope.popover = popover;
    });
    
    //ionicModal for adding personal event
    $ionicModal.fromTemplateUrl('add-personal-event.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(addEventModal) {
        $scope.addEventModal = addEventModal;
    });
    $scope.openAddEventModal = function(event, $index) {
        $scope.addEventModal.show();
        
        //add personal event details
        $scope.addPersonalEvent = function(name, date, location) {
            console.log(name);
            console.log(date);
            console.log(location);
            var datetime = date.toISOString();
            console.log(datetime);
            
            $scope.personalEvents.$add({
                title: name,
                start: datetime,
                stick: true,
                location: location,
                allDay: false,
                backgroundColor: "#ffffff",
                borderColor: "#000000",
                textColor: "#000000",
            })
            console.log($scope.allEventsByDate);
            //push event into $scope.allEventsByDate and sort
            var singleEventTime = moment(date).format('hh:mm a');
            console.log(singleEventTime);
            $scope.allEventsByDate.push({title: name, location: location, time: singleEventTime, start: datetime});
            console.log($scope.allEventsByDate);
            
            $scope.allEventsByDate.sort(function(a,b) {
                return new Date(a.start).getTime() - new Date(b.start).getTime();
            })
        }
        this.name = null;
        this.date = null;
        this.location = null;
    }
    $scope.closeAddEventModal = function() {
        $scope.addEventModal.hide();
        $ionicListDelegate.closeOptionButtons();
    }
    
    //ionicModal for event editing
    $ionicModal.fromTemplateUrl('editEventMyCalendar.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;
    });
    $scope.editEventModal = function(event, $index) {
        $scope.modal.show();
        console.log(event); //eventKey, loopID
        //console.log($index);
        
        $scope.editEvent = function (eventTitle, datetime, location) {
            if(event.loopID == null) { //for personal events
                console.log("personal");
                var update = $scope.personalEvents.$getRecord(event.eventKey);
                console.log(update);
                
                if (eventTitle == null && datetime == null && location == null) {
                    //combination 1 - no input at all
                    console.log(1);
                    update.title = event.title;
                    update.start = event.start;
                    update.location = event.location;
                } else if (eventTitle != null && datetime != null && location != null) {
                    //combination 2 - all input
                    console.log(2);
                    var datetime = datetime.toISOString();
                    update.title = eventTitle;
                    update.start = datetime;
                    update.location = location;
                } else if (eventTitle != null && datetime != null && location == null) {
                    //combination 3 - title and datetime input
                    console.log(3);
                    var datetime = datetime.toISOString();
                    update.title = eventTitle;
                    update.start = datetime;
                    update.location = event.location;
                } else if (eventTitle != null && datetime == null && location != null) {
                    //combination 4 - title and location input
                    console.log(4);
                    update.title = eventTitle;
                    update.start = event.start;
                    update.location = location;
                } else if (eventTitle == null && datetime != null && location != null) {
                    //combination 5 - datetime and location input
                    console.log(5);
                    var datetime = datetime.toISOString();
                    update.title = event.title;
                    update.start = datetime;
                    update.location = location;
                } else if (eventTitle != null && datetime == null && location == null) {
                    //combination 6 - title input only
                    console.log(6);
                    update.title = eventTitle;
                    update.start = event.start;
                    update.location = event.location;
                } else if (eventTitle == null && datetime != null && location == null) {
                    //combination 7 - datetime input only
                    console.log(7);
                    var datetime = datetime.toISOString();
                    update.title = event.title;
                    update.start = datetime;
                    update.location = event.location;
                } else if (eventTitle == null && datetime == null && location != null) {
                    //combination 8 - location input only
                    console.log(8);
                    update.title = event.title;
                    update.start = event.start;
                    update.location = location;
                }
                console.log(update.title);
                console.log(update.start);
                console.log(update.location);
                
                //save changes to Firebase & reflect in $scope.allEvents
                $scope.personalEvents.$save(update).then(function(){
                    //update $scope.allEventsByDate
                    console.log($scope.allEventsByDate[$index]);
                    var time = moment(update.start).format('hh:mm a');
                    $scope.allEventsByDate[$index].title = update.title;
                    $scope.allEventsByDate[$index].time = time;
                    $scope.allEventsByDate[$index].start = update.start;
                    $scope.allEventsByDate[$index].location = update.location;
                })
                
            } else if (event.loopID != null){ //loop events
                console.log("loop"); 
                var update = [];
                
                if (eventTitle == null && datetime == null && location == null) {
                    //combination 1 - no input at all
                    console.log(1);
                    update.title = event.title;
                    update.start = event.start;
                    update.location = event.location;
                } else if (eventTitle != null && datetime != null && location != null) {
                    //combination 2 - all input
                    console.log(2);
                    var datetime = datetime.toISOString();
                    update.title = eventTitle;
                    update.start = datetime;
                    update.location = location;
                } else if (eventTitle != null && datetime != null && location == null) {
                    //combination 3 - title and datetime input
                    console.log(3);
                    var datetime = datetime.toISOString();
                    update.title = eventTitle;
                    update.start = datetime;
                    update.location = event.location;
                } else if (eventTitle != null && datetime == null && location != null) {
                    //combination 4 - title and location input
                    console.log(4);
                    update.title = eventTitle;
                    update.start = event.start;
                    update.location = location;
                } else if (eventTitle == null && datetime != null && location != null) {
                    //combination 5 - datetime and location input
                    console.log(5);
                    var datetime = datetime.toISOString();
                    update.title = event.title;
                    update.start = datetime;
                    update.location = location;
                } else if (eventTitle != null && datetime == null && location == null) {
                    //combination 6 - title input only
                    console.log(6);
                    update.title = eventTitle;
                    update.start = event.start;
                    update.location = event.location;
                } else if (eventTitle == null && datetime != null && location == null) {
                    //combination 7 - datetime input only
                    console.log(7);
                    var datetime = datetime.toISOString();
                    update.title = event.title;
                    update.start = datetime;
                    update.location = event.location;
                } else if (eventTitle == null && datetime == null && location != null) {
                    //combination 8 - location input only
                    console.log(8);
                    update.title = event.title;
                    update.start = event.start;
                    update.location = location;
                }
                console.log(update.title);
                console.log(update.start);
                console.log(update.location);
                
                //update $scope.allEventsByDate
                console.log($scope.allEventsByDate[$index]);
                var time = moment(update.start).format('hh:mm a');
                $scope.allEventsByDate[$index].title = update.title;
                $scope.allEventsByDate[$index].time = time;
                $scope.allEventsByDate[$index].start = update.start;
                $scope.allEventsByDate[$index].location = update.location;
                
                //update event detail in Events node & reflect in $scope.allEvents
                allEventsRoot.child(event.loopID).child(event.eventKey).update({
                    title: update.title,
                    start: update.start,
                    location: update.location
                })
                //clear input fields
                this.eventTitle = null;
                this.datetime = null;
                this.location = null;
                //$scope.allEvents.length = 0;
                //$scope.allEvents.splice(0, $scope.allEvents.length);
                //console.log($scope.allEvents);
            }
            //console.log($scope.allEvents);
        }
    }
    $scope.closeModal = function() {
        $scope.modal.hide();
        $ionicListDelegate.closeOptionButtons();
    }
    
    //initialize array for dayClick
    $scope.todaysDate = [];
    $scope.allEventsByDate = [];
    
    //config calendar
    $scope.uiConfig = {
        calendar: {
            //height: "auto",
            contentheight: "350",
            fixedWeekCount: false,
            editable: false,
            timezone: 'local',
            selectable: true,
            select: function(start, end, jsEvent, view) {
                var start = moment(start).format();
                //ties to date in addPersonalEvent modal for default value
                $scope.date = new Date(start);
            },
            firstDay: 1,
            header: {
                left: 'prev',
                center: 'title',
                right: 'next'
            },
            dayClick: function(date, jsEvent, view) {
                //pass clicked date into $scope.todaysDate to be passed to view as text in divider
                this.addTouch();
                var todaysDate = date.format('Do MMMM YYYY');
                $scope.todaysDate.length = 0;
                $scope.todaysDate.push(todaysDate);
                
                //push sorted Events into list
                $scope.allEventsByDate.length = 0;
                var selectedDate = date.format('YYYY-MM-DD');
                console.log(selectedDate);
                
                //console.log($scope.allEvents);
                
                angular.forEach($scope.allEvents, function (key) {
                    console.log(key);
                    if (key.eventKey == null) {
                        var singleEventDate = moment(key.start).format();
                        if(singleEventDate.includes(selectedDate)) {
                            var singleEventTime = moment(singleEventDate).format('hh:mm a');
                            $scope.allEventsByDate.push({title: key.title, location: key.location, time: singleEventTime, start: key.start, eventKey: key.$id});
                        }
                    } else {
                        var singleEventDate = moment(key.start).format();
                        if(singleEventDate.includes(selectedDate)) {
                            var singleEventTime = moment(singleEventDate).format('hh:mm a');
                            $scope.allEventsByDate.push({title: key.title, location: key.location, time: singleEventTime, start: key.start, loopID: key.key, eventKey: key.eventKey});
                        }
                    }
                    console.log($scope.allEventsByDate);
                    $scope.allEventsByDate.sort(function(a,b) {
                        return new Date(a.start).getTime() - new Date(b.start).getTime();
                    })
                })
            },
            eventRender: function (event, element, view) {
                //jquery qtip functionality to highlight event title
                element.qtip({
                    content: {
                        title: event.title,
                        text: event.location
                    },
                    style: {
                        classes: 'qtip-light qtip-rounded',
                    },
                    show: {
                        solo: true,
                    },
                    hide: 'unfocus',
                    position: {
                        viewport: true,
                    }
                });
                element.addTouch();
            },
         },
    };
    
    //initialize calendar view
    $scope.eventSources = [$scope.allEvents];
    
    //initialize filter: pushing loop key into array when unchecked and removing key from array when checked
    var loopsToHide = [];
    var loopsToHideIndex = [];
    var reloadEvents = [];
    var loopsToShow = [];
    
    $scope.uncheck = function uncheck(key) {
        //console.log(key);
        var index = loopsToHide.indexOf(key);
        if (index >= 0) { //key present in $scope.loopsToHide hence to re-introduce events into $scope.allEvents
            reloadEvents.length = 0;
            loopsToShow.length = 0;            
            loopsToHide.splice(index, 1);
            //console.log(loopsToHide);
            //recall $scope.allEvents from Firebase
            allEventsRoot.on("value", function (allSnapshot){
            $timeout(function(){
                allSnapshot.forEach(function(childSnapshot) {
                    var key = childSnapshot.key();
                    //console.log(key);
                    var eventData = allEventsRoot.child(key);
                    eventData.on("child_added", function(allEventsSnapshot) {
                        var allEventData = allEventsSnapshot.val();
                        reloadEvents.push({title:allEventData.title, start: allEventData.start, stick: allEventData.stick, location: allEventData.location, allDay: allEventData.allDay, color: allEventData.color, key: key})
                        })
                    })
                //console.log(reloadEvents);
                //isolate relevant events in [reloadEvents] with key
                //console.log(key);
                for (var i=0; i < reloadEvents.length; i++) {
                    if(key === reloadEvents[i].key) {
                        loopsToShow.push(reloadEvents[i]);
                        }
                    }
                //console.log(loopsToShow);
                for (var i=0; i < loopsToShow.length; i++) {
                    var index = $scope.allEvents.indexOf(loopsToShow[i]);
                    if (index = -1) {
                        $scope.allEvents.push(loopsToShow[i]);
                    }
                }
                //console.log($scope.allEvents);
                })
            })
            
            
            
        } else {
            loopsToHide.push(key);
            //console.log(loopsToHide);
            //take key from loopsToHide and iterate through $scope.allEvents to remove events that have keys equal to the key
            angular.forEach(loopsToHide, function (value, key) {
                //console.log(value); //logs loop key
                //console.log(key);
                console.log($scope.allEvents);
                for (var i=0; i<$scope.allEvents.length; i++) {
                    if (value === $scope.allEvents[i].key) {
                        var index1 = $scope.allEvents.indexOf($scope.allEvents[i]);
                        //console.log(index1);
                        if (loopsToHideIndex.indexOf(index1) >= 0) {
                            //Do nothing as [loopsToHideIndex] already contains index1
                        } else { //otherwise, push index1 into [loopsToHideIndex]
                            loopsToHideIndex.push(index1);
                            //console.log(loopsToHideIndex);
                        }
                    }
                }
            })
            //use [loopsToHideIndex] to alter $scope.allEvents
            loopsToHideIndex.sort(function(a,b){return a-b; }); //arrange index by descending order
            //console.log(loopsToHideIndex);
            for (var i = loopsToHideIndex.length-1; i>=0; i--) {
                $scope.allEvents.splice(loopsToHideIndex[i], 1);
            }
            loopsToHideIndex.length = 0;
        }
    }
    
    //showConfirm function for popup to delete event in mycalendar
    $scope.showConfirm = function(event, $index) {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Delete Event',
            template: 'Are you sure you want to delete this event?',
            cancelText: 'No',
            cancelType: 'button-default',
            okText: 'Yes',
            okType: 'button-dark'
        });
        confirmPopup.then(function(res) {
            if(res) {
                console.log(event);
                console.log($index);
                if (event.loopID == null) {
                    var remPersonal = new Firebase('https://vivid-heat-1234.firebaseio.com/personalEvents/' + uid + '/' + event.eventKey);
                    remPersonal.remove();
                    
                    $scope.allEventsByDate.splice($index, 1);
                } else {
                    var remLoop = new Firebase('https://vivid-heat-1234.firebaseio.com/events/' + event.loopID + '/' + event.eventKey);
                    remLoop.remove();
                    $scope.allEventsByDate.splice($index,1);
                    
                    /*for (var i=0; i<$scope.allEvents.length; i++) {
                        if(event.eventKey === $scope.allEvents[i].eventKey) {
                            $scope.allEvents.splice(i,1);
                        }
                        //console.log($scope.allEvents);
                    }*/
                    /*$scope.allEvents.splice(0, $scope.allEvents.length);
                    
                    var newPersonalEvents = personal.orderByChild("start");
                    $scope.reloadPersonalEvents = $firebaseArray(newPersonalEvents);
                    
                    $scope.reloadPersonalEvents.$loaded().then(function(events) {
                        for(var i=0; i<events.length; i++) {
                            $scope.allEvents.push(events[i]);
                        }
                    })
                    console.log($scope.allEvents);*/
                    
                    ref.child('changes').child(event.loopID).child(currentDateInMS).set(userName + " " + "deleted event:" + " " + event.title);
                }
            } else {
                $ionicListDelegate.closeOptionButtons();
            }
        })
    }
}])

app.controller('SignInCtrl', function($scope, $state, $ionicPopup, $ionicLoading) {
    $scope.show = function() {
        $ionicLoading.show({
            template: '<p>Authenticating...</p><ion-spinner></ion-spinner>'
        })
    };
    $scope.hide = function() {
        $ionicLoading.hide();
    };

    $scope.data = {};
    
    $scope.loginEmail = function() {
        var ref = new Firebase("https://vivid-heat-1234.firebaseio.com");
        $scope.show($ionicLoading);
        
        ref.authWithPassword({
            email: $scope.data.email,
            password: $scope.data.password }, function(error, userData) {
            if (error) {
                $scope.hide($ionicLoading);
                console.log("Login Failed!", error);
                var alertPopup = $ionicPopup.alert ({
                    title: 'Unable to log in',
                    template: error,
                    okType: 'button-dark'
                });
            } else {
                $scope.hide($ionicLoading);
                console.log("Authenticated successfully with payload:", userData);
                $state.go('app.mycalendar');
                //$state.go('app.loops.index');
            }
        });
        //clear input fields
        //this.data.email = null;
        //this.data.password = null;
    };
})

//controller for link tab
app.controller('LinkCtrl', function($scope) {
    
})

//controller for settings tab
app.controller('SettingsCtrl', function($scope, $state) {
    var ref = new Firebase("https://vivid-heat-1234.firebaseio.com");
    //retrieve user name
    var uid = {};
    //retrieve user unique id from users node
    var userData = ref.getAuth();
    var uid = userData.uid;
    //console.log(uid); //success!
    $scope.userName = [];
    ref.child("users").child(uid).once("value", function(snapshot) {
        var val = snapshot.val();
        $scope.userName.push(val.name);
    })
    
    //sign out
    $scope.logOut = function() {
        ref.unauth();
        $state.go('signin');
    };
})

//controller for changePassword page
app.controller('changePasswordCtrl', function($scope, $ionicPopup) {
    var ref = new Firebase("https://vivid-heat-1234.firebaseio.com");
    //retrieve user email
    var uid = {};
    //retrieve user unique id from users node
    var userData = ref.getAuth();
    var uid = userData.uid;
    console.log(uid); //success!
    
    $scope.userEmail = [];
    ref.child("users").child(uid).once("value", function(snapshot){
        var val = snapshot.val();
        $scope.userEmail.push(val.email);
    })
    //console.log(val);
    console.log($scope.userEmail); //empty
    
    //change password
    $scope.changePassword = function changePassword(current, changeTo) {
        //console.log(current); //current password
        //console.log(changeTo); //new desired password
        ref.child("users").child(uid).once("value", function (snapshot){
            var val = snapshot.val();
            var email = val.email;
            ref.changePassword({
                email: email,
                oldPassword: current,
                newPassword: changeTo 
            }, function(error) {
                if (error === null) {
                    console.log("Password successfully changed");
                    var alertPopup = $ionicPopup.alert ({
                        title: 'Change password',
                        template: 'Password successfully changed', 
                        okType: 'button-dark'
                    })
                } else {
                    console.log("Error changing password:", error );
                    var alertPopup = $ionicPopup.alert ({ 
                        title: 'Change password',
                        template: error,
                        okType: 'button-dark'
                    })
                }
            })
        })
        //clear input fields
        this.existing.Password = null;
        this.new.Password = null;
    }
})

//link mobile phone controller
app.controller('linkphoneCtrl', function($scope) {
    var ref = new Firebase("https://vivid-heat-1234.firebaseio.com");
    $scope.userPhone = [];
    var uid = {};
    //retrieve user unique id from users node
    var userData = ref.getAuth();
    var uid = userData.uid;
    console.log(uid); //success!
    
    $scope.selectedCountry = {}
    $scope.countries = [ 
        {
        name: "United States",
        dial_code: "+1",
        code: "US"
        }, 
        {
        name: "Israel",
        dial_code: "+972",
        code: "IL"
        }, 
        {
        name: "Afghanistan",
        dial_code: "+93",
        code: "AF"
    }, 
        {
        name: "Albania",
        dial_code: "+355",
        code: "AL"
    }, 
        {
        name: "Algeria",
        dial_code: "+213",
        code: "DZ"
    }, 
        {
        name: "AmericanSamoa",
        dial_code: "+1 684",
        code: "AS"
    }, 
        {
        name: "Andorra",
        dial_code: "+376",
        code: "AD"
    }, 
        {
        name: "Angola",
        dial_code: "+244",
        code: "AO"
    }, 
        {
        name: "Anguilla",
        dial_code: "+1 264",
        code: "AI"
    }, 
        {
        name: "Antigua and Barbuda",
        dial_code: "+1268",
        code: "AG"
    }, 
        {
        name: "Argentina",
        dial_code: "+54",
        code: "AR"
    }, 
        {
        name: "Armenia",
        dial_code: "+374",
        code: "AM"
    }, 
        {
        name: "Aruba",
        dial_code: "+297",
        code: "AW"
    }, 
        {
        name: "Australia",
        dial_code: "+61",
        code: "AU"
    }, 
        {
        name: "Austria",
        dial_code: "+43",
        code: "AT"
    }, 
        {
        name: "Azerbaijan",
        dial_code: "+994",
        code: "AZ"
    }, 
        {
        name: "Bahamas",
        dial_code: "+1 242",
        code: "BS"
    }, 
        {
        name: "Bahrain",
        dial_code: "+973",
        code: "BH"
    }, 
        {
        name: "Bangladesh",
        dial_code: "+880",
        code: "BD"
    }, 
        {
        name: "Barbados",
        dial_code: "+1 246",
        code: "BB"
    }, 
        {
        name: "Belarus",
        dial_code: "+375",
        code: "BY"
    }, 
        {
        name: "Belgium",
        dial_code: "+32",
        code: "BE"
    }, {
        name: "Belize",
        dial_code: "+501",
        code: "BZ"
    }, {
        name: "Benin",
        dial_code: "+229",
        code: "BJ"
    }, {
        name: "Bermuda",
        dial_code: "+1 441",
        code: "BM"
    }, {
        name: "Bhutan",
        dial_code: "+975",
        code: "BT"
    }, {
        name: "Bosnia and Herzegovina",
        dial_code: "+387",
        code: "BA"
    }, {
        name: "Botswana",
        dial_code: "+267",
        code: "BW"
    }, {
        name: "Brazil",
        dial_code: "+55",
        code: "BR"
    }, {
        name: "British Indian Ocean Territory",
        dial_code: "+246",
        code: "IO"
    }, {
        name: "Bulgaria",
        dial_code: "+359",
        code: "BG"
    }, {
        name: "Burkina Faso",
        dial_code: "+226",
        code: "BF"
    }, {
        name: "Burundi",
        dial_code: "+257",
        code: "BI"
    }, {
        name: "Cambodia",
        dial_code: "+855",
        code: "KH"
    }, {
        name: "Cameroon",
        dial_code: "+237",
        code: "CM"
    }, {
        name: "Canada",
        dial_code: "+1",
        code: "CA"
    }, {
        name: "Cape Verde",
        dial_code: "+238",
        code: "CV"
    }, {
        name: "Cayman Islands",
        dial_code: "+ 345",
        code: "KY"
    }, {
        name: "Central African Republic",
        dial_code: "+236",
        code: "CF"
    }, {
        name: "Chad",
        dial_code: "+235",
        code: "TD"
    }, {
        name: "Chile",
        dial_code: "+56",
        code: "CL"
    }, {
        name: "China",
        dial_code: "+86",
        code: "CN"
    }, {
        name: "Christmas Island",
        dial_code: "+61",
        code: "CX"
    }, {
        name: "Colombia",
        dial_code: "+57",
        code: "CO"
    }, {
        name: "Comoros",
        dial_code: "+269",
        code: "KM"
    }, {
        name: "Congo",
        dial_code: "+242",
        code: "CG"
    }, {
        name: "Cook Islands",
        dial_code: "+682",
        code: "CK"
    }, {
        name: "Costa Rica",
        dial_code: "+506",
        code: "CR"
    }, {
        name: "Croatia",
        dial_code: "+385",
        code: "HR"
    }, {
        name: "Cuba",
        dial_code: "+53",
        code: "CU"
    }, {
        name: "Cyprus",
        dial_code: "+537",
        code: "CY"
    }, {
        name: "Czech Republic",
        dial_code: "+420",
        code: "CZ"
    }, {
        name: "Denmark",
        dial_code: "+45",
        code: "DK"
    }, {
        name: "Djibouti",
        dial_code: "+253",
        code: "DJ"
    }, {
        name: "Dominica",
        dial_code: "+1 767",
        code: "DM"
    }, {
        name: "Dominican Republic",
        dial_code: "+1 849",
        code: "DO"
    }, {
        name: "Ecuador",
        dial_code: "+593",
        code: "EC"
    }, {
        name: "Egypt",
        dial_code: "+20",
        code: "EG"
    }, {
        name: "El Salvador",
        dial_code: "+503",
        code: "SV"
    }, {
        name: "Equatorial Guinea",
        dial_code: "+240",
        code: "GQ"
    }, {
        name: "Eritrea",
        dial_code: "+291",
        code: "ER"
    }, {
        name: "Estonia",
        dial_code: "+372",
        code: "EE"
    }, {
        name: "Ethiopia",
        dial_code: "+251",
        code: "ET"
    }, {
        name: "Faroe Islands",
        dial_code: "+298",
        code: "FO"
    }, {
        name: "Fiji",
        dial_code: "+679",
        code: "FJ"
    }, {
        name: "Finland",
        dial_code: "+358",
        code: "FI"
    }, {
        name: "France",
        dial_code: "+33",
        code: "FR"
    }, {
        name: "French Guiana",
        dial_code: "+594",
        code: "GF"
    }, {
        name: "French Polynesia",
        dial_code: "+689",
        code: "PF"
    }, {
        name: "Gabon",
        dial_code: "+241",
        code: "GA"
    }, {
        name: "Gambia",
        dial_code: "+220",
        code: "GM"
    }, {
        name: "Georgia",
        dial_code: "+995",
        code: "GE"
    }, {
        name: "Germany",
        dial_code: "+49",
        code: "DE"
    }, {
        name: "Ghana",
        dial_code: "+233",
        code: "GH"
    }, {
        name: "Gibraltar",
        dial_code: "+350",
        code: "GI"
    }, {
        name: "Greece",
        dial_code: "+30",
        code: "GR"
    }, {
        name: "Greenland",
        dial_code: "+299",
        code: "GL"
    }, {
        name: "Grenada",
        dial_code: "+1 473",
        code: "GD"
    }, {
        name: "Guadeloupe",
        dial_code: "+590",
        code: "GP"
    }, {
        name: "Guam",
        dial_code: "+1 671",
        code: "GU"
    }, {
        name: "Guatemala",
        dial_code: "+502",
        code: "GT"
    }, {
        name: "Guinea",
        dial_code: "+224",
        code: "GN"
    }, {
        name: "Guinea-Bissau",
        dial_code: "+245",
        code: "GW"
    }, {
        name: "Guyana",
        dial_code: "+595",
        code: "GY"
    }, {
        name: "Haiti",
        dial_code: "+509",
        code: "HT"
    }, {
        name: "Honduras",
        dial_code: "+504",
        code: "HN"
    }, {
        name: "Hungary",
        dial_code: "+36",
        code: "HU"
    }, {
        name: "Iceland",
        dial_code: "+354",
        code: "IS"
    }, {
        name: "India",
        dial_code: "+91",
        code: "IN"
    }, {
        name: "Indonesia",
        dial_code: "+62",
        code: "ID"
    }, {
        name: "Iraq",
        dial_code: "+964",
        code: "IQ"
    }, {
        name: "Ireland",
        dial_code: "+353",
        code: "IE"
    }, {
        name: "Israel",
        dial_code: "+972",
        code: "IL"
    }, {
        name: "Italy",
        dial_code: "+39",
        code: "IT"
    }, {
        name: "Jamaica",
        dial_code: "+1 876",
        code: "JM"
    }, {
        name: "Japan",
        dial_code: "+81",
        code: "JP"
    }, {
        name: "Jordan",
        dial_code: "+962",
        code: "JO"
    }, {
        name: "Kazakhstan",
        dial_code: "+7 7",
        code: "KZ"
    }, {
        name: "Kenya",
        dial_code: "+254",
        code: "KE"
    }, {
        name: "Kiribati",
        dial_code: "+686",
        code: "KI"
    }, {
        name: "Kuwait",
        dial_code: "+965",
        code: "KW"
    }, {
        name: "Kyrgyzstan",
        dial_code: "+996",
        code: "KG"
    }, {
        name: "Latvia",
        dial_code: "+371",
        code: "LV"
    }, {
        name: "Lebanon",
        dial_code: "+961",
        code: "LB"
    }, {
        name: "Lesotho",
        dial_code: "+266",
        code: "LS"
    }, {
        name: "Liberia",
        dial_code: "+231",
        code: "LR"
    }, {
        name: "Liechtenstein",
        dial_code: "+423",
        code: "LI"
    }, {
        name: "Lithuania",
        dial_code: "+370",
        code: "LT"
    }, {
        name: "Luxembourg",
        dial_code: "+352",
        code: "LU"
    }, {
        name: "Madagascar",
        dial_code: "+261",
        code: "MG"
    }, {
        name: "Malawi",
        dial_code: "+265",
        code: "MW"
    }, {
        name: "Malaysia",
        dial_code: "+60",
        code: "MY"
    }, {
        name: "Maldives",
        dial_code: "+960",
        code: "MV"
    }, {
        name: "Mali",
        dial_code: "+223",
        code: "ML"
    }, {
        name: "Malta",
        dial_code: "+356",
        code: "MT"
    }, {
        name: "Marshall Islands",
        dial_code: "+692",
        code: "MH"
    }, {
        name: "Martinique",
        dial_code: "+596",
        code: "MQ"
    }, {
        name: "Mauritania",
        dial_code: "+222",
        code: "MR"
    }, {
        name: "Mauritius",
        dial_code: "+230",
        code: "MU"
    }, {
        name: "Mayotte",
        dial_code: "+262",
        code: "YT"
    }, {
        name: "Mexico",
        dial_code: "+52",
        code: "MX"
    }, {
        name: "Monaco",
        dial_code: "+377",
        code: "MC"
    }, {
        name: "Mongolia",
        dial_code: "+976",
        code: "MN"
    }, {
        name: "Montenegro",
        dial_code: "+382",
        code: "ME"
    }, {
        name: "Montserrat",
        dial_code: "+1664",
        code: "MS"
    }, {
        name: "Morocco",
        dial_code: "+212",
        code: "MA"
    }, {
        name: "Myanmar",
        dial_code: "+95",
        code: "MM"
    }, {
        name: "Namibia",
        dial_code: "+264",
        code: "NA"
    }, {
        name: "Nauru",
        dial_code: "+674",
        code: "NR"
    }, {
        name: "Nepal",
        dial_code: "+977",
        code: "NP"
    }, {
        name: "Netherlands",
        dial_code: "+31",
        code: "NL"
    }, {
        name: "Netherlands Antilles",
        dial_code: "+599",
        code: "AN"
    }, {
        name: "New Caledonia",
        dial_code: "+687",
        code: "NC"
    }, {
        name: "New Zealand",
        dial_code: "+64",
        code: "NZ"
    }, {
        name: "Nicaragua",
        dial_code: "+505",
        code: "NI"
    }, {
        name: "Niger",
        dial_code: "+227",
        code: "NE"
    }, {
        name: "Nigeria",
        dial_code: "+234",
        code: "NG"
    }, {
        name: "Niue",
        dial_code: "+683",
        code: "NU"
    }, {
        name: "Norfolk Island",
        dial_code: "+672",
        code: "NF"
    }, {
        name: "Northern Mariana Islands",
        dial_code: "+1 670",
        code: "MP"
    }, {
        name: "Norway",
        dial_code: "+47",
        code: "NO"
    }, {
        name: "Oman",
        dial_code: "+968",
        code: "OM"
    }, {
        name: "Pakistan",
        dial_code: "+92",
        code: "PK"
    }, {
        name: "Palau",
        dial_code: "+680",
        code: "PW"
    }, {
        name: "Panama",
        dial_code: "+507",
        code: "PA"
    }, {
        name: "Papua New Guinea",
        dial_code: "+675",
        code: "PG"
    }, {
        name: "Paraguay",
        dial_code: "+595",
        code: "PY"
    }, {
        name: "Peru",
        dial_code: "+51",
        code: "PE"
    }, {
        name: "Philippines",
        dial_code: "+63",
        code: "PH"
    }, {
        name: "Poland",
        dial_code: "+48",
        code: "PL"
    }, {
        name: "Portugal",
        dial_code: "+351",
        code: "PT"
    }, {
        name: "Puerto Rico",
        dial_code: "+1 939",
        code: "PR"
    }, {
        name: "Qatar",
        dial_code: "+974",
        code: "QA"
    }, {
        name: "Romania",
        dial_code: "+40",
        code: "RO"
    }, {
        name: "Rwanda",
        dial_code: "+250",
        code: "RW"
    }, {
        name: "Samoa",
        dial_code: "+685",
        code: "WS"
    }, {
        name: "San Marino",
        dial_code: "+378",
        code: "SM"
    }, {
        name: "Saudi Arabia",
        dial_code: "+966",
        code: "SA"
    }, {
        name: "Senegal",
        dial_code: "+221",
        code: "SN"
    }, {
        name: "Serbia",
        dial_code: "+381",
        code: "RS"
    }, {
        name: "Seychelles",
        dial_code: "+248",
        code: "SC"
    }, {
        name: "Sierra Leone",
        dial_code: "+232",
        code: "SL"
    }, {
        name: "Singapore",
        dial_code: "+65",
        code: "SG"
    }, {
        name: "Slovakia",
        dial_code: "+421",
        code: "SK"
    }, {
        name: "Slovenia",
        dial_code: "+386",
        code: "SI"
    }, {
        name: "Solomon Islands",
        dial_code: "+677",
        code: "SB"
    }, {
        name: "South Africa",
        dial_code: "+27",
        code: "ZA"
    }, {
        name: "South Georgia and the South Sandwich Islands",
        dial_code: "+500",
        code: "GS"
    }, {
        name: "Spain",
        dial_code: "+34",
        code: "ES"
    }, {
        name: "Sri Lanka",
        dial_code: "+94",
        code: "LK"
    }, {
        name: "Sudan",
        dial_code: "+249",
        code: "SD"
    }, {
        name: "Suriname",
        dial_code: "+597",
        code: "SR"
    }, {
        name: "Swaziland",
        dial_code: "+268",
        code: "SZ"
    }, {
        name: "Sweden",
        dial_code: "+46",
        code: "SE"
    }, {
        name: "Switzerland",
        dial_code: "+41",
        code: "CH"
    }, {
        name: "Tajikistan",
        dial_code: "+992",
        code: "TJ"
    }, {
        name: "Thailand",
        dial_code: "+66",
        code: "TH"
    }, {
        name: "Togo",
        dial_code: "+228",
        code: "TG"
    }, {
        name: "Tokelau",
        dial_code: "+690",
        code: "TK"
    }, {
        name: "Tonga",
        dial_code: "+676",
        code: "TO"
    }, {
        name: "Trinidad and Tobago",
        dial_code: "+1 868",
        code: "TT"
    }, {
        name: "Tunisia",
        dial_code: "+216",
        code: "TN"
    }, {
        name: "Turkey",
        dial_code: "+90",
        code: "TR"
    }, {
        name: "Turkmenistan",
        dial_code: "+993",
        code: "TM"
    }, {
        name: "Turks and Caicos Islands",
        dial_code: "+1 649",
        code: "TC"
    }, {
        name: "Tuvalu",
        dial_code: "+688",
        code: "TV"
    }, {
        name: "Uganda",
        dial_code: "+256",
        code: "UG"
    }, {
        name: "Ukraine",
        dial_code: "+380",
        code: "UA"
    }, {
        name: "United Arab Emirates",
        dial_code: "+971",
        code: "AE"
    }, {
        name: "United Kingdom",
        dial_code: "+44",
        code: "GB"
    }, {
        name: "Uruguay",
        dial_code: "+598",
        code: "UY"
    }, {
        name: "Uzbekistan",
        dial_code: "+998",
        code: "UZ"
    }, {
        name: "Vanuatu",
        dial_code: "+678",
        code: "VU"
    }, {
        name: "Wallis and Futuna",
        dial_code: "+681",
        code: "WF"
    }, {
        name: "Yemen",
        dial_code: "+967",
        code: "YE"
    }, {
        name: "Zambia",
        dial_code: "+260",
        code: "ZM"
    }, {
        name: "Zimbabwe",
        dial_code: "+263",
        code: "ZW"
    }, {
        name: "land Islands",
        dial_code: "",
        code: "AX"
    }, {
        name: "Antarctica",
        dial_code: null,
        code: "AQ"
    }, {
        name: "Bolivia, Plurinational State of",
        dial_code: "+591",
        code: "BO"
    }, {
        name: "Brunei Darussalam",
        dial_code: "+673",
        code: "BN"
    }, {
        name: "Cocos (Keeling) Islands",
        dial_code: "+61",
        code: "CC"
    }, {
        name: "Congo, The Democratic Republic of the",
        dial_code: "+243",
        code: "CD"
    }, {
        name: "Cote d'Ivoire",
        dial_code: "+225",
        code: "CI"
    }, {
        name: "Falkland Islands (Malvinas)",
        dial_code: "+500",
        code: "FK"
    }, {
        name: "Guernsey",
        dial_code: "+44",
        code: "GG"
    }, {
        name: "Holy See (Vatican City State)",
        dial_code: "+379",
        code: "VA"
    }, {
        name: "Hong Kong",
        dial_code: "+852",
        code: "HK"
    }, {
        name: "Iran, Islamic Republic of",
        dial_code: "+98",
        code: "IR"
    }, {
        name: "Isle of Man",
        dial_code: "+44",
        code: "IM"
    }, {
        name: "Jersey",
        dial_code: "+44",
        code: "JE"
    }, {
        name: "Korea, Democratic People's Republic of",
        dial_code: "+850",
        code: "KP"
    }, {
        name: "Korea, Republic of",
        dial_code: "+82",
        code: "KR"
    }, {
        name: "Lao People's Democratic Republic",
        dial_code: "+856",
        code: "LA"
    }, {
        name: "Libyan Arab Jamahiriya",
        dial_code: "+218",
        code: "LY"
    }, {
        name: "Macao",
        dial_code: "+853",
        code: "MO"
    }, {
        name: "Macedonia, The Former Yugoslav Republic of",
        dial_code: "+389",
        code: "MK"
    }, {
        name: "Micronesia, Federated States of",
        dial_code: "+691",
        code: "FM"
    }, {
        name: "Moldova, Republic of",
        dial_code: "+373",
        code: "MD"
    }, {
        name: "Mozambique",
        dial_code: "+258",
        code: "MZ"
    }, {
        name: "Palestinian Territory, Occupied",
        dial_code: "+970",
        code: "PS"
    }, {
        name: "Pitcairn",
        dial_code: "+872",
        code: "PN"
    }, {
        name: "Réunion",
        dial_code: "+262",
        code: "RE"
    }, {
        name: "Russia",
        dial_code: "+7",
        code: "RU"
    }, {
        name: "Saint Barthélemy",
        dial_code: "+590",
        code: "BL"
    }, {
        name: "Saint Helena, Ascension and Tristan Da Cunha",
        dial_code: "+290",
        code: "SH"
    }, {
        name: "Saint Kitts and Nevis",
        dial_code: "+1 869",
        code: "KN"
    }, {
        name: "Saint Lucia",
        dial_code: "+1 758",
        code: "LC"
    }, {
        name: "Saint Martin",
        dial_code: "+590",
        code: "MF"
    }, {
        name: "Saint Pierre and Miquelon",
        dial_code: "+508",
        code: "PM"
    }, 
        {
        name: "Saint Vincent and the Grenadines",
        dial_code: "+1 784",
        code: "VC"
    }, 
        {
        name: "Sao Tome and Principe",
        dial_code: "+239",
        code: "ST"
        }, 
    {
        name: "Somalia",
        dial_code: "+252",
        code: "SO"
    }, 
    {
        name: "Svalbard and Jan Mayen",
        dial_code: "+47",
        code: "SJ"
    }, 
        {
        name: "Syrian Arab Republic",
        dial_code: "+963",
        code: "SY"
    }, 
        {
        name: "Taiwan, Province of China",
        dial_code: "+886",
        code: "TW"
    }, 
        {
        name: "Tanzania, United Republic of",
        dial_code: "+255",
        code: "TZ"
    }, 
        {
        name: "Timor-Leste",
        dial_code: "+670",
        code: "TL"
    }, 
        {
        name: "Venezuela, Bolivarian Republic of",
        dial_code: "+58",
        code: "VE"
    }, 
        {
        name: "Viet Nam",
        dial_code: "+84",
        code: "VN"
    }, 
        {
        name: "Virgin Islands, British",
        dial_code: "+1 284",
        code: "VG"
        }, 
        {
        name: "Virgin Islands, U.S.",
        dial_code: "+1 340",
        code: "VI"
        }
    ]; //list of country codes
    
    ref.child("users").child(uid).once("value", function (snapshot){
        var val = snapshot.val();
        console.log(val.phoneNo);
        if (val.phoneNo != null) {
            $scope.userPhone.push(val.phoneNo);
            console.log($scope.userPhone);
        } else if (val.phoneNo == null) {
            $scope.userPhone = ["Account not linked"];
        }
    })
    
    $scope.linkPhone = function linkPhone (phoneNumber){
        console.log(phoneNumber);
        //add phone number to users tree
        ref.child("users").child(uid).child("phoneNo").set(phoneNumber);
    }
})

//signup controller
app.controller('signUpCtrl', function($scope, $state, $ionicPopup) {
    $scope.signUp = {};
    
    $scope.signupEmail = function() {
        var ref = new Firebase("https://vivid-heat-1234.firebaseio.com");
        
        ref.createUser({
            email: $scope.signUp.email,
            password: $scope.signUp.password }, function(error, userData) {
            if (error) {
                console.log("Error creating user:", error);
                var alertPopup = $ionicPopup.alert ({
                    title: 'Unable to sign up',
                    template: error,
                    okType: 'button-dark'
                });
            } else {
                //alert popup
                var alertPopup = $ionicPopup.alert ({
                    title: 'Thank you for signing up',
                    template: 'Please proceed to login',
                    okType: 'button-dark'
                });
                $state.go('signin');
                console.log("Successfully created user account with uid:", userData);
                console.log(userData.uid); //success
                //split id from email
                var email = $scope.signUp.email;
                var emailID = email.substring(0, email.lastIndexOf("@"));
                //start user/ tree with uid as parent and name and email as child
                var newUser = {};
                newUser["/users/" + userData.uid] = {
                    name: emailID, 
                    email: $scope.signUp.email 
                }
                //perform a deep-path update
                ref.update(newUser, function(error) {
                    if (error) {
                        console.log("Error registering new user:", error);
                    }
                })
            }
        });
        //clear input fields
        //this.data.email = null;
        //this.data.password = null;
    };
})

//forgot password controller
app.controller('forgotPasswordCtrl', function($scope, $ionicPopup) {
    var ref = new Firebase('https://vivid-heat-1234.firebaseio.com')
    $scope.retrievePassword = function retrievePassword(email) {
        console.log(email);
        ref.resetPassword({
            email: email 
        }, function(error) {
            if (error === null) {
                console.log("Password reset email sent successfully");
                var alertPopup = $ionicPopup.alert ({
                    title: 'Retrieve password',
                    template: 'Password reset email sent successfully. Please check your email.',
                    okType: 'button button-outline button-dark'
                })
            } else {
                console.log("Error sending password reset email:", error);
                var alertPopup = $ionicPopup.alert ({
                    title: 'Retrieve password',
                    template: error,
                    okType: 'button button-outline button-dark'
                })
            }
        })
        //clear input field
        this.forgotPassword.email = null;
    }
})
