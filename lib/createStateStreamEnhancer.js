'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createStateStreamEnhancer = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _most = require('most');

var _constants = require('./constants');

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var createStateStreamEnhancer = exports.createStateStreamEnhancer = function createStateStreamEnhancer(epicMiddleware) {
  return function (createStore) {
    return function (reducer, preloadedState, enhancer) {
      var store = createStore(reducer, preloadedState, enhancer);
      var _dispatch = store.dispatch;

      var middlewareApi = _defineProperty({
        getState: store.getState,
        dispatch: function dispatch(action) {
          return _dispatch(action);
        }
      }, _constants.STATE_STREAM_SYMBOL, (0, _most.skipRepeats)((0, _most.from)(store)));

      _dispatch = epicMiddleware(middlewareApi)(store.dispatch);

      return _extends({}, store, {
        dispatch: _dispatch
      });
    };
  };
};