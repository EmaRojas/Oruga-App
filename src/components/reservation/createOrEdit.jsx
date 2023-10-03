import React, { useEffect, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, Input, InputAdornment, InputLabel, OutlinedInput, Slider, TextField, Typography } from '@mui/material';
import { getAllPriceRooms } from '../../services/priceRoom.service';
import { toast } from 'react-toastify';
import Autocomplete from '@mui/material/Autocomplete';
import { getAll } from "../../services/client.service";
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { FormControlLabel, FormLabel, FormControl, Radio, RadioGroup } from '@mui/material';
import "dayjs/locale/es";
import dayjs from 'dayjs';
import { createReservation, getAllReservations, updateReservation } from '../../services/reservation.service';

import { DateTimePicker } from '@mui/x-date-pickers';
import { set } from 'react-hook-form';
import { useForm } from '../../hooks/useForm';
import CustomNotification from './CustomNotification';


const MembembershipByUserEmpty = {
    "_id": "",
    "endDate": "",
    "client": "",
    "membership": ""
}


export const CreateOrEdit = ({ isEdit, setEdit, setReservations, currentReservation, setCurrentReservation }) => {

    const [formSubmitted, setFormSubmitted] = useState(false);
    const [modal, setModal] = useState(false);
    const [disabledButton, setdisabledButton] = useState(false);

    const [clients, setClients] = useState({});
    const [priceRooms, setPriceRooms] = useState({});

    const [client, setClient] = useState('');
    const [validClient, setValidClient] = useState('Es obligatorio');

    const [selectedPriceRoom, setSelectedPriceRoom] = useState('');
    const [selectedRoom, setSelectedRoom] = useState('');

    const [validPriceRoom, setValidPriceRoom] = useState('Es obligatorio');
    const [endDate, setEndDate] = useState('');
    const [validEndDate, setValidEndDate] = useState('Es obligatorio');
    const [roomName, setRoomName] = useState('');

    const [total, setTotal] = useState(0);
    const [hour, setHour] = useState(0);

    const [paymentMethod, setPaymentMethod] = useState('Efectivo');
    const [billing, setBilling] = useState('No factura');
    const [value, setValue] = React.useState(0.00);

    const formValidations = {
        //paid: [(value) => value.length >= 1 && !isNaN(value), 'Es obligatorio. No se puede ingresar letras.'],
    }

    const {
        isFormValid, paid, paidValid, note, onInputChange
    } = useForm(currentReservation, formValidations);



    const handleChange = (event) => {
        setPaymentMethod(event.target.value);
    };

    const handleChangeBilling = (event) => {
        setBilling(event.target.value);
    };

    const handleDateChange = (value) => {
        if (value !== null) {
            setEndDate(value);
            setValidEndDate(null);
        } else {
            setValidEndDate('Es obligatorio');
        }
    };

    const handleAutocompleteChange = (event, value) => {
        if (value !== null) {
            setClient(value._id);
            setValidClient(null);
        } else {
            setValidClient('Es obligatorio');
        }
    };

    const handleAutocompletePriceRoom = (event, value) => {
        debugger
        if (value !== null) {

            setSelectedPriceRoom(value._id);
            setSelectedRoom(value.roomID._id);
            setTotal(value.price);
            setHour(value.hour);
            setRoomName(value.roomID.name);

            setValidPriceRoom(null);

        } else {
            setValidPriceRoom('Es obligatorio');
            setTotal(0);
        }
    };

    const getClients = async () => {
        await getAll()
            .then(({ clients }) => {
                setClients(clients)
                console.log(clients);

            })
            .catch((e) => {
                console.log(e.message)
            })
    }

    const getPriceRooms = async () => {
        await getAllPriceRooms()
            .then(({ priceRooms }) => {
                setPriceRooms(priceRooms);

            })
            .catch((e) => {
                console.log(e.message)
            })
    }


    useEffect(() => {
        // const tomorrow = dayjs().add(1, 'month');
        // setEndDate(tomorrow);
        getClients();
        getPriceRooms();

    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault();

        const id = toast.loading("Validando formulario...")
        try {
            setdisabledButton(true);
            setFormSubmitted(true);

            if (currentReservation._id.length < 1 && (client === '' || endDate === '' || selectedPriceRoom === '')) {
                if (endDate === '') {
                    setValidEndDate('Es obligatorio');
                }

                toast.dismiss(id);
                setdisabledButton(false);
                toast.error("Formulario incorrecto")
                return;
            }
            if (currentReservation._id.length > 1) {
                const date = endDate.format('YYYY-MM-DD');
                const time = endDate.format('HH:mm');
                const { success } = await updateReservation(client, selectedPriceRoom, selectedRoom, endDate, date, time, paymentMethod, total, paid );

                if (!success) {
                    toast.dismiss(id);
                    return;
                }
                toast.update(id, { render: "Se actualizó la reserva", type: "success", isLoading: false, autoClose: 2000 });
            } else {
                //console.log(selectedMembership);
                const date = endDate.format('YYYY-MM-DD');
                const time = endDate.format('HH:mm');
                var endTime = new Date(endDate);

                // Sumar una hora
                endTime.setHours(endTime.getHours() + parseInt(hour));

                // Convertir la fecha a la zona horaria de Argentina (ART) manualmente
                const fechaUtc = new Date(endDate);
                const diferenciaHoraria = -3; // ART está UTC-3
                const fechaArgentina = new Date(fechaUtc.getTime() + diferenciaHoraria * 60 * 60 * 1000);
                console.log(fechaArgentina);
                const fechaUtcEnd = new Date(endTime);
                const fechaArgentinaEnd = new Date(fechaUtcEnd.getTime() + diferenciaHoraria * 60 * 60 * 1000);


                var endTimeString = ("0" + endTime.getHours()).slice(-2) + ":" + ("0" + endTime.getMinutes()).slice(-2);
                const { success } = await createReservation(client, selectedPriceRoom, selectedRoom, fechaArgentina, fechaArgentinaEnd, date, time, endTimeString, paymentMethod, total, parseFloat(paid) || 0, billing, note);

                if (!success) {
                    toast.dismiss(id);
                    return;
                }

                const variableSala = 'Sala 1';
                const variableFecha = '2023-09-11';
                const variableHoraInicio = '15:00';
                const variableHoraFin = '17:00';

                toast.update(id, {
                    render: <CustomNotification sala={roomName} fecha={date} horaInicio={time} horaFin={endTimeString}/>,
                    type: 'success',
                    isLoading: false,
                    autoClose: 5000,
                  });


            }

            reset();
        } catch (e) {
            toast.dismiss(id);
            console.log(e.message);
        }
    }

    const refreshList = async () => {

        await getAllReservations()
            .then(({ reservations }) => {

                // Transformar los datos para la exportación CSV
                const transformedReservations = reservations.map((reservation) => {

                    return {
                        ...reservation,
                        clientID: reservation.clientID.full_name || "",
                        roomID: reservation.roomID ? reservation.roomID.name : "",
                        total: reservation.paymentID ? ('$ ' + reservation.paymentID.paid + ' / $ ' +reservation.paymentID.total) : "",
                        date: reservation.date + ' ' + reservation.time + ' - ' + reservation.endTime,
                        billing: reservation.billing ? reservation.billing : "",
                        note: reservation.note
                    };
                });

                setReservations(transformedReservations);
            })
            .catch((e) => {
                console.log(e.message);
            });
    }

    const reset = () => {
        setdisabledButton(false);
        setFormSubmitted(false);
        setEdit(true);
        setTotal(0);
        refreshList();
        setModal(false);
    }

    const handleOpen = () => {
        setModal(true);
    }

    const handleClose = () => {
        setModal(false);
        reset();
    }


    return (
        <>
            <Button disabled={!isEdit} onClick={handleOpen}>NUEVA RESERVA</Button>
            {/* <Button disabled={isEdit} onClick={handleOpen}>EDITAR</Button> */}
            <Dialog open={modal} onClose={handleClose}>
                <form onSubmit={handleSubmit}>
                    <DialogTitle>
                        <Typography hidden={!isEdit} color='primary.main' sx={{ ml: 1 }}>NUEVA RESERVA</Typography>
                        <Typography hidden={isEdit} color='primary.main' sx={{ ml: 1 }}>EDITAR RESERVA</Typography>
                        <Divider />
                    </DialogTitle>

                    <DialogContent>
                        <Grid container>
                            <Grid item xs={12} sx={{ mt: 2 }}>
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    options={clients}
                                    getOptionLabel={(clients) => clients.full_name.toString()}
                                    renderInput={(params) => <TextField {...params} label="Seleccionar cliente"
                                        name='client' error={!!validClient && formSubmitted}
                                        helperText={validClient} />}
                                    name="client"
                                    onChange={handleAutocompleteChange}
                                />
                            </Grid>
                            {/* <Grid item xs={12} md={12} sx={{ mt: 2 }}>
                                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
                                    <DemoItem components={['DatePicker']}>
                                        <DatePicker label="Vencimiento"
                                            name="endDate"
                                            error={!!validEndDate && formSubmitted}
                                            helperText={validEndDate}
                                            value={endDate}
                                            onChange={(newValue) => handleDateChange(newValue)}
                                        />
                                    </DemoItem>
                                </LocalizationProvider>

                            </Grid> */}

                            <Grid item xs={12} sx={{ mt: 2 }}>

                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DemoContainer components={['DateTimePicker']}>
                                    <DateTimePicker label="Fecha y hora"
                                            name="endDate"
                                            error={!!validEndDate && formSubmitted}
                                            helperText={validEndDate}
                                            value={endDate}
                                            onChange={(newValue) => handleDateChange(newValue)}
                                    />
                                </DemoContainer>
                            </LocalizationProvider>
                            </Grid>

                            <Grid item xs={12} sx={{ mt: 2 }}>

                                <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    options={priceRooms}
                                    getOptionLabel={(priceRoom) => `${priceRoom.roomID.name.toString()} (${priceRoom.hour.toString()} hs)`}
                                    renderInput={(params) => <TextField {...params} label="Seleccionar sala"
                                        name='priceRooms' error={!!validPriceRoom && formSubmitted}
                                        helperText={validPriceRoom} />}
                                    name="memberships"
                                    onChange={handleAutocompletePriceRoom}
                                />
                            </Grid>
                            <Grid item xs={12} sx={{ mt: 4 }}>
                                <Typography color='primary.main' sx={{ ml: 1 }}>DETALLE DE PAGO</Typography>

                                <Divider />
                            </Grid>
                            <Grid item xs={12} sx={{ mt: 2 }}>
                                <FormControl fullWidth>
                                    <InputLabel htmlFor="outlined-adornment-amount">Total</InputLabel>
                                    <OutlinedInput
                                        disabled
                                        id="outlined-adornment-amount"
                                        startAdornment={<InputAdornment position="start">$</InputAdornment>}
                                        label="Amount"
                                        value={total}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sx={{ mt: 2 }}>
                                <TextField
                                    label="Pagado"
                                    type="text"
                                    fullWidth
                                    name="paid"
                                    value={paid}
                                    onChange={onInputChange}
                                    error={!!paidValid && formSubmitted}
                                    helperText={paidValid}
                                    
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
                                        <FormControlLabel value="Transferencia" control={<Radio />} label="Transferencia" />
                                        <FormControlLabel value="Mercado Pago" control={<Radio />} label="Mercado Pago" />
                                        <FormControlLabel value="Tarjeta" control={<Radio />} label="Tarjeta" />

                                    </RadioGroup>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sx={{ mt: 2 }}>
                                <FormControl>
                                    <FormLabel id="demo-controlled-radio-buttons-group">Facturación</FormLabel>
                                    <RadioGroup
                                        row
                                        aria-labelledby="demo-controlled-radio-buttons-group"
                                        name="controlled-radio-buttons-group"
                                        value={billing}
                                        onChange={handleChangeBilling}
                                    >
                                        <FormControlLabel value="No factura" control={<Radio />} label="No factura" />
                                        <FormControlLabel value="Factura A" control={<Radio />} label="Factura A" />
                                        <FormControlLabel value="Factura B" control={<Radio />} label="Factura B" />
                                    </RadioGroup>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sx={{ mt: 2 }}>
                                <TextField
                                    label="Nota"
                                    type="text"
                                    fullWidth
                                    multiline
                                    rows={2}
                                    name="note"
                                    value={note}
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
