import axiosInstance from "@helpers/apiClient";
import handleApiResponse from "@helpers/handleApiResponse";

class ProjectService {
  async fetchProjects() {
    const response = handleApiResponse(axiosInstance.get("/projects"));
    return response;
  }

  async addProject(data) {
    const response = handleApiResponse(axiosInstance.post("/projects", data));
    return response;
  }

  async showProject(id) {
    const response = handleApiResponse(axiosInstance.get(`/projects/${id}`));
    return response;
  }

  async updateProject(data,id) {
    const response = handleApiResponse(axiosInstance.put(`/projects/${id}`, data));
    return response;
  }
  
  async deleteProject(id) {
    const response = handleApiResponse(axiosInstance.delete(`/projects/${id}`));
    return response;
  }

  async fetchUserList(id) {
    const response = handleApiResponse(axiosInstance.get(`/project/user-list/${id}`));
    return response;
  }
}

const projectService = new ProjectService();
export default projectService;
