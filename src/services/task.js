import axiosInstance from "@helpers/apiClient";
import handleApiResponse from "@helpers/handleApiResponse";

class TaskService {
  async showProject(id) {
    const response = handleApiResponse(axiosInstance.get(`/show-project/${id}`));
    return response;
  }

  // Fetch all tasks
  async fetchTasks() {
    const response = handleApiResponse(axiosInstance.get("/tasks"));
    return response;
  }

  // Fetch tasks by project ID
  async fetchTasksByProject(projectId) {
    const response = handleApiResponse(axiosInstance.get(`/projects/${projectId}/tasks`));
    return response;
  }

  // Fetch tasks assigned to current user
  async fetchMyTasks() {
    const response = handleApiResponse(axiosInstance.get("/my-tasks"));
    return response;
  }

  // Create a new task
  async createTask(data) {
    const response = handleApiResponse(axiosInstance.post("/tasks", data));
    return response;
  }

  // Get single task details
  async getTask(id) {
    const response = handleApiResponse(axiosInstance.get(`/tasks/${id}`));
    return response;
  }

  // Update task
  async updateTask(id, data) {
    const response = handleApiResponse(axiosInstance.put(`/tasks/${id}`, data));
    return response;
  }

  // Delete task
  async deleteTask(id) {
    const response = handleApiResponse(axiosInstance.delete(`/tasks/${id}`));
    return response;
  }

  // Assign task to user
  async assignTask(taskId, userId) {
    const response = handleApiResponse(axiosInstance.post(`/tasks/${taskId}/assign`, { user_id: userId }));
    return response;
  }

  // Update task status
  async updateTaskStatus(taskId, status) {
    const response = handleApiResponse(axiosInstance.patch(`/tasks/${taskId}/status`, { status }));
    return response;
  }

  // Fetch project assignments for senior user
  async fetchMyProjectAssignments() {
    const response = handleApiResponse(axiosInstance.get("/project-assignments/my-projects"));
    return response;
  }

  // Fetch team members for a specific project
  async fetchProjectMembers(projectId) {
    const response = handleApiResponse(axiosInstance.get(`/projects/${projectId}/members`));
    return response;
  }
}

const taskService = new TaskService();
export default taskService;

