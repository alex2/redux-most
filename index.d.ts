import {
  Action,
  Middleware,
  MiddlewareAPI,
  StoreEnhancer,
} from 'redux';
import { Stream } from 'most';

/*****************************************
  Type abbreviations:
  A = Action
  T = ActionType (a string or symbol)
  S = State
*****************************************/

// for the original, redux-observable style API
export declare interface Epic<A extends Action, S, any> {
  (
    actionStream: Stream<A>,
    middlewareApi: MiddlewareAPI<S>,
    dependencies: any
  ): Stream<A>;
}

// for the newer, declarative only API, which takes in a state stream
// to sample via the withState utility instead of exposing dispatch/getState
export declare interface Epic<A extends Action, S, any> {
  (
    actionStream: Stream<A>,
    stateStream: Stream<S>,
    dependencies: any
  ): Stream<A>;
}

export interface EpicMiddleware<A extends Action, S> extends Middleware {
  replaceEpic (
    nextEpic: Epic<A, S>
  ): void;
}

export declare function createEpicMiddleware<A extends Action, S, any> (
  rootEpic: Epic<A, S>,
  dependencies: any
): EpicMiddleware<A, S>;


export declare function createStateStreamEnhancer<A extends Action, S> (
  epicMiddleware: EpicMiddleware<A, S>
): StoreEnhancer<S>;

export declare function combineEpics<A extends Action, S, any> (
  epicsArray: Epic<A, S, any>[],
): Epic<A, S, any>;

export declare type ActionType = string | symbol

// overloads exist due to select being a curried function
export declare function select<A extends Action, T = ActionType> (
  actionType: T,
  stream: Stream<A>
): Stream<A>;

export declare function select<A extends Action, T = ActionType> (
  actionType: T
): (stream: Stream<A>) => Stream<A>;

// overloads exist due to selectArray being a curried function
export declare function selectArray<A extends Action, T = ActionType> (
  actionTypes: T[],
  stream: Stream<A>
): Stream<A>;

export declare function selectArray<A extends Action, T = ActionType> (
  actionTypes: T[]
): (stream: Stream<A>) => Stream<A>;

// overloads exist due to withState being a curried function
export declare function withState<A extends Action, S> (
  stateStream: Stream<S>,
  actionStream: Stream<A>
): Stream<[S, A]>;

export declare function withState<A extends Action, S> (
  stateStream: Stream<S>
): (actionStream: Stream<A>) => Stream<[S, A]>;

export const EPIC_END = '@@redux-most/EPIC_END';