import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField, Typography } from '@mui/material';
import { useForm } from '../../hooks/useForm';
import { createClient, getAll } from '../../services/client.service';

const formData = {
    "full_name": "",
    "phone": "",
    "email": "",
    "company_name": "",
    "cuit": "",
    "description": "",
    "assistance": ""
}

export const CreateOrEdit = ({ isEdit, setClients, clients }) => {
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [modal, setModal] = useState(false);

    const formValidations = {
        full_name: [(value) => value.length >= 1, 'Es obligatorio.'],
        phone: [(value) => value.length >= 1 && !isNaN(value), 'Es obligatorio. No se puede ingresar letras.'],
        company_name: [(value) => value.length >= 1 && isNaN(value), 'Es obligatorio. No se puede ingresar número.'],
        cuit: [(value) => value.length >= 8 && !isNaN(value), 'Es obligatorio. No se puede ingresar letras.'],
        email: [(value) => value.length >= 2 && value.includes('@'), 'Es Obligatorio. El correo debe de tener una @'],
    }

    const {
        formState, full_name, phone, email, company_name, description, assistance, cuit, onInputChange,
        isFormValid, full_nameValid, phoneValid, emailValid, company_nameValid, cuitValid
    } = useForm(formData, formValidations);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setFormSubmitted(true);
            if (!isFormValid) return;
            const {success} = await createClient(full_name, phone, email, company_name, description, assistance, cuit);
            if(success){
                refreshList();
                setModal(false);
            }
        } catch (e) {
            console.log(e.message);
        }
    }

    const handleSubmitPrueba = async (e) => {
        e.preventDefault();
        try {
            const response = await createClient();
            console.log(response);
        } catch (e) {
            console.log(e.message);
        }
    }

    const handleOpen = () => {
        setModal(true);
    }

    const handleClose = () => {
        setModal(false);
    }

    const refreshList = ()=>{
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
            <Button onClick={handleSubmitPrueba}>Post</Button>
            <Button onClick={handleOpen}>Nuevo</Button>
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
                                    label="Nombre empresa"
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
                                    label="Descripción"
                                    type="text"
                                    fullWidth
                                    multiline
                                    rows={3}
                                    name="description"
                                    value={description}
                                    onChange={onInputChange}
                                />
                            </Grid>
                            <Grid item xs={12} sx={{ mt: 2 }}>
                                <TextField
                                    label="Asistencia"
                                    type="text"
                                    fullWidth
                                    name="assistance"
                                    value={assistance}
                                    onChange={onInputChange}
                                />
                            </Grid>
                        </Grid>



                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>
                            <Typography color='primary.main' sx={{ ml: 1 }}>Cancelar</Typography>
                        </Button>
                        <Button
                            type="submit"
                            variant='contained'
                        >
                            <Typography color='secondary.main' sx={{ ml: 1 }}>Crear</Typography>
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </>
    )
};
