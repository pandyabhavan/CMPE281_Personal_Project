var project = angular.module('project',[]);

project.directive('fileModel', ['$parse', function ($parse) {
	return {
		restrict: 'A',
		link: function(scope, element, attrs) {
			var model = $parse(attrs.fileModel);
			var modelSetter = model.assign;

			element.bind('change', function(){
				scope.$apply(function(){
					modelSetter(scope, element[0].files[0]);
				});
			});
		}
	};
}]);

project.controller('gradingController', ['$scope','$http', function($scope,$http, fileUpload){
	$scope.uploadbtn = false;
	$scope.uploadPanel = true;
	$scope.gradePanel = false;
	$scope.complete = false;
	$scope.onTime = false;
	$scope.outputFile = "output/test.png";
	$scope.uploadFile = function(){
		$scope.uploadbtn = true;
		var file = $scope.myFile;
		console.log('file is ' );
		console.dir(file);
		var uploadUrl = "/upload";
		var fd = new FormData();
		fd.append('file', file);
		$http.post(uploadUrl, fd, {
			transformRequest: angular.identity,
			headers: {'Content-Type': undefined}
		})
		.success(function(data){
			if(data.statusCode == 200)
			{
				$scope.outputFile = "output/output.png";
				$scope.uploadPanel = false;
				$scope.gradePanel = true;
				console.log($scope.uploadPanel);
			}
			else
			{
				alert('Please try again!');
			}
		})
		.error(function(error){
			alert('Something went wrong! Try again');
		});
	};
	
	$scope.submitGrade = function(){
		
		$http({
			method: "PUT",
			url: "/submitGrade",
			data: {
				"scale": $scope.scale,
				"score": $scope.score,
				"grade": $scope.grade,
				"comments":$scope.comments,
				"complete":$scope.complete,
				"onTime":$scope.onTime
			}
		}).success(function (data) {
			if(data.statusCode == 401)
			{
				alert("Server error! Please try again.");
			}
			else if(data.statusCode == 200)
			{
				alert('Score recoreded successfully');
				window.location = "/grading";
			}
			else
			{ 	
				alert("Server error! Please try again.");
			}
		}).error(function (error) {
			alert("Something went wrong! Please try again");
		});
		
	};

}]);
