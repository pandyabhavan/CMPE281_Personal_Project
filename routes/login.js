var mysql = require("./mysql");
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

exports.login = login;
exports.showGrading = showGrading;