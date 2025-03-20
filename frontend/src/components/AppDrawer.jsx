import { Drawer, List, ListItem, ListItemText } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const AppDrawer = ({ drawerOpen, toggleDrawer, logout }) => {
  const navigate = useNavigate();

  return (
    <Drawer anchor="right" open={drawerOpen} onClose={() => toggleDrawer(false)} onClick={toggleDrawer(false)}>
      <div className="w-64 p-4" onKeyDown={() => toggleDrawer(false)} >
        <h2 className="text-xl font-bold mb-4">Profile Options</h2>
        <List>
          <ListItem button onClick={() => navigate('/profile')}>
            <ListItemText primary="Profile" />
          </ListItem>
          <ListItem button>
            <ListItemText primary="Option 2" />
          </ListItem>
          <ListItem button onClick={logout}>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </div>
    </Drawer>
  );
};

export default AppDrawer;
