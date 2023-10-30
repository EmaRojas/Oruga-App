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

import { DateTimePicker, TimePicker, DatePicker } from '@mui/x-date-pickers';

import { set } from 'react-hook-form';
import { useForm } from '../../hooks/useForm';
import CustomNotification from './CustomNotification';


const ReservationEmpty = {
    "_id": "",
    "roomID": "",
    "priceRoomID": "",
    "full_name" : ""
  }
  


export const CreateOrEdit = ({ isEdit, setEdit, setReservations, currentReservation, setCurrentReservation }) => {
    dayjs.locale('es')

    const [formSubmitted, setFormSubmitted] = useState(false);
    const [modal, setModal] = useState(false);
    const [disabledButton, setdisabledButton] = useState(false);
    const [startDateTime, setStartDateTime] = useState(dayjs());

    const [clients, setClients] = useState([]);
    const [priceRooms, setPriceRooms] = useState({});
    const [validStartHour, setValidStartHour] = useState('Es obligatorio');
    const [startHour, setStartHour] = useState(dayjs());
    const [selectedTime, setSelectedTime] = useState(dayjs());
    const [selectedDateTime, setSelectedDateTime] = useState(dayjs());

    const [client, setClient] = useState('');
    const [validClient, setValidClient] = useState('Es obligatorio');

    const [selectedPriceRoom, setSelectedPriceRoom] = useState('');
    const [selectedRoom, setSelectedRoom] = useState('');

    const [validPriceRoom, setValidPriceRoom] = useState('Es obligatorio');
    const [endDate, setEndDate] = useState('');
    const [validEndDate, setValidEndDate] = useState('Es obligatorio');
    const [roomName, setRoomName] = useState('');
    const [discount, setDiscount] = useState('Ninguno');
    const [total, setTotal] = useState(0);
    const [newTotal, setNewTotal] = useState(0);

    const [hour, setHour] = useState(0);

    const [paymentMethod, setPaymentMethod] = useState('Efectivo');
    const [billing, setBilling] = useState('No factura');
    const [value, setValue] = React.useState(0.00);

    const formValidations = {
        //paid: [(value) => value.length >= 1 && !isNaN(value), 'Es obligatorio. No se puede ingresar letras.'],
    }

    const handleStartHourChange = (value) => {
        if (value !== null) {
            const selectedHour = value.hour().toString().padStart(2, '0');
            const selectedMinutes = value.minute().toString().padStart(2, '0');
            const date = new Date(endDate);
            setStartHour(selectedHour + ":" + selectedMinutes);
            date.setHours(selectedHour);
            date.setMinutes(selectedMinutes);
            setStartDateTime(date);
            setValidStartHour(null);
        } else {
            setValidStartHour('Es obligatorio');
        }
    };


    const {
        isFormValid, paid, paidValid, note, onInputChange
    } = useForm(currentReservation, formValidations);

        
    // const [selectedDateTime, setSelectedDateTime] = useState(dayjs(currentReservation.dateTime) || dayjs());
    // const [selectedTime, setSelectedTime] = useState(dayjs(currentReservation.dateTime) || dayjs());
    const [selectedPriceRoomName, setSelectedPriceRoomName] = useState('');

    const [selectedClient, setSelectedClient] = useState(currentReservation.clientID || '');

    useEffect(() => {
        // ...
        // Inicializa el estado selectedDateTime con el valor de currentReservation.dateTime
        if(currentReservation._id.length > 1 && currentReservation.priceRoomID) {
            debugger
            setSelectedDateTime(dayjs(currentReservation.dateTime).add(3, 'hour'));
            setSelectedTime(dayjs(currentReservation.dateTime).add(3, 'hour'));
            setSelectedPriceRoomName(currentReservation.roomID + ' (' + currentReservation.priceRoomID.hour + ' hs)');
            setTotal(currentReservation.priceRoomID.price);
            setSelectedRoom(currentReservation.priceRoomID.roomID);
            setBilling(currentReservation.billing);
            setPaymentMethod(currentReservation.paymentMethod);
            setHour(currentReservation.priceRoomID.hour);
            setSelectedPriceRoom(currentReservation.priceRoomID._id);
            setNewTotal(currentReservation.paymentID.total);
            console.log(selectedPriceRoomName);
        } else {
            setEdit(true);
            setSelectedTime(dayjs());
            setSelectedDateTime(dayjs());
        }

        console.log("dt " + selectedDateTime);
        console.log("t " + selectedTime);

    }, [currentReservation]);

    const handleChange = (event) => {
        setPaymentMethod(event.target.value);
    };

    const handleChangeBilling = (event) => {
        setBilling(event.target.value);
    };

    const handleDateChange = (value) => {
        debugger
        if (value !== null) {
            setSelectedDateTime(value);
            setValidEndDate(null);
        } else {
            setValidEndDate('Es obligatorio');
        }
    };

    const handleTimeChange = (value) => {
        if (value !== null) {
            const selectedHour = value.hour().toString().padStart(2, '0');
            const selectedMinutes = value.minute().toString().padStart(2, '0');
            const date = new Date(selectedDateTime);
            setStartHour(selectedHour + ":" + selectedMinutes);
            date.setHours(selectedHour);
            date.setMinutes(selectedMinutes);
            setEndDate(date);
            setSelectedTime(dayjs(date));

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
            setNewTotal(value.price);
            setHour(value.hour);
            setRoomName(value.roomID.name);
            setSelectedPriceRoomName(value.roomID.name + ' (' + value.hour + ' hs)')
            setValidPriceRoom(null);
            setDiscount('Ninguno');

        } else {
            setValidPriceRoom('Es obligatorio');
            setTotal(0);
        }
    }

    const handleChangeDiscount = (event) => {
        debugger
        var valor = total;
        setNewTotal(total);
        if(event.target.value === '15% de recargo') {
            setDiscount('15% de recargo');
            valor = parseInt(total) * 1.15;
            console.log(valor);
            setNewTotal(parseInt(valor));
        } 
        if(event.target.value === '15% de descuento') {
            setDiscount('15% de descuento');
            valor = parseInt(total) * 0.85;
            console.log(valor);
            setNewTotal(parseInt(valor));
        } 
        if(event.target.value === 'Ninguno') {
            setDiscount('Ninguno');
            setNewTotal(total);
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
            debugger
            setdisabledButton(true);
            setFormSubmitted(true);

            if (currentReservation._id.length < 1 && (client === '' || selectedPriceRoom === '')) {
                if (endDate === '' || selectedDateTime == null || selectedTime == null) {
                    setValidEndDate('Es obligatorio');
                }

                toast.dismiss(id);
                setdisabledButton(false);
                toast.error("Formulario incorrecto")
                return;
            }
            if (currentReservation._id.length > 1) {
                debugger
                console.log("date " + selectedDateTime);
                console.log("time " + selectedTime);

                // Obtener la hora, minutos y segundos de 'nuevaHora'
                const hora = selectedTime.hour();
                const minutos = selectedTime.minute();
                const segundos = selectedTime.second();

                // Asignar la hora, minutos y segundos a 'fechaOriginal' mientras se conserva la fecha
                selectedDateTime.hour(hora);
                selectedDateTime.minute(minutos);
                selectedDateTime.second(segundos);
                const newDateTime = selectedDateTime.hour(hora).minute(minutos).second(segundos);

                console.log(selectedDateTime);
                const date =  dayjs(newDateTime).format('YYYY-MM-DD');
                const time =  dayjs(newDateTime).format('HH:mm');
                var endTime = new Date(newDateTime);
                // Sumar una hora
                endTime.setHours(endTime.getHours() + parseInt(hour));


                // Convertir la fecha a la zona horaria de Argentina (ART) manualmente
                const diferenciaHoraria = -3; // ART está UTC-3
                const fechaUtcStart = new Date(newDateTime);
                const fechaArgentinaStart = new Date(fechaUtcStart.getTime() + diferenciaHoraria * 60 * 60 * 1000);

                // Convertir la fecha a la zona horaria de Argentina (ART) manualmente
                const fechaUtcEnd = new Date(endTime);
                const fechaArgentinaEnd = new Date(fechaUtcEnd.getTime() + diferenciaHoraria * 60 * 60 * 1000);


                var endTimeString = ("0" + endTime.getHours()).slice(-2) + ":" + ("0" + endTime.getMinutes()).slice(-2);
                const { success } = await updateReservation(currentReservation._id, selectedPriceRoom, selectedRoom, fechaArgentinaStart, fechaArgentinaEnd, date, time, endTimeString, paymentMethod, newTotal, parseFloat(paid) || 0, billing, note);

                if (!success) {
                    toast.dismiss(id);
                    return;
                }

                toast.update(id, { render: "Se actualizó la reserva", type: "success", isLoading: false, autoClose: 2000 });
                window.location.reload(false);
            } else {
                console.log("date " + selectedDateTime);
                console.log("time " + selectedTime);

                const date =  dayjs(selectedDateTime).format('YYYY-MM-DD');
                const time =  dayjs(selectedTime).format('HH:mm');
                var endTime = new Date(selectedTime);
                // Sumar una hora
                endTime.setHours(endTime.getHours() + parseInt(hour));


                // Convertir la fecha a la zona horaria de Argentina (ART) manualmente
                const diferenciaHoraria = -3; // ART está UTC-3
                const fechaUtcStart = new Date(selectedTime);
                const fechaArgentinaStart = new Date(fechaUtcStart.getTime() + diferenciaHoraria * 60 * 60 * 1000);

                // Convertir la fecha a la zona horaria de Argentina (ART) manualmente
                const fechaUtcEnd = new Date(endTime);
                const fechaArgentinaEnd = new Date(fechaUtcEnd.getTime() + diferenciaHoraria * 60 * 60 * 1000);


                var endTimeString = ("0" + endTime.getHours()).slice(-2) + ":" + ("0" + endTime.getMinutes()).slice(-2);
                const { success } = await createReservation(client, selectedPriceRoom, selectedRoom, fechaArgentinaStart, fechaArgentinaEnd, date, time, endTimeString, paymentMethod, newTotal, parseFloat(paid) || 0, billing, note);

                if (!success) {
                    toast.dismiss(id);
                    return;
                }

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
                        note: reservation.note,
                        paid: reservation.paymentID.paid,
                        paymentMethod: reservation.paymentID.means_of_payment
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
        setSelectedDateTime(null);
        setSelectedTime(null);
        setCurrentReservation(ReservationEmpty);
        setSelectedPriceRoomName('');
        setPaymentMethod('Efectivo');
        setDiscount('Ninguno');
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
            <Button disabled={isEdit} onClick={handleOpen}>EDITAR</Button>
            <Dialog open={modal} onClose={handleClose}>
                <form onSubmit={handleSubmit}>
                    <DialogTitle>
                        <Typography hidden={!isEdit} color='primary.main' sx={{ ml: 1 }}>NUEVA RESERVA</Typography>
                        <Typography hidden={isEdit} color='primary.main' sx={{ ml: 1 }}>EDITAR RESERVA</Typography>
                        <Divider />
                    </DialogTitle>

                    <DialogContent>
                        <Grid container>
                        <> {isEdit &&
                            <Grid item xs={12} sx={{ mt: 2 }}>
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    options={clients}
                                    getOptionLabel={(clients) => clients?.full_name.toString()}
                                    renderInput={(params) => <TextField {...params} label="Seleccionar cliente"
                                        name='client' error={!!validClient && formSubmitted}
                                        helperText={validClient} />}
                                    name="client"
                                    onChange={handleAutocompleteChange}
                                />
                            </Grid>
                        }
                        </>

                            <Grid item xs={12} md={6} >

                            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
                                <DemoContainer components={['DatePicker']}>
                                    <DatePicker label="Fecha y hora"
                                            name="endDate"
                                            error={!!validEndDate && formSubmitted}
                                            helperText={validEndDate}
                                            value={selectedDateTime} // Usa selectedDateTime en lugar de endDate
                                            onChange={(newValue) => handleDateChange(newValue)}
                                    />
                                </DemoContainer>
                            </LocalizationProvider>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
                                <DemoContainer components={['TimePicker']}>
                                        <TimePicker error={!!validStartHour && formSubmitted} 
                                            ampm={false} // Configura el formato de 24 horas
                                            views={['hours', 'minutes']} // Muestra solo las vistas de horas y minutos
                                            minTime={dayjs().set('hour', 7).set('minute', 59)} 
                                            maxTime={dayjs().set('hour', 23).set('minute', 0)}
                                            value={selectedTime} // Usa selectedDateTime en lugar de endDate
                                            onChange={(newValue) => handleTimeChange(newValue)}
                                        />
                                    </DemoContainer>
                                </LocalizationProvider>
                            </Grid>
                            {/* <Grid item xs={12} sx={{ mt: 2 }}>

                                <Autocomplete
                                disablePortal
                                id="combo-box-demo"
                                options={priceRooms}
                                getOptionLabel={getOptionLabel}
                                renderInput={(params) => <TextField {...params} label="Seleccionar sala"
                                    name='priceRooms' error={!!validPriceRoom && formSubmitted}
                                    helperText={validPriceRoom} />}
                                name="memberships"
                                onChange={handleAutocompletePriceRoom}
                                value={selectedRoomName2 || null}
                                />
                            </Grid> */}
                            <> {!isEdit &&
                                <Grid item xs={12} sx={{ mt: 2 }}>
                                <Typography variant="subtitle1">Sala seleccionada: {selectedPriceRoomName}</Typography>
                            </Grid>
                            }
                            </>

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
                            <> {isEdit &&
                            <Grid item xs={12} sx={{ mt: 2 }}>
                                <FormControl>
                                    <FormLabel id="demo-controlled-radio-buttons-group">Descuento o recargo</FormLabel>
                                    <RadioGroup
                                        row
                                        aria-labelledby="demo-controlled-radio-buttons-group"
                                        name="controlled-radio-buttons-group"
                                        value={discount}
                                        onChange={handleChangeDiscount}
                                    >
                                        <FormControlLabel value="Ninguno" control={<Radio />} label="Ninguno" />
                                        <FormControlLabel value="15% de recargo" control={<Radio />} label="15% de recargo" />
                                        <FormControlLabel value="15% de descuento" control={<Radio />} label="15% de descuento" />
                                    </RadioGroup>
                                </FormControl>
                            </Grid>
                            }
                            </>
                            <Grid item xs={12} sx={{ mt: 2 }}>
                                <FormControl fullWidth>
                                    <InputLabel htmlFor="outlined-adornment-amount">Total</InputLabel>
                                    <OutlinedInput
                                        disabled
                                        id="outlined-adornment-amount"
                                        startAdornment={<InputAdornment position="start">$</InputAdornment>}
                                        label="Amount"
                                        value={newTotal}
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