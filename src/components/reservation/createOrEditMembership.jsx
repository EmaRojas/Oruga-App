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
import { createReservation, createReservationMembership, getAllReservations, updateReservation } from '../../services/reservation.service';
import { getMembershipByEmail, consumeHours } from '../../services/membershipByUser.service';

import { DatePicker, DateTimePicker, MobileTimePicker, TimePicker } from '@mui/x-date-pickers';
import { set } from 'react-hook-form';
import { useForm } from '../../hooks/useForm';
import CustomNotification from './CustomNotification';


const ReservationEmpty = {
    "_id": "",
    "roomID": "",
    "priceRoomID": ""
}


export const CreateOrEditMembership = ({ isEdit, setEdit, setReservations, currentReservation, setCurrentReservation }) => {

    const [formSubmitted, setFormSubmitted] = useState(false);
    const [modal, setModal] = useState(false);
    const [disabledButton, setdisabledButton] = useState(false);

    const [clients, setClients] = useState({});
    const [membership, setMembership] = useState({});
    const [priceRooms, setPriceRooms] = useState({});
    const [startHour, setStartHour] = useState(dayjs());
    const [validStartHour, setValidStartHour] = useState('Es obligatorio');
    const [endDateTime, setEndDateTime] = useState(dayjs());
    const [startDateTime, setStartDateTime] = useState(dayjs());

    const [endHour, setEndHour] = useState(dayjs());
    const [validEndHour, setValidEndHour] = useState('Es obligatorio');
    const [client, setClient] = useState('');
    const [validClient, setValidClient] = useState('Es obligatorio');
    const [roomId, setRoomId] = useState('');

    const [selectedPriceRoom, setSelectedPriceRoom] = useState('');
    const [selectedRoom, setSelectedRoom] = useState('');
    const [membershipName, setMembershipName] = useState('');
    const [membershipId, setMembershipId] = useState('');

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

    const [loadingMembership, setLoadingMembership] = useState(false);

    const handleAutocompleteChange = async (event, value) => {
        if (value !== null) {
            setClient(value._id);
            setValidClient(null);
            setLoadingMembership(true);

            try {
                const { memberships } = await getMembershipByEmail(value.email);
                const membership = memberships[0];

                if (membership && membership.membershipID.name.length >= 5) {
                    setMembershipName(membership.membershipID.name);
                    setRoomId(membership.roomID._id);
                    setRoomName(membership.roomID.name);
                    setMembershipId(membership._id);
                } else {
                    setMembershipName('El cliente seleccionado no tiene membresía.');
                }
            } catch (e) {
                console.log(e.message);
            } finally {
                setLoadingMembership(false);
            }
        } else {
            setValidClient('Es obligatorio');
            setMembershipName(''); // Limpiar el valor de membershipName cuando no se selecciona un cliente
        }
    };

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
 const handleEndHourChange = (value) => {
     if (value !== null) {
         const selectedHour = value.hour().toString().padStart(2, '0');
         const selectedMinutes = value.minute().toString().padStart(2, '0');
         const date = new Date(endDate);
         setEndHour(selectedHour + ":" + selectedMinutes);
         date.setHours(selectedHour);
         date.setMinutes(selectedMinutes);
         setEndDateTime(date);
         setValidEndHour(null);
     } else {
         setValidEndHour('Es obligatorio');
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

            if (currentReservation._id.length < 1 && (client === '' || endDate === '')) {
                if (endDate === '') {
                    setValidEndDate('Es obligatorio');
                }

                toast.dismiss(id);
                setdisabledButton(false);
                toast.error("Formulario incorrecto")
                return;
            }
            if (currentReservation._id.length > 1) {
                const date = dayjs(endDate).format('YYYY-MM-DD');
                const time = dayjs(endDate).format('HH:mm');
                const { success } = await updateReservation(client, endDate, date, time, paymentMethod, total, paid );

                if (!success) {
                    toast.dismiss(id);
                    return;
                }
                toast.update(id, { render: "Se actualizó la reserva", type: "success", isLoading: false, autoClose: 2000 });
            } else {
                debugger
                //console.log(selectedMembership);
                const date = dayjs(endDate).format('YYYY-MM-DD');
                const time = dayjs(endDate).format('HH:mm');
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
                console.log(membership);

                var endTimeString = ("0" + endTime.getHours()).slice(-2) + ":" + ("0" + endTime.getMinutes()).slice(-2);
                console.log(startHour);
                console.log(endHour);
                console.log(roomId);

                const { success } = await createReservationMembership(client, date, startDateTime, endDateTime, startHour, endHour, roomId, note);

                // Supongamos que tienes dos objetos Dayjs: startTime y endTime
                const startTime = dayjs(startDateTime);
                const endTime2 = dayjs(endDateTime);

                // Calcular la diferencia de tiempo en minutos
                const differenceInMinutes = endTime2.diff(startTime, 'minute');

                // Convertir los minutos a horas y minutos
                const hours = Math.floor(differenceInMinutes / 60);
                const minutes = differenceInMinutes % 60;

                // Formato para expresar la diferencia en el formato que mencionaste (X.Y)
                const formattedDifference = parseFloat(`${hours}.${minutes}`).toFixed(1);
                var member = "";
                const { success2 } = await consumeHours(membershipId, formattedDifference, startDateTime, endDateTime, member);

                if (!success) {
                    toast.dismiss(id);
                    return;
                }

                const variableSala = 'Sala 1';
                const variableFecha = '2023-09-11';
                const variableHoraInicio = '15:00';
                const variableHoraFin = '17:00';

                toast.update(id, {
                    render: <CustomNotification sala={roomName} fecha={date} horaInicio={startHour} horaFin={endHour}/>,
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
                        statusEmoji: reservation.paymentID ? "🔑 Reserva" : "⭐ Membresía"

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
            <Button disabled={!isEdit} onClick={handleOpen}>NUEVA RESERVA CON MEMBRESÍA</Button>
            {/* <Button disabled={isEdit} onClick={handleOpen}>EDITAR</Button> */}
            <Dialog open={modal} onClose={handleClose}>
                <form onSubmit={handleSubmit}>
                    <DialogTitle>
                        <Typography hidden={!isEdit} color='primary.main' sx={{ ml: 1 }}>NUEVA RESERVA CON MEMBRESÍA</Typography>
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
                            <Grid item xs={12} sx={{ mt: 4 }}>
                                <Typography>{membershipName}</Typography>
                            </Grid>

                            <Grid item xs={12} md={12} sx={{ mt: 2 }}>

                            <Grid item xs={12} md={12} sx={{ mt: 2 }}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DemoContainer components={['TimePicker']}>
                                        <DatePicker label="Fecha"
                                            name="endDate"
                                            error={!!validEndDate && formSubmitted}
                                            helperText={validEndDate}
                                            value={endDate}
                                            onChange={(newValue) => handleDateChange(newValue)}
                                        />
                                    </DemoContainer>
                                </LocalizationProvider>
                            </Grid>
                            </Grid>
                            <Grid item xs={12} md={6} sx={{ mt: 2 }}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DemoItem label="Hora inicio">
                                        <TimePicker error={!!validStartHour && formSubmitted} onChange={(newValue) => handleStartHourChange(newValue)}
                                            ampm={false} // Configura el formato de 24 horas
                                            views={['hours', 'minutes']} // Muestra solo las vistas de horas y minutos
                                            minTime={dayjs().set('hour', 7).set('minute', 59)} 
                                            maxTime={dayjs().set('hour', 23).set('minute', 0)}
                                        />
                                    </DemoItem>
                                </LocalizationProvider>
                            </Grid>
                            <Grid item xs={12} md={6} sx={{ mt: 2 }}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DemoItem label="Hora fin">
                                        <TimePicker error={!!validEndHour && formSubmitted} onChange={(newValue) => handleEndHourChange(newValue)}
                                            ampm={false} // Configura el formato de 24 horas
                                            views={['hours', 'minutes']} // Muestra solo las vistas de horas y minutos
                                            minTime={dayjs().set('hour', 7).set('minute', 59)} // Establece la hora mínima a las 8:00 AM
                                            maxTime={dayjs().set('hour', 23).set('minute', 0)}
                                        />
                                    </DemoItem>
                                </LocalizationProvider>
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
