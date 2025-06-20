import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PrivateRoute from "@routes/PrivateRoute";
import PublicRoute from "@routes/PublicRoute";
import Layout from '@components/layouts';
import RegisterPage from '@pages/RegisterPage';
import Login from '@pages/Login';
import Dashboard from '@pages/Dashboard';
import Employee from '@pages/Employee/Index';
import AddEmployee from '@pages/Employee/AddEmployee';
import Project from '@pages/Project/IndexPage';
import AddProject from '@pages/Project/AddProject';
import ProjectManagement from '@pages/Senior/ProjectManagement';
import ProjectDetail from '@pages/Senior/ProjectDetail';
import CreateTask from '@pages/Senior/CreateTask';
import EditTask from '@pages/Senior/EditTask';
import MyTasks from '@pages/Senior/MyTasks';

function AppRouter() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
          <Route path="/" element={<Layout />}>
            <Route index element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } />

            <Route path='/employees' element={
              <PrivateRoute>
                <Employee />
              </PrivateRoute>
            } />

            <Route path='/employee/add' element={
              <PrivateRoute>
                <AddEmployee />
              </PrivateRoute>
            } />

            <Route path='/projects' element={
              <PrivateRoute>
                <Project />
              </PrivateRoute>
            } />

            <Route path='/project/add' element={
              <PrivateRoute>
                <AddProject />
              </PrivateRoute>
            } />

            {/* Senior Management Routes */}
            <Route path='/senior/projects' element={
              <PrivateRoute>
                <ProjectManagement />
              </PrivateRoute>
            } />

            <Route path='/senior/project/:projectId' element={
              <PrivateRoute>
                <ProjectDetail />
              </PrivateRoute>
            } />

            <Route path='/senior/project/:projectId/create-task' element={
              <PrivateRoute>
                <CreateTask />
              </PrivateRoute>
            } />

            <Route path='/senior/my-tasks' element={
              <PrivateRoute>
                <MyTasks />
              </PrivateRoute>
            } />

            <Route path='/senior/project/:projectId/edit-task/:taskId' element={
              <PrivateRoute>
                <EditTask />
              </PrivateRoute>
            } />

          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default AppRouter;
