export type TemplateType = {
  id: string;
  title: string;
  content: string;
};

export type LoginType = {
  username: string;
  password: string;
};

export type RegisterType = {
  username: string;
  email: string;
  password: string;
};

export type DocumentType = {
  title: string;
  content: string;
  id: string;
  last_revision: number;
  project_id: string;
  user_id: string;
};
