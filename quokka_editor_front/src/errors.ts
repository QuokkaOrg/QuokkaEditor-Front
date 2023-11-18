import { Axios, AxiosError } from "axios";
import toast from "react-hot-toast";
import { TOAST_OPTIONS } from "./consts";
import { NavigateFunction } from "react-router-dom";
import logger from "./logger";

export const ERRORS = {
  required: "This field is required",
  email: "Please provide a valid email address.",
  passwordLength: "Password must be at least 8 characters long",
  sessionExpired: "Your session expired. Please login again.",
  somethingWrong: "Something went wrong. Please try again.",
};

type ApiError = {
  detail: string;
};

export const handleDocumentsError = (
  err: AxiosError,
  navigate: NavigateFunction
) => {
  if (err.response?.status === 401) {
    navigate("/");
    toast.error(ERRORS.sessionExpired, TOAST_OPTIONS);
  } else {
    toast.error(ERRORS.somethingWrong, TOAST_OPTIONS);
  }
};

export const handleLoginError = (err: AxiosError<ApiError>) => {
  logger.error(err);
  if (err.response?.status == 401) {
    toast.error(err.response.data.detail, TOAST_OPTIONS);
  }
};

export const handleEditorError = (
  err: AxiosError<ApiError>,
  navigate: NavigateFunction
) => {
  if (err.response?.status === 404) {
    navigate("/404");
  }
};
