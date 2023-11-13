import axios from "axios";
import {
  CURRENT_DOCUMENT_URL,
  DOCUMENTS_URL,
  GET_PDF_URL,
  GET_TEMPLATES_URL,
  LOGIN_URL,
  REGISTER_URL,
  SHARE_DOCUMENT_URL,
} from "./apiUrls";
import { LoginType, RegisterType } from "./types/global";

const getHeaders = () => {
  return { Authorization: sessionStorage.getItem("userToken") };
};

export const getTemplates = () => {
  return axios.get(GET_TEMPLATES_URL, { headers: getHeaders() });
};

export const addNewDocument = (template: string) => {
  return axios.post(DOCUMENTS_URL, null, {
    params: template && { template_id: template },
    headers: getHeaders(),
  });
};

export const deleteSelectedDocument = (docId: string) => {
  return axios.delete(DOCUMENTS_URL + docId, { headers: getHeaders() });
};

export const getPageOfDocuments = (queryParams: string) => {
  return axios.get(DOCUMENTS_URL + queryParams, { headers: getHeaders() });
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
