import React, { useEffect } from 'react';
import Box from '@mui/material/Box';
import Dashboard from '../../components/Dashboard/dashboard';
import NavBar from '../../components/NavBar';
import { Card, CardContent, Grid2, Stack, Typography } from '@mui/material';
import { toast } from 'react-toastify';
import { BarChart } from '@mui/icons-material';
import { axisClasses } from '@mui/x-charts/ChartsAxis';
//import './style.css';

const otherSetting = {
  height: 300,
  yAxis: [{ label: 'rainfall (mm)' }],
  grid: { horizontal: true },
  sx: {
    [`& .${axisClasses.left} .${axisClasses.label}`]: {
      transform: 'translateX(-10px)',
    },
  },
};

const dataset = [
  {
    london: 59,
    paris: 57,
    newYork: 86,
    seoul: 21,
    month: 'January',
  },
  {
    london: 50,
    paris: 52,
    newYork: 78,
    seoul: 28,
    month: 'February',
  },
  {
    london: 47,
    paris: 53,
    newYork: 106,
    seoul: 41,
    month: 'March',
  },
  {
    london: 54,
    paris: 56,
    newYork: 92,
    seoul: 73,
    month: 'April',
  },
  {
    london: 57,
    paris: 69,
    newYork: 92,
    seoul: 99,
    month: 'May',
  },
  {
    london: 60,
    paris: 63,
    newYork: 103,
    seoul: 144,
    month: 'June',
  },
  {
    london: 59,
    paris: 60,
    newYork: 105,
    seoul: 319,
    month: 'July',
  },
  {
    london: 65,
    paris: 60,
    newYork: 106,
    seoul: 249,
    month: 'August',
  },
  {
    london: 51,
    paris: 51,
    newYork: 95,
    seoul: 131,
    month: 'September',
  },
  {
    london: 60,
    paris: 65,
    newYork: 97,
    seoul: 55,
    month: 'October',
  },
  {
    london: 67,
    paris: 64,
    newYork: 76,
    seoul: 48,
    month: 'November',
  },
  {
    london: 61,
    paris: 70,
    newYork: 103,
    seoul: 25,
    month: 'December',
  },
];

const valueFormatter = (value) => `${value}mm`;

const Home = () => {
    useEffect(()=>{
      toast.warn("Esta página ainda está em desenvolvimento. Pedimos desculpas por qualquer inconveniente causado e agradecemos sua compreensão. Estamos trabalhando para disponibilizá-la o mais breve possível!");
    });
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
              <Card sx={{ maxWidth: 100 + "%", height: 60 }}>
                <CardContent>
                  <Stack spacing={2}>
                    <div className='paddingall'>
                      <span className='precotitle'>50k</span>
                      <span className='subtitle'>Total InCome</span>
                    </div>
                  </Stack>
                </CardContent>
              </Card>
              <Card sx={{ maxWidth: 100 + "%", height: 60 }}>
                <CardContent>
                <BarChart
                  dataset={dataset}
                  xAxis={[
                    {
                      scaleType: 'band',
                      dataKey: 'month',
                      valueFormatter: (month, context) =>
                        context.location === 'tick'
                          ? `${month.slice(0, 3)} \n2023`
                          : `${month} 2023`,
                    },
                  ]}
                  series={[{ dataKey: 'seoul', label: 'Seoul rainfall', valueFormatter }]}
                  {...otherSetting}
                />
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

