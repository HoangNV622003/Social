import React, { useState } from 'react';
import axios from 'axios';
import './SignUp.css';
import backgroundImage from '../../assets/images/backgr.png';
import {
  Typography,
  Button,
  Box,
  Container,
  Grid,
  TextField,
  Card,
  CardHeader,
  CardContent,
} from '@mui/material';

import '../notice/notice.css';  
import { showAlert } from '../notice/notice.js';  

export default function Registration() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        setLoading(false);
        return;
    }
    setError('');

    try {
        const response = await axios.post('http://localhost:8080/register', formData);

        if (response.status === 201) {
            // Handle successful registration (e.g., show a success message)
            showAlert('Registration successful! Please verify your email.');
        }
    } catch (err) {
        if (err.response && err.response.status === 409) {
            // Handle duplicate email/username
            setError(err.response.data); // Hiển thị thông báo từ backend
        } else if (err.response && err.response.status === 500) {
            // Handle server errors
            setError('A server error occurred. Please try again later.');
        } else {
            setError('An unexpected error occurred. Please try again.');
        }
    } finally {
        setLoading(false);
    }
};


  return (
    <div>
      <div id="notification" className="notification hidden" >
    <span id="notification-message"></span>
</div>
    <div className="Signup-container">
      <Card sx={{ maxWidth: 700, margin: '30px auto', border: '3px solid #356' }}>
      
        <CardContent>
          <Container maxWidth="xs">
            <Box sx={{ mt: 0 }}>
              <Typography variant="h4" align="center" gutterBottom>
                Register
              </Typography>

              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      label="Email"
                      name="email"
                      fullWidth
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Username"
                      name="username"
                      fullWidth
                      value={formData.username}
                      onChange={handleChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Password"
                      name="password"
                      type="password"
                      fullWidth
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Confirm Password"
                      name="confirmPassword"
                      type="password"
                      fullWidth
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                  </Grid>
                  {error && (
                    <Grid item xs={12}>
                      <Typography color="error" variant="body2">
                        {error}
                      </Typography>
                    </Grid>
                  )}
                  <Grid item xs={12}>
                    <Button type="submit" fullWidth variant="contained" color="primary" disabled={loading}>
                      {loading ? 'Processing...' : 'Register'}
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Box>
          </Container>
        </CardContent>
      </Card>

     
    </div>
    </div>
  );
}
