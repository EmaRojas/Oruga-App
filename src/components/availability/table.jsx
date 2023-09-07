import { useEffect, useState } from "react";
import { Card, CardContent, Grid, Typography, List, ListItem, ListItemText } from "@mui/material";
import dayjs from 'dayjs';
import { getReservationsByDate } from "../../services/reservation.service";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers';
import "dayjs/locale/es";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DemoItem } from '@mui/x-date-pickers/internals/demo';

export const Table = () => {
  const [rooms, setRooms] = useState({});
  const fechaHoy = dayjs().format('YYYY-MM-DD');
  const [date, setDate] = useState(dayjs(fechaHoy));

  const handleDateChange = (newDate) => {
    if (dayjs(newDate).isValid()) {
      setDate(newDate);
      console.log(newDate);
    } else {
      console.error("La fecha seleccionada no es válida.");
    }
  };

  useEffect(() => {
    async function fetchData() {
      const response = await getReservationsByDate(date.format('YYYY-MM-DD'));
      setRooms(response.rooms || {});
      console.log('Response from API:', response);
    }

    fetchData();
  }, [date]);

  const cardStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '130px',
    marginLeft: '15px', // Ajusta la altura según tus necesidades
    marginBottom: '20px' // Margen inferior del contenedor principal
  };

  const localizationProviderStyle = {
    marginBottom: '20px' // Margen inferior del LocalizationProvider
  };

  return (
    <Grid container style={cardStyle}>
      <div style={localizationProviderStyle}>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
          <DemoItem components={['DatePicker']}>
            <DatePicker label="Disponibilidad del día:"
              name="date"
              value={date}
              onChange={(newDate) => handleDateChange(newDate)}
            />
          </DemoItem>
        </LocalizationProvider>
      </div>
      
      {Object.keys(rooms).length === 0 ? (
        <Grid item xs={12} sm={12} md={12} lg={12} >
        <Card>
          <CardContent style={{ textAlign: "center" }}>
            <Typography variant="body2" color="textSecondary">
              Ninguna sala está reservada para esta fecha.
            </Typography>
          </CardContent>
        </Card>
        </Grid>
      ) : (
        <Grid container spacing={2}>
          {Object.keys(rooms).map((nombreSala) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={nombreSala}>
              <Card>
                <CardContent style={{ textAlign: "center" }}>
                  <Typography variant="h5" component="div">
                    {nombreSala}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Horarios disponibles:
                  </Typography>
                  <Grid container>
                    <Grid item xs={6}>
                      <List>
                        {Object.keys(rooms[nombreSala])
                          .filter((horaRango) => horaRango >= "08-09" && horaRango <= "15-16")
                          .map((horaRango) => (
                            <ListItem key={horaRango} style={{ textAlign: "center", padding: "4px 0" }}>
                              <ListItemText
                                primary={horaRango}
                                style={{
                                  color: rooms[nombreSala][horaRango] === "free" ? "green" : "red",
                                }}
                              />
                            </ListItem>
                          ))}
                      </List>
                    </Grid>
                    <Grid item xs={6}>
                      <List>
                        {Object.keys(rooms[nombreSala])
                          .filter((horaRango) => horaRango >= "16-17" && horaRango <= "22-23")
                          .map((horaRango) => (
                            <ListItem key={horaRango} style={{ textAlign: "center", padding: "4px 0" }}>
                              <ListItemText
                                primary={horaRango}
                                style={{
                                  color: rooms[nombreSala][horaRango] === "free" ? "green" : "red",
                                }}
                              />
                            </ListItem>
                          ))}
                      </List>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Grid>
  );
};