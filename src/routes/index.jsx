import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RegisterPage from '../pages/RegisterPage';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import Employee from '../pages/Employee/Index';
import AddEmployee from '../pages/Employee/AddEmployee';
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";
import Layout from '../components/layouts';
// import ProtectedPermissionRoute from "./ProtectedPermissionRoute";

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

          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default AppRouter;
