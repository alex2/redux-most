import * as ActionTypes from '../ActionTypes'
import { clearSearchResults } from '../actions'
import { select } from 'redux-most'

const clear = action$ =>
  // action$.thru(select(ActionTypes.SEARCHED_USERS_DEBOUNCED))
  select(ActionTypes.SEARCHED_USERS_DEBOUNCED, action$)
    .filter(({ payload }) => !payload.query)
    .map(clearSearchResults)

export default clear
