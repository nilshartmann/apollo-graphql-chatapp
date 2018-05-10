const AUTH_ID_KEY = "__auth_id__";
const AUTH_JWT_KEY = "__auth_jwt__";

const theStorage = sessionStorage;

export const setLocalAuth = (userId: string, jwt: string) => {
  if (!userId) {
    throw new Error("Missing userId");
  }
  if (!jwt) {
    throw new Error("Missing JWT");
  }
  theStorage.setItem(AUTH_ID_KEY, userId);
  theStorage.setItem(AUTH_JWT_KEY, jwt);
};
export const clearLocalAuth = () => {
  theStorage.removeItem(AUTH_ID_KEY);
  theStorage.removeItem(AUTH_JWT_KEY);
};

export const getJwtToken = () => theStorage.getItem(AUTH_JWT_KEY);

export const getAuthorizationHeader = () =>
  getJwtToken() && {
    authorization: `Bearer ${getJwtToken()}`
  };

export const getLocalUserId = () => theStorage.getItem(AUTH_ID_KEY);
export const setLocalUserId = (authId: string) => theStorage.setItem(AUTH_ID_KEY, authId);
export const hasLocalUserId = (): boolean => theStorage.getItem(AUTH_ID_KEY) !== null;
