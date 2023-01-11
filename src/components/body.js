import React from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { getAuthToken, delAuthToken } from '../util/auth';
import Home from '../components/home';
import GiftCode from '../components/giftcode';
import Mail from '../components/mail';
import Bulletin from '../components/bulletin';
import Testing from '../components/testing';
import Error from '../components/error';
import {
  Box,
  Drawer,
  CssBaseline,
  ListItemIcon,
  SvgIcon,
  AppBar,
  Toolbar,
  List,
  Divider,
  ListItem,
  ListItemButton,
  ListItemText,
  Link,
  Grid,
  Button,
} from '@mui/material';

import GroupWork from '@mui/icons-material/GroupWork';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import EmailIcon from '@mui/icons-material/Email';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import ScienceIcon from '@mui/icons-material/Science';

const drawerWidth = 240;
const companyName = 'Icecone';

const operations = [
  {
    id: 1,
    route: 'gift',
    name: '兌換碼',
    icon: CardGiftcardIcon,
    isAvailable: true,
  },
  { id: 2, route: 'mail', name: '信箱', icon: EmailIcon, isAvailable: false },
  {
    id: 3,
    route: 'bulletin',
    name: '公告',
    icon: FormatListBulletedIcon,
    isAvailable: false,
  },
  {
    id: 4,
    route: 'testing',
    name: '測試',
    icon: ScienceIcon,
    isAvailable: false,
  },
];

export default function Body(props) {
  const navigate = useNavigate();
  const [authenticated, setAuthenticated] = React.useState(false);
  React.useEffect(() => {
    let token = getAuthToken();
    if (token === 'access_token') {
      setAuthenticated(true);
    }
  }, [authenticated]);

  const handleLogout = () => {
    delAuthToken();
    setAuthenticated(false);
    navigate('/login');
  }

  if (!authenticated) {
    <div>Not auth</div>
    // <Navigate replace to="/login" />;
  } else {
    return (
      <div className="body">
        <Box sx={{ display: 'flex' }}>
          <CssBaseline />
          <AppBar
            position="fixed"
            sx={{
              width: `calc(100% - ${drawerWidth}px)`,
              ml: `${drawerWidth}px`,
            }}
          >
            <Toolbar>
              <Grid container display="flex" justifyContent="right">
                <Button color="inherit" onClick={handleLogout}>
                  登出
                </Button>
              </Grid>
            </Toolbar>
          </AppBar>
          <Drawer
            sx={{
              width: drawerWidth,
              flexShrink: 0,
              '& .MuiDrawer-paper': {
                width: drawerWidth,
                boxSizing: 'border-box',
              },
            }}
            variant="permanent"
            anchor="left"
          >
            <Toolbar>
              <GroupWork sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
              <Link href="/" variant="h5" underline="none">
                {companyName}
              </Link>
            </Toolbar>
            <Divider />
            <List>
              {operations.map((operation) => (
                <ListItem key={operation.id} disablePadding>
                  <ListItemButton
                    href={operation.route}
                    disabled={!operation.isAvailable}
                  >
                    <ListItemIcon>
                      <SvgIcon component={operation.icon} />
                    </ListItemIcon>
                    <ListItemText primary={operation.name} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
            <Divider />
          </Drawer>
          <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            <Toolbar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/gift" element={<GiftCode />} />
                <Route path="*" element={<Error />} />
                {/* <Route path="/mail" element={<Mail />} />
                <Route path="/bulletin" element={<Bulletin />} />
                <Route path="/testing" element={<Testing />} /> */}
              </Routes>
          </Box>
        </Box>
      </div>
    );
  }
}
