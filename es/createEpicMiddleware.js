import { map, observe, switchLatest } from 'most';
import { async } from 'most-subject';
import { epicBegin, epicEnd } from './actions';
import { STATE_STREAM_SYMBOL } from './constants';

export var createEpicMiddleware = function createEpicMiddleware(epic, dependencies) {
  if (typeof epic !== 'function') {
    throw new TypeError('You must provide an Epic (a function) to createEpicMiddleware.');
  }

  var actionsIn$ = async();

  var epic$ = async();

  var middlewareApi = void 0;

  var epicMiddleware = function epicMiddleware(_middlewareApi) {
    middlewareApi = _middlewareApi;

    return function (next) {
      var callNextEpic = function callNextEpic(nextEpic) {
        middlewareApi.dispatch(epicBegin());

        var state$ = middlewareApi[STATE_STREAM_SYMBOL];
        var isUsingStateStreamEnhancer = !!state$;

        return isUsingStateStreamEnhancer ? nextEpic(actionsIn$, state$, dependencies) : nextEpic(actionsIn$, middlewareApi, dependencies);
      };

      var actionsOut$ = switchLatest(map(callNextEpic, epic$));
      observe(middlewareApi.dispatch, actionsOut$);

      epic$.next(epic);

      return function (action) {
        var result = next(action);
        actionsIn$.next(action);
        return result;
      };
    };
  };

  epicMiddleware.replaceEpic = function (nextEpic) {
    middlewareApi.dispatch(epicEnd());
    epic$.next(nextEpic);
  };

  return epicMiddleware;
};