<!DOCTYPE html>
<html ng-app="app">
<head>
    <meta charset="utf-8">
    <title>Max Pro Displays:: Slideshow</title>

    <link href="css/bootstrap.css" rel="stylesheet">
    <link rel="stylesheet" href="css/styles.css">
</head>

<body ng-controller="MainCtrl">
    <div class="col-xs-12" ng-if="progress !== 100">
        <progressbar class="progress-striped" value="progress">{{progress | number:0}}%</progressbar>
    </div>

    <div class="progress-striped" style="text-align:center" ng-if="loaded && slides.length ==0"><h3>No image found</h3></div>

    <img ng-show="loaded && slides.length>0" bg-image class="fullBg {{currentAnimation}}" ng-repeat="slide in slides"
         ng-if="isCurrentSlideIndex($index)"
         ng-src="{{slide.src}}">

    <ul ng-show="loaded && slides.length>0" class="nav nav-pills">
        <li style="display:none" ng-class="{'active':isCurrentAnimation('slide-left-animation')}"><a ng-click="setCurrentAnimation('slide-left-animation')">LEFT</a></li>
        <li style="display:none" ng-class="{'active':isCurrentAnimation('slide-down-animation')}"><a ng-click="setCurrentAnimation('slide-down-animation')">DOWN</a></li>
        <li style="display:none" ng-class="{'active':isCurrentAnimation('fade-in-animation')}"><a ng-click="setCurrentAnimation('fade-in-animation')">FADE</a></li>
    </ul>

    <script src="libs/jquery.min.js"></script>
    <script src="libs/TweenMax.min.js"></script>
    <script src="libs/angular.min.js"></script>
    <script src="libs/angular-animate.min.js"></script>
    <script src="libs/ui-bootstrap-tpls-0.11.0.min.js"></script>
    <script src="libs/preloadjs-0.4.1.min.js"></script>
    <script src="js/app.js"></script>

</body>
</html>
