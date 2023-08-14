import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ImageIcon from '@mui/icons-material/Image';
import WorkIcon from '@mui/icons-material/Work';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import Divider from '@mui/material/Divider';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import GroupIcon from '@mui/icons-material/Group';
import RoomPreferencesIcon from '@mui/icons-material/RoomPreferences';
export const ActiveUsers = () => {
  return (
    <Card>
        <CardContent>
        <Typography variant="h6">
        EN ESTE MOMENTO
        </Typography>
    <List
      sx={{
        width: '100%',
        maxWidth: '95%',
        bgcolor: 'background.paper',
      }}
    >
      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <GroupIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary="Emanuel Rojas" secondary="Coworking" />
      </ListItem>
      <Divider variant="inset" component="li" />
      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <RoomPreferencesIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary="Facundo Quintana" secondary="Alocasia" />
      </ListItem>
      {/* <Divider variant="inset" component="li" />
      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <BeachAccessIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary="Vacation" secondary="July 20, 2014" />
      </ListItem> */}
    </List>
    </CardContent>
    </Card>
  );
}