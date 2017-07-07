
app.controller('EditCtrl', function ($scope, $http) {

    $scope.paths="";

    function checkParamExist() {
      var param=getParameterByName('id');

      if(!param || param.trim()==""){
        alert("Client id not provided. Please provide query param as ?id=xyz in url.");
        return false;
      }
      return true;
    };

    pvtFuncMakeRESTCalls = function(inputObj) {

        console.log("Calling REST URL= " + inputObj.url + "| method: "+ inputObj.method);
        return $http({
            method: inputObj.method?inputObj.method:'GET',
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
            inputObj.status=response.status;
            return inputObj;
        });

    };

    function loadImages() {

      if(!checkParamExist()){
        return false;
      }

    	var inputObj = {};
    	//Servlet URL
        inputObj.url = 'filechecker.php?q=' + getParameterByName('id');

    	pvtFuncMakeRESTCalls(inputObj).then(function callback(inputObj) {
            console.log(inputObj.isError + ":" + inputObj.data);

            if(inputObj.isError){

            	if(inputObj.status==501){
            		//location.href='client';
            	}
            	else if(inputObj.status==504){
            		//location.href='upload.html';
            	}
            }else{
            	$scope.paths=inputObj.data;
            }

        });
    }

    $scope.removeImage = function(imageName) {

      if(!checkParamExist()){
        return false;
      }

        var inputObj = {};
        inputObj.url = 'filechecker.php?action=del&q=' + getParameterByName('id') +'&img='+imageName;

        return pvtFuncMakeRESTCalls(inputObj).then(function callback(inputObj) {
            console.log(inputObj.isError + ":" + inputObj.data);

            if (!inputObj.isError && inputObj.data) {
            	location.reload();
            }else{
            	alert("Not able to remove image");
            }
            return inputObj;
        });
    };


    function getParameterByName(name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location.search);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    };

    loadImages();
});
