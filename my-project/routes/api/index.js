var router = require('express').Router();

// split up route handling
router.use('/users', require('./users'));

module.exports = router;