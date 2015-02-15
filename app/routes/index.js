var express = require('express');
var router = express.Router();
var reddit = require('../reddit/reddit');
var qs = require('querystring');
var url = require('url');

router.use('/completeoauth', function (req, res, next) {
    var state = req.query.state;
    var code = req.query.code;
    var error = req.query.error;

    if(state && code) {
        console.log("state: " + state + ", code: " + code);
        reddit.completeAuthorization(state, code, error, function(){
            console.log("[ROUTER] completeAuth callback");
            res.redirect('/');
        });
    }
    // next('OAuth failure Error');
});

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'reddit Plus: Material Design reddit' });
});

router.get('/r/:sub/:sort', function(req, res, next) {
    
    reddit.subreddit(req.params.sub, req.params.sort, 25, function(data){
        console.log('data: ' + JSON.stringify(data));
        res.json(data);
    });
});

module.exports = router;