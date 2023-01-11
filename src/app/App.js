import * as React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { lightTheme } from '../util/theme';
import Login from '../components/login';
import Body from '../components/body';

export default function App() {
  return (
    <ThemeProvider theme={lightTheme}>
      <main className="App">
        <BrowserRouter>
          <Routes>
            <Route
              path="*"
              element={<Body/>}
            />
            <Route
              path="/login"
              element={<Login/>}
            />
          </Routes>
        </BrowserRouter>
      </main>
    </ThemeProvider>
  );
}
