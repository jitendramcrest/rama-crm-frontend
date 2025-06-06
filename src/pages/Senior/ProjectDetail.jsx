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
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Add,
  MoreVert,
  Edit,
  Delete,
  Assignment,
  Person,
  Schedule,
  ArrowBack
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { useLoader } from '@context/LoaderContext';
import { useNotification } from '@context/NotificationContext';
import taskService from '@services/task';
import projectService from '@services/project';
import MagicButton from '@components/common/MagicButton';

const ProjectDetail = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { showLoader, hideLoader } = useLoader();
  const { showNotification } = useNotification();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    if (projectId) {
      fetchProjectDetails();
      fetchProjectTasks();
      fetchProjectMembers();
    }
  }, [projectId]);

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

  const fetchProjectTasks = async () => {
    try {
      const response = await taskService.fetchTasksByProject(projectId);
      if (response?.success) {
        setTasks(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      showNotification({
        message: 'Failed to load tasks',
        severity: 'error',
        position: 'top-center',
      });
    }
  };

  const fetchProjectMembers = async () => {
    try {
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
    }
  };

  const handleMenuOpen = (event, task) => {
    setAnchorEl(event.currentTarget);
    setSelectedTask(task);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedTask(null);
  };

  const handleEditTask = () => {
    navigate(`/senior/task/${selectedTask.id}/edit`);
    handleMenuClose();
  };

  const handleDeleteTask = async () => {
    try {
      showLoader();
      const response = await taskService.deleteTask(selectedTask.id);
      if (response?.success) {
        showNotification({
          message: 'Task deleted successfully!',
          severity: 'success',
          position: 'top-center',
        });
        fetchProjectTasks(); // Refresh tasks
      }
    } catch (error) {
      showNotification({
        message: 'Failed to delete task',
        severity: 'error',
        position: 'top-center',
      });
    } finally {
      hideLoader();
      setDeleteDialogOpen(false);
      handleMenuClose();
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const response = await taskService.updateTaskStatus(taskId, newStatus);
      if (response?.success) {
        showNotification({
          message: 'Task status updated successfully!',
          severity: 'success',
          position: 'top-center',
        });
        fetchProjectTasks(); // Refresh tasks
      }
    } catch (error) {
      showNotification({
        message: 'Failed to update task status',
        severity: 'error',
        position: 'top-center',
      });
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

  if (!project) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <Typography>Loading project details...</Typography>
      </Box>
    );
  }

  return (
    <>
      {/* Header */}
      <Box display="flex" alignItems="center" mb={3}>
        <IconButton onClick={() => navigate('/senior/projects')} sx={{ mr: 2 }}>
          <ArrowBack />
        </IconButton>
        <Box flexGrow={1}>
          <Typography variant="h4" fontWeight="bold" color="primary">
            {project.name}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {project.description}
          </Typography>
        </Box>
        <MagicButton
          onClick={() => navigate(`/senior/project/${projectId}/create-task`)}
          startIcon={<Add />}
        >
          Create Task
        </MagicButton>
      </Box>

      {/* Project Info Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Schedule color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Project Status</Typography>
              </Box>
              <Chip 
                label={project.status || 'Active'}
                color={getStatusColor(project.status || 'active')}
                size="large"
              />
              <Typography variant="body2" color="text.secondary" mt={1}>
                Deadline: {new Date(project.deadline).toLocaleDateString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Person color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Team Members</Typography>
              </Box>
              <Typography variant="h4" fontWeight="bold">
                {members.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Active members
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Assignment color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Tasks</Typography>
              </Box>
              <Typography variant="h4" fontWeight="bold">
                {tasks.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {tasks.filter(t => t.status === 'completed').length} completed
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Team Members Section */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" mb={2}>Team Members</Typography>
              {members.map((member) => (
                <Box key={member.id} display="flex" alignItems="center" mb={2}>
                  <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                    {member.name?.charAt(0)}
                  </Avatar>
                  <Box flexGrow={1}>
                    <Typography variant="body1" fontWeight="medium">
                      {member.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {member.role || member.designation}
                    </Typography>
                  </Box>
                  <Chip 
                    label={member.status || 'Active'}
                    color="success"
                    size="small"
                  />
                </Box>
              ))}
              {members.length === 0 && (
                <Typography color="text.secondary" textAlign="center" py={2}>
                  No team members assigned
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Tasks Section */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" mb={2}>Recent Tasks</Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Task</TableCell>
                      <TableCell>Assignee</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {tasks.slice(0, 5).map((task) => (
                      <TableRow key={task.id}>
                        <TableCell>
                          <Typography variant="body2" fontWeight="medium">
                            {task.title}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Due: {new Date(task.due_date).toLocaleDateString()}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <Avatar sx={{ width: 24, height: 24, mr: 1, fontSize: '0.75rem' }}>
                              {task.assigned_to?.name?.charAt(0) || 'U'}
                            </Avatar>
                            <Typography variant="body2">
                              {task.assigned_to?.name || 'Unassigned'}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={task.status}
                            color={getStatusColor(task.status)}
                            size="small"
                            onClick={() => {
                              // Add status change logic here
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton
                            size="small"
                            onClick={(e) => handleMenuOpen(e, task)}
                          >
                            <MoreVert />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              {tasks.length === 0 && (
                <Typography color="text.secondary" textAlign="center" py={2}>
                  No tasks created yet
                </Typography>
              )}
              {tasks.length > 5 && (
                <Box textAlign="center" mt={2}>
                  <Button onClick={() => navigate(`/senior/project/${projectId}/tasks`)}>
                    View All Tasks ({tasks.length})
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEditTask}>
          <Edit sx={{ mr: 1 }} /> Edit Task
        </MenuItem>
        <MenuItem onClick={() => setDeleteDialogOpen(true)}>
          <Delete sx={{ mr: 1 }} /> Delete Task
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the task "{selectedTask?.title}"?
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteTask} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ProjectDetail;

