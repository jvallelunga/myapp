var router = require('express').Router();

var UserService = require('#services/user/index');

router.post('/', async function(req, res, next) {
  try {
    const resonse = UserService.create({ name: 'inserting ' + Date.now() });
    res.json(resonse);
  } catch (err) {
    next(err);
  }  
});
router.get('/', async function(req, res, next) {
  try {
    res.json(await UserService.find());
  } catch (err) {
    next(err);
  }  
});

module.exports = router;
