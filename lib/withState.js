'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.withState = undefined;

var _most = require('most');

var _prelude = require('@most/prelude');

var flippedSampleState = (0, _prelude.curry3)(function (f, stateStream, samplerStream) {
  return (0, _most.sampleArray)(f, samplerStream, [stateStream, samplerStream]);
});

var toArray = function toArray(state, samplerStreamEvent) {
  return [state, samplerStreamEvent];
};

var withState = exports.withState = flippedSampleState(toArray);