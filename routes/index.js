
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('grading', { title: 'Express' });
};