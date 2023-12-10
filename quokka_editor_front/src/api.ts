import axios from "axios";
import {
  CURRENT_DOCUMENT_URL,
  DOCUMENTS_URL,
  GET_PDF_URL,
  GET_TEMPLATES_URL,
  LOGIN_URL,
  PROJECTS_URL,
  REGISTER_URL,
  SHARE_DOCUMENT_URL,
  TOKEN_REFRESH_URL,
  USER_DATA_URL,
} from "./apiUrls";
import { LoginType, RegisterType } from "./types/global";
import { throttle } from "lodash";
import { UserState } from "./Redux/userSlice";

const getHeaders = () => {
  return { Authorization: sessionStorage.getItem("userToken") };
};

export const getTemplates = () => {
  return axios.get(GET_TEMPLATES_URL, { headers: getHeaders() });
};

export const addNewDocument = (project_id: string, template: string | null) => {
  return axios.post(
    DOCUMENTS_URL,
    { template_id: template, project_id: project_id },
    {
      headers: getHeaders(),
    }
  );
};

export const addNewProject = () => {
  return axios.post(PROJECTS_URL, null, { headers: getHeaders() });
};

export const deleteSelectedDocument = (docId: string) => {
  return axios.delete(DOCUMENTS_URL + docId, { headers: getHeaders() });
};

export const deleteSelectedProject = (projectId: string) => {
  return axios.delete(PROJECTS_URL + projectId, { headers: getHeaders() });
};

export const getPageOfProjects = (queryParams: string) => {
  return axios.get(PROJECTS_URL + queryParams, { headers: getHeaders() });
};

export const loginUser = (loginData: LoginType) => {
  return axios.post(LOGIN_URL, loginData);
};

export const registerUser = (registerData: RegisterType) => {
  return axios.post(REGISTER_URL, registerData);
};

export const updateTitle = (docId: string, updatedTitle: string) => {
  return axios.patch(
    CURRENT_DOCUMENT_URL + docId,
    { title: updatedTitle },
    { headers: getHeaders() }
  );
};

export const getSingleDocument = (docId: string) => {
  return axios.get(CURRENT_DOCUMENT_URL + docId, { headers: getHeaders() });
};

export const getPDF = (docId: string) => {
  return axios.get(GET_PDF_URL + docId, {
    headers: { ...getHeaders(), Accept: "application/pdf" },
    responseType: "blob",
  });
};

export const changeDocumentPrivileges = (
  docId: string,
  privileges: string,
  isDocumentShared: boolean
) => {
  return axios.post(
    SHARE_DOCUMENT_URL + docId,
    {
      shared_role: privileges,
      shared_by_link: isDocumentShared,
    },
    { headers: getHeaders() }
  );
};

export const shareDocument = (
  docId: string,
  privileges: string,
  isDocumentShared: boolean
) => {
  return axios.post(
    SHARE_DOCUMENT_URL + docId,
    {
      shared_role: privileges,
      shared_by_link: !isDocumentShared,
    },
    { headers: getHeaders() }
  );
};

export const refreshToken = () => {
  return axios.get(TOKEN_REFRESH_URL, { headers: getHeaders() });
};

export const throttledSearch = throttle(
  async (searchQuery: string) => await getPageOfProjects(searchQuery),
  300
);

export const getUser = () => {
  return axios.get(USER_DATA_URL, { headers: getHeaders() });
};

export const updateUser = (updatedUserData: UserState) => {
  return axios.patch(USER_DATA_URL, updatedUserData, { headers: getHeaders() });
};
