import Axios from "axios";
import { api } from "../settings";

/* selectors */
export const getAll = ({ tables }) => tables.data;
export const getLoadingState = ({ tables }) => tables.loading;

/* action name creator */
const reducerName = 'tables';
const createActionName = name => `app/${reducerName}/${name}`;

/* action types */
const FETCH_START = createActionName('FETCH_START');
const FETCH_SUCCESS = createActionName('FETCH_SUCCESS');
const FETCH_ERROR = createActionName('FETCH_ERROR');
const CHANGE_STATUS = createActionName('CHANGE_STATUS');

/* action creators */
export const fetchStarted = payload => ({ payload, type: FETCH_START });
export const fetchSuccess = payload => ({ payload, type: FETCH_SUCCESS });
export const fetchError = payload => ({ payload, type: FETCH_ERROR });
export const statusChange = payload => ({ payload, type: CHANGE_STATUS });

/* thunk creators */
export const fetchFromAPI = () => {
  return (dispatch) => {
    dispatch(fetchStarted());

    Axios
      .get(`${api.url}/api/${api.tables}`)
      .then(res => {
        dispatch(fetchSuccess(res.data));
      })
      .catch(err => {
        dispatch(fetchError(err.message || true));
      });
  };
};

export const changeApiStatus = (row) => {
  return (dispatch) => {

    Axios
      .put(`${api.url}/api/${api.tables}/${row.id}`, { row })
      .then(res => {
        dispatch(statusChange(res.data));
      });
  };
};

/* reducer */
export default function reducer(statePart = [], action = {}) {
  switch (action.type) {
    case FETCH_START: {
      return {
        ...statePart,
        loading: {
          active: true,
          error: false,
        },
      };
    }
    case FETCH_SUCCESS: {
      return {
        ...statePart,
        loading: {
          active: false,
          error: false,
        },
        data: action.payload,
      };
    }
    case FETCH_ERROR: {
      return {
        ...statePart,
        loading: {
          active: false,
          error: action.payload,
        },
      };
    }
    case CHANGE_STATUS: {
      const newData = statePart.data.map(function (element) {
        if (element.id === action.payload.id) {
          return action.payload;
        } else {
          return element;
        }
      });
      return {
        ...statePart,
        data: newData,
      };
    }
    default:
      return statePart;
  }
}
