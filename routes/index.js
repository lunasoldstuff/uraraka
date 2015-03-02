var express = require('express');
var router = express.Router();

var qs = require('querystring');
var url = require('url');

router.get('/partials/:name', function(req, res, next){
    var name = req.params.name;
    res.render('partials/' + name);
});

/* GET home page. */
router.get('/', function(req, res, next) {
    res.locals.user = req.user;
    res.render('index', { title: 'reddit Plus: Material Design reddit' , authenticated: req.isAuthenticated() });
});

module.exports = router;