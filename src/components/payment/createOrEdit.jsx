import React, { useEffect, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, FormLabel, Grid, Radio, RadioGroup, TextField, Typography } from '@mui/material';
import { useForm } from '../../hooks/useForm';
import { getAllPaymentsFilter, getStats, updatePayment, getAll } from "../../services/payment.service";
import { toast } from 'react-toastify';
import { FormControl } from '@mui/base';

const PaymentEmpty = { 
    "_id": "",
    "client": "",
    "means_of_payment": "",
    "total": "",
    "paid": "",
    "created": ""
}

export const CreateOrEdit = ({ isEdit, setEdit, setPayments, currentPayment, setCurrentPayment }) => {

    const [formSubmitted, setFormSubmitted] = useState(false);
    const [modal, setModal] = useState(false);
    const [disabledButton, setdisabledButton] = useState(false);
    const [assistance, setAssistance] = React.useState('Individual');

    const formValidations = {
    }

    const {
        total, paid, status, created, onInputChange
    } = useForm(currentPayment, formValidations);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const id = toast.loading("Validando formulario...")
        try {
            setFormSubmitted(true);

            if (currentPayment._id.length > 1) {
                const { success } = await updatePayment(currentPayment._id, paid);
                if (!success) {
                    toast.dismiss(id);
                    return;
                }
                toast.update(id, { render: "Registro modificado", type: "success", isLoading: false, autoClose: 2000 });
            } 
            setCurrentPayment(PaymentEmpty);
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
        setModal(true);
    }

    const handleClose = () => {
        setModal(false);
    }

    const refreshList = () => {

        getAll()
            .then(({ payments }) => {
                setPayments(payments)
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
                                    label="Total"
                                    type="text"
                                    fullWidth
                                    name="total"
                                    value={total}
                                    onChange={onInputChange}
                                />
                            </Grid>
                            <Grid item xs={12} sx={{ mt: 2 }}>
                                <TextField
                                    label="Pagado"
                                    type="text"
                                    fullWidth
                                    name="paid"
                                    value={paid}
                                    onChange={onInputChange}
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
