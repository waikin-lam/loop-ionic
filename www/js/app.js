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
    
$stateProvider.state('app.follow', {
        url: '/follow',
        views: {
            follow: {
                templateUrl: 'follow.html',
                controller: 'FollowCtrl'
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
    var ref = new Firebase("https://vivid-heat-1234.firebaseio.com/loops");
    
    return {
        getLoops: function() { 
        //return as a synchronized object
        return $firebaseObject(ref);
        },
  }
}])

app.controller('MainCtrl', function($scope) {
    
})

//this controller waits for the state to be completely resolved before instantiation
app.controller('LoopsCtrl', function($scope, $ionicPopover, $ionicPopup, loopsFactory, $ionicListDelegate) {
    $scope.loops = loopsFactory.getLoops();
    
    //scope for left side tab delete
    $scope.data = {
        showDelete: false
    };
    // from TemplateUrl() method
    $ionicPopover.fromTemplateUrl('loops-popover.html', {
        scope: $scope
    }).then(function(popover) {
        $scope.popover = popover;
    });
    
    var ref = new Firebase('https://vivid-heat-1234.firebaseio.com');
    
    var uid = {};
    //retrieve user unique id from users node
    var userData = ref.getAuth();
    var uid = userData.uid;
    console.log(uid); //success!
    
    //scope onItemDelete minus tab on nav-bar, with popup confirm
    $scope.onItemDelete = function(key) {
        var loopKey = ref.child('/loops').child(key);
        var member = ref.child('/members').child(key);
        var user = ref.child('/users').child(uid).child('/loops').child(key);
        var events = ref.child('/events').child(key);
        
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
                loopKey.remove();
                member.remove();
                user.remove();
                events.remove()
            } else
                {
                    //Do nothing
                }
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
                  type: 'button-positive',
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
        
        editNamePopup.then(function(res) {
            //console.log('Tapped!', res);
            if (res != null) {
                var loopName = ref.child('/loops').child(key).child('name');
                loopName.set(res);
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
        var member = ref.child('/members').child(key);
        var user = ref.child('/users').child(uid).child('/loops').child(key);
        var events = ref.child('/events').child(key);
        
        var confirmPopup = $ionicPopup.confirm({
            title: 'Delete Loop',
            template: 'Are you sure you want to close this loop?',
            cancelText: 'No',
            cancelType: 'button-default',
            okText: 'Yes',
            okType: 'button-positive'
        });
        console.log(key);
        confirmPopup.then(function(res) {
            if(res) {
                //to delete loop and associated data linkages
                loopKey.remove();
                member.remove();
                user.remove();
                events.remove()
            } else {
                $ionicListDelegate.closeOptionButtons();
            }
        });
    }
    
    //function to add loop to list and save it to multiple locations in the database
    $scope.addLoop = function(newLoop) {
        var root = new Firebase("https://vivid-heat-1234.firebaseio.com");
        var uid = {};
        //retrieve user unique id from users node
        var userData = root.getAuth();
        var uid = userData.uid;
        //console.log(uid); //success!
        
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
        
        // perform a deep-path update
        root.update(newLoopName, function(error) {
            if (error) {
                console.log("Error updating data:", error)
            }
        });
    };
})

app.controller('loopCtrl', function($scope, $ionicPopover, $stateParams, $timeout, $ionicModal, $ionicPopup, $firebaseArray, $firebaseObject, $ionicListDelegate) {
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
            contentHeight: "auto",
            editable: true,
            eventDrop: function(event, delta, revertFunc) {
                alert(event.title + " was dropped on " + event.start.format());
                if (!confirm("Are you sure about this change?")) {
                    revertFunc();
                }
                //console.log(event.start._d.toISOString()); //new time
                //console.log(event.start._i); //original time
                //console.log(event); //event from eventDrop function
                //console.log(event);
                
                //update Firebase event Start parameter
                events.on("value", function(eventSnapshots){
                    eventSnapshots.forEach(function(eventChild) {
                        
                        var loopChild = eventChild.key();
                        console.log(loopChild);
                        //console.log(loopChild.key());
                        
                        if(event.$id === loopChild) {
                            console.log(true); //true
                            //replace loopChild.start with event.start.d.toISOString()
                            var key = eventChild.key();
                            console.log(key);
                            
                            var newStart = event.start._d.toISOString();
                            console.log(newStart);
                            events.child(key).update({start: newStart});
                            return
                        } else {
                            // do nothing
                        }
                        
                    })  
                })
            },
            dayClick: function(date, jsEvent, view) {
                
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
                    var singleEventDate = singleEvent.start;
                    //console.log(singleEventDate); //logs datetime in ISO format by order of eventkey i.e. whichever came first
                        
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
            timezone: 'local',
            firstDay: 1,
            header: {
                left: 'prev',
                center: 'title',
                right: 'next'
            },
            eventRender: function(event, element, view) {
                element.qtip({
                    content: event.title
                });
            }
        },
    },
    
    // from TemplateUrl() method
    $ionicPopover.fromTemplateUrl('loop-popover.html', {
        scope: $scope
    }).then(function(popover) {
        $scope.popover = popover;
    });
    
    //function to add event details to loop in Firebase
    $scope.addEvent = function(eventName, eventDate, eventLocation) {
        //extract color from /loops tree
        var colorRef = new Firebase("https://vivid-heat-1234.firebaseio.com/loops/" + loopId);
        var color = colorRef.on("value", function(data) {
            var loopColor = data.val();
            console.log(loopColor.color);
        
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
            //sort array of objects for view to show events in chronological order
        })
        
        //re-up calendar with added event
        $scope.eventSources = [$scope.events];
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
        
        var key = event.key;
        $scope.eventSources = [$scope.events];
        $scope.updateEvent = function(updateTitle, updateDateTime, updateLocation) {
            var datetime = updateDateTime.toISOString();
            var update = $scope.events.$getRecord(key);
            update.title = updateTitle;
            update.start = datetime;
            update.location = updateLocation;
            $scope.events.$save(update).then(function() {
                //alert("data has been updated");
                $scope.eventSources = [$scope.events];
                console.log($scope.events);
                $scope.eventsByDate.length = 0;
                $scope.eventsByDate.push({title: update.title, location: update.location, start: datetime});
            })
        }  
    };
    $scope.closeModal = function() {
        $scope.modal.hide();
        $ionicListDelegate.closeOptionButtons();
    };
    
    //showConfirm function for popup to delete event
    $scope.showConfirm = function(event, $index) {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Delete Event',
            template: 'Are you sure you want to delete this event?'
        });
            confirmPopup.then(function(res){
                if(res) {
                    //console.log($index);
                    var eventKey = event.key;
                    //console.log(eventKey); //yields event key
                    var ref = new Firebase('https://vivid-heat-1234.firebaseio.com/events/' + loopId + '/' + eventKey);
                    ref.remove();
                    //update $scope.eventsByDate to delete $index item from ng-repeat list in view
                    $scope.eventsByDate.splice($index, 1);
                } else {
                    $ionicListDelegate.closeOptionButtons();
                }
            })
        }
})

