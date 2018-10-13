const models = require('../models');
const Promise = require('bluebird');
const _ = require('underscore');

module.exports.createSession = (req, res, next) => {
  console.log('req.cookies ', req.cookies);
  console.log('req.body ', req.body);
  //console.log('res ', res);
  if (_.isEmpty(req.cookies)) {
    models.Sessions.create()
      .then((obj) => {
        var insertId = obj.insertId; 
        return models.Sessions.getAll({id: insertId});
      })
      .then(data => {
        req.session = {hash: data[0].hash};
        res.cookie('shortlyid', data[0].hash);
        // res.cookies set to the following:
        // { shortlyid: { value: '***hash***', options: undefined } }
        next();
      });
  } else { //'assigns a session object to the request if a session already exists'
    models.Sessions.getAll({hash: req.cookies.shortlyid})
      .then(data => {
        console.log('data: ', data);
        if (data.length > 0) {
          
          models.Users.getAll({ id: data[0].userId })
            .then(userData => {
              console.log('userData: ', userData);
              req.session = {
                hash: data[0].hash,
                user: {username: userData[0].username},
                userId: data[0].userId
              };
              next();
            })
            .catch(err => {
              req.session = {
                hash: data[0].hash
              };
              next();
            });

        } else {
          
          models.Sessions.create()
            .then((obj) => {
              var insertId = obj.insertId; 
              return models.Sessions.getAll({id: insertId});
            })
            .then(data => {
              req.session = {hash: data[0].hash};
              res.cookie('shortlyid', data[0].hash);
              // res.cookies set to the following:
              // { shortlyid: { value: '***hash***', options: undefined } }
              next();
            });
      
        }
      })
      .catch(err => {
        // no-cookie scenario
        console.log(err);
      });
    
    // console.log('DDDDDDDDDDDDD:', req.cookies);
    // console.log('EEEEEEEEEEEEE:', req.session);
    // need to set req.session
  }
};

/************************************************************/
// Add additional authentication middleware functions below
/************************************************************/

