<!DOCTYPE html>
<html ng-app="website">
<head>
    <meta charset="utf-8">
    <title>CEfforts:: Slideshow</title>

    <link href="css/bootstrap.css" rel="stylesheet">
    <link rel="stylesheet" href="css/styles.css">
</head>

<body ng-controller="MainCtrl">
    <img ng-show="loaded" bg-image class="fullBg" ng-repeat="slide in slides"
         ng-if="isCurrentSlideIndex($index)"
         ng-src="{{slide.src}}">

    <script src="libs/jquery.min.js"></script>
    <script src="http://cdnjs.cloudflare.com/ajax/libs/gsap/1.13.1/TweenMax.min.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.2.16/angular.min.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.2.16/angular-animate.min.js"></script>
    <script src="libs/ui-bootstrap-tpls-0.11.0.min.js"></script>
    <script src="http://code.createjs.com/preloadjs-0.4.1.min.js"></script>
    <script src="js/app.js"></script>

</body>
</html>
