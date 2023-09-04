import React, { useEffect, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField, Typography, Select, MenuItem, FormLabel, RadioGroup, FormControlLabel, Radio, Box } from '@mui/material';
import { useForm } from '../../hooks/useForm';
import { createMembership, getAllMemberships, updateMembership } from '../../services/membership.service';
import { toast } from 'react-toastify';
import { FormControl } from '@mui/base';
import { getAllRooms } from '../../services/room.service'
import Autocomplete from '@mui/material/Autocomplete';

const MembershipEmpty = { 
    "_id":"",
    "name": "",
    "price": "",
    "type": "",
    "hours": ""
}


export const CreateOrEdit = ({ isEdit, setEdit, setMemberships, currentMembership, setCurrentMembership }) => {
    
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [modal, setModal] = useState(false);
    const [disabledButton, setdisabledButton] = useState(false);
    const [type, setType] = React.useState('Normal');
    const [rooms, setRooms] = useState();
    const [selectRooms, setSelectRooms] = useState();
    const [validRoom, setValidRoom] = useState('Es obligatorio');

    const handleAutocompleteChange = (event, value) => {
        if (value !== null) {
            setSelectRooms(value._id);
            setValidRoom(null);
        } else {
            setValidRoom('Es obligatorio');
        }
    };

    const getRooms = async () => {
        await getAllRooms()
            .then(({ rooms }) => {
                setRooms(rooms)
            })
            .catch((e) => {
                console.log(e.message)
            })
    };


    useEffect(() => {
        getRooms();
    }, [])


    const formValidations = {
        name: [(value) => value.length >= 1, 'Es obligatorio.'],
        price: [
            (value) => value.length >= 1 && !isNaN(value) && !(/[.,]/.test(value)),
            'Es obligatorio. Solo se permiten números, sin puntos ni comas.'
        ],
        hours: [(value) => !isNaN(value) && value.length >= 1, 'Es obligatorio. No se puede ingresar letras.'],
    }

    const {
        name, price, hours, onInputChange,
        isFormValid, nameValid, priceValid, hoursValid
    } = useForm(currentMembership, formValidations);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const id = toast.loading("Validando formulario...")
        try {
            setdisabledButton(true);
            setFormSubmitted(true);
           
            if (!isFormValid)
            {
                toast.dismiss(id);
                setdisabledButton(false);
                toast.error("Formulario incorrecto")
                return;
            } 
            // Eliminar el punto
            var priceParse = price.replace(/\./g, '');
            if (currentMembership._id.length > 1) {
            
                const { success } = await updateMembership(currentMembership._id, selectRooms, name, priceParse,hours, type);
                if (!success) {
                    toast.dismiss(id);
                    return;
                }
                toast.update(id, { render: "Registro modificado", type: "success", isLoading: false, autoClose: 2000 });
            } else {

                const response = await createMembership(name, selectRooms, priceParse,hours, type);

                // if (!success) {
                //     toast.dismiss(id);
                //     return;
                // }
                toast.update(id, { render: "Membresía registrada", type: "success", isLoading: false, autoClose: 2000 });
            }
            setCurrentMembership(MembershipEmpty);
            reset();     
        } catch (e) {
            toast.dismiss(id);
            console.log(e.message);
        }
    }

    const handleChange = (event) => {
        setType(event.target.value);
    };

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

    const refreshList = () => {
        
        getAllMemberships()
            .then(({ memberships }) => {
                setMemberships(memberships)
            })
            .catch((e) => {
                console.log(e.message)
            })
    }      

    return (
        <>
            <Button disabled={!isEdit} onClick={handleOpen}>Nuevo</Button>
            <Button disabled={isEdit} onClick={handleOpen}>Editar</Button>
            <Dialog open={modal} onClose={handleClose}>
                <form onSubmit={handleSubmit}>
                    <DialogTitle><Typography color='primary.main' sx={{ ml: 1 }}>NUEVA MEMBRESÍA</Typography></DialogTitle>
                    <DialogContent>

                        <Grid container>

                            <Grid item xs={12} sx={{ mt: 2 }}>
                                <TextField
                                    label="Nombre"
                                    type="text"
                                    fullWidth
                                    name="name"
                                    value={name}
                                    onChange={onInputChange}
                                    error={!!nameValid && formSubmitted}
                                    helperText={nameValid}
                                />
                            </Grid>
                            <Grid item xs={12} sx={{ mt: 2 }}>
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    options={rooms}
                                    getOptionLabel={(rooms) => rooms.name.toString()}
                                    renderInput={(params) => <TextField {...params} label="Seleccionar sala"
                                        name='client' error={!!validRoom && formSubmitted}
                                        helperText={validRoom} />}
                                    name="client"
                                    onChange={handleAutocompleteChange}
                                />
                            </Grid>

                            <Grid item xs={12} sx={{ mt: 2 }}>
                                <TextField
                                    label="Precio"
                                    type="text"
                                    fullWidth
                                    name="price"
                                    value={price}
                                    onChange={onInputChange}
                                    error={!!priceValid && formSubmitted}
                                    helperText={priceValid}
                                />
                            </Grid>
                            <Grid item xs={12} sx={{ mt: 2 }}>
                                <TextField
                                    label="Horas"
                                    type="text"
                                    fullWidth
                                    name="hours"
                                    value={hours || ''}
                                    onChange={onInputChange}
                                    error={!!hoursValid && formSubmitted}
                                    helperText={hoursValid}
                                />
                            </Grid>
                            <Grid item xs={12} sx={{ mt: 2 }}>
                                <FormControl>
                                    <FormLabel id="demo-controlled-radio-buttons-group">Tipo de membresía</FormLabel>
                                    <RadioGroup
                                        row
                                        aria-labelledby="demo-controlled-radio-buttons-group"
                                        name="controlled-radio-buttons-group"
                                        value={type}
                                        onChange={handleChange}
                                    >
                                        <FormControlLabel value="Individual" control={<Radio />} label="Individual" />
                                        <FormControlLabel value="Sala privada" control={<Radio />} label="Sala privada" />
                                        <FormControlLabel value="Multiple" control={<Radio />} label="Multiple" />

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
