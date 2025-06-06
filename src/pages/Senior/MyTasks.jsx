import React, { useEffect, useState } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Chip,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  LinearProgress
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

const MyTasks = () => {
  const navigate = useNavigate();
  const { showLoader, hideLoader } = useLoader();
  const { showNotification } = useNotification();
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0
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
        const pending = taskData.filter(t => t.status === 'pending').length;
        const inProgress = taskData.filter(t => t.status === 'in_progress').length;
        const completed = taskData.filter(t => t.status === 'completed').length;
        
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

  const handleStatusUpdate = async (taskId, newStatus) => {
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
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg">
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
          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg">
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
          <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-lg">
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
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg">
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
                          {task.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" noWrap>
                          {task.description?.length > 50 
                            ? `${task.description.substring(0, 50)}...` 
                            : task.description}
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
                        label={task.priority}
                        color={getPriorityColor(task.priority)}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={task.status.replace('_', ' ')}
                        color={getStatusColor(task.status)}
                        size="small"
                        onClick={() => {
                          // Quick status change menu could be implemented here
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography 
                        variant="body2"
                        color={isOverdue(task.due_date, task.status) ? 'error' : 'text.primary'}
                      >
                        {formatDate(task.due_date)}
                        {isOverdue(task.due_date, task.status) && ' (Overdue)'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" gap={1}>
                        <IconButton
                          size="small"
                          onClick={() => navigate(`/senior/task/${task.id}`)}
                          title="View Details"
                        >
                          <Visibility fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => navigate(`/senior/task/${task.id}/edit`)}
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
        </CardContent>
      </Card>
    </>
  );
};

export default MyTasks;

