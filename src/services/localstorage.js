class LocalStorageService {
  USER = "userInfo";
  ACCESS_TOKEN = "accessToken";

  setLocalStorage = (key, user) => {
    localStorage.setItem(key, JSON.stringify(user));
  };

  getLocalStorage = (key) => {
    return JSON.parse(localStorage.getItem(key));
  };
}

const localStorageService = new LocalStorageService();

export default localStorageService;
