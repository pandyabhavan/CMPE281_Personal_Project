var project = angular.module('project',[]);

project.controller('loginController', function ($scope, $http,$window) {
	
	$scope.tenant = "Tenant-1";
	
	$scope.login = function () {
		$http({
			method: "POST",
			url: "/login",
			data: {
				"email": $scope.email,
				"password": $scope.password,
				"tenant": $scope.tenant
			}
		}).success(function (data) {
			if(data.statusCode == 401)
			{
				alert("Invalid Email/Password combination");
			}
			else if(data.statusCode == 200)
			{
				window.location = "/grading";
			}
			else
			{ 	
				alert("Invalid Email/Password combination");
			}
		}).error(function (error) {
			alert("Something went wrong! Please try again");
		});
	};
});
