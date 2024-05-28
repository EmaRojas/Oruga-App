import React, { useEffect, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, Input, InputAdornment, InputLabel, OutlinedInput, Slider, TextField, Typography } from '@mui/material';
import { toast } from 'react-toastify';
import Autocomplete from '@mui/material/Autocomplete';
import { getAll } from "../../services/client.service";
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { FormControlLabel, FormLabel, FormControl, Radio, RadioGroup, MenuItem, Select } from '@mui/material';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import 'dayjs/locale/es'; // Asegúrate de importar el locale que necesitas
import { createReservation, getAllReservations, updateReservation } from '../../services/reservation.service';

import { DateTimePicker, TimePicker, DatePicker } from '@mui/x-date-pickers';

import { set } from 'react-hook-form';
import { useForm } from '../../hooks/useForm';
import CustomNotification from './CustomNotification';


const ReservationEmpty = {
    "_id": "",
    "room": "",
    "note": "",
    "billing": "No factura",
    "paymentMethod": "Efectivo"
}



export const CreateOrEdit = ({ isEdit, setEdit, setReservations, currentReservation, setCurrentReservation }) => {
    dayjs.extend(utc);
    dayjs.extend(timezone);
    dayjs.tz.setDefault('America/Buenos_Aires');

    const [formSubmitted, setFormSubmitted] = useState(false);
    const [modal, setModal] = useState(false);
    const [disabledButton, setdisabledButton] = useState(false);
    const [clients, setClients] = useState([]);
    const [client, setClient] = useState('');
    const [validClient, setValidClient] = useState('Es obligatorio');
    const [validEndDate, setValidEndDate] = useState('Es obligatorio');

    const formValidations = {
        // note: [(value) => value.length >= 1, 'Es obligatorio.'],
        room: [(value) => value.length >= 1, 'Es obligatorio.'],

    }
    const {
        startDateTime, date, endDateTime, paid, total, room, paymentMethod, billing, paidValid, note, onInputChange,
        isFormValid, noteValid, roomValid
    } = useForm(currentReservation, formValidations);

    const handleAutocompleteChange = (event, value) => {
        if (value !== null) {
            setClient(value._id);
            setValidClient(null);
        } else {
            setValidClient('Es obligatorio');
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

    useEffect(() => {
        getClients();
    }, [])

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


            if (currentReservation._id.length < 1 && (client === '')) {
                toast.dismiss(id);
                setdisabledButton(false);
                toast.error("Formulario incorrecto")
                return;
            }
            if (currentReservation._id.length > 1) {
                debugger

                const dateString = dayjs(date).format('DD [de] MMMM');
                const startTimeString = dayjs(startDateTime).format('HH:mm');
                const endTimeString = dayjs(endDateTime).format('HH:mm');

                // Suponiendo que startDateTime y endDateTime son strings en un formato compatible con Day.js, como 'YYYY-MM-DDTHH:mm:ss'
                const startDateTimeDayjs = dayjs(startDateTime);
                const endDateTimeDayjs = dayjs(endDateTime);
                const dateDayJs = dayjs(date);

                // Obtener la hora, minutos y segundos de 'nuevaHora'
                const hora = startDateTimeDayjs.hour();
                const minutos = startDateTimeDayjs.minute();
                const segundos = startDateTimeDayjs.second();


                // Asignar la hora, minutos y segundos a 'fechaOriginal' mientras se conserva la fecha
                dateDayJs.hour(hora);
                dateDayJs.minute(minutos);
                dateDayJs.second(segundos);
                const newDateTime = dateDayJs.hour(hora).minute(minutos).second(segundos);

                // Obtener la hora, minutos y segundos de 'nuevaHora'
                const newEndDateTime = dateDayJs;
                const horaEnd = endDateTimeDayjs.hour();
                const minutosEnd = endDateTimeDayjs.minute();
                const segundosEnd = endDateTimeDayjs.second();

                // Asignar la hora, minutos y segundos a 'fechaOriginal' mientras se conserva la fecha
                newEndDateTime.hour(horaEnd);
                newEndDateTime.minute(minutosEnd);
                newEndDateTime.second(segundosEnd);
                const finalEndDateTime = newEndDateTime.hour(horaEnd).minute(minutosEnd).second(segundosEnd);

                const { success } = await updateReservation(currentReservation._id, room, newDateTime, finalEndDateTime, date, dateString, startTimeString, endTimeString, paymentMethod, parseFloat(total) || 0, parseFloat(paid) || 0, billing, note);

                if (!success) {
                    toast.dismiss(id);
                    return;
                }

                toast.update(id, { render: "Se actualizó la reserva", type: "success", isLoading: false, autoClose: 2000 });
                window.location.reload(false);
            } else {

                debugger
                // const dateString = dayjs(date).format('YYYY-DD-MM');
                const dateString = dayjs(date).format('DD [de] MMMM');
                const startTimeString = dayjs(startDateTime).format('HH:mm');
                const endTimeString = dayjs(endDateTime).format('HH:mm');

                // Suponiendo que startDateTime y endDateTime son strings en un formato compatible con Day.js, como 'YYYY-MM-DDTHH:mm:ss'
                const startDateTimeDayjs = dayjs(startDateTime);
                const endDateTimeDayjs = dayjs(endDateTime);
                const dateDayJs = dayjs(date);

                // Obtener la hora, minutos y segundos de 'nuevaHora'
                const hora = startDateTimeDayjs.hour();
                const minutos = startDateTimeDayjs.minute();
                const segundos = startDateTimeDayjs.second();


                // Asignar la hora, minutos y segundos a 'fechaOriginal' mientras se conserva la fecha
                dateDayJs.hour(hora);
                dateDayJs.minute(minutos);
                dateDayJs.second(segundos);
                const newDateTime = dateDayJs.hour(hora).minute(minutos).second(segundos);

                // Obtener la hora, minutos y segundos de 'nuevaHora'
                const newEndDateTime = dateDayJs;
                const horaEnd = endDateTimeDayjs.hour();
                const minutosEnd = endDateTimeDayjs.minute();
                const segundosEnd = endDateTimeDayjs.second();

                // Asignar la hora, minutos y segundos a 'fechaOriginal' mientras se conserva la fecha
                newEndDateTime.hour(horaEnd);
                newEndDateTime.minute(minutosEnd);
                newEndDateTime.second(segundosEnd);
                console.log(paymentMethod);
                console.log(billing);
                console.log("a");


                console.log(newDateTime);
                const finalEndDateTime = newEndDateTime.hour(horaEnd).minute(minutosEnd).second(segundosEnd);
                console.log(finalEndDateTime);
                console.log("a");

                const { success } = await createReservation(client, room, newDateTime, finalEndDateTime, date, dateString, startTimeString, endTimeString, paymentMethod, parseFloat(total) || 0, parseFloat(paid) || 0, billing, note);

                if (!success) {
                    toast.dismiss(id);
                    return;
                }

                toast.update(id, {
                    render: <CustomNotification sala={room} fecha={dateString} horaInicio={startTimeString} horaFin={endTimeString} />,
                    type: 'success',
                    isLoading: false,
                    autoClose: 5000,
                });


            }
            setCurrentReservation(ReservationEmpty);
            reset();
            // Esperar 5 segundos y luego recargar la página
            setTimeout(() => {
                window.location.reload();
            }, 5000);

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
                        room: reservation.room,
                        totalString: reservation.total ? ('$ ' + reservation.paid + ' / $ ' + reservation.total) : "",
                        dateString: reservation.dateString + ' ' + reservation.time + ' - ' + reservation.endTime,
                        date: reservation.date,
                        startDateTime: reservation.startDateTime,
                        endDateTime: reservation.endDateTime,
                        billing: reservation.billing ? reservation.billing : "",
                        total: reservation.total,
                        note: reservation.note,
                        paid: reservation.paid,
                        paymentMethod: reservation.paymentMethod ? reservation.paymentMethod : "",
                        statusEmoji: reservation.membershipID ? "⭐ Membresía" : "🔑 Reserva"
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
        refreshList();
        setModal(false);
        setCurrentReservation(ReservationEmpty);
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
            <> {currentReservation.membershipID == null &&
            <Button disabled={isEdit} onClick={handleOpen}>EDITAR</Button>
            }
            </>            <Dialog open={modal} onClose={handleClose}>
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

                            <Grid item xs={12} md={12} >

                                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
                                    <DemoContainer components={['DatePicker']}>
                                        <DatePicker label="Fecha"
                                            error={!!validEndDate && formSubmitted}
                                            helperText={validEndDate}
                                            id="date"
                                            type="date"
                                            fullWidth
                                            name="date"
                                            className="form-input"
                                            value={dayjs(date)}
                                            onChange={date => onInputChange({ target: { value: date, name: 'date' } })}                                           
                                        />
                                    </DemoContainer>
                                </LocalizationProvider>
                            </Grid>
                            
                            <Grid container>
                                <Grid item xs={12} md={6} sx={{ mt: 1 }}>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DemoContainer components={['TimePicker']}>
                                            <TimePicker label="Hora inicio" error={!!formSubmitted}
                                                ampm={false} // Configura el formato de 24 horas
                                                views={['hours', 'minutes']} // Muestra solo las vistas de horas y minutos
                                                minTime={dayjs().set('hour', 7).set('minute', 59)}
                                                maxTime={dayjs().set('hour', 23).set('minute', 0)}
                                                id="startDateTime"
                                                type="dateTime"
                                                name="startDateTime"
                                                value={dayjs(startDateTime)}
                                                onChange={startDateTime => onInputChange({ target: { value: startDateTime, name: 'startDateTime' } })}
                                            />
                                        </DemoContainer>
                                    </LocalizationProvider>
                                </Grid>
                                <Grid item xs={12} md={6} sx={{ mt: 1 }} >
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DemoContainer components={['TimePicker']}>
                                            <TimePicker label="Hora fin" error={!!formSubmitted}
                                                ampm={false} // Configura el formato de 24 horas
                                                views={['hours', 'minutes']} // Muestra solo las vistas de horas y minutos
                                                minTime={dayjs().set('hour', 7).set('minute', 59)}
                                                maxTime={dayjs().set('hour', 23).set('minute', 0)}
                                                id="endDateTime"
                                                type="dateTime"
                                                name="endDateTime"
                                                value={dayjs(endDateTime)}
                                                onChange={endDateTime => onInputChange({ target: { value: endDateTime, name: 'endDateTime' } })}
                                            />
                                        </DemoContainer>
                                    </LocalizationProvider>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} sx={{ mt: 2 }}>
                                <InputLabel id="demo-simple-select-label">Sala</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    type="text"
                                    fullWidth
                                    name="room"
                                    onChange={onInputChange}
                                    value={room}
                                    displayEmpty
                                    error={!!roomValid && formSubmitted}
                                    helperText={roomValid}
                                >
                                    <MenuItem value={"Alocasia"}>Alocasia</MenuItem>
                                    <MenuItem value={"Bromelia"}>Bromelia</MenuItem>
                                    <MenuItem value={"Peperomia"}>Peperomia</MenuItem>
                                    <MenuItem value={"Begonia"}>Begonia</MenuItem>
                                    <MenuItem value={"Calathea"}>Calathea</MenuItem>
                                    <MenuItem value={"Pothus"}>Pothus</MenuItem>
                                    <MenuItem value={"Pandurata"}>Pandurata</MenuItem>
                                </Select>
                            </Grid>

                            <Grid item xs={12} sx={{ mt: 4 }}>
                                <Typography color='primary.main' sx={{ ml: 1 }}>DETALLE DE PAGO</Typography>

                                <Divider />
                            </Grid>

                            <Grid item xs={12} sx={{ mt: 2 }}>
                                <TextField
                                    label="Total"
                                    type="text"
                                    fullWidth
                                    name="total"
                                    onChange={onInputChange}
                                    value={total}
                                    defaultValue={0}
                                />
                            </Grid>

                            <Grid item xs={12} sx={{ mt: 2 }}>
                                <TextField
                                    label="Abonado"
                                    type="text"
                                    fullWidth
                                    name="paid"
                                    onChange={onInputChange}
                                    value={paid}
                                    defaultValue={0}
                                />
                            </Grid>

                            <Grid item xs={12} sx={{ mt: 2 }}>
                                <FormControl>
                                    <FormLabel id="demo-controlled-radio-buttons-group">Medio de pago</FormLabel>
                                    <RadioGroup
                                        row
                                        aria-labelledby="demo-controlled-radio-buttons-group"
                                        name="paymentMethod"
                                        value={paymentMethod}
                                        onChange={onInputChange}
                                        defaultValue="Efectivo"
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
                                        name="billing"
                                        value={billing}
                                        onChange={onInputChange}
                                        defaultValue="No factura"
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
                                    defaultValue=""
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