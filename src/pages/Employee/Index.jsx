import React, { useEffect, useState } from 'react';
import employeeService from '../../services/employee';
import EmployeeTable from '../../components/EmployeeTable';
import { useLoader } from '../../context/LoaderContext';
import { useNotification } from '../../context/NotificationContext';
import MagicButton from '../../components/MagicButton';
import { Grid } from '@mui/material';
import { Add } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const EmployeePage = () => {
    const { showLoader, hideLoader } = useLoader();
    const { showNotification } = useNotification();
    const [employees, setEmployees] = useState([]);
    const navigate = useNavigate();

    const fetchEmployees = async () => {
        try {
            showLoader();

            const res = await employeeService.fetchEmployee();

            if (res?.success) {
                const employeeList = res?.data || [];

                if (employeeList.length > 0) {
                    setEmployees(employeeList);
                    showNotification({
                        message: 'Employees loaded successfully!',
                        severity: 'success',
                        position: 'top-right',
                    });
                } else {
                    showNotification({
                        message: 'No employees found.',
                        severity: 'info',
                        position: 'top-center',
                    });
                }
            } else {
                showNotification({
                    message: 'Failed to load employees',
                    severity: 'error',
                    position: 'top-center',
                });
            }

        } catch (error) {
            console.error('Error fetching employees:', error);
            showNotification({
                message: 'Something went wrong while fetching employees.',
                severity: 'error',
                position: 'top-center',
            });
        } finally {
            hideLoader();
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    const addEmployee = () => {
        navigate('/employee/add');
    };

    return (
        <>
            {/* Header Row with Button */}
            <Grid container alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                <Grid item>
                    <h2 style={{ margin: 0 }}>Employees List</h2>
                </Grid>
                <Grid item>
                    <MagicButton onClick={addEmployee} fullWidth={false} startIcon={<Add />}>
                        Add
                    </MagicButton>
                </Grid>
            </Grid>

            {/* Employee Table */}
            <EmployeeTable employees={employees} />
        </>
    );
};

export default EmployeePage;
