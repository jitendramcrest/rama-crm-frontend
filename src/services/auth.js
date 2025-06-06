import axiosInstance from "@helpers/apiClient";
import handleApiResponse from "@helpers/handleApiResponse";

class AuthService {
  async registerUser(user) {
    const response = handleApiResponse(axiosInstance.post("/register", user));
    return response;
  }

  async login(user) {
    const response = handleApiResponse(axiosInstance.post("/login", user));
    return response;
  }

  async checkAuth() {
    const response = handleApiResponse(axiosInstance.post("/check-token"));
    return response;
  }

  async logout() {
    const response = handleApiResponse(axiosInstance.post("/logout"));
    return response;
  }
}

const authService = new AuthService();
export default authService;
