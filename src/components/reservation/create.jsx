import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Autocomplete from '@mui/material/Autocomplete';
import { getAll } from "../../services/client.service";
import { getAllRooms } from "../../services/room.service";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import Grid from '@mui/material/Grid';


export function Create() {
  const [open, setOpen] = useState(false);

  const [clients, setClients] = useState();
  const [privateRooms, setRooms] = useState();


  const getClients =async () => {    
    await getAll()
    .then(({ clients }) => {
        setClients(clients)
        console.log(clients);

    })
    .catch((e) => {
        console.log(e.message)
    })
  }

  const getRooms =async () => {    
    await getAllRooms()
    .then(({ privateRooms }) => {
        setRooms(privateRooms);
        console.log(privateRooms);

    })
    .catch((e) => {
        console.log(e.message)
    })
  }


  useEffect(() => {
    getClients();
    getRooms();

  }, [])


  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(e)
    
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };



  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        Nueva reserva
      </Button>
      <Dialog open={open} onClose={handleClose}>
      <form onSubmit={handleSubmit}>

        <DialogContent>
        <Grid container>
        <Grid item xs={12} sx={{ mt: 2 }}>

          <DialogContentText>
            BUSCAR CLIENTE
          </DialogContentText>
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={clients}
            getOptionLabel={(clients) => clients.full_name.toString()}
            sx={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label="Cliente" />}
            name="client"
            // value={value}
            // onChange={(event, value) => console.log(value._id)}
          />
        </Grid>
        <Grid item xs={12} sx={{ mt: 2 }}>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoContainer components={['TimePicker']}>
            <TimePicker 
            label="Hora inicio" 
            name="init_time"
            />
        </DemoContainer>
        </LocalizationProvider>
        </Grid>
        <Grid item xs={12} sx={{ mt: 2 }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoContainer components={['TimePicker']}>
            <TimePicker 
            label="Hora fin" 
            name="end_time"
            />
        </DemoContainer>
        </LocalizationProvider>
        </Grid>
        <Grid item xs={12} sx={{ mt: 2 }}>
        <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={privateRooms}
            getOptionLabel={(privateRooms) => privateRooms.name.toString()}
            sx={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label="Sala" />}
            name="privateRoom"
            // onChange={(event, value) => console.log(value._id)}
          />
        </Grid>
        </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button type="submit">Crear reserva</Button>
        </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}