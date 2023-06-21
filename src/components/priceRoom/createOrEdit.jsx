import React, { useEffect, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField, Typography } from '@mui/material';
import { useForm } from '../../hooks/useForm';
import { getAllPriceRooms, createPriceRoom } from '../../services/priceRoom.service';
import { toast } from 'react-toastify';
import Autocomplete from '@mui/material/Autocomplete';
import { getAll } from "../../services/client.service";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { FormControlLabel, FormLabel, FormControl, Radio, RadioGroup } from '@mui/material';
import dayjs from 'dayjs';
import { getAllRooms } from '../../services/room.service';


const PriceRoomEmpty = { 
    "_id":"",
    "roomID": {
        "name": "",
    },
}


export const CreateOrEdit = ({ isEdit, setEdit, currentPriceRoom, setcurrentPriceRoom }) => {
    
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [modal, setModal] = useState(false);
    const [disabledButton, setdisabledButton] = useState(false);

    const [rooms, setRooms] = useState();
    const [priceRooms, setPriceRooms] = useState();
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [selectedPriceRoom, setSelectedPriceRoom] = useState(null);
    const [price, setPrice] = useState(0);
    const [hour, setHour] = useState(0);

  
    const handleAutocompleteChange = (event, value) => {
      setSelectedRoom(value);
    };
  

    const getRooms =async () => {    
      await getAllRooms()
      .then(({ rooms }) => {
          setRooms(rooms)
          console.log(rooms);
  
      })
      .catch((e) => {
          console.log(e.message)
      })
    }
  
    const getPriceRooms =async () => {    
      await getAllPriceRooms()
      .then(({ priceRooms }) => {
          setPriceRooms(priceRooms);
  
      })
      .catch((e) => {
          console.log(e.message)
      })
    }

    
  useEffect(() => {
    getRooms();
    getPriceRooms();

  }, [])

    const formValidations = {
        fecha: [(value) => value !== null, 'Es obligatorio.']
    }

    const {
        isFormValid
    } = useForm(currentPriceRoom, formValidations);

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
                const { success } = await createPriceRoom(selectedRoom._id, hour, price);

                if (!success) {
                    toast.dismiss(id);
                    return;
                }
                toast.update(id, { render: "Precio creado", type: "success", isLoading: false, autoClose: 2000 });
                reset(); 
            }
            
            
        } catch (e) {
            toast.dismiss(id);
            console.log(e.message);
        }
    }

    const reset = () => {
        setdisabledButton(false);
        setFormSubmitted(false);
        setEdit(true);
        getPriceRooms();
        handleClose();
    }

    const handleOpen = () => {
        setModal(true);
    }

    const handlePriceChange = (event) => {
        setPrice(event.target.value);
        console.log(price);
      };

      const handleHourChange = (event) => {
        setHour(event.target.value);
        console.log(hour);
      };

    const handleClose = () => {
        setModal(false);
    }


    return (
        <>
            <Button onClick={handleOpen}>CREAR PRECIO</Button>
            <Dialog open={modal} onClose={handleClose}>
                <form onSubmit={handleSubmit}>
                    <DialogTitle><Typography color='primary.main' sx={{ ml: 1 }}>NUEVO PRECIO SALA</Typography></DialogTitle>
                    <DialogContent>
                        <Grid container>
                            <Grid item xs={12} sx={{ mt: 2 }}>
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    options={rooms}
                                    getOptionLabel={(rooms) => rooms.name.toString()}
                                    renderInput={(params) => <TextField {...params} label="Seleccionar sala" />}
                                    name="client"
                                    onChange={handleAutocompleteChange}
                                // value={value}
                                // onChange={(event, value) => console.log(value._id)}
                                />
                            </Grid>
                            <Grid item xs={12} sx={{ mt: 2 }}>
                                <TextField
                                    label="Horas"
                                    type="text"
                                    fullWidth
                                    name="hour"
                                    value={hour}
                                    onChange={handleHourChange}
                                />
                            </Grid>
                            <Grid item xs={12} sx={{ mt: 2 }}>
                                <TextField
                                    label="Precio"
                                    type="text"
                                    fullWidth
                                    name="price"
                                    value={price}
                                    onChange={handlePriceChange}
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
