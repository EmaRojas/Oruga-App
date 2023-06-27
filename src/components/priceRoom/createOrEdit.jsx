import React, { useEffect, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField, Typography } from '@mui/material';
import { useForm } from '../../hooks/useForm';
import { createPriceRoom, updatePriceRoom, getAllPriceRooms } from '../../services/priceRoom.service';
import { getAllRooms } from '../../services/room.service'
import { toast } from 'react-toastify';
import Autocomplete from '@mui/material/Autocomplete';
import { Label } from '@mui/icons-material';

const PriceRoomEmpty = {
    "_id": "",
    "hour": "",
    "price": "",
    "idRoom": ""
}


export const CreateOrEdit = ({ isEdit, setEdit, setPriceRooms, currentPriceRoom, setCurrentPriceRoom }) => {

    const [formSubmitted, setFormSubmitted] = useState(false);
    const [modal, setModal] = useState(false);
    const [disabledButton, setdisabledButton] = useState(false);
    const [rooms, setRooms] = useState();
    const [selectRooms, setSelectRooms] = useState();

    const formValidations = {
        hour: [(value) => value.length >= 1 && !isNaN(value), 'Es obligatorio. No se puede ingresar letras.'],
        price: [(value) => value.length >= 1 && !isNaN(value), 'Es obligatorio. No se puede ingresar letras.'],
    }

    const {
        isFormValid, hour, hourValid, price, priceValid, onInputChange
    } = useForm(currentPriceRoom, formValidations);

    useEffect(() => {
        getRooms();
    }, [])

    const getRooms = async () => {
        await getAllRooms()
            .then(({ rooms }) => {
                setRooms(rooms)
            })
            .catch((e) => {
                console.log(e.message)
            })
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const id = toast.loading("Validando formulario...")
        try {
            setFormSubmitted(true);
            
            if (!isFormValid) {
                toast.dismiss(id);
                return;
            }
            setdisabledButton(true);
            
            if (currentPriceRoom._id.length > 1) {
                const { success } = await updatePriceRoom(currentPriceRoom._id, hour, price);

                if (!success) {
                    toast.dismiss(id);
                    return;
                }
                toast.update(id, { render: "Precio modificado", type: "success", isLoading: false, autoClose: 2000 });
            } else {
                console.log(rooms);
                const { success } = await createPriceRoom(selectRooms, hour, price);

                if (!success) {
                    toast.dismiss(id);
                    return;
                }
                toast.update(id, { render: "Precio creado", type: "success", isLoading: false, autoClose: 2000 });

            }
            setCurrentPriceRoom(PriceRoomEmpty);
            reset();

        } catch (e) {
            setdisabledButton(false);
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
        console.log(currentPriceRoom);
        setModal(true);
    }

    const handleClose = () => {
        setModal(false);
    }

    const refreshList = async () => {

        await getAllPriceRooms()
        .then(({ priceRooms }) => {
    
          // Transformar los datos para la exportación CSV
          const transformedPriceRooms = priceRooms.map((priceRoom) => {
    
            return {
              ...priceRoom,
              roomID: priceRoom.roomID.name || "",
              idRoom: priceRoom.roomID._id,
              hour: priceRoom.hour,
              price: priceRoom.price,
            };
          });
          
          setPriceRooms(transformedPriceRooms);
          console.log(priceRooms);
        })
        .catch((e) => {
          console.log(e.message);
        });
    }

    return (
        <>
            <Button disabled={!isEdit} onClick={handleOpen}>CREAR PRECIO</Button>
            <Button disabled={isEdit} onClick={handleOpen}>Editar</Button>
            <Dialog open={modal} onClose={handleClose}>
                <form onSubmit={handleSubmit}>
                    <>
                        {
                            isEdit &&
                            <DialogTitle><Typography color='primary.main' sx={{ ml: 1 }}>NUEVO PRECIO SALA</Typography></DialogTitle>

                        }
                        {
                            isEdit === false &&
                            <DialogTitle><Typography color='primary.main' sx={{ ml: 1, textTransform: 'uppercase' }}>MODIFICAR {currentPriceRoom.roomID}</Typography></DialogTitle>

                        }
                    </>
                    <DialogContent>
                        <Grid container>
                            <> {isEdit &&
                                <Grid visibility={!isEdit} item xs={12} sx={{ mt: 2 }}>
                                    <Autocomplete
                                        disablePortal
                                        fullWidth
                                        id="combo-box-demo"
                                        options={rooms}
                                        getOptionLabel={(rooms) => rooms.name.toString()}
                                        renderInput={(params) => <TextField {...params} label="Seleccionar sala" />}
                                        name="client"
                                        onChange={(event, value) => setSelectRooms(value._id)}
                                    />
                                </Grid>
                            }

                            </>

                            <Grid item xs={12} sx={{ mt: 2 }}>
                                <TextField
                                    label="Horas"
                                    type="text"
                                    fullWidth
                                    name="hour"
                                    value={hour}
                                    onChange={onInputChange}
                                    error={!!hourValid && formSubmitted}
                                    helperText={hourValid}
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
