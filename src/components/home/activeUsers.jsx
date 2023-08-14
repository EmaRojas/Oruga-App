import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import RoomPreferencesIcon from '@mui/icons-material/RoomPreferences';
import { getNowReservations } from "../../services/reservation.service";
import { useEffect, useState } from "react";

export const ActiveUsers = () => {
  const [reservations, setReservations] = useState([]);

  const refreshNow = async () => {    
    try {
      const { reservations } = await getNowReservations();
      setReservations(reservations);
    } catch (error) {
      console.log(error.message);
    }
  }

  useEffect(() => {
     refreshNow();
  }, []);

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
          <Divider variant="inset" component="li" />
          {reservations.map((reservation) => (
            <ListItem key={reservation._id}>
              <ListItemAvatar>
                <Avatar>
                  <RoomPreferencesIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText className="tabluppercase"
                primary={reservation.clientID.full_name}
                secondary={reservation.roomID.name}
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}