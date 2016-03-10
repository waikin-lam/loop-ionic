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
    
    /*$stateProvider.state('app.loops.detail.members', {
        url: '/members',
        templateUrl: 'members.html',
        controller: 'loopCtrl',
    })
    
    $stateProvider.state('app.loops.detail.alerts', {
        url: '/alerts',
        templateUrl: 'alerts.html',
        controller: 'loopCtrl',
    })*/
    
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
app.controller('LoopsCtrl', function($scope, $ionicPopover, $ionicPopup, loopsFactory, $ionicListDelegate, usersService, loopsArray, membersArray, eventsArray, $q) {
    
    var ref = new Firebase('https://vivid-heat-1234.firebaseio.com');
    
    var uid = {};
    //retrieve user unique id from users node
    var userData = ref.getAuth();
    var uid = userData.uid;
    console.log(uid); //success!
    
    $scope.loops = [];
    var loopUIDfromUser = [];
    var loopObject = [];
    var loopsToDisplay = [];
    var eventsObject = [];
    var filteredEvents = [];
    var startTimes = [];
    
    //filter list of loops to show only those users are authorized to see
    var userRef = new Firebase('https://vivid-heat-1234.firebaseio.com/users/' + uid + '/loops');
    var loops = new Firebase('https://vivid-heat-1234.firebaseio.com/loops/');
    var events = new Firebase('https://vivid-heat-1234.firebaseio.com/events/')
    
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
            console.log(loopsToDisplay);
            return loopsToDisplay;
        });
    })
    
    var eventsTree = loopIDfromUsers.then(function(loopIDfrUser){
        
        
        eventsObject.length = 0;
        filteredEvents.length = 0;
        
        var keyArray = [];
        var tempStartTime = [];
        
        console.log(loopIDfrUser);
        for (var i=0; i<loopIDfrUser.length; i++) {
            var key = loopIDfrUser[i];
            console.log(key)
        }
        
        angular.forEach(loopIDfrUser, function (key) {
           return ref.child('events').child(key).once('value').then(function(events) {
               console.log(key);
               var events = events.val();
               for (var eventID in events) {
                    if (events.hasOwnProperty(eventID)) {
                        //console.log(eventID); // logs eventID
                        console.log(events[eventID]);
                        
                        var dateInFull = new Date(events[eventID].start);
                        var dateInMS = dateInFull.getTime();
                        //console.log(dateInMS);
                        
                        var diff = dateInMS - currentDateInMS;
                        console.log(diff);
                        
                        var index = keyArray.indexOf(key);
                        
                        if (index === -1 && diff > 0) {
                            console.log(false);
                            keyArray.push(key);
                            tempStartTime.push(diff);
                            startTimes.push({key:key, start:events[eventID].start, title:events[eventID].title})
                            
                        } else if (index === 0 && diff > 0 && diff < tempStartTime[0]) {
                            console.log(true);
                            tempStartTime.length = 0;
                            tempStartTime.push(diff);
                            startTimes.length = 0;
                            startTimes.push({key:key, start:events[eventID].start, title:events[eventID].title})
                        }
                    }
               }
            })
        })  
        //console.log(startTimes);
        return startTimes;
    });
    
    Promise.all([loopIDfromUsers, loopIDfromLoops, eventsTree]).then(function(results) {
        console.log(results);
        $scope.loops = results[1];
        //var events = results[2];
        //console.log(loops);
        //console.log(events);
    });
    //--
    
    /*userRef.on("value", function(userSnapshot) {
        
        loopUIDfromUser.length = 0;
        //startTimes.length = 0;
        
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
        //console.log(loopUIDfromUser.length);
        
        loops.on("value", function(loopSnapshot) {
            loopObject.length = 0;
            var loop = loopSnapshot.val();
            //console.log(loop);
            for (var loopUID in loop) {
                if (loop.hasOwnProperty(loopUID)) {
                    //console.log(loopUID);
                    //console.log(loop[loopUID]);
                    //loopObject.push({key: loopUID, name: loop[loopUID].name})
                }
            }
            console.log(loopObject);
            
            var keyArray = [];
            var tempStartTime = [];
            
            /*for (var i=0; i<loopUIDfromUser.length; i++) {
                var event = events.child(loopUIDfromUser[i]);
                event.on("value", function(snapshots) {
                    var eventKey = snapshots.key();
                    console.log(eventKey); //loop key
                    var eventVal = snapshots.val();
                    //console.log(eventVal); //event object
                    for (var eventID in eventVal) {
                        if (eventVal.hasOwnProperty(eventID)) {
                            console.log(eventID); //event keys
                            //console.log(eventVal[eventID].start);
                            var dateInFull = new Date( eventVal[eventID].start);
                            //console.log(dateInMS);
                            var dateInMs = dateInFull.getTime();
                            //console.log(dateInMs); //convert date into milliseconds
                            
                            var diff = dateInMs - currentDateInMS;
                            console.log(diff); //compute difference between event time and current time in milliseconds
                            
                            var index = keyArray.indexOf(eventKey);
                            console.log(index);
                            
                            if (index === -1 && diff > 0) {
                                //push difference into tempStartTime array if eventKey is not present in keyArray i.e. first event evaluated
                                keyArray.push(eventKey);
                                tempStartTime.push(diff);
                                console.log(tempStartTime[0]);
                                startTimes.push({key: eventKey, start: eventVal[eventID].start, title: eventVal[eventID].title})
                            } else if (index === 0 && diff > 0 && diff < tempStartTime[0]) {
                                //else for event 2 onwards, to compare diff against diff in tempStartTime and overwrite
                                console.log(true);
                                tempStartTime.length = 0;
                                tempStartTime.push(diff);

                            }
                            console.log(keyArray);
                            console.log(tempStartTime);
                            console.log(startTimes);

                        }
                    }
                })
                                
            }*/
            
            //$q.all(startTimes).then(function() {
                /*$scope.loops.length = 0;
                angular.forEach(loopUIDfromUser, function (key) {
                    for (var i=0; i<loopObject.length; i++) {
                        if (key === loopObject[i].key) {
                            /*event = events.child(loopUIDfromUser[i]);
                            event.on("value", function(snapshot) {
                                snapshot.forEach(function(childSnapshot) {
                                    var key = childSnapshot.key();
                                    console.log(key);
                                    
                                    var childData = childSnapshot.val();
                                    console.log(childData);
                                })
                            })*/
                            /*$scope.loops.push(loopObject[i]);
                        }
                    }
                })
                console.log($scope.loops);
                    angular.forEach(startTimes, function (key,value) {
                    console.log(key);
                    //console.log(value);
                })
                
            //}) 
        })
    })*/
    
    //compare event datetime with final array being one loop with one event with the latter being the upcoming
    /*var events = new Firebase("https://vivid-heat-1234.firebaseio.com/events/");
    
    var currentDate = new Date();
    var currentDateInMS = currentDate.getTime();
    console.log(currentDateInMS);
    
    var diffInTime = [];
    var nextEventTime = [];
    
    events.on("child_added", function (snapshots) {
        var loopKey = snapshots.key();
        //console.log(loopKey);
        var loopEvents = snapshots.val();
        console.log(loopEvents);
        angular.forEach(loopEvents, function(key, value) {
            //console.log(loopKey);
            console.log(key.start); // returns object 
            //console.log(value); // returns event unique ID
            var d = new Date(key.start);
            var e = d.getTime(); //time in milliseconds
            var diff = e - currentDateInMS;
            console.log(diff);
            if (diff > 0) {
                diffInTime.push(diff);
            }
            console.log(diffInTime);
            diffInTime.sort();
            console.log(diffInTime);
            //var nextEventTime = Math.min(diffInTime);
            //console.log(nextEventTime);
            startTimes.push({loopID: loopKey, key: value, start: e, title: key.title});
        })
        $q.all(startTimes, diffInTime).then(function () {
            //console.log(startTimes);
            //console.log(diffInTime);
        })
        console.log(startTimes.length);
        for (var i=0; i<startTimes.length; i++) {
            var diff = startTimes[i].start - currentDateInMS;
            console.log(diff);
        }
    })*/

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
                return;
            } else {
                console.log(false);
                member.remove();
                user.remove();
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
        
        editNamePopup.then(function(res1) {
            console.log('Tapped!', res1);
            if (res1 != null) {
                var loopName = ref.child('/loops').child(key).child('name');
                loopName.set(res1);
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
                return;
            } else if (totalMembers != 1 && res) {
                console.log(false);
                member.remove();
                user.remove();
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
    }
    
    //add selected user into Firebase
    $scope.addUserToFirebase = function addUserToFirebase(name, uid) {
        //console.log(name); //success
        //console.log(uid); //success
        var ref = new Firebase("https://vivid-heat-1234.firebaseio.com");
        ref.child("members").child(loopId).child(uid).set(true);
        ref.child("users").child(uid).child("loops").child(loopId).set(true);
        //alert popup upon successfully added user into loop
        var alertPopup = $ionicPopup.alert ({
            title: 'Alert',
            template: 'Successfully added user into loop'
        });
    }
    
    $scope.membersOfLoop = [];
    //list of members of a loop
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
            //height: 350,
            contentheight: "auto",
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
                    template: error
                });
            } else {
                //alert popup
                var alertPopup = $ionicPopup.alert ({
                    title: 'Thank you for signing up',
                    template: 'Please proceed to login'
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
                $state.go('app.mycalendar');
            }
        });
    };
})

//controller for link tab
app.controller('LinkCtrl', function($scope) {
    
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