app.controller('MyCalendarCtrl', ["$scope", "$ionicPopover", "$timeout", "loopsFactory", "uiCalendarConfig", function($scope, $ionicPopover, $timeout, loopsFactory, uiCalendarConfig) {

    //initialize loops for filter view
    $scope.loops = loopsFactory.getLoops();
                                  
    //initialize scope for consolidated Events
    $scope.allEvents =[];
    
    $ionicPopover.fromTemplateUrl('my-popover.html', {
    scope: $scope
    }).then(function(popover) {
        $scope.popover = popover;
    });
    
    //config calendar
    $scope.uiConfig = {
        calendar: {
            //height: 350,
            fixedWeekCount: false,
            editable: false,
            timezone: 'local',
            firstDay: 1,
            header: {
                left: 'prev',
                center: 'title',
                right: 'next'
            },
            eventRender: function eventRender(event, element,view) {
                //jquery qtip functionality to highlight event title
                element.qtip({
                    content: event.title
                });
            },
         },
    };
    
    var allEventsRoot = new Firebase('https://vivid-heat-1234.firebaseio.com/events');
    allEventsRoot.on("value", function (allSnapshot){
        $timeout(function(){
            allSnapshot.forEach(function(childSnapshot) {
                var key = childSnapshot.key();
                //console.log(key);
                var eventData = allEventsRoot.child(key);
                eventData.on("child_added", function(allEventsSnapshot) {
                    var allEventData = allEventsSnapshot.val();
                    //console.log(allEventData); //successful in retrieving loopIds
                    $scope.allEvents.push({title:allEventData.title, start: allEventData.start, stick: allEventData.stick, location: allEventData.location, allDay: allEventData.allDay, color: allEventData.color, key: key})
                })
            })
            console.log($scope.allEvents);
        })
    })
    //initialize calendar view
    $scope.eventSources = [$scope.allEvents];
    
    //initialize filter: pushing loop key into array when unchecked and removing key from array when checked
    var loopsToHide = [];
    var loopsToHideIndex = [];
    var reloadEvents = [];
    var loopsToShow = [];
    
    $scope.uncheck = function uncheck(key) {
        var index = loopsToHide.indexOf(key);
        if (index >= 0) { //key present in $scope.loopsToHide hence to re-introduce events into $scope.allEvents
            reloadEvents.length = 0;
            loopsToShow.length = 0;            loopsToHide.splice(index, 1);
            console.log(loopsToHide);
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
                console.log(reloadEvents);
                //isolate relevant events in [reloadEvents] with key
                console.log(key);
                for (var i=0; i < reloadEvents.length; i++) {
                    if(key === reloadEvents[i].key) {
                        loopsToShow.push(reloadEvents[i]);
                        }
                    }
                console.log(loopsToShow);
                for (var i=0; i < loopsToShow.length; i++) {
                    var index = $scope.allEvents.indexOf(loopsToShow[i]);
                    if (index = -1) {
                        $scope.allEvents.push(loopsToShow[i]);
                    }
                }
                console.log($scope.allEvents);
                })
            })
            
            
            
        } else {
            loopsToHide.push(key);
            console.log(loopsToHide);
            //take key from loopsToHide and iterate through $scope.allEvents to remove events that have keys equal to the key
            angular.forEach(loopsToHide, function (value, key) {
                console.log(value);
                for (var i=0; i<$scope.allEvents.length; i++) {
                    if (value === $scope.allEvents[i].key) {
                        var index1 = $scope.allEvents.indexOf($scope.allEvents[i]);
                        console.log(index1);
                        if (loopsToHideIndex.indexOf(index1) >= 0) {
                            //Do nothing as [loopsToHideIndex] already contains index1
                        } else { //otherwise, push index1 into [loopsToHideIndex]
                            loopsToHideIndex.push(index1);
                            console.log(loopsToHideIndex);
                        }
                    }
                }
            })
            //use [loopsToHideIndex] to alter $scope.allEvents
            loopsToHideIndex.sort(function(a,b){return a-b; }); //arrange index by descending order
            console.log(loopsToHideIndex);
            for (var i = loopsToHideIndex.length-1; i>=0; i--) {
                $scope.allEvents.splice(loopsToHideIndex[i], 1);
            }
            loopsToHideIndex.length = 0;
        }
    }
}])

app.controller('SignInCtrl', function($scope, $state, $ionicPopup) {

    $scope.data = {};
    
    $scope.signupEmail = function() {
        var ref = new Firebase("https://vivid-heat-1234.firebaseio.com");
        
        ref.createUser({
            email: $scope.data.email,
            password: $scope.data.password }, function(error, userData) {
            if (error) {
                console.log("Error creating user:", error);
                var alertPopup = $ionicPopup.alert ({
                    title: 'Unable to sign up',
                    template: error
                });
            } else {
                //alert popup
                var alertPopup = $ionicPopup.alert ({
                    title: 'Thank you for signing up',
                    template: 'Please proceed to login'
                });
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
                var alertPopup = $ionicPopup.alert ({
                    title: 'Unable to log in',
                    template: error
                });
            } else {
                console.log("Authenticated successfully with payload:", userData);
                $state.go('app.loops.index');
            }
        });
    };
})

//controller for follow tab
app.controller('FollowCtrl', function($scope) {
    
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

