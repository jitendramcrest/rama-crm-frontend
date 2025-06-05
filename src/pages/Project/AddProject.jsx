import React, { useState } from 'react';
import {
  TextField,
  Button,
  Container,
  Typography,
  Paper,
  Grid,
  MenuItem
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { enGB } from 'date-fns/locale';
import { useNotification } from '../../context/NotificationContext';
import { messages } from "../../utils/messages";
import MagicButton from "../../components/MagicButton";
import projectService from '../../services/project';

const AddProject = () => {
    const navigate = useNavigate();
    const { showNotification } = useNotification();
    const [error, setError] = useState({});
    const [formData, setFormData] = useState({
        name: '',
        deadline: null,
        description: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError(prev => ({ ...prev, [e.target.name]: null }));
    };

    const handleDateChange = (date) => {
        setFormData({ ...formData, deadline: date });
        setError(prev => ({ ...prev, [date]: null }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = ['The name field is required.'];
        if (!formData.deadline) newErrors.deadline = ['The deadline field is required.'];
        if (!formData.description.trim()) newErrors.description = ['The description field is required.'];

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
            deadline: formData.deadline
            ? format(formData.deadline, 'yyyy-MM-dd')
            : null,
        };

        try {
            const res = await projectService.addProject(formattedData);
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
                    message: 'Project added successfully!',
                    severity: 'success',
                    position: 'top-center',
                });
                setError(null);
                setFormData({ name: '', deadline: null, description: ''});
                if (res) {
                    setTimeout(() => {
                        navigate('/projects');
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

    return (
        <Container maxWidth="sm" className="mt-10">
        <Paper elevation={3} className="p-6">
            <Typography variant="h5" gutterBottom>Add New Project</Typography>

            <form className="space-y-5">
                <Grid container spacing={3}>
                    <TextField label="Project Name" variant="outlined" name="name" value={formData.name} onChange={handleChange} required fullWidth />
                    {error?.name && <p className="text-red-500 text-sm">{error.name[0]}</p>}
                    <TextField label="Description" variant="outlined" name="description" value={formData.description} onChange={handleChange} required fullWidth />
                    {error?.description && <p className="text-red-500 text-sm">{error.description[0]}</p>}
                    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enGB}>
                        <DatePicker
                        label="Deadline Date"
                        value={formData.deadline}
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
                    {error?.deadline && <p className="text-red-500 text-sm">{error.deadline[0]}</p>}
                    <MagicButton onClick={handleSubmit}>Save</MagicButton>
                </Grid>
            </form>
        </Paper>
        </Container>
    );
};

export default AddProject;
