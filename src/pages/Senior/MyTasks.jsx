import React, { useEffect, useState } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  MenuItem,
  Box,
  Chip,
  Menu,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button 
} from '@mui/material';
import {
  Assignment,
  CheckCircle,
  Schedule,
  Warning,
  Edit,
  Visibility
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useLoader } from '@context/LoaderContext';
import { useNotification } from '@context/NotificationContext';
import taskService from '@services/task';
import MagicButton from '@components/common/MagicButton';
import SecondaryMagicButton from '@components/common/SecondaryMagicButton';

const MyTasks = () => {
  const navigate = useNavigate();
  const { showLoader, hideLoader } = useLoader();
  const { showNotification } = useNotification();
  const [tasks, setTasks] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [modalMode, setModalMode] = useState('');
  const [error, setError] = useState({});
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0
  });

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    task_id: "",
    priority: '',
    estimated_hours: ''
  });

  useEffect(() => {
    fetchMyTasks();
  }, []);

  const fetchMyTasks = async () => {
    try {
      showLoader();
      const response = await taskService.fetchMyTasks();
      
      if (response?.success) {
        const taskData = response.data || [];
        setTasks(taskData);
        
        // Calculate stats
        const total = taskData.length;
        const pending = taskData.filter(item => item.task?.status === 'pending').length;
        const inProgress = taskData.filter(item => item.task?.status === 'in_progress').length;
        const completed = taskData.filter(item => item.task?.status === 'completed').length;

        setStats({ total, pending, inProgress, completed });
        
        showNotification({
          message: 'Tasks loaded successfully!',
          severity: 'success',
          position: 'top-right',
        });
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      showNotification({
        message: 'Failed to load tasks',
        severity: 'error',
        position: 'top-center',
      });
    } finally {
      hideLoader();
    }
  };

  const getStatusColor = (status) => {
    const statusColors = {
      'pending': 'warning',
      'in_progress': 'info',
      'completed': 'success',
      'cancelled': 'error'
    };
    return statusColors[status] || 'default';
  };

  const getPriorityColor = (priority) => {
    const priorityColors = {
      'low': 'success',
      'medium': 'warning',
      'high': 'error'
    };
    return priorityColors[priority] || 'default';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const isOverdue = (dueDate, status) => {
    return status !== 'completed' && new Date(dueDate) < new Date();
  };

  const handleMenuOpen = (event, task) => {
    setAnchorEl(event.currentTarget);
    setSelectedTask(task);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedTask(null);
  };

  const getStatusName = (status) => {

    const statusColors = {
      'pending': 'Pending',
      'in_progress': 'In Progress',
      'completed': 'Completed',
      'cancelled': 'Cancelled'
    };
    return statusColors[status] || 'default';

  }

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const response = await taskService.updateTaskStatus(taskId, newStatus);
      if (response?.success) {
        showNotification({
          message: 'Task status updated successfully!',
          severity: 'success',
          position: 'top-center',
        });
        fetchMyTasks(); // Refresh tasks
      }
    } catch (error) {
      showNotification({
        message: 'Failed to update task status',
        severity: 'error',
        position: 'top-center',
      });
    }
  };

  const completionPercentage = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;

  const handleOpenModal = (mode, task) => {
    setModalMode(mode);
    setSelectedTask(task);
    setOpenModal(true);
  };
  
  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedTask(null);
    setModalMode('');
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(prev => ({ ...prev, [e.target.name]: null }));
  };

  const handleSaveTask = (task) => {
    // Send update request to backend...
    console.log('Saving', task);
    // handleCloseModal();
  };
  
  return (
    <>
      {/* Header */}
      <Grid container alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
        <Grid item>
          <Typography variant="h4" fontWeight="bold" color="primary">
            My Tasks
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Track and manage your assigned tasks
          </Typography>
        </Grid>
      </Grid>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card className="text-white shadow-lg bg-gradient-to-r from-blue-500 to-blue-600">
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {stats.total}
                  </Typography>
                  <Typography variant="body2">Total Tasks</Typography>
                </Box>
                <Assignment fontSize="large" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card className="text-white shadow-lg bg-gradient-to-r from-orange-500 to-orange-600">
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {stats.pending}
                  </Typography>
                  <Typography variant="body2">Pending</Typography>
                </Box>
                <Warning fontSize="large" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card className="text-white shadow-lg bg-gradient-to-r from-yellow-500 to-yellow-600">
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {stats.inProgress}
                  </Typography>
                  <Typography variant="body2">In Progress</Typography>
                </Box>
                <Schedule fontSize="large" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card className="text-white shadow-lg bg-gradient-to-r from-green-500 to-green-600">
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {stats.completed}
                  </Typography>
                  <Typography variant="body2">Completed</Typography>
                </Box>
                <CheckCircle fontSize="large" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Progress Overview */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Overall Progress
              </Typography>
              <Box display="flex" alignItems="center" mb={1}>
                <Typography variant="body2" color="text.secondary" sx={{ minWidth: 100 }}>
                  {Math.round(completionPercentage)}% Complete
                </Typography>
                <Box width="100%" mx={2}>
                  <LinearProgress
                    variant="determinate"
                    value={completionPercentage}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {stats.completed}/{stats.total}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tasks Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Task Details
          </Typography>
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Task</TableCell>
                  <TableCell>Project</TableCell>
                  <TableCell>Priority</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Due Date</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tasks.map((task) => (
                  <TableRow key={task.id} hover>
                    <TableCell>
                      <Box>
                        <Typography variant="body1" fontWeight="medium">
                          {task?.task?.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" noWrap>
                          {task?.task?.description?.length > 50 
                            ? `${task?.task?.description.substring(0, 50)}...` 
                            : task?.task?.description}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {task.project?.name || 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={task?.task?.priority}
                        color={getPriorityColor(task?.task?.priority)}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getStatusName(task?.task?.status)}
                        color={getStatusColor(task?.task?.status)}
                        size="small"
                        onClick={(e) => {
                          handleMenuOpen(e, task)
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography 
                        variant="body2"
                        color={isOverdue(task?.task?.due_date, task?.task?.status) ? 'error' : 'text.primary'}
                      >
                        {formatDate(task?.task?.due_date)}
                        {isOverdue(task?.task?.due_date, task?.task?.status) && ' (Overdue)'}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Box display="flex" gap={1}>
                        <IconButton
                          size="small"
                          onClick={() => handleOpenModal('view', task)}
                          title="View Details"
                        >
                          <Visibility fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleOpenModal('edit', task)}
                          title="Edit Task"
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>

                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem key="pending" onClick={() => handleStatusChange(selectedTask?.task?.id,'pending')}>
              Pending
            </MenuItem>
            <MenuItem key="in_progress" onClick={() => handleStatusChange(selectedTask?.task?.id,'in_progress')}>
              In Progress
            </MenuItem>
            <MenuItem key="completed" onClick={() => handleStatusChange(selectedTask?.task?.id,'completed')}>
              Completed
            </MenuItem>
            <MenuItem key="cancelled" onClick={() => handleStatusChange(selectedTask?.task?.id,'cancelled')}>
              Cancelled
            </MenuItem>
          </Menu>
          
          {tasks.length === 0 && (
            <Box textAlign="center" py={4}>
              <Typography variant="h6" color="text.secondary">
                No tasks assigned to you yet.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tasks will appear here when they are assigned to you.
              </Typography>
            </Box>
          )}

          <Dialog open={openModal} onClose={handleCloseModal} maxWidth="md" fullWidth>
            <DialogTitle>{modalMode === 'view' ? 'Task Details' : 'Edit Task'}</DialogTitle>
            <DialogContent>
              {modalMode === 'view' ? (
                <>
                  <p><strong>Title:</strong> {selectedTask?.task?.title}</p>
                  <p><strong>Description:</strong> {selectedTask?.task?.description}</p>

                  <p><strong>Priority:</strong> {selectedTask?.task?.priority}</p>
                  <p><strong>Status:</strong> {getStatusName(selectedTask?.task?.status)}</p>
                  <p><strong>Estimate Hours:</strong> {selectedTask?.task?.estimated_hours}</p>
                  <p><strong>Due Date:</strong> {formatDate(selectedTask?.task?.due_date)}</p>
                </>
              ) : (
                <>
                 <form>
                    <Grid container spacing={3}>
                      <TextField
                        label="Task Title"
                        variant="outlined"
                        name="title"
                        value={selectedTask?.task?.title || ''}
                        onChange={handleChange}
                        fullWidth
                        error={!!error?.title}
                        helperText={error?.title?.[0]}
                      />
                      
                      <TextField
                        label="Description"
                        variant="outlined"
                        name="description"
                        value={selectedTask?.task?.description || ''}
                        onChange={handleChange}
                        fullWidth
                        multiline
                        rows={4}
                        error={!!error?.description}
                        helperText={error?.description?.[0]}
                      />
                    </Grid>
                  </form>
                </>
              )}
            </DialogContent>
            <DialogActions>

              <SecondaryMagicButton
                type="submit"
                variant="outlined"
                onClick={handleCloseModal}
              >
                Cancel
              </SecondaryMagicButton>

              {modalMode === 'edit' && <MagicButton
                type="submit"
                onClick={() => handleSaveTask(selectedTask)}
              >
                Create Task
              </MagicButton> }

            </DialogActions>
          </Dialog>


        </CardContent>
      </Card>
    </>
  );
};

export default MyTasks;

