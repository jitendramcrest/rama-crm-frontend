import React, { useState } from 'react'
import { TextField, MenuItem, Typography, Paper } from '@mui/material'
import { useNavigate } from 'react-router-dom';
import MagicButton from "@components/common/MagicButton";
import authService from "@services/auth";
import { useNotification } from '@context/NotificationContext';
import { messages } from "@utils/messages";

export default function RegisterForm() {
    const navigate = useNavigate();
    const roles = [
        { value: 'admin', label: 'Admin' },
        { value: 'tl', label: 'Team Lead' },
        { value: 'senior', label: 'Senior' },
        { value: 'junior', label: 'Junior' }
    ];
    const [form, setForm] = useState({ name: '', email: '', password: '', role: '' })
    const { showNotification } = useNotification();
    const [error, setError] = useState({});

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError(prev => ({ ...prev, [e.target.name]: null }));
    }

    const validateForm = () => {
        const newErrors = {};
        if (!form.name.trim()) newErrors.name = ['The name field is required.'];
        if (!form.email.trim()) newErrors.email = ['The email field is required.'];
        if (!form.password.trim()) newErrors.password = ['The password field is required.'];
        if (!form.role.trim()) newErrors.role = ['The role field is required.'];
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setError(validationErrors);
            return;
        }

        try {
            const res = await authService.registerUser(form);
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
                    message: 'User registered successfully!',
                    severity: 'success',
                    position: 'top-center',
                });
                setError(null);
                setForm({ name: '', email: '', password: '', role: '' });
                if (res) {
                    setTimeout(() => {
                        navigate('/login');
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
        <div className="relative min-h-screen bg-gradient-to-tr from-purple-900 via-indigo-900 to-black flex items-center justify-center overflow-hidden">
            {/* Sparkles and glows */}
            <div className="absolute top-10 left-10 w-40 h-40 bg-pink-500 rounded-full opacity-30 blur-3xl animate-ping"></div>
            <div className="absolute bottom-20 right-20 w-60 h-60 bg-cyan-500 rounded-full opacity-20 blur-2xl animate-pulse"></div>
            <div className="absolute top-1/4 right-1/3 w-32 h-32 bg-yellow-400 rounded-full opacity-20 blur-2xl animate-ping"></div>
            <div className="absolute -bottom-10 left-1/4 w-96 h-96 bg-purple-700 opacity-25 blur-3xl rounded-full animate-spin-slow"></div>

            <Paper elevation={10}
            className="relative z-10 p-10 max-w-md w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl">
                <Typography
                    variant="h6"
                    className="text-black text-center mb-2 drop-shadow-md"
                >Rama CRM
                </Typography>
                <p className="text-white text-center text-sm mb-1">.....</p>
                <form className="space-y-5">
                    <TextField label="Name" variant="outlined" name="name" value={form.name} onChange={handleChange} required fullWidth />
                    {error?.name && <p className="text-red-500 text-sm">{error.name[0]}</p>}
                    <TextField label="Email" variant="outlined" name="email" value={form.email} onChange={handleChange} required fullWidth type="email" />
                    {error?.email && <p className="text-red-500 text-sm">{error.email[0]}</p>}
                    <TextField label="Password" variant="outlined" name="password" value={form.password} onChange={handleChange} required fullWidth type="password" />
                    {error?.password && <p className="text-red-500 text-sm">{error.password[0]}</p>}
                    <TextField
                    select
                    label="Role"
                    name="role"
                    variant="outlined"
                    value={form.role}
                    onChange={handleChange}
                    required
                    fullWidth
                    >
                    {roles.map(role => (
                        <MenuItem key={role.value} value={role.value}>
                        {role.label}
                        </MenuItem>
                    ))}
                    </TextField>
                    {error?.role && <p className="text-red-500 text-sm">{error.role[0]}</p>}
                    <MagicButton onClick={handleSubmit}>Register</MagicButton>
                </form>
            </Paper>

            <div className="absolute inset-0 pointer-events-none z-0">
                {[...Array(20)].map((_, i) => (
                <div
                    key={i}
                    className="absolute w-1.5 h-1.5 bg-white rounded-full opacity-70 animate-twinkle"
                    style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 5}s`,
                    }}
                ></div>
                ))}
            </div>
        </div>
    )
}
