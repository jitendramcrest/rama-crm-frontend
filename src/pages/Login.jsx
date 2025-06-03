import React, { useState } from 'react'
import MagicButton from "../components/MagicButton";
import { TextField, Button, Typography, Paper } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import authService from "../services/auth";
import { useDispatch } from "react-redux";
import { setToken, setUser } from "../redux/reducers/authDataSlice";
import { useNotification } from '../context/NotificationContext';
import { messages } from "../utils/messages";

const Login = () => {

    const [form, setForm] = useState({ email: '', password: '' });
    const { showNotification } = useNotification();
    const navigate = useNavigate();
    const [error, setError] = useState({});
    const dispatch = useDispatch();

    const handleChange = (e) => {
      setForm({ ...form, [e.target.name]: e.target.value });
      setError(prev => ({ ...prev, [e.target.name]: null }));
    };

    const validateForm = () => {
      const newErrors = {};
      if (!form.email.trim()) newErrors.email = ['The email field is required.'];
      if (!form.password.trim()) newErrors.password = ['The password field is required.'];
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
        const res = await authService.login(form);

        setError(null);
        if (res?.success) {
          const authUser = res?.user;
          const accessToken = res?.token;

          dispatch(setUser(authUser));
          dispatch(setToken(accessToken));

          showNotification({
            message: 'User Login successfully!',
            severity: 'success',
            position: 'top-center',
          });

          setForm({email: '', password: ''})
          if (res?.success) {
              setTimeout(() => {
                  navigate('/');
              }, 1000);
          }

        } else if (res.status === 422) {
          setError(res?.response?.data);
        } else if (res.status === 401) {
          const errorMsg = messages.resError(res?.response?.data?.error);
          showNotification({
            message: errorMsg,
            severity: 'error',
            position: 'top-center',
          });
        } else {
          const errorMsg = messages.resError(res?.message);
          showNotification({
            message: errorMsg,
            severity: 'error',
            position: 'top-center',
          });
        }
      } catch (err) {

        if (err.response?.status === 422) {
          setError(err.response?.data);
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

        {/* Login card */}
        <Paper
          elevation={10}
          className="relative z-10 p-10 max-w-md w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl"
        >
          <Typography
            variant="h6"
            className="text-black text-center mb-2 drop-shadow-md"
          >Rama CRM
          </Typography>
          <form className="space-y-5">
            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              name="email"
              type="email"
              value={form.email} onChange={handleChange} required
            />
            {error?.email && <p className="text-red-500 text-sm">{error.email[0]}</p>}
            <TextField
              fullWidth
              label="Password"
              variant="outlined"
              type="password"
              name="password"
              value={form.password} onChange={handleChange} required
            />
            {error?.password && <p className="text-red-500 text-sm">{error.password[0]}</p>}
            <MagicButton onClick={handleSubmit}>Login</MagicButton>

          </form>
        </Paper>

        {/* Floating sparkles */}
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
    );
};

export default Login;
