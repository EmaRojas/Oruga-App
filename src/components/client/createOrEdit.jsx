import React, { useEffect, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, FormLabel, Grid, Radio, RadioGroup, TextField, Typography } from '@mui/material';
import { useForm } from '../../hooks/useForm';
import { createClient, getAll, updateClient } from '../../services/client.service';
import { toast } from 'react-toastify';
import { FormControl } from '@mui/base';

const ClientEmpty = {
    "_id": "",
    "full_name": "",
    "phone": "",
    "email": "",
    "company_name": "",
    "cuit": "",
    "category": ""
}


export const CreateOrEdit = ({ isEdit, setEdit, setClients, currentUser, setCurrentUser }) => {

    const [formSubmitted, setFormSubmitted] = useState(false);
    const [modal, setModal] = useState(false);
    const [disabledButton, setdisabledButton] = useState(false);
    const [category, setCategory] = React.useState('Profesional');

    const formValidations = {
        full_name: [(value) => value.length >= 1, 'Es obligatorio.'],
        phone: [(value) => value.length >= 1 && !isNaN(value), 'Es obligatorio. No se puede ingresar letras.'],
        company_name: [(value) => value.length >= 1 && isNaN(value), 'Es obligatorio. No se puede ingresar número.'],
        cuit: [(value) => value.length >= 8 && !isNaN(value), 'Es obligatorio. No se puede ingresar letras.'],
        email: [
            (value) => value.length >= 2 && value.includes('@') && !value.includes(' '), 
            'Es Obligatorio. El correo debe de tener una @ y no debe contener espacios'
        ],
    }

    const {
        full_name, phone, email, company_name, cuit, onInputChange,
        isFormValid, full_nameValid, phoneValid, emailValid, company_nameValid, cuitValid
    } = useForm(currentUser, formValidations);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const id = toast.loading("Validando formulario...")
        try {
            setFormSubmitted(true);
            console.log(emailValid);
            if (!isFormValid) {
                toast.dismiss(id);
                return;
            }

            setdisabledButton(true);

            if (currentUser._id.length > 1) {
                const { success } = await updateClient(currentUser._id, full_name, phone, email, company_name, category, cuit);
                if (!success) {
                    toast.dismiss(id);
                    return;
                }
                toast.update(id, { render: "Registro modificado", type: "success", isLoading: false, autoClose: 2000 });
            } else {
                const { success } = await createClient(full_name, phone, email, company_name, category, cuit);

                if (!success) {
                    toast.dismiss(id);
                    return;
                }
                toast.update(id, { render: "Cliente registrado", type: "success", isLoading: false, autoClose: 2000 });
            }
            setCurrentUser(ClientEmpty);
            reset();
        } catch (e) {
            setdisabledButton(false);
            toast.dismiss(id);
            console.log(e.message);
        }
    }

    const handleChange = (event) => {
        setCategory(event.target.value);
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

        getAll()
            .then(({ clients }) => {
                setClients(clients)
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
                    <DialogTitle><Typography color='primary.main' sx={{ ml: 1 }}>NUEVO CLIENTE</Typography></DialogTitle>
                    <DialogContent>

                        <Grid container>

                            <Grid item xs={12} sx={{ mt: 2 }}>
                                <TextField
                                    label="Nombre completo"
                                    type="text"
                                    fullWidth
                                    name="full_name"
                                    value={full_name}
                                    onChange={onInputChange}
                                    error={!!full_nameValid && formSubmitted}
                                    helperText={full_nameValid}
                                />
                            </Grid>
                            <Grid item xs={12} sx={{ mt: 2 }}>
                                <TextField
                                    label="Teléfono"
                                    type="text"
                                    fullWidth
                                    name="phone"
                                    value={phone}
                                    onChange={onInputChange}
                                    error={!!phoneValid && formSubmitted}
                                    helperText={phoneValid}
                                />
                            </Grid>
                            <Grid item xs={12} sx={{ mt: 2 }}>
                                <TextField
                                    label="Email"
                                    type="text"
                                    fullWidth
                                    name="email"
                                    value={email}
                                    onChange={onInputChange}
                                    error={!!emailValid && formSubmitted}
                                    helperText={emailValid}
                                />
                            </Grid>
                            <Grid item xs={12} sx={{ mt: 2 }}>
                                <TextField
                                    label="Profesión/Razón Social"
                                    type="text"
                                    fullWidth
                                    name="company_name"
                                    value={company_name}
                                    onChange={onInputChange}
                                    error={!!company_nameValid && formSubmitted}
                                    helperText={company_nameValid}
                                />
                            </Grid>
                            <Grid item xs={12} sx={{ mt: 2 }}>
                                <TextField
                                    label="C.U.I.T."
                                    type="text"
                                    fullWidth
                                    name="cuit"
                                    value={cuit}
                                    onChange={onInputChange}
                                    error={!!cuitValid && formSubmitted}
                                    helperText={cuitValid}
                                />
                            </Grid>
                            <Grid item xs={12} sx={{ mt: 2 }}>
                                <FormControl>
                                    <FormLabel id="demo-controlled-radio-buttons-group">Categoría</FormLabel>
                                    <RadioGroup
                                        row
                                        aria-labelledby="demo-controlled-radio-buttons-group"
                                        name="controlled-radio-buttons-group"
                                        value={category}
                                        onChange={handleChange}
                                    >
                                        <FormControlLabel value="Profesional" control={<Radio />} label="Profesional" />
                                        <FormControlLabel value="Empresa" control={<Radio />} label="Empresa" />
                                        <FormControlLabel value="Formador" control={<Radio />} label="Formador" />
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
