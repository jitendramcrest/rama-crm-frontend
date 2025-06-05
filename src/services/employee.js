import axiosInstance from "../helpers/apiClient";
import handleApiResponse from "../helpers/handleApiResponse";

class EmployeeService {
  async fetchEmployee() {
    const response = handleApiResponse(axiosInstance.get("/employees"));
    return response;
  }

  async addEmployee(data) {
    const response = handleApiResponse(axiosInstance.post("/employees", data));
    return response;
  }

  async showEmployee(id) {
    const response = handleApiResponse(axiosInstance.get(`/employees/${id}`));
    return response;
  }

  async updateEmployee(data,id) {
    const response = handleApiResponse(axiosInstance.put(`/employees/${id}`, data));
    return response;
  }
  
  async deleteEmployee(id) {
    const response = handleApiResponse(axiosInstance.delete(`/employees/${id}`));
    return response;
  }
}

const employeeService = new EmployeeService();
export default employeeService;
