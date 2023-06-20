import React, { useEffect, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField, Typography } from '@mui/material';
import { useForm } from '../../hooks/useForm';
import { getAllMemberships } from '../../services/membership.service';
import { toast } from 'react-toastify';
import Autocomplete from '@mui/material/Autocomplete';
import { getAll } from "../../services/client.service";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { FormControlLabel, FormLabel, FormControl, Radio, RadioGroup } from '@mui/material';
import dayjs from 'dayjs';
import { createMembershipByUser } from '../../services/membershipByUser.service';


const MembembershipBy = { 
    "_id":"",
    "clientID": {
        "full_name": "",
    },
}


export const CreateOrEdit = ({ isEdit, setEdit, currentMembershipByUser, setcurrentMembershipByUser }) => {
    
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [modal, setModal] = useState(false);
    const [disabledButton, setdisabledButton] = useState(false);

    const [clients, setClients] = useState();
    const [memberships, setMemberships] = useState();
    const [selectedClient, setSelectedClient] = useState(null);
    const [selectedMembership, setSelectedMembership] = useState(null);
  
    const [selectedDateTime, setSelectedDateTime] = useState(null);
  
  
    const [paymentMethod, setPaymentMethod] = useState('Efectivo');
  
    const handleChange = (event) => {
      setPaymentMethod(event.target.value);
    };
  

    const handleDateTimeChange = (newDateTime) => {
      setSelectedDateTime(newDateTime);
      const endDateString = selectedDateTime.format('YYYY-MM-DD');
        console.log(endDateString);
    };
  
    const handleAutocompleteChange = (event, value) => {
      setSelectedClient(value);
    };
  
    const handleAutocompleteMembership = (event, value) => {
      setSelectedMembership(value);
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
  
    const getMemberships =async () => {    
      await getAllMemberships()
      .then(({ memberships }) => {
          setMemberships(memberships);
  
      })
      .catch((e) => {
          console.log(e.message)
      })
    }

    
  useEffect(() => {
    getClients();
    getMemberships();

  }, [])

    const formValidations = {
        fecha: [(value) => value !== null, 'Es obligatorio.']
    }

    const {
        isFormValid
    } = useForm(currentMembershipByUser, formValidations);

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
                const { success } = await createMembershipByUser(selectedClient._id, selectedMembership._id, selectedDateTime, selectedDateTime);

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
        
        // getAllReservations()
        //     .then(({ reservations }) => {
        //         setReservations(reservations)
        //     })
        //     .catch((e) => {
        //         console.log(e.message)
        //     })
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
            <Button onClick={handleOpen}>ASIGNAR MEMBRESÍA</Button>
            <Dialog open={modal} onClose={handleClose}>
                <form onSubmit={handleSubmit}>
                    <DialogTitle><Typography color='primary.main' sx={{ ml: 1 }}>NUEVA MEMBRESÍA ACTIVA</Typography></DialogTitle>
                    <DialogContent>
                        <Grid container>
                            <Grid item xs={12} sx={{ mt: 2 }}>
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    options={clients}
                                    getOptionLabel={(clients) => clients.full_name.toString()}
                                    renderInput={(params) => <TextField {...params} label="Seleccionar cliente" />}
                                    name="client"
                                    onChange={handleAutocompleteChange}
                                // value={value}
                                // onChange={(event, value) => console.log(value._id)}
                                />
                            </Grid>
                            <Grid item xs={12} sx={{ mt: 2 }}>

                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DemoContainer components={['DateTimePicker']}>
                                        <DateTimePicker label="Fecha fin"
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
                                    options={memberships}
                                    getOptionLabel={(memberships) => `${memberships.name.toString()} (${memberships.price.toString()} hs)`}
                                    renderInput={(params) => <TextField {...params} label="Seleccionar membresía" />}
                                    name="memberships"
                                    onChange={handleAutocompleteMembership}
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
