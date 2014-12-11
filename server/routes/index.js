var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
 
	res.sendFile(__dirname + '/public/index.html');
// res.render('index', { title: 'Express' });
});

module.exports = router;
