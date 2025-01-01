import React from 'react';
import Box from '@mui/material/Box';
import Dashboard from '../../components/Dashboard/dashboard';
import NavBar from '../../components/NavBar';
import { Card, CardContent, Grid2, Stack, Typography } from '@mui/material';
import './style.css';

const Home = () => {

   return (
    <>
      <NavBar />
      <Box height={60} /> {/*Tamanho da Box em relação ao top da página*/}
      <Box sx={{ display: 'flex' }}  paddingLeft={1} paddingRight={1}>
        <Dashboard />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Grid2 container spacing={2}>
            <Grid2 size={8}>
            <Stack spacing={2} direction={"row"}>
              <Card sx={{ maxWidth: 49 + "%", height: 140 }}>
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    Lizard
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Lizards are a widespread group of squamate reptiles, with over 6,000
                    species, ranging across all continents except Antarctica
                  </Typography>
                </CardContent>
              </Card>
              <Card sx={{ maxWidth: 49+ "%", height: 140 }}>
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    Lizard
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Lizards are a widespread group of squamate reptiles, with over 6,000
                    species, ranging across all continents except Antarctica
                  </Typography>
                </CardContent>
              </Card>
            </Stack>
            </Grid2>
            <Grid2 size={4}>
            <Stack spacing={2}>
              <Card sx={{ maxWidth: 345 }}>
                <CardContent>
                  <Stack spacing={2}>
                    <div className='paddingall'>
                      <span className='precotitle'>50k</span>
                      <span className='subtitle'>Total InCome</span>
                    </div>
                  </Stack>
                </CardContent>
              </Card>
              <Card sx={{ maxWidth: 345 }}>
                <CardContent>
                  
                </CardContent>
              </Card>
            </Stack>
            </Grid2>
          </Grid2>
          <Box height={10} />
          <Grid2 container spacing={2}>
            <Grid2 size={8}>
              <Card sx={{ height: 60 + "vh" }}>
                <CardContent>
                  
                </CardContent>
              </Card>
            </Grid2>
            <Grid2 size={4}>
            <Card sx={{ height: 60 + "vh" }}>
                <CardContent>
                  
                </CardContent>
              </Card>
            </Grid2>
          </Grid2>
        </Box>
      </Box>
    </>
  );
};

export default Home;

