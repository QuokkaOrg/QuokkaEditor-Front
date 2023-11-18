import { AxiosError } from "axios";
import logger from "../logger";

const handleError = (error: AxiosError) => {
  logger.error(error);
  const errorResponse = error.response;
  if(errorResponse?.status === 401) return []
};

export default handleError;
