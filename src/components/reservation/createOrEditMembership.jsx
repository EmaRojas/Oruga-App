import React, { useEffect, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, Input, InputAdornment, InputLabel, OutlinedInput, Slider, TextField, Typography } from '@mui/material';
import Box, { BoxProps } from '@mui/material/Box';
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
import { createReservation, createReservationMembership, getAllReservations, updateReservation, updateReservationMembership } from '../../services/reservation.service';
import { getMembershipByEmail, consumeHours } from '../../services/membershipByUser.service';

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

function Item(props: BoxProps) {
    const { sx, ...other } = props;
    return (
      <Box
        sx={{
          bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#101010' : '#fff'),
          color: (theme) => (theme.palette.mode === 'dark' ? 'grey.300' : 'grey.800'),
          border: '1px solid',
          borderColor: (theme) =>
            theme.palette.mode === 'dark' ? 'grey.800' : 'grey.300',
          p: 1,
          borderRadius: 2,
          fontSize: '0.825rem',
          fontWeight: '500',
          ...sx,
        }}
        {...other}
      />
    );
  }

export const CreateOrEditMembership = ({ isEdit, setEdit, setReservations, currentReservation, setCurrentReservation }) => {
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
    const [membership, setMembership] = useState(null);
    const [selectedClientTotalHours, setSelectedClientTotalHours] = useState('');
    const [selectedClientRemainingHours, setSelectedClientRemainingHours] = useState('');
    const [clientEmail, setClientEmail] = useState('');
    const formValidations = {
        // note: [(value) => value.length >= 1, 'Es obligatorio.'],
        // room: [(value) => value.length >= 1, 'Es obligatorio.'],

    }
    const {
        startDateTime, date, endDateTime, paid, total, room, paymentMethod, billing, paidValid, note, onInputChange,
        isFormValid, noteValid, roomValid
    } = useForm(currentReservation, formValidations);

    const handleAutocompleteChange = async (event, value) => {
        if (value !== null) {
            debugger
            setClient(value._id);
            const { memberships } = await getMembershipByEmail(value.email);
            setClientEmail(value.email);
            console.log("xd");

            if(memberships.length > 0) {
                setMembership(memberships[0]);
                setSelectedClientTotalHours(convertToHoursMinutes(memberships[0].total_hours));
                setSelectedClientRemainingHours(convertToHoursMinutes(memberships[0].remaining_hours));
            } else {
                setMembership("noMembership");
            }
            setValidClient(null);
        } else {
            setMembership(null);

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

    function convertToHoursMinutes(seconds) {
        const hours1 = Math.floor(seconds / 3600);
        const remainingSeconds = seconds % 3600;
        const minutes = Math.floor(remainingSeconds / 60);

        let remTime;
        if (minutes === 0) {
            remTime = hours1.toString();
        } else {
            remTime = hours1.toString() + ':' + minutes.toString();
        }
        return remTime;
    }
            

    

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

                const { success } = await updateReservationMembership(currentReservation._id, newDateTime, finalEndDateTime, date, dateString, startTimeString, endTimeString, note);

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

                console.log(newDateTime);
                const finalEndDateTime = newEndDateTime.hour(horaEnd).minute(minutosEnd).second(segundosEnd);
                console.log(finalEndDateTime);
                console.log("a");

                const { success } = await createReservationMembership(client, membership._id, membership.room, newDateTime, finalEndDateTime, date, dateString, startTimeString, endTimeString, membership.paymentMethod, parseFloat(membership.total) || 0, parseFloat(membership.paid) || 0, membership.billing, note);

                if (!success) {
                    toast.dismiss(id);
                    return;
                }

                const membershipsResponse = await getMembershipByEmail(clientEmail);
                let membership2;
                
                if (membershipsResponse.memberships && membershipsResponse.memberships.length > 0) {
                    membership2 = membershipsResponse.memberships[0];
                }
                const remainingHours = membership2.remaining_hours;
                function convertToHoursMinutes(seconds) {
                    const hours1 = Math.floor(seconds / 3600);
                    const remainingSeconds = seconds % 3600;
                    const minutes = Math.floor(remainingSeconds / 60);
                    return { hours1, minutes };
                }

                const { hours1, minutes } = convertToHoursMinutes(remainingHours);

                let remTime;
                if (minutes === 0) {
                    remTime = hours1.toString();
                } else {
                    remTime = hours1.toString() + ':' + minutes.toString();
                }
                toast.update(id, {
                    render: <CustomNotification sala={membership.room} fecha={dateString} horaInicio={startTimeString} horaFin={endTimeString} remaining={remTime}/>,
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
        setMembership(null);
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
            <> {currentReservation.membershipID != null &&
            <Button disabled={isEdit} onClick={handleOpen}>EDITAR</Button>
            }
            </>
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

                            <>
                                {membership !== null && membership !== "noMembership" && (
                                    <Grid item xs={12} sx={{ mt: 2, mb: 2 }}>
                                        <Box
                                            sx={{
                                                display: 'grid',
                                                gap: 1,
                                                gridTemplateColumns: 'repeat(2, 1fr)',
                                            }}
                                        >
                                            <Item>Membresía {membership.room + " " + selectedClientTotalHours} horas</Item>
                                            <Item>{selectedClientRemainingHours} horas restantes</Item>
                                        </Box>
                                    </Grid>
                                )}
                                {membership === "noMembership" && (
                                    <Grid item xs={12} sx={{ mt: 2, mb: 2 }}>
                                        <Box
                                            sx={{
                                                display: 'grid',
                                                gap: 1,
                                                gridTemplateColumns: 'repeat(1, 1fr)',
                                            }}
                                        >
                                            <Item>El cliente seleccionado no tiene membresía activa.</Item>
                                        </Box>
                                    </Grid>
                                )}
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


                            <Grid item xs={12} sx={{ mt: 4 }}>
                                <Typography color='primary.main' sx={{ ml: 1 }}>NOTA</Typography>

                                <Divider />
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