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
  DialogActions, 
  Button, 
  Grid, 
  MenuItem,
  TextField,
  OutlinedInput,
  InputLabel,
  FormControl,
  ListItemText,
  Select,
  Checkbox,
} from '@mui/material';
import { format, parseISO } from 'date-fns';
import { IconButton, Tooltip } from '@mui/material';
import { Edit, Settings } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { enGB } from 'date-fns/locale';
import { useNotification } from '@context/NotificationContext';
import { messages } from "@utils/messages";
import projectService from '@services/project';
import MagicButton from "@components/common/MagicButton";
import { useLoader } from '@context/LoaderContext';
import DeleteRowDialog from "@components/common/DeleteRowDialog";

const ProjectTable = ({ projects, onProjectUpdated }) => {
  const { showLoader, hideLoader } = useLoader();
  const [open, setOpen] = useState(false);
  const [ModelStatus, setModelStatus] = useState(false);
  const { showNotification } = useNotification();
  const [error, setError] = useState({});
  const [userList, setUserList] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    deadline: null,
    description: '',
    project_id: '',
    selectedUsers: [],
    flag: 1,
    start_date: null, 
    end_date: null,
    hourly_rate: '',
    notes: '',
  });

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

  const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
      setError(prev => ({ ...prev, [e.target.name]: null }));
  };

  const handleMultiSelectChange = (event) => {
    setFormData({
      ...formData,
      selectedUsers: event.target.value,
    });
    setError(prev => ({ ...prev, selectedUsers: null }));
  };

  const handleDateChange = (fieldName, date) => {
    setFormData({ ...formData, [fieldName]: date });
    setError(prev => ({ ...prev, [fieldName]: null }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!ModelStatus && !formData.name.trim()) newErrors.name = ['The name field is required.'];
    if (!ModelStatus && !formData.deadline) newErrors.deadline = ['The deadline field is required.'];
    if (!ModelStatus && !formData.description.trim()) newErrors.description = ['The description field is required.'];
    if (ModelStatus && formData.selectedUsers.length === 0) newErrors.selectedUsers = ['The assign team field is required.'];  
    if (ModelStatus && !formData.start_date) newErrors.start_date = ['The start date field is required.'];  
    if (ModelStatus && !formData.end_date) newErrors.end_date = ['The end date field is required.'];  
    if (ModelStatus && !formData.hourly_rate.trim()) newErrors.hourly_rate = ['The hourly rate field is required.'];  
    if (ModelStatus && !formData.notes.trim()) newErrors.notes = ['The notes field is required.'];  

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
      start_date: formData.start_date
        ? format(formData.start_date, 'yyyy-MM-dd')
        : '',
      end_date: formData.end_date
        ? format(formData.end_date, 'yyyy-MM-dd')
        : '',
    };
    
    try {
        const res = await projectService.updateProject(formattedData,formData.project_id);
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
                message: 'Project updated successfully!',
                severity: 'success',
                position: 'top-center',
            });
            setError(null);
            if (res) {
                setTimeout(() => {
                  setFormData({name: '', deadline: null, description: '', project_id: '', selectedUsers: [], flag: 1, start_date: null, end_date: null, hourly_rate: '', notes: ''});
                  setOpen(false);
                  if (typeof onProjectUpdated === 'function') {
                    onProjectUpdated();
                  }
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
    setError({});
    setFormData({
      name: '',
      deadline: null,
      description: '',
      project_id: '',
      selectedUsers: [],
      flag: 1,
      start_date: null,
      end_date: null,
      hourly_rate: '',
      notes: '',
    });
  };

  const handleEdit = async (id) => {
    showLoader();
    setOpen(true);
    setModelStatus(false);
    setFormData({name: '', deadline: null, description: '', project_id: '', selectedUsers: [], flag: 1, start_date: null, end_date: null, hourly_rate: '', notes: ''});

    try {
        const res = await projectService.showProject(id);
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
              message: 'Project fetched successfully!',
              severity: 'success',
              position: 'top-center',
            });
            setError(null);

            if (res) {
              const project = res?.data;
              const deadline = project.deadline ? parseISO(project.deadline) : null;
              setFormData({ name: project.name, description: project.description, deadline: deadline, project_id: project.id, flag: 1 });
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

  const handleDelete = async (id) => {          
    showLoader();
    setModelStatus(false);

    try {
        const res = await projectService.deleteProject(id);
        if (res?.success) {

            showNotification({
              message: 'Project deleted successfully!',
              severity: 'success',
              position: 'top-center',
            });

            if (typeof onProjectUpdated === 'function') {
              onProjectUpdated();
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

  const handleSetting = async (id) => {   
    showLoader();
    setOpen(true);
    setModelStatus(true);
    setFormData({
      name: '',
      deadline: null,
      description: '',
      project_id: id,
      selectedUsers: [],
      flag: 2,
      start_date: null, 
      end_date: null,
      hourly_rate: '',
      notes: '',
    });
    try {
      const res = await projectService.fetchUserList(id);
      if (res?.success) {
        const projectUserList = res?.data?.users || [];
        if (projectUserList) {
          setUserList(projectUserList);
        }
        const assignUsersIds = res?.data?.assign_users || [];
        const assignData = res?.data?.assignData || [];

        if(assignUsersIds.length > 0 && assignData){
          const start_date = assignData.start_date ? parseISO(assignData.start_date) : null;
          const end_date = assignData.end_date ? parseISO(assignData.end_date) : null;
          setFormData({project_id: id, selectedUsers: assignUsersIds, flag: 2, start_date: start_date, end_date: end_date, hourly_rate: assignData.hourly_rate, notes: assignData.notes});
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
      const errorMsg = messages.resError(err?.message);
      showNotification({
        message: errorMsg,
        severity: 'error',
        position: 'top-center',
      });
      hideLoader();
    }
  };
  
  return (
    <>
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><b>#</b></TableCell>
            <TableCell><b>Project Name</b></TableCell>
            <TableCell><b>Description</b></TableCell>
            <TableCell><b>Deadline</b></TableCell>
            <TableCell><b>Created By</b></TableCell>
            <TableCell><b>Action</b></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {projects.map((project, index) => (
            <TableRow key={project.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{project.name}</TableCell>
              <TableCell>{project.description}</TableCell>
              <TableCell>{project.deadline ? format(parseISO(project.deadline), 'dd-MM-yyyy'): null}</TableCell>
              <TableCell>{project?.user ? project?.user?.name : "-"}</TableCell>
              <TableCell>
                <Tooltip title="Edit">
                  <IconButton color="primary" onClick={() => handleEdit(project.id)}>
                    <Edit />
                  </IconButton>
                </Tooltip>
                <DeleteRowDialog
                  itemId={project.id}
                  onDelete={handleDelete}
                  message={`Are you sure you want to delete this "${project.name}"?`}
                  title="Delete Project"
                  buttonText="Delete"
                  tooltip="Delete Project"
                />
                <Tooltip title="Assign Team">
                  <IconButton color="success" onClick={() => handleSetting(project.id)}>
                    <Settings />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>

    <Dialog fullWidth={true} open={open} onClose={handleClose}>
      <DialogTitle>{ModelStatus ? "Assign Project" : "Edit Project"} </DialogTitle>
      <DialogContent>
      <form className="space-y-5">
        <Grid container spacing={3}>
          {!ModelStatus ? (
            <>
              <TextField label="Project Name" variant="outlined" name="name" value={formData.name} onChange={handleChange} required fullWidth />
              {error?.name && <p className="text-red-500 text-sm">{error.name[0]}</p>}
              
              <TextField label="Description" variant="outlined" name="description" value={formData.description} onChange={handleChange} required fullWidth />
              {error?.description && <p className="text-red-500 text-sm">{error.description[0]}</p>}
              
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enGB}>
                <DatePicker
                  label="Deadline Date"
                  value={formData.deadline}
                  onChange={(date) => handleDateChange('deadline', date)}
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
            </>
          ) : (
            <>
              <FormControl fullWidth>
                <InputLabel id="multi-select-label">Select Users</InputLabel>
                <Select
                  labelId="multi-select-label"
                  multiple
                  value={formData.selectedUsers}
                  onChange={handleMultiSelectChange}
                  input={<OutlinedInput label="Select Users" />}
                  MenuProps={MenuProps}
                  renderValue={(selected) =>
                    selected
                      .map((id) => {
                        const user = userList.find((u) => u.id === id);
                        return user ? user.name : id;
                      })
                      .join(', ')
                  }
                >
                  {userList.map((user) => (
                    <MenuItem key={user.id} value={user.id}>
                      <Checkbox checked={formData.selectedUsers.indexOf(user.id) > -1} />
                      <ListItemText primary={user.name} />
                    </MenuItem>
                  ))}
                </Select>
                {error?.selectedUsers && (
                  <p className="text-red-500 text-sm">{error.selectedUsers[0]}</p>
                )}
              </FormControl>

              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enGB}>
                <DatePicker
                  label="Start Date"
                  value={formData.start_date}
                  onChange={(date) => handleDateChange('start_date', date)}
                  inputFormat="dd/MM/yyyy"
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      required: true,
                    },
                  }}
                />
              </LocalizationProvider>
              {error?.start_date && <p className="text-red-500 text-sm">{error.start_date[0]}</p>}
              
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enGB}>
                <DatePicker
                  label="End Date"
                  value={formData.end_date}
                  onChange={(date) => handleDateChange('end_date', date)}
                  inputFormat="dd/MM/yyyy"
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      required: true,
                    },
                  }}
                />
              </LocalizationProvider>
              {error?.end_date && <p className="text-red-500 text-sm">{error.end_date[0]}</p>}
              
              <TextField type="number" label="Hourly Rate" variant="outlined" name="hourly_rate" value={formData.hourly_rate} onChange={handleChange} required fullWidth />
              {error?.hourly_rate && <p className="text-red-500 text-sm">{error.hourly_rate[0]}</p>}
              
              <TextField 
                label="Notes" 
                variant="outlined" 
                name="notes" 
                value={formData.notes} 
                onChange={handleChange} 
                required 
                fullWidth 
                multiline
                rows={3}
              />
              {error?.notes && <p className="text-red-500 text-sm">{error.notes[0]}</p>}
            </>
          )}
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

export default ProjectTable;
