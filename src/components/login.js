import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { setAuthToken } from '../util/auth';
import { Grid, Button, Card, Typography, TextField } from '@mui/material';
import SendIcon from '@mui/icons-material/Send'

export default function Login(props) {
  const navigate = useNavigate();

  const handleSubmit = () => {
    setAuthToken('access_token')
    navigate("/")
  }
  return (
    <Grid
      container
      display={'flex'}
      justifyContent={'center'}
      alignContent={'center'}
      textAlign={'center'}
      minHeight={540}
    >
      <Card sx={{ minWidth: 400, padding: 3 }}>
        <Typography variant="h5" component={'div'}>
          登入
        </Typography>
        <Grid container direction={'column'}>
          <TextField
            id="user"
            label="用戶名"
            variant="standard"
            sx={{ marginBottom: 2 }}
          />
          <TextField
            id="password"
            label="密碼"
            variant="standard"
            type={'password'}
            sx={{ marginBottom: 4 }}
          />
        </Grid>
        <Button variant="contained" size='medium' onClick={handleSubmit} endIcon={<SendIcon />}>
          送出
        </Button>
      </Card>
    </Grid>
  );
}
