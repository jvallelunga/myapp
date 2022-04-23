var express = require('express');
var router = express.Router();

var UserService = require('#services/user/index');

/* GET home page. */
router.get('/', async function(req, res, next) {
  try {
    const users = await UserService.find();
    console.log(users);
    res.render('index', { title: 'Express!!! - SUCCESS', users });
  } catch(e) {
    console.log(e);
    res.render('index', { title: 'Express!!! - ERROR' });
  }
});

module.exports = router;
