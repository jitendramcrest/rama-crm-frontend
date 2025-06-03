import * as React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';

export default function AlertDialog({ open, onClose, title, content, buttonText }) {

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
            <DialogContent>
            <DialogContentText id="alert-dialog-description">
                {typeof content === 'string' ? (
                    <p>{content}</p>
                ) : (
                    <p>{content?.error}</p>
                )}
            </DialogContentText>
            </DialogContent>
            <DialogActions>
            <Button onClick={onClose}>{buttonText}</Button>
            </DialogActions>
        </Dialog>
    );
}
