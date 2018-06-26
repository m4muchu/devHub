import axios from "axios";
import {
  GET_PROFILE,
  GET_ERRORS,
  PROFILE_LOADING,
  CLEAR_CURRENT_PROFILE
} from "./types";

export const getCurrentProfile = () => dispatch => {
  dispatch(setProfileLoading());

  axios
    .get("/api/profile")
    .then(res => {
      dispatch({
        type: GET_PROFILE,
        payload: res.data
      });
    })
    .catch(err =>
      dispatch({
        type: GET_PROFILE, // it will workout for new user with have no profile and we will function as a button to create new profile,,for that this logic is using
        payload: {}
      })
    );
};

// profile loading
export const setProfileLoading = () => {
  return {
    type: PROFILE_LOADING
  };
};

// clear current profile

export const clearCurrentProfile = () => {
  return {
    type: CLEAR_CURRENT_PROFILE
  };
};
