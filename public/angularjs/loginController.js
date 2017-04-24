var project = angular.module('project',[]);

project.controller('loginController', function ($scope, $http) {
	
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
				
			}
			else if(data.statusCode == 200)
			{
				alert('LOL');
			}
			else
			{
				
			}
		}).error(function (error) {
			
		});
	};
});
