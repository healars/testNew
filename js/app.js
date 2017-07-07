var app = angular.module('app', ['ngAnimate', 'ui.bootstrap']);

app.controller('MainCtrl', function($scope, $timeout, QueueService, $http, $interval) {
    var INTERVAL = 3000,
        staticSlides = [{
                id: "0",
                src: "./clientImages/noimage.png"
            },
            {
                id: "1",
                src: "./clientImages/noimage.png"
            }
        ];


    function setCurrentSlideIndex(index) {
        $scope.currentIndex = index;
    }

    function isCurrentSlideIndex(index) {
        return $scope.currentIndex === index;
    }

    function nextSlide() {
        $scope.currentIndex = ($scope.currentIndex < $scope.slides.length - 1) ? ++$scope.currentIndex : 0;
        $timeout(nextSlide, INTERVAL);
    }

    function setCurrentAnimation(animation) {
        $scope.currentAnimation = animation;
    }

    function isCurrentAnimation(animation) {
        return $scope.currentAnimation === animation;
    }

    pvtFuncMakeRESTCalls = function(inputObj) {

        console.log("Calling REST URL= " + inputObj.url);
        return $http({
            method: 'GET',
            url: inputObj.url
        }).then(function successCallback(response) {
            if (response && response.status == 200 && response.data) {
                console.log('REST success');
                inputObj.data = response.data;
            }
            return inputObj;
        }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            console.log(response.status + ': REST FAILURE for ' + inputObj.url);
            inputObj.isError = true;
            inputObj.status = response.status;
            inputObj.message = response.data.message;
            return inputObj;
        });

    };

    function loadSlides() {
        //console.log(staticSlides[0]);
        //QueueService.loadManifest(staticSlides);

        var inputObj = {};
        //Servlet URL
        inputObj.url = 'filechecker.php?q=' + getParameterByName('id');

        pvtFuncMakeRESTCalls(inputObj).then(function callback(inputObj) {
            console.log(inputObj.isError + ":" + inputObj.data);
            var paths = [];

            if (inputObj.isError) {

                console.log("No image found. Err: " + inputObj.message);
                paths = staticSlides;
            } else {
                $scope.dynamicSlides = inputObj.data;
                /*angular.forEach(inputObj.data, function(value, key) {
                    var item = {};
                    item.id = key;
                    item.src = value;

                    paths.push(item);

                }, '');
                */
                paths=inputObj.data;
                console.log(paths.toSource());
            }
            QueueService.loadManifest(paths);
        });
    }

    requestFullScreen2 = function(elem) {
        // ## The below if statement seems to work better ## if ((document.fullScreenElement && document.fullScreenElement !== null) || (document.msfullscreenElement && document.msfullscreenElement !== null) || (!document.mozFullScreen && !document.webkitIsFullScreen)) {
        if ((document.fullScreenElement !== undefined && document.fullScreenElement === null) || (document.msFullscreenElement !== undefined && document.msFullscreenElement === null) || (document.mozFullScreen !== undefined && !document.mozFullScreen) || (document.webkitIsFullScreen !== undefined && !document.webkitIsFullScreen)) {
            if (elem.requestFullScreen) {
                elem.requestFullScreen();
            } else if (elem.mozRequestFullScreen) {
                elem.mozRequestFullScreen();
            } else if (elem.webkitRequestFullScreen) {
                elem.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
            } else if (elem.msRequestFullscreen) {
                elem.msRequestFullscreen();
            }
        } else {
            if (document.cancelFullScreen) {
                document.cancelFullScreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitCancelFullScreen) {
                document.webkitCancelFullScreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        }
    }

    function getContextPath() {
        return window.location.pathname.substring(0, window.location.pathname.indexOf("/", 2));
    }

    function getParameterByName(name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location.search);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    };

    $scope.$on('queueProgress', function(event, queueProgress) {
        $scope.$apply(function() {
            $scope.progress = queueProgress.progress * 100;
        });
    });

    $scope.$on('queueComplete', function(event, slides) {
        $scope.$apply(function() {
            $scope.slides = slides;
            $scope.loaded = true;

            $timeout(nextSlide, INTERVAL);
        });
    });

    $scope.$on('errorLoadingImage', function(event, preloadError, slides) {
        $scope.$apply(function() {
            for (var i = slides.length - 1; i >= 0; i--) {
                if (slides[i] && slides[i].id && preloadError.item && preloadError.item.id && (slides[i].id === preloadError.item.id)) {
                    slides.splice(i, 1);
                    console.log('removing ' + preloadError.item.id);
                }
            }
        });
    });

    $scope.progress = 0;
    $scope.loaded = false;
    $scope.currentIndex = 0;
    $scope.currentAnimation = 'slide-left-animation';

    $scope.setCurrentSlideIndex = setCurrentSlideIndex;
    $scope.isCurrentSlideIndex = isCurrentSlideIndex;
    $scope.setCurrentAnimation = setCurrentAnimation;
    $scope.isCurrentAnimation = isCurrentAnimation;

    loadSlides();

});

app.factory('QueueService', function($rootScope) {
    var queue = new createjs.LoadQueue(true);

    function loadManifest(manifest) {
        queue.loadManifest(manifest);

        queue.on('progress', function(event) {
            $rootScope.$broadcast('queueProgress', event);
        });

        queue.on('error', function(event) {
            $rootScope.$broadcast('errorLoadingImage', event, manifest);
        });

        queue.on('complete', function() {
            $rootScope.$broadcast('queueComplete', manifest);
        });
    }

    return {
        loadManifest: loadManifest
    }
})

app.animation('.slide-left-animation', function($window) {
    return {
        enter: function(element, done) {
            TweenMax.fromTo(element, 1, {
                left: $window.innerWidth
            }, {
                left: 0,
                onComplete: done
            });
        },

        leave: function(element, done) {
            TweenMax.to(element, 1, {
                left: -$window.innerWidth,
                onComplete: done
            });
        }
    };
});

app.animation('.slide-down-animation', function($window) {
    return {
        enter: function(element, done) {
            TweenMax.fromTo(element, 1, {
                top: -$window.innerHeight
            }, {
                top: 0,
                onComplete: done
            });
        },

        leave: function(element, done) {
            TweenMax.to(element, 1, {
                top: $window.innerHeight,
                onComplete: done
            });
        }
    };
});

app.animation('.fade-in-animation', function($window) {
    return {
        enter: function(element, done) {
            TweenMax.fromTo(element, 1, {
                opacity: 0
            }, {
                opacity: 1,
                onComplete: done
            });
        },

        leave: function(element, done) {
            TweenMax.to(element, 1, {
                opacity: 0,
                onComplete: done
            });
        }
    };
});

app.directive('bgImage', function($window, $timeout) {
    return function(scope, element, attrs) {
        var resizeBG = function() {
            var bgwidth = element.width();
            var bgheight = element.height();

            var winwidth = $window.innerWidth;
            var winheight = $window.innerHeight;

            var widthratio = winwidth / bgwidth;
            var heightratio = winheight / bgheight;

            var widthdiff = heightratio * bgwidth;
            var heightdiff = widthratio * bgheight;

            if (heightdiff > winheight) {
                element.css({
                    width: winwidth + 'px',
                    height: heightdiff + 'px'
                });
            } else {
                element.css({
                    width: widthdiff + 'px',
                    height: winheight + 'px'
                });
            }
        };

        var windowElement = angular.element($window);
        windowElement.resize(resizeBG);

        element.bind('load', function() {
            resizeBG();
        });
    }
});

$(document).ready(function() {

    $(document).on('click', 'body *', function() {
        requestFullScreen2(document.body);
    });
});
