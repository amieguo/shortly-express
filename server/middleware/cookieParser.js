var express = require('express');


var app = express();




const parseCookies = (req, res, next) => {
  const cookieStr = req.headers.cookie;

  if (cookieStr) {
    const cookieArr = cookieStr.split('; ');
    const cookieObj = {};
    cookieArr.forEach((x) => {
      const keyValue = x.split('=');
      cookieObj[keyValue[0]] = keyValue[1];
    });
    
    req.cookies = cookieObj;
  }
  next();
};

module.exports = parseCookies;
