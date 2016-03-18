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
                            //console.log(false);
                            keyArray.push(key);
                            //console.log(keyArray);
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
        
        angular.forEach(loopIDfrLoops, function (key, value) {
            var object = key;
            var loopID = object.key;
            
            return ref.child('events').child(loopID).once('value').then(function(events){
                var events = events.val();
                console.log(events);
                
                // if {events} is empty
               if(isEmpty(events)) {
                   console.log(object);
                   loopWithoutEvent.length = 0;
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
        
        /*for (var i=test.length-1; i>=0; i--) {
            for (var j=events.length-1; j>=0; j--) {
                console.log(test[i].key);
                console.log(events[j].key);
                if(overlapLoops[i].key === events[j].key) {
                    test.splice(test[i],1);
                    events.splice(events[j],1);
                }
            }  
        }
        console.log(test);
        for (var i=0; i<test.length; i++) {
            $scope.loops.push({key: overlapLoops[i].key, name: overlapLoops[i].name, title: "null"});
        //console.log(overlapLoops);
        console.log($scope.loops);
        }*/
    });
    
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
            okType: 'button-positive'
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
                return;
            } else {
                console.log(false);
                member.remove();
                user.remove();
                ref.child("changes").child(key).child(currentDateInMS).set(name + " " + "left the loop");
                return;
            }
            })
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
                return;
            } else if (totalMembers != 1 && res) {
                console.log(false);
                member.remove();
                user.remove();
                ref.child("changes").child(key).child(currentDateInMS).set(name + " " + "left the loop");
                return;
            } else {
                $ionicListDelegate.closeOptionButtons();
            }
        });
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
    };
})

app.controller('loopCtrl', function($scope, $ionicPopover, $stateParams, $timeout, $ionicModal, $ionicPopup, $firebaseArray, $firebaseObject, $ionicListDelegate, usersService, $ionicSlideBoxDelegate) {
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
                    content: event.title,
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
    
    // from TemplateUrl() method
    $ionicPopover.fromTemplateUrl('loop-popover.html', {
        scope: $scope
    }).then(function(popover) {
        $scope.popover = popover;
    });
    
    $ionicPopover.fromTemplateUrl('users.html', {
        scope: $scope
    }).then(function(addUserPopup) {
        $scope.addUserPopup = addUserPopup;
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
            root.child("changes").child(loopId).child(currentDateInMS).set(userName + " " + "added new event:" + " " + eventName);
        })
        
        //re-up calendar with added event
        $scope.eventSources = [$scope.events];
        
        //clear input fields
        this.eventName = null;
        this.eventDate = null;
        this.eventLocation = null;
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
                //alert("data has been updated");
                $scope.eventsByDate.length = 0;
                $scope.eventsByDate.push({title: update.title, location: update.location, start: datetime});
                
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
            //clear fields
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

app.controller('MyCalendarCtrl', ["$scope", "$ionicPopover", "$timeout", "loopsFactory", "uiCalendarConfig", "loopsArray", function($scope, $ionicPopover, $timeout, loopsFactory, uiCalendarConfig, loopsArray) {

    var ref = new Firebase('https://vivid-heat-1234.firebaseio.com');
    
    var uid = {};
    //retrieve user unique id from users node
    var userData = ref.getAuth();
    var uid = userData.uid;
    console.log(uid); //success!
    
    //initialize scope for consolidated Events
    $scope.allEvents =[];
    
    $scope.loops = [];
    var loopUIDfromUser = [];
    var loopObject = [];
    var eventKeys = [];
    
    //filter list of loops to show only those users are authorized to see
    var userRef = new Firebase('https://vivid-heat-1234.firebaseio.com/users/' + uid + '/loops');
    var loops = new Firebase('https://vivid-heat-1234.firebaseio.com/loops/');
    var allEventsRoot = new Firebase('https://vivid-heat-1234.firebaseio.com/events');
    
    userRef.on("value", function(userSnapshot) {
        
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
        //console.log(loopUIDfromUser);
        loops.on("value", function(loopSnapshot) {
            loopObject.length = 0;
            var loop = loopSnapshot.val();
            for (var loopUID in loop) {
                if (loop.hasOwnProperty(loopUID)) {
                    //console.log(loopUID);
                    //console.log(loop[loopUID]);
                    loopObject.push({key: loopUID, name: loop[loopUID].name})
                    //console.log(loopObject);
                }
            }
            //console.log(loopObject.length);
            $scope.loops.length = 0;
            angular.forEach(loopUIDfromUser, function (key) {
                for (var i=0; i<loopObject.length; i++) {
                    if (key === loopObject[i].key) {
                        $scope.loops.push(loopObject[i]);
                    }
                }
            })
            //console.log($scope.loops[0].key);
        })
        allEventsRoot.on("value", function (allSnapshot) {
            $timeout(function() {
                eventKeys.length = 0;
                allSnapshot.forEach(function(childSnapshot) {
                    var key = childSnapshot.key();
                    eventKeys.push(key);
                })
                //console.log(eventKeys);
                //console.log($scope.loops);
                $scope.allEvents.length = 0;
                angular.forEach(eventKeys, function (key,value){
                    for (var i=0; i<$scope.loops.length; i++) {
                        if (key === $scope.loops[i].key) {
                            console.log(key);
                            var eventData = allEventsRoot.child(key);
                            eventData.on("child_added", function(allEventsSnapshot) {
                                var allEventData = allEventsSnapshot.val();
                                //console.log(allEventData);
                                $scope.allEvents.push({title: allEventData.title, start: allEventData.start, stick: allEventData.stick, location: allEventData.location, allDay: allEventData.allDay, color: allEventData.color, key: key})
                            })
                        }  
                    }
                })
                console.log($scope.allEvents);
            })
        })
    })
    
    $ionicPopover.fromTemplateUrl('my-popover.html', {
    scope: $scope
    }).then(function(popover) {
        $scope.popover = popover;
    });
    
    //config calendar
    $scope.uiConfig = {
        calendar: {
            height: "auto",
            //contentheight: "auto",
            fixedWeekCount: false,
            editable: false,
            timezone: 'local',
            firstDay: 1,
            header: {
                left: 'prev',
                center: 'title',
                right: 'next'
            },
            eventRender: function (event, element, view) {
                //jquery qtip functionality to highlight event title
                element.qtip({
                    content: event.title,
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
                console.log("Successfully created user account with uid:", userData);
                console.log(userData.uid); //success
                //split id from email
                var email = $scope.data.email;
                var emailID = email.substring(0, email.lastIndexOf("@"));
                //start user/ tree with uid as parent and name and email as child
                var newUser = {};
                newUser["/users/" + userData.uid] = {
                    name: emailID, 
                    email: $scope.data.email 
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
      //StatusBar.styleDefault();
        //change status bar text color to light text, for dark backgrounds
        StatusBar.styleLightContent();
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
            //StatusBar.styleDefault();
            StatusBar.styleColor(2);
    }
    });
})

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

