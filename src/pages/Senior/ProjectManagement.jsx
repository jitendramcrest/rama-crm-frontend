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
  AvatarGroup
} from '@mui/material';
import { 
  Add, 
  People, 
  Assignment, 
  Schedule,
  TrendingUp,
  Warning 
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useLoader } from '@context/LoaderContext';
import { useNotification } from '@context/NotificationContext';
import taskService from '@services/task';

const ProjectManagement = () => {
  const navigate = useNavigate();
  const { showLoader, hideLoader } = useLoader();
  const { showNotification } = useNotification();
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalTasks: 0,
    pendingTasks: 0,
    completedTasks: 0
  });

  useEffect(() => {
    fetchMyProjects();
  }, []);

  const fetchMyProjects = async () => {
    try {
      showLoader();
      const response = await taskService.fetchMyProjectAssignments();
      
      if (response?.success) {
        const projectData = response.data || [];
        setProjects(projectData);
        
        // Calculate stats
        const totalProjects = projectData.length;
        let totalTasks = 0;
        let pendingTasks = 0;
        let completedTasks = 0;
        
        projectData.forEach(project => {
          totalTasks += project.tasks?.length || 0;
          project.tasks?.forEach(task => {
            if (task.status === 'pending' || task.status === 'in_progress') {
              pendingTasks++;
            } else if (task.status === 'completed') {
              completedTasks++;
            }
          });
        });
        
        setStats({ totalProjects, totalTasks, pendingTasks, completedTasks });
        
        showNotification({
          message: 'Projects loaded successfully!',
          severity: 'success',
          position: 'top-right',
        });
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      showNotification({
        message: 'Failed to load projects',
        severity: 'error',
        position: 'top-center',
      });
    } finally {
      hideLoader();
    }
  };

  const getStatusColor = (status) => {
    const statusColors = {
      'active': 'success',
      'completed': 'primary',
      'on_hold': 'warning',
      'pending': 'default'
    };
    return statusColors[status] || 'default';
  };

  const handleProjectClick = (projectId) => {
    navigate(`/senior/project/${projectId}`);
  };

  const handleCreateTask = (projectId) => {
    navigate(`/senior/project/${projectId}/create-task`);
  };

  return (
    <>
      {/* Header */}
      <Grid container alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
        <Grid item>
          <Typography variant="h4" fontWeight="bold" color="primary">
            My Project Management
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Manage your assigned projects and team tasks
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
                    {stats.totalProjects}
                  </Typography>
                  <Typography variant="body2">Total Projects</Typography>
                </Box>
                <TrendingUp fontSize="large" />
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
                    {stats.totalTasks}
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
                    {stats.pendingTasks}
                  </Typography>
                  <Typography variant="body2">Pending Tasks</Typography>
                </Box>
                <Warning fontSize="large" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card className="text-white shadow-lg bg-gradient-to-r from-purple-500 to-purple-600">
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {stats.completedTasks}
                  </Typography>
                  <Typography variant="body2">Completed Tasks</Typography>
                </Box>
                <Schedule fontSize="large" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Projects Grid */}
      <Grid container spacing={3}>
        {projects.map((project) => (
          <Grid item xs={12} md={6} lg={4} key={project.id}>
            <Card 
              className="transition-shadow cursor-pointer hover:shadow-lg"
              onClick={() => handleProjectClick(project.id)}
            >
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                  <Typography variant="h6" fontWeight="bold" noWrap>
                    {project.name}
                  </Typography>
                  <Chip 
                    label={project.status}
                    color={getStatusColor(project.status)}
                    size="small"
                  />
                </Box>
                
                <Typography variant="body2" color="text.secondary" mb={2} noWrap>
                  {project.description}
                </Typography>
                
                <Box mb={2}>
                  <Typography variant="caption" color="text.secondary">
                    Deadline: {new Date(project.deadline).toLocaleDateString()}
                  </Typography>
                </Box>
                
                {/* Team Members */}
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                  <Box display="flex" alignItems="center">
                    <People fontSize="small" color="action" sx={{ mr: 1 }} />
                    <AvatarGroup max={3} sx={{ '& .MuiAvatar-root': { width: 24, height: 24 } }}>
                      {project.members?.map((member, index) => (
                        <Avatar key={index} sx={{ bgcolor: 'primary.main', fontSize: '0.75rem' }}>
                          {member.name?.charAt(0)}
                        </Avatar>
                      ))}
                    </AvatarGroup>
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    {project.members?.length || 0} members
                  </Typography>
                </Box>
                
                {/* Task Summary */}
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="body2">
                    Tasks: {project.tasks?.length || 0}
                  </Typography>
                </Box>
                
                {/* Actions */}
                <Box display="flex" gap={1} mt={2}>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleProjectClick(project.id);
                    }}
                  >
                    View Details
                  </Button>
                  <Button
                    size="small"
                    variant="contained"
                    startIcon={<Add />}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCreateTask(project.id);
                    }}
                  >
                    Add Task
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      {projects.length === 0 && (
        <Box textAlign="center" py={4}>
          <Typography variant="h6" color="text.secondary">
            No projects assigned to you yet.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Contact your team lead to get assigned to projects.
          </Typography>
        </Box>
      )}
    </>
  );
};

export default ProjectManagement;

