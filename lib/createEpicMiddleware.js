'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createEpicMiddleware = undefined;

var _most = require('most');

var _mostSubject = require('most-subject');

var _actions = require('./actions');

var _constants = require('./constants');

var createEpicMiddleware = exports.createEpicMiddleware = function createEpicMiddleware(epic, dependencies) {
  if (typeof epic !== 'function') {
    throw new TypeError('You must provide an Epic (a function) to createEpicMiddleware.');
  }

  var actionsIn$ = (0, _mostSubject.async)();

  var epic$ = (0, _mostSubject.async)();

  var middlewareApi = void 0;

  var epicMiddleware = function epicMiddleware(_middlewareApi) {
    middlewareApi = _middlewareApi;

    return function (next) {
      var callNextEpic = function callNextEpic(nextEpic) {
        middlewareApi.dispatch((0, _actions.epicBegin)());

        var state$ = middlewareApi[_constants.STATE_STREAM_SYMBOL];
        var isUsingStateStreamEnhancer = !!state$;

        return isUsingStateStreamEnhancer ? nextEpic(actionsIn$, state$, dependencies) : nextEpic(actionsIn$, middlewareApi, dependencies);
      };

      var actionsOut$ = (0, _most.switchLatest)((0, _most.map)(callNextEpic, epic$));
      (0, _most.observe)(middlewareApi.dispatch, actionsOut$);

      epic$.next(epic);

      return function (action) {
        var result = next(action);
        actionsIn$.next(action);
        return result;
      };
    };
  };

  epicMiddleware.replaceEpic = function (nextEpic) {
    middlewareApi.dispatch((0, _actions.epicEnd)());
    epic$.next(nextEpic);
  };

  return epicMiddleware;
};