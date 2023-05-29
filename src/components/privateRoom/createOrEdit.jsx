import React, { useEffect, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField, Typography } from '@mui/material';
import { useForm } from '../../hooks/useForm';
import { createPrivateRoom, getAllRooms, updatePrivateRoom } from '../../services/privateRoom.service';
import { toast } from 'react-toastify';

const PrivateRoomEmpty = { 
    "_id":"",
    "name": "",
    "capacity": ""
}


export const CreateOrEdit = ({ isEdit, setEdit, setPrivateRooms, currentPrivateRoom, setCurrentPrivateRoom }) => {
    
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [modal, setModal] = useState(false);
    const [disabledButton, setdisabledButton] = useState(false);

    const formValidations = {
        name: [(value) => value.length >= 1, 'Es obligatorio.'],
        capacity: [(value) => value.length >= 1, 'Es obligatorio.'],
    }

    const {
        name, capacity, onInputChange,
        isFormValid, nameValid, capacityValid
    } = useForm(currentPrivateRoom, formValidations);

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
                
            if (currentPrivateRoom._id.length > 1) {
                const { success } = await updatePrivateRoom(currentPrivateRoom._id, name, capacity);
                if (!success) {
                    toast.dismiss(id);
                    return;
                }
                toast.update(id, { render: "Registro modificado", type: "success", isLoading: false, autoClose: 2000 });
            } else {
                const { success } = await createPrivateRoom(name, capacity);

                if (!success) {
                    toast.dismiss(id);
                    return;
                }
                toast.update(id, { render: "Sala creada", type: "success", isLoading: false, autoClose: 2000 });
            }
            setCurrentPrivateRoom(PrivateRoomEmpty);
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
        
        getAllRooms()
            .then(({ privateRooms }) => {
                setPrivateRooms(privateRooms)
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
                    <DialogTitle><Typography color='primary.main' sx={{ ml: 1 }}>NUEVA SALA</Typography></DialogTitle>
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
                                    label="Capacidad"
                                    type="text"
                                    fullWidth
                                    name="capacity"
                                    value={capacity}
                                    onChange={onInputChange}
                                    error={!!capacityValid && formSubmitted}
                                    helperText={capacityValid}
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
