var mysql = require("./mysql");
var path = require("path");
var fs = require("fs");
var unzip = require('unzip');
var mkdir = require('mkdirp');

function login(req,res)
{
	var response;
	var email = req.param('email');
	var password = req.param('password');
	var tenant = req.param('tenant');
	var query = "select email from login where email='"+email+"' and password='"+password+"'";
	mysql.fetchData(function(err,results){
		if(err)
		{
			response = {"statusCode":401,"data":null};
			res.send(JSON.stringify(response));
		}
		else
		{
			if(results.length > 0)
			{	
				console.log(results[0]);
				response = {"statusCode":200,"data":results[0]};
				res.send(JSON.stringify(response));
			}
			else
			{
				response = {"statusCode":401,"data":null};
				res.send(JSON.stringify(response));
			}
		}
	},query);
}

function showGrading(req,res)
{
	res.render('grading', {});
}

function upload(req,res)
{
	console.log(req.files.file.name);
	var tempPath = req.files.file.path;
	var response;
	var targetPath = path.resolve("./public/uploadedFiles/"+req.files.file.name);
	fs.rename(tempPath, targetPath, function(err) {
		if (err)
		{
			response = {"statusCode":401};
			res.send(JSON.stringify(response));
		}
		console.log("Upload completed!");
		fs.createReadStream("./public/uploadedFiles/"+req.files.file.name)
		.pipe(unzip.Parse())
		.on('entry', function (entry) {

			var fileName = entry.path
			var type = entry.type
			var fullPath = './public/input/'+req.files.file.name+'/' + path.dirname( fileName )
			fileName = path.basename( fileName )
			mkdir.sync(fullPath)
			entry.pipe(fs.createWriteStream( fullPath + '/' + fileName ))
		})

		var exec = require('child_process').exec;
		var child = exec('java -jar ./public/jars/tenant1.jar ./public/input/'+req.files.file.name + ' ./public/output',
				function (error, stdout, stderr){
			console.log('Output -> ' + stdout);
			if(error !== null){
				console.log("Error -> "+error);
			}
		});
		
		response = {"statusCode":200};
		res.send(JSON.stringify(response));
	});
}

exports.login = login;
exports.showGrading = showGrading;
exports.upload = upload;