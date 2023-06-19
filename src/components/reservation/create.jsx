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
import { getAllRooms } from "../../services/privateRoom.service";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import Grid from '@mui/material/Grid';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { FormControlLabel, FormLabel, FormControl, Radio, RadioGroup } from '@mui/material';
import { createReservation } from '../../services/reservation.service';
import dayjs from 'dayjs';


export function Create() {
  const [open, setOpen] = useState(false);

  const [clients, setClients] = useState();
  const [priceRooms, setRooms] = useState();
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedPriceRoom, setSelectedPriceRoom] = useState(null);

  const [selectedDateTime, setSelectedDateTime] = useState(null);


  const [paymentMethod, setPaymentMethod] = useState('Efectivo');
  const [paid, setPaid] = useState(0);

  const handleChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  const handlePaidChange = (event) => {
    setPaid(event.target.value);
    console.log(paid);
  };

  const handleDateTimeChange = (newDateTime) => {
    setSelectedDateTime(newDateTime);
  };

  const handleAutocompleteChange = (event, value) => {
    setSelectedClient(value);
  };

  const handleAutocompleteChangeRoom = (event, value) => {
    setSelectedPriceRoom(value);
  };

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
    .then(({ priceRooms }) => {
        setRooms(priceRooms);
        console.log(priceRooms);

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
    console.log(selectedClient._id);
    console.log(selectedPriceRoom._id);
    const date = selectedDateTime.format('YYYY-MM-DD');
    const time = selectedDateTime.format('HH:mm');
    const { success } = await createReservation(selectedClient._id, selectedPriceRoom._id, selectedPriceRoom.roomID._id, selectedDateTime, date, time, paymentMethod, selectedPriceRoom.price, paid );
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
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={clients}
            getOptionLabel={(clients) => clients.full_name.toString()}
            sx={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label="Cliente" />}
            name="client"
            onChange={handleAutocompleteChange}
            // value={value}
            // onChange={(event, value) => console.log(value._id)}
          />
        </Grid>
        <Grid item xs={12} sx={{ mt: 2 }}>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoContainer components={['DateTimePicker']}>
          <DateTimePicker label="Fecha y hora"
          value={selectedDateTime}
          onChange={handleDateTimeChange}
          name="fecha"
           />
        </DemoContainer>
        </LocalizationProvider>
        </Grid>
        <Grid item xs={12} sx={{ mt: 2 }}>
        <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={priceRooms}
            getOptionLabel={(priceRooms) => `${priceRooms.roomID.name.toString()} (${priceRooms.hour.toString()} hs)`}
            sx={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label="Sala" />}
            name="priceRoom"
            onChange={handleAutocompleteChangeRoom}
          />
        </Grid>
        <Grid item xs={12} sx={{ mt: 2 }}>
                                <FormControl>
                                    <FormLabel id="demo-controlled-radio-buttons-group">Medio de pago</FormLabel>
                                    <RadioGroup
                                        row
                                        aria-labelledby="demo-controlled-radio-buttons-group"
                                        name="controlled-radio-buttons-group"
                                        value={paymentMethod}
                                        onChange={handleChange}
                                    >
                                        <FormControlLabel value="Efectivo" control={<Radio />} label="Efectivo" />
                                        <FormControlLabel value="MercadoPago" control={<Radio />} label="MercadoPago" />
                                    </RadioGroup>
                                </FormControl>
        </Grid>
        <Grid item xs={12} sx={{ mt: 2 }}>
                                <TextField
                                    label="Monto abonado"
                                    type="text"
                                    fullWidth
                                    name="paid"
                                    value={paid}
                                    onChange={handlePaidChange}
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