import React, { useEffect, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, Input, InputAdornment, InputLabel, OutlinedInput, Slider, TextField, Typography } from '@mui/material';
import { getAllMemberships } from '../../services/membership.service';
import { toast } from 'react-toastify';
import Autocomplete from '@mui/material/Autocomplete';
import { getAll } from "../../services/client.service";
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { FormControlLabel, FormLabel, FormControl, Radio, RadioGroup } from '@mui/material';
import "dayjs/locale/es";
import dayjs from 'dayjs';
import { createMembershipByUser, getAllMembershipsByUser, consumeHours } from '../../services/membershipByUser.service';
import { DatePicker } from '@mui/x-date-pickers';
import { set } from 'react-hook-form';



const MembembershipByUserEmpty = {
    "_id": "",
    "endDate": "",
    "client": "",
    "membership": ""
}


export const CreateOrEdit = ({ isEdit, setEdit, setMembershipsByUser, currentMembershipByUser, setcurrentMembershipByUser }) => {

    const [formSubmitted, setFormSubmitted] = useState(false);
    const [modal, setModal] = useState(false);
    const [disabledButton, setdisabledButton] = useState(false);

    const [clients, setClients] = useState({});
    const [memberships, setMemberships] = useState({});

    const [client, setClient] = useState('');
    const [validClient, setValidClient] = useState('Es obligatorio');

    const [selectedMembership, setSelectedMembership] = useState('');
    const [validMembership, setValidMembership] = useState('Es obligatorio');

    const [endDate, setEndDate] = useState('');
    const [validEndDate, setValidEndDate] = useState('Es obligatorio');
    const [total, setTotal] = useState(0);
    const [hours, setHours] = useState(0);

    const [paymentMethod, setPaymentMethod] = useState('Efectivo');

    const [value, setValue] = React.useState(0.00);

    const handleSliderChange = (event, newValue) => {
        const intValue = Math.floor(newValue); // Parte entera
        const decimalValue = newValue % 1; // Parte decimal
        const adjustedDecimal = Math.min(decimalValue, 0.50); // Limitar la parte decimal a 0.6 (60)
        const adjustedValue = intValue + parseFloat(adjustedDecimal.toFixed(2));
        setValue(adjustedValue);
        console.log(value);
    };

    const handleInputChange = (event) => {
        console.log(event.target.value);
        let newValue = event.target.value;
        const intValue = Math.floor(newValue); // Parte entera
        const decimalValue = newValue % 1; // Parte decimal
        const adjustedDecimal = Math.min(decimalValue, 0.50); // Limitar la parte decimal a 0.6 (60)
        const adjustedValue = intValue + parseFloat(adjustedDecimal.toFixed(2));
        setValue(adjustedValue);
      };
    
      const handleBlur = () => {
        if (value < 0) {
          setValue(0);
        } else if (value > 50) {
          setValue(50);
        }
      };

    const handleChange = (event) => {
        setPaymentMethod(event.target.value);
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

    const handleAutocompleteMembership = (event, value) => {
        debugger
        if (value !== null) {
            setTotal(value?.price);
            setHours(value?.hours);
            setSelectedMembership(value._id);

            setValidMembership(null);
        } else {
            setValidMembership('Es obligatorio');
            setTotal(0);
            setHours(0);
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

    const getMemberships = async () => {
        await getAllMemberships()
            .then(({ memberships }) => {
                setMemberships(memberships);

            })
            .catch((e) => {
                console.log(e.message)
            })
    }


    useEffect(() => {
        const tomorrow = dayjs().add(1, 'month');
        setEndDate(tomorrow);
        getClients();
        getMemberships();

    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault();

        const id = toast.loading("Validando formulario...")
        try {
            setdisabledButton(true);
            setFormSubmitted(true);

            if (currentMembershipByUser._id.length < 1 && (client === '' || endDate === '' || selectedMembership === '')) {
                if (endDate === '') {
                    setValidEndDate('Es obligatorio');
                }

                toast.dismiss(id);
                setdisabledButton(false);
                toast.error("Formulario incorrecto")
                return;
            }
            if (currentMembershipByUser._id.length > 1) {
                var valueString = value.toString();
                console.log('value string' + valueString);
                const { success } = await consumeHours(currentMembershipByUser._id, valueString);
                if (!success) {
                    toast.dismiss(id);
                    return;
                }
                toast.update(id, { render: "Se registraron las horas", type: "success", isLoading: false, autoClose: 2000 });
            } else {
                console.log(selectedMembership);
                var hrs = parseInt(hours, 10);
                const { success } = await createMembershipByUser(client, selectedMembership, endDate, hrs, total, paymentMethod);

                if (!success) {
                    toast.dismiss(id);
                    return;
                }
                toast.update(id, { render: "Se activo la membresía", type: "success", isLoading: false, autoClose: 2000 });

            }

            reset();
        } catch (e) {
            toast.dismiss(id);
            console.log(e.message);
        }
    }

    const refreshList = async () => {

        await getAllMembershipsByUser()
            .then(({ membershipsByUser }) => {

                // Transformar los datos para la exportación CSV
                const transformedMemberships = membershipsByUser.map((membership) => {
                    const dateObj = new Date(membership.endDate);
                    const day = dateObj.getDate();
                    const month = dateObj.getMonth() + 1; // Los meses comienzan en 0, por lo que se suma 1

                    const totalSeconds = membership.remaining_hours; // Valor obtenido de la base de datos

                    // Convertir segundos a horas y minutos
                    function convertToHoursMinutes(seconds) {
                      const hours1 = Math.floor(seconds / 3600);
                      const remainingSeconds = seconds % 3600;
                      const minutes = Math.floor(remainingSeconds / 60);
                      return { hours1, minutes };
                    }
        
                    // Convertir segundos a horas y minutos
        
                    const { hours1, minutes } = convertToHoursMinutes(totalSeconds);
                    console.log(hours1, minutes);  // Output: 1 30
                    
                    let remTime;
                    if (minutes === 0) {
                      remTime = hours1.toString();
                    } else {
                      remTime = hours1.toString() + ':' + minutes.toString();
                    }

                    return {
                        ...membership,
                        clientID: membership.clientID.full_name || "",
                        membershipID: membership.membershipID.name,
                        endDate: day + '/' + month,
                        hours: remTime,
                    };
                });

                setMembershipsByUser(transformedMemberships);
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
        setHours(0);
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
            <Button disabled={!isEdit} onClick={handleOpen}>ASIGNAR MEMBRESÍA</Button>
            <Button disabled={isEdit} onClick={handleOpen}>CARGAR HORAS</Button>
            <Dialog open={modal} onClose={handleClose}>
                <form onSubmit={handleSubmit}>
                    <DialogTitle>
                        <Typography hidden={!isEdit} color='primary.main' sx={{ ml: 1 }}>NUEVA MEMBRESÍA ACTIVA</Typography>
                        <Typography hidden={isEdit} color='primary.main' sx={{ ml: 1 }}>CARGAR HORAS</Typography>
                        <Divider />
                    </DialogTitle>
                    <DialogContent hidden={isEdit}>
                        <Grid container>
                            <Grid item xs={7} md={7} sx={{ mt: 2 }}>
                                <Slider
                                    value={value.toFixed(2)}
                                    onChange={handleSliderChange}
                                    min={0}
                                    max={12}
                                    step={0.1}
                                    aria-labelledby="input-slider"
                                />
                            </Grid>
                            <Grid item xs={4} md={4} sx={{ ml:2, mt: 2 }}>
                                <Input
                                    value={value.toFixed(2)} // Formatear a dos lugares decimales
                                    size="small"
                                    onChange={handleInputChange}
                                    onBlur={handleBlur}
                                    inputProps={{
                                        step: '0.1',
                                        min: 0,
                                        max: 12,
                                        type: 'number',
                                        'aria-labelledby': 'input-slider',
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogContent hidden={!isEdit}>
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
                            <Grid item xs={12} md={12} sx={{ mt: 2 }}>
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

                            </Grid>
                            <Grid item xs={12} sx={{ mt: 2 }}>

                                <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    options={memberships}
                                    getOptionLabel={(membership) => `${membership.name.toString()} (${membership.price.toString()} hs)`}
                                    renderInput={(params) => <TextField {...params} label="Seleccionar membresía"
                                        name='memberships' error={!!validMembership && formSubmitted}
                                        helperText={validMembership} />}
                                    name="memberships"
                                    onChange={handleAutocompleteMembership}
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
                                <FormControl fullWidth>
                                    <TextField
                                        disabled
                                        label="Horas"
                                        type="text"
                                        name="hour"
                                        value={hours}
                                    />
                                </FormControl>
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
                                        <FormControlLabel value="MercadoPago" control={<Radio />} label="MercadoPago" />
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
