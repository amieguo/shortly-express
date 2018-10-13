const models = require('../models');
const Promise = require('bluebird');
const _ = require('underscore');

module.exports.createSession = (req, res, next) => {
  console.log('req.cookies ', req.cookies);
  if (_.isEmpty(req.cookies)) {
    models.Sessions.create()
      .then((obj) => {
        var insertId = obj.insertId; 
        return models.Sessions.getAll();
        // {id: insertId}
        //console.log(obj);
      })
      .then(results => {
        console.log('AAAAAAAAAA: ', results[0].hash);
        req.session = {hash: results[0].hash};
        console.log('BBBBBBBBBBBBBBBB: ', req.session);
        next();
      });
    // console.log(models.Sessions.create());
    // .then(() => models.Sessions.hash)
  }
  
  next();
  
};

/************************************************************/
// Add additional authentication middleware functions below
/************************************************************/

