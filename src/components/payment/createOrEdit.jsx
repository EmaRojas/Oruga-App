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
    "created": "",
    "billing": ""
}

export const CreateOrEdit = ({ isEdit, setEdit, start, end, setPayments, currentPayment, setCurrentPayment }) => {

    const [formSubmitted, setFormSubmitted] = useState(false);
    const [modal, setModal] = useState(false);
    const [disabledButton, setdisabledButton] = useState(false);
    const [assistance, setAssistance] = React.useState('Individual');
    // const [billing, setBilling] = useState('No factura');

    // const handleChangeBilling = (event) => {
    //     setBilling(event.target.value);
    // };

    const formValidations = {
    }

    const {
        total, paid, status, created, billing, onInputChange
    } = useForm(currentPayment, formValidations);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const id = toast.loading("Validando formulario...")
        try {
            setFormSubmitted(true);

            if (currentPayment._id.length > 1) {
                const { success } = await updatePayment(currentPayment._id, paid, billing);
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

    const refreshList = async () => {
        await getAllPaymentsFilter(start, end)
          .then(({ payments }) => {
      
            // Transformar los datos para la exportación CSV
            const transformedPayments = payments.map((payment) => {
      
               const createdDate = new Date(payment.created);

                // Formatear la fecha en el formato deseado
                const formattedDate = `${createdDate.getFullYear()}-${(createdDate.getMonth() + 1)
                    .toString()
                    .padStart(2, '0')}-${createdDate.getDate().toString().padStart(2, '0')}`;
    
              return {
                ...payment,
                means_of_payment: payment.means_of_payment || "",
                total: payment.total,
                paid: payment.paid,
                created: formattedDate,
                client: payment.clientInfo.full_name,
                billing: payment.billing
              };
            });
            
            setPayments(transformedPayments);
            console.log(payments);
            })
          .catch((e) => {
            console.log(e.message);
          });
      
        setCurrentPayment(PaymentEmpty);
        setEdit(true);
      };

    return (
        <>
            {/* <Button disabled={!isEdit} onClick={handleOpen}>Nuevo</Button> */}
            <Button disabled={isEdit} onClick={handleOpen}>ACTUALIZAR</Button>
            <Dialog open={modal} onClose={handleClose}>
                <form onSubmit={handleSubmit}>
                    <DialogTitle><Typography color='primary.main' sx={{ ml: 1 }}>ACTUALIZAR PAGO</Typography></DialogTitle>
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
                            <Grid item xs={12} sx={{ mt: 2 }}>
                                <FormControl>
                                    <FormLabel id="demo-controlled-radio-buttons-group">Facturación</FormLabel>
                                    <RadioGroup
                                        row
                                        aria-labelledby="demo-controlled-radio-buttons-group"
                                        name="billing"
                                        value={billing}
                                        onChange={onInputChange}
                                    >
                                        <FormControlLabel value="No factura" control={<Radio />} label="No factura" />
                                        <FormControlLabel value="Factura A" control={<Radio />} label="Factura A" />
                                        <FormControlLabel value="Factura B" control={<Radio />} label="Factura B" />
                                        <FormControlLabel value="Factura C" control={<Radio />} label="Factura C" />
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
