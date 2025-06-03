import React, { useState } from 'react';
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  TableContainer,
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogContentText, 
  DialogActions, 
  Button, 
  Grid, 
  MenuItem,
  TextField 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { IconButton, Tooltip } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { useNotification } from '../context/NotificationContext';
import { messages } from "../utils/messages";
import employeeService from '../services/employee';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { enGB } from 'date-fns/locale';
import MagicButton from "../components/MagicButton";
import { useLoader } from '../context/LoaderContext';

const EmployeeTable = ({ employees }) => {
  const { showLoader, hideLoader } = useLoader();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const [error, setError] = useState({});
  const roles = ['tl', 'senior', 'junior'];
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    joining_date: null,
    designation: '',
    department: '',
    hourly_rate: ''
  });

  const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
      setError(prev => ({ ...prev, [e.target.name]: null }));
  };

  const handleDateChange = (date) => {
      setFormData({ ...formData, joining_date: date });
      setError(prev => ({ ...prev, [date]: null }));
  };

  const validateForm = () => {
      const newErrors = {};
      if (!formData.name.trim()) newErrors.name = ['The name field is required.'];
      if (!formData.email.trim()) newErrors.email = ['The email field is required.'];
      if (!formData.role.trim()) newErrors.role = ['The role field is required.'];
      if (!formData.joining_date) newErrors.joining_date = ['The joining date field is required.'];
      if (!formData.designation.trim()) newErrors.designation = ['The designation field is required.'];
      if (!formData.department.trim()) newErrors.department = ['The department field is required.'];
      if (!formData.hourly_rate.trim()) newErrors.hourly_rate = ['The hourly rate field is required.'];

      return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
        setError(validationErrors);
        return;
    }

    const formattedData = {
        ...formData,
        joining_date: formData.joining_date
        ? format(formData.joining_date, 'dd/MM/yy')
        : null,
    };

    try {
        const res = await employeeService.updateEmployee(formattedData);
        setError(null);
        if (res.status === 422) {
            setError(res?.response?.data);
        } else if (res.status === 401) {
            const errorMsg = messages.resError(res?.response?.data?.error);
            showNotification({
                message: errorMsg,
                severity: 'error',
                position: 'top-center',
            });
        } else if (res?.success) {

            showNotification({
                message: 'Employee added successfully!',
                severity: 'success',
                position: 'top-center',
            });
            setError(null);
            setFormData({ name: '', email: '', password: '', role: '', joining_date: null, designation: '', department: '', hourly_rate: ''});
            if (res) {
                setTimeout(() => {
                    navigate('/employees');
                }, 1000);
            }
        } else {
            const errorMsg = messages.resError(res?.message);
            showNotification({
                message: errorMsg,
                severity: 'error',
                position: 'top-center',
            });
        }
    } catch (err) {
        if (err.response && err.response.status === 422) {
            setError(err?.response?.data);
        } else {
            const errorMsg = messages.resError(err?.message);
            showNotification({
                message: errorMsg,
                severity: 'error',
                position: 'top-center',
            });
        }
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleEdit = async (id) => {
    showLoader();
    setOpen(true);
    setFormData({
      name: '',
      email: '',
      role: '',
      joining_date: null,
      designation: '',
      department: '',
      hourly_rate: ''
    });

    try {
        const res = await employeeService.showEmployee(id);
        setError(null);
        if (res.status === 422) {
            setError(res?.response?.data);
        } else if (res.status === 401) {
            const errorMsg = messages.resError(res?.response?.data?.error);
            showNotification({
              message: errorMsg,
              severity: 'error',
              position: 'top-center',
            });
        } else if (res?.success) {

            showNotification({
              message: 'Employee fetched successfully!',
              severity: 'success',
              position: 'top-center',
            });
            setError(null);

            if (res) {
              const emp = res?.data;
              console.log(emp);

              const joining_date = emp.joining_date ? format(emp.joining_date, 'MM/dd/yyyy') : null;
              console.log(joining_date);
              setFormData({ name: emp.name, email: emp.email, role: 'tl', joining_date: joining_date, designation: emp.designation, department: emp.department, hourly_rate: emp.hourly_rate});

              console.log(formData);
            }
        } else {
            const errorMsg = messages.resError(res?.message);
            showNotification({
              message: errorMsg,
              severity: 'error',
              position: 'top-center',
            });
        }
        hideLoader();
    } catch (err) {
      console.error('Error fetching employee:', err);
      if (err.response && err.response.status === 422) {
          setError(err?.response?.data);
      } else {
          const errorMsg = messages.resError(err?.message);
          showNotification({
            message: errorMsg,
            severity: 'error',
            position: 'top-center',
          });
      }
      hideLoader();
    }
  }

  const handleDelete = (id) => {          
    console.log(`Delete employee with ID: ${id}`);
  }
  
  return (
    <>
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><b>ID</b></TableCell>
            <TableCell><b>Name</b></TableCell>
            <TableCell><b>Email</b></TableCell>
            <TableCell><b>Designation</b></TableCell>
            <TableCell><b>Department</b></TableCell>
            <TableCell><b>Joining Date</b></TableCell>
            <TableCell><b>Hours Pay</b></TableCell>
            <TableCell><b>Action</b></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {employees.map((emp) => (
            <TableRow key={emp.id}>
              <TableCell>{emp.id}</TableCell>
              <TableCell>{emp.name}</TableCell>
              <TableCell>{emp.email}</TableCell>
              <TableCell>{emp.designation}</TableCell>
              <TableCell>{emp.department}</TableCell>
              <TableCell>{emp.joining_date ? format(parseISO(emp.joining_date), 'dd-MM-yyyy') : '-'}</TableCell>
              <TableCell>{emp.hourly_rate}</TableCell>
              <TableCell>
                <Tooltip title="Edit">
                  <IconButton color="primary" onClick={() => handleEdit(emp.id)}>
                    <Edit />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton color="secondary" onClick={() => handleDelete(emp.id)}>
                    <Delete />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>

    <Dialog fullWidth={true} open={open} onClose={handleClose}>
      <DialogTitle>Edit Employee</DialogTitle>
      <DialogContent>
      <form className="space-y-5">
        <Grid container spacing={3}>
            <TextField label="Name" variant="outlined" name="name" value={formData.name} onChange={handleChange} required fullWidth />
            {error?.name && <p className="text-red-500 text-sm">{error.name[0]}</p>}
            <TextField label="Email" variant="outlined" name="email" value={formData.email} onChange={handleChange} required fullWidth type="email" />
            {error?.email && <p className="text-red-500 text-sm">{error.email[0]}</p>}
            <TextField
            select
            label="Role"
            name="role"
            variant="outlined"
            value={formData.role}
            onChange={handleChange}
            required
            fullWidth
            >
            {roles.map((role) => (
                <MenuItem key={role} value={role}>{role}</MenuItem>
            ))}
            </TextField>
            {error?.role && <p className="text-red-500 text-sm">{error.role[0]}</p>}

            <TextField label="Designation" variant="outlined" name="designation" value={formData.designation} onChange={handleChange} required fullWidth />
            {error?.designation && <p className="text-red-500 text-sm">{error.designation[0]}</p>}
            <TextField label="Department" variant="outlined" name="department" value={formData.department} onChange={handleChange} required fullWidth />
            {error?.department && <p className="text-red-500 text-sm">{error.department[0]}</p>}
            <TextField type="number" label="Hourly Rate" variant="outlined" name="hourly_rate" value={formData.hourly_rate} onChange={handleChange} required fullWidth />
            {error?.hourly_rate && <p className="text-red-500 text-sm">{error.hourly_rate[0]}</p>}

            <LocalizationProvider dateAdapter={AdapterDateFns} locale={enGB}>
                <DatePicker
                label="Joining Date"
                value={formData.joining_date}
                onChange={handleDateChange}
                inputFormat="dd/MM/yyyy"
                slotProps={{
                    textField: {
                    fullWidth: true,
                    required: true,
                    },
                }}
                />
            </LocalizationProvider>
            {error?.joining_date && <p className="text-red-500 text-sm">{error.joining_date[0]}</p>}
            <MagicButton onClick={handleSubmit}>Save</MagicButton>
        </Grid>
      </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
    </>
  );
};

export default EmployeeTable;
