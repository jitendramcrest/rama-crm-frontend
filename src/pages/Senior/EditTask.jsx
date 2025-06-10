import React, { useState, useEffect } from 'react';
import {
  TextField,
  OutlinedInput,
  Container,
  Typography,
  Paper,
  Grid,
  MenuItem,
  Box,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  ListItemText,
  Checkbox
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { useNavigate, useParams } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { enGB } from 'date-fns/locale';
import { ArrowBack } from '@mui/icons-material';
import { useNotification } from '@context/NotificationContext';
import { useLoader } from '@context/LoaderContext';
import { messages } from "@utils/messages";
import MagicButton from "@components/common/MagicButton";
import SecondaryMagicButton from "@components/common/SecondaryMagicButton";
import taskService from '@services/task';

const EditTask = () => {
  const { projectId, taskId } = useParams();
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const { showLoader, hideLoader } = useLoader();
  const [error, setError] = useState({});
  const [project, setProject] = useState(null);
  const [members, setMembers] = useState([]);
  
  const priorities = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' }
  ];
  
  const statuses = [
    { value: 'pending', label: 'Pending' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' }
  ];
  
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    project_id: projectId,
    task_id: taskId,
    assigned_to: [],
    priority: 'medium',
    status: 'pending',
    due_date: null,
    estimated_hours: ''
  });

  useEffect(() => {
    if (projectId) {
      fetchProjectDetails();
      fetchTaskDetails();
      fetchProjectMembers();
    }
  }, [projectId]);

  const fetchTaskDetails = async () => {
    try {
      const response = await taskService.getTask(taskId);
      if (response?.success) {

        console.log(response?.data);
        const taskData = response?.data;
        const due_date = response?.data?.due_date ? parseISO(response?.data?.due_date) : null;
        
        const assignUser = response?.assign_user;
        setFormData({
          title: taskData?.title,
          description: taskData?.description,
          project_id: taskData?.project_id,
          task_id: taskData?.id,
          assigned_to: assignUser,
          priority: taskData?.priority,
          status: taskData?.status,
          due_date: due_date,
          estimated_hours: taskData?.estimated_hours
        });
      }
    } catch (error) {
      console.error('Error fetching task details:', error);
      showNotification({
        message: 'Failed to load task details',
        severity: 'error',
        position: 'top-center',
      });
    }
  };

  const fetchProjectDetails = async () => {
    try {
      const response = await taskService.showProject(projectId);
      if (response?.success) {
        setProject(response.data);
      }
    } catch (error) {
      console.error('Error fetching project details:', error);
      showNotification({
        message: 'Failed to load project details',
        severity: 'error',
        position: 'top-center',
      });
    }
  };

  const fetchProjectMembers = async () => {
    try {
      showLoader();
      const response = await taskService.fetchProjectMembers(projectId);
      if (response?.success) {
        setMembers(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching members:', error);
      showNotification({
        message: 'Failed to load team members',
        severity: 'error',
        position: 'top-center',
      });
    } finally {
      hideLoader();
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(prev => ({ ...prev, [e.target.name]: null }));
  };

  const handleDateChange = (date) => {
    setFormData({ ...formData, due_date: date });
    setError(prev => ({ ...prev, due_date: null }));
  };

  const handleMultiSelectChange = (event) => {
    setFormData({
      ...formData,
      assigned_to: event.target.value,
    });
    setError(prev => ({ ...prev, assigned_to: null }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = ['The title field is required.'];
    if (!formData.description.trim()) newErrors.description = ['The description field is required.'];
    if (formData.assigned_to.length === 0) newErrors.assigned_to = ['Please assign the task to a team member.'];
    if (!formData.due_date) newErrors.due_date = ['The due date field is required.'];
    if (!formData.estimated_hours.trim()) newErrors.estimated_hours = ['The estimated hours field is required.'];
    
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
      due_date: formData.due_date
        ? format(formData.due_date, 'yyyy-MM-dd')
        : null,
    };

    console.log(formattedData);
    // return;
    try {
      showLoader();
      const res = await taskService.updateTask(taskId,formattedData);
      
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
          message: 'Task updated successfully!',
          severity: 'success',
          position: 'top-center',
        });
        setError(null);

        setTimeout(() => {
          navigate(`/senior/project/${projectId}`);
        }, 1000);
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
    } finally {
      hideLoader();
    }
  };

  const handleCancel = () => {
    navigate(`/senior/project/${projectId}`);
  };

  return (
    <Container maxWidth="md" className="mt-4">
      <Paper elevation={3} className="p-6">
        {/* Header */}
        <Box display="flex" alignItems="center" mb={3}>
          <IconButton onClick={handleCancel} sx={{ mr: 2 }}>
            <ArrowBack />
          </IconButton>
          <Box>
            <Typography variant="h5" gutterBottom>
              Edit Task
            </Typography>
            {project && (
              <Typography variant="subtitle1" color="text.secondary">
                Project: {project.name}
              </Typography>
            )}
          </Box>
        </Box>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <TextField
              label="Task Title"
              variant="outlined"
              name="title"
              value={formData.title}
              onChange={handleChange}
              fullWidth
              error={!!error?.title}
              helperText={error?.title?.[0]}
            />
            
            <TextField
              label="Description"
              variant="outlined"
              name="description"
              value={formData.description}
              onChange={handleChange}
              fullWidth
              multiline
              rows={4}
              error={!!error?.description}
              helperText={error?.description?.[0]}
            />

            <FormControl fullWidth>
              <InputLabel id="multi-select-label">Select Users</InputLabel>
              <Select
                labelId="multi-select-label"
                multiple
                value={formData.assigned_to}
                onChange={handleMultiSelectChange}
                input={<OutlinedInput label="Select Users" />}
                MenuProps={MenuProps}
                renderValue={(selected) =>
                  selected
                    .map((id) => {
                      const user = members.find((u) => u.id === id);
                      return user ? user.name : id;
                    })
                    .join(', ')
                }
              >
                {members.map((user) => (
                  <MenuItem key={user.id} value={user.id}>
                    <Checkbox checked={formData.assigned_to.indexOf(user.id) > -1} />
                    <ListItemText primary={user.name} />
                  </MenuItem>
                ))}
              </Select>
              {error?.assigned_to && (
                <p className="text-sm text-red-500">{error.assigned_to[0]}</p>
              )}
            </FormControl>

            <TextField
              select
              label="Priority"
              name="priority"
              variant="outlined"
              value={formData.priority}
              onChange={handleChange}
              fullWidth
            >
              {priorities.map(priority => (
                <MenuItem key={priority.value} value={priority.value}>
                  {priority.label}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="Status"
              name="status"
              variant="outlined"
              value={formData.status}
              onChange={handleChange}
              fullWidth
            >
              {statuses.map(status => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              type="number"
              label="Estimated Hours"
              variant="outlined"
              name="estimated_hours"
              value={formData.estimated_hours}
              onChange={handleChange}
              fullWidth
              inputProps={{ min: 0, step: 0.5 }}
              error={!!error?.estimated_hours}
              helperText={error?.estimated_hours?.[0]}
            />

            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enGB}>
              <DatePicker
                label="Due Date"
                value={formData.due_date}
                onChange={handleDateChange}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!error?.due_date,
                    helperText: error?.due_date?.[0]
                  },
                }}
              />
            </LocalizationProvider>

            <Box display="flex" gap={2} justifyContent="flex-end" mt={2} width="100%">
              <SecondaryMagicButton
                type="submit"
                variant="outlined"
                onClick={handleCancel}
              >
                Cancel
              </SecondaryMagicButton>

              <MagicButton
                type="submit"
              >
                Edit Task
              </MagicButton>
            </Box>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default EditTask;

