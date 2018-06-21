'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.req = req;

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _Utils = require('./Utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function req(method, params) {
  var url = params.url,
      headers = params.headers,
      body = params.body,
      auth = params.auth,
      query = params.query,
      rest = params.rest;

  return new Promise(function (resolve, reject) {
    var j = _request2.default.jar();
    (0, _request2.default)(_extends({
      url: url,
      headers: headers,
      auth: auth,
      qs: query,
      method: method,
      json: body,
      jar: j
    }, rest), function (error, response, body) {
      error = (0, _Utils.assembleError)({ error: error, response: response });
      if (error) {
        reject(error);
      } else {
        console.log('\u2713 ' + method + ' succeeded.');
        console.log('Server responded with: \n' + JSON.stringify(response, null, 2));
        var resp = (0, _Utils.tryJson)(body);
        if (rest.keepCookie) {
          var __cookie = j.getCookieString(url);
          resolve(_extends({
            __cookie: __cookie
          }, resp));
        } else {
          resolve(resp);
        }
      }
    });
  });
}
