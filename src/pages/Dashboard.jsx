import React from 'react';
import {
  Typography,
  Grid,
  Card,
  CardContent
} from '@mui/material';
import { useDispatch, useSelector } from "react-redux";

const Dashboard = () => {
  const userData = useSelector((state) => state?.authData?.user);

  return (
    <>
      <Typography variant="h5" gutterBottom>
        Welcome, {userData.name}! 🎉
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            className="bg-gradient-to-r from-pink-500 to-rose-400 text-white shadow-xl hover:scale-105 transition"
          >
            <CardContent>
              <Typography variant="h6">Users</Typography>
              <Typography variant="h4">120</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            className="bg-gradient-to-r from-green-400 to-teal-500 text-white shadow-xl hover:scale-105 transition"
          >
            <CardContent>
              <Typography variant="h6">Sales</Typography>
              <Typography variant="h4">$8,920</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-xl hover:scale-105 transition"
          >
            <CardContent>
              <Typography variant="h6">Traffic</Typography>
              <Typography variant="h4">45K</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            className="bg-gradient-to-r from-blue-400 to-indigo-500 text-white shadow-xl hover:scale-105 transition"
          >
            <CardContent>
              <Typography variant="h6">Tasks</Typography>
              <Typography variant="h4">17</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default Dashboard;

