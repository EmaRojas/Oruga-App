import React, { useEffect, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField, Typography, Select, MenuItem } from '@mui/material';
import { useForm } from '../../hooks/useForm';
import { createMembership, getAll, updateMembership } from '../../services/membership.service';
import { toast } from 'react-toastify';

const MembershipEmpty = { 
    "_id":"",
    "name": "",
    "price": "",
    "type": ""
}


export const CreateOrEdit = ({ isEdit, setEdit, setMemberships, currentMembership, setCurrentMembership }) => {
    
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [modal, setModal] = useState(false);
    const [disabledButton, setdisabledButton] = useState(false);

    const formValidations = {
        name: [(value) => value.length >= 1, 'Es obligatorio.'],
        type: [(value) => value.length >= 1, 'Es obligatorio.'],

    }

    const {
        name, price, type, onInputChange,
        isFormValid, nameValid, priceValid
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
                return;
            } 
                
            if (currentMembership._id.length > 1) {
                const { success } = await updateMembership(currentMembership._id, name, price, type);
                if (!success) {
                    toast.dismiss(id);
                    return;
                }
                toast.update(id, { render: "Registro modificado", type: "success", isLoading: false, autoClose: 2000 });
            } else {
                const { success } = await createMembership(name, price, type);

                if (!success) {
                    toast.dismiss(id);
                    return;
                }
                toast.update(id, { render: "Cliente registrado", type: "success", isLoading: false, autoClose: 2000 });
            }
            setCurrentMembership(MembershipEmpty);
            reset();     
        } catch (e) {
            toast.dismiss(id);
            console.log(e.message);
        }
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

    const refreshList = () => {
        
        getAll()
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
                    <DialogTitle><Typography color='primary.main' sx={{ ml: 1 }}>NUEVO CLIENTE</Typography></DialogTitle>
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
