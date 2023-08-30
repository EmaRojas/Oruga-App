import React, { useEffect, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField, Typography, Select, MenuItem, FormLabel, RadioGroup, FormControlLabel, Radio, Box } from '@mui/material';
import { useForm } from '../../hooks/useForm';
import { createMembership, getAllMemberships, updateMembership } from '../../services/membership.service';
import { toast } from 'react-toastify';
import { FormControl } from '@mui/base';

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

    const formValidations = {
        name: [(value) => value.length >= 1, 'Es obligatorio.'],
        price:[(value) => value.length >= 1 && !isNaN(value), 'Es obligatorio. No se puede ingresar letras.'],
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
            
                const { success } = await updateMembership(currentMembership._id, name, priceParse,hours, type);
                if (!success) {
                    toast.dismiss(id);
                    return;
                }
                toast.update(id, { render: "Registro modificado", type: "success", isLoading: false, autoClose: 2000 });
            } else {

                const response = await createMembership(name, priceParse,hours, type);

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
                                    <FormLabel id="demo-controlled-radio-buttons-group">Tipo</FormLabel>
                                    <RadioGroup
                                        row
                                        aria-labelledby="demo-controlled-radio-buttons-group"
                                        name="controlled-radio-buttons-group"
                                        value={type}
                                        onChange={handleChange}
                                    >
                                        <FormControlLabel value="Normal" control={<Radio />} label="Normal" />
                                        <FormControlLabel value="Compartida" control={<Radio />} label="Compartida" />
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
