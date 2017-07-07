'use strict';

var app = angular.module(
    'app', ['ngAnimate',
        'ui.bootstrap',
        'ngResource',
        'ngFileUpload'
    ]);


app.controller('FilesCtrl', function($scope, Upload, $timeout) {
    $scope.uploadFiles = function(files, errFiles) {
        $scope.files = files;
        $scope.errFiles = errFiles;
        $scope.errorMsg ='';
        angular.forEach(files, function(file) {
            file.upload = Upload.upload({
                url: 'uploader.php?q=' + getParameterByName('id'),
                data: {
                    file: file
                }
            });

            file.upload.then(function(response) {
                $timeout(function() {
                    file.result = response.data;
                });

                if(response.status ==200){
                  location.reload();
                }

            }, function(response) {

              if(response.status!=200){
                  $scope.errorMsg = response.status + ': ' + response.data.message;
                  alert(response.data.message);
              }
            }, function(evt) {
                file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
            });
        });
    }

    function getParameterByName(name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location.search);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    };

});
