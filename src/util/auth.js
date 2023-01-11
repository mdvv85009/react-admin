const TOKEN_NAME = 'project_ls_admin_jwt';

export const setAuthToken = (token) => {
  localStorage.setItem(TOKEN_NAME, token);
};

export const getAuthToken = () => {
  return localStorage.getItem(TOKEN_NAME);
};

export const delAuthToken = () => {
  localStorage.removeItem(TOKEN_NAME)
}
