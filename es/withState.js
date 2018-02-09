import { sampleArray } from 'most';
import { curry3 } from '@most/prelude';

var flippedSampleState = curry3(function (f, stateStream, samplerStream) {
  return sampleArray(f, samplerStream, [stateStream, samplerStream]);
});

var toArray = function toArray(state, samplerStreamEvent) {
  return [state, samplerStreamEvent];
};

export var withState = flippedSampleState(toArray);