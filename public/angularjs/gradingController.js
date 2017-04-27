var project = angular.module('project',[]);

project.controller('gradingController', function ($scope, $http,$window) {
	$scope.tenant = "Tenant-1";
	$scope.upload = function (files) {
		alert('1');
		var fd = new FormData();
		fd.append("file",files[0]);
		$http.post('/upload', fd, {
	        headers: {'Content-Type': undefined },
	        transformRequest: angular.identity
	    }).success( alert('Success'); ).error( alert('failed'); );
	};
});
