import React, { useState } from 'react';
import {
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Tooltip
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const DeleteRowDialog = ({
  onDelete,
  itemId,
  message = 'Are you sure you want to delete this item?',
  buttonText = 'Delete',
  title = 'Confirm Delete',
  tooltip = 'Delete Item'
}) => {
  const [open, setOpen] = useState(false);

  const handleConfirm = () => {
    onDelete(itemId);
    setOpen(false);
  };

  return (
    <>
      <Tooltip title={tooltip}>
        <IconButton
          onClick={() => setOpen(true)}
          color="secondary"
        >
          <DeleteIcon />
        </IconButton>
      </Tooltip>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <Typography>{message}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} className="text-gray-600">
            Cancel
          </Button>
          <Button
            color="secondary"
            onClick={handleConfirm}
          >
            {buttonText}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DeleteRowDialog;
