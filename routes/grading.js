var path = require("path");
var fs = require("fs");
var unzip = require('unzip');
var mkdir = require('mkdirp');
var mysql = require('./mysql');

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
		var child = exec('java -jar ./public/jars/tenant1.jar ./public/input/'+req.files.file.name + ' ./public/output/',
				function (error, stdout, stderr){
			console.log('Output -> ' + stdout);
			if(error !== null){
				console.log("Error -> "+error);
			}
			console.log('done');
			response = {"statusCode":200};
			res.send(JSON.stringify(response));
		});

	});
}

function submitGrade(req,res)
{
	var response;
	var scale = req.param("scale");
	var score = req.param("score");
	var grade = req.param("grade");
	var comments = req.param("comments");
	var complete = req.param("complete");
	var onTime = req.param("onTime");
	var query = "insert into grading values('Tenant-1',"+scale+","+score+",'"+grade+"',"+complete+",'"+comments+"',"+onTime+")";
	mysql.fetchData(function(err,results){
		if(err)
		{
			response = {"statusCode":401,"data":null};
			res.send(JSON.stringify(response));
		}
		else
		{
			response = {"statusCode":200,"data":results[0]};
			res.send(JSON.stringify(response));
		}
	},query);
}
exports.upload = upload;
exports.submitGrade = submitGrade;