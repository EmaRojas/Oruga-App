import React, { useEffect, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField, Typography } from '@mui/material';
import { useForm } from '../../hooks/useForm';
import { createReservation, getAllReservations, updateReservation } from '../../services/reservation.service';
import { toast } from 'react-toastify';
import Autocomplete from '@mui/material/Autocomplete';
import { getAll } from "../../services/client.service";
import { getAllRooms } from "../../services/priceRoom.service";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { FormControlLabel, FormLabel, FormControl, Radio, RadioGroup } from '@mui/material';
import dayjs from 'dayjs';


const ReservationEmpty = { 
    "_id":"",
    "clientID": {
        "full_name": "",
    },
}


export const CreateOrEdit = ({ isEdit, setEdit, setReservations, currentReservation, setCurrentReservation }) => {
    
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [modal, setModal] = useState(false);
    const [disabledButton, setdisabledButton] = useState(false);

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

    const formValidations = {
        fecha: [(value) => value !== null, 'Es obligatorio.']
    }

    const {
        isFormValid
    } = useForm(currentReservation, formValidations);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const id = toast.loading("Validando formulario...")
        try {
            setdisabledButton(true);
            setFormSubmitted(true);
           
            if (!isFormValid)
            {
                toast.dismiss(id);
                return;
            } 
                
            // if (currentReservation._id.length > 1) {
            //     const { success } = await updateReservation(currentReservation._id, clientID);
            //     if (!success) {
            //         toast.dismiss(id);
            //         return;
            //     }
            //     toast.update(id, { render: "Registro modificado", type: "success", isLoading: false, autoClose: 2000 });
            // } 
            
            else {
                const date = selectedDateTime.format('YYYY-MM-DD');
                const time = selectedDateTime.format('HH:mm');
                const { success } = await createReservation(selectedClient._id, selectedPriceRoom._id, selectedPriceRoom.roomID._id, selectedDateTime, date, time, paymentMethod, selectedPriceRoom.price, paid );

                if (!success) {
                    toast.dismiss(id);
                    return;
                }
                toast.update(id, { render: "Sala creada", type: "success", isLoading: false, autoClose: 2000 });
            }
            reset();     
        } catch (e) {
            toast.dismiss(id);
            console.log(e.message);
        }
    }

    const refreshList = () => {
        
        getAllReservations()
            .then(({ reservations }) => {
                setReservations(reservations)
            })
            .catch((e) => {
                console.log(e.message)
            })
    }

    const reset = () => {
        setdisabledButton(false);
        setFormSubmitted(false);
        setEdit(true);
        refreshList();
        handleClose();
    }

    const handleOpen = () => {
        setModal(true);
    }

    const handleClose = () => {
        setModal(false);
    }


    return (
        <>
            <Button onClick={handleOpen}>NUEVA RESERVA</Button>
            <Dialog open={modal} onClose={handleClose}>
                <form onSubmit={handleSubmit}>
                    <DialogTitle><Typography color='primary.main' sx={{ ml: 1 }}>NUEVA SALA</Typography></DialogTitle>
                    <DialogContent>
                        <Grid container>
                            <Grid item xs={12} sx={{ mt: 2 }}>
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    options={clients}
                                    getOptionLabel={(clients) => clients.full_name.toString()}
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
                        <Button onClick={handleClose}>
                            <Typography color='primary.main' sx={{ ml: 1 }}>Cancelar</Typography>
                        </Button>
                        {
                            isEdit && <Button
                                type="submit"
                                variant='contained'
                                disabled={disabledButton}
                            >
                                <Typography color='secondary.main' sx={{ ml: 1 }}>Crear</Typography>
                            </Button>
                        }

                        {
                            !isEdit && <Button
                                type="submit"
                                variant='contained'
                                disabled={disabledButton}
                            >
                                <Typography color='secondary.main' sx={{ ml: 1 }}>Actualizar</Typography>
                            </Button>
                        }

                    </DialogActions>
                </form>
            </Dialog>
        </>
    )
};
