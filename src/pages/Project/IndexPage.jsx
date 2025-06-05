import React, { useEffect, useState } from 'react';
import projectService from '../../services/project';
import ProjectTable from '../../components/ProjectTable';
import { useLoader } from '../../context/LoaderContext';
import { useNotification } from '../../context/NotificationContext';
import MagicButton from '../../components/MagicButton';
import { Grid } from '@mui/material';
import { Add } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const IndexPage = () => {
    const { showLoader, hideLoader } = useLoader();
    const { showNotification } = useNotification();
    const [projects, setProject] = useState([]);
    const navigate = useNavigate();

    const fetchProject = async () => {
        try {
            showLoader();

            const res = await projectService.fetchProjects();

            if (res?.success) {
                const projectList = res?.data || [];

                if (projectList.length > 0) {
                    setProject(projectList);
                    showNotification({
                        message: 'Projects loaded successfully!',
                        severity: 'success',
                        position: 'top-right',
                    });
                } else {
                    showNotification({
                        message: 'No project found.',
                        severity: 'info',
                        position: 'top-center',
                    });
                }
            } else {
                showNotification({
                    message: 'Failed to load project',
                    severity: 'error',
                    position: 'top-center',
                });
            }

        } catch (error) {
            showNotification({
                message: 'Something went wrong while fetching project.',
                severity: 'error',
                position: 'top-center',
            });
        } finally {
            hideLoader();
        }
    };

    useEffect(() => {
        fetchProject();
    }, []);

    const addProject = () => {
        navigate('/project/add');
    };

    return (
        <>
            {/* Header Row with Button */}
            <Grid container alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                <Grid item>
                    <h2 style={{ margin: 0 }}>Projects List</h2>
                </Grid>
                <Grid item>
                    <MagicButton onClick={addProject} fullWidth={false} startIcon={<Add />}>
                        Add
                    </MagicButton>
                </Grid>
            </Grid>

            {/* Project Table */}
            <ProjectTable projects={projects} onProjectUpdated={fetchProject} />
        </>
    );
};

export default IndexPage;
