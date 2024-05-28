import React, { useEffect, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, Input, InputAdornment, InputLabel, OutlinedInput, Slider, TextField, Typography } from '@mui/material';
import { toast } from 'react-toastify';
import Autocomplete from '@mui/material/Autocomplete';
import { getAll } from "../../services/client.service";
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { FormControlLabel, FormLabel, FormControl, Radio, RadioGroup, Select, MenuItem } from '@mui/material';
import "dayjs/locale/es";
import dayjs from 'dayjs';
import { createMembershipByUser, getAllMembershipsByUser, consumeHours, updateMembershipByUser } from '../../services/membershipByUser.service';
import { DatePicker } from '@mui/x-date-pickers';
import { set } from 'react-hook-form';
import { useForm } from '../../hooks/useForm';

import { DateTimePicker } from '@mui/x-date-pickers';


const MembembershipByUserEmpty = {
    "_id": "",
    "endDate": "",
    "client": "",
    "membership": "",
    "billing": "No factura",
    "paymentMethod": "Efectivo"
}


export const CreateOrEdit = ({ isEdit, setEdit, setMembershipsByUser, currentMembershipByUser, setCurrentMembershipByUser }) => {

    const [formSubmitted, setFormSubmitted] = useState(false);
    const [modal, setModal] = useState(false);
    const [disabledButton, setdisabledButton] = useState(false);

    const [clients, setClients] = useState({});
    const [memberships, setMemberships] = useState({});

    const [client, setClient] = useState('');
    const [validClient, setValidClient] = useState('Es obligatorio');

    const [selectedMembership, setSelectedMembership] = useState('');
    const [validMembership, setValidMembership] = useState('Es obligatorio');
    const [membershipString, setMembershipString] = useState('');

    const [endDate, setEndDate] = useState('');
    const [startDateTime, setStartDateTime] = useState('');
    const [validEndDate, setValidEndDate] = useState('Es obligatorio');
    // const [paid, setPaid] = useState(0);
    const [remainingHours, setRemainingHours] = useState(0);
    const [member, setMember] = useState('');


    const [value, setValue] = React.useState(0.00);
    const formValidations = {
        //paid: [(value) => value.length >= 1 && !isNaN(value), 'Es obligatorio. No se puede ingresar letras.'],
    }

    const {
        isFormValid, total, paid, paymentMethod, billing, room, hours, paidValid, onInputChange
    } = useForm(currentMembershipByUser, formValidations);

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
        const tomorrow = dayjs().add(1, 'month');
        setEndDate(tomorrow);
        getClients();

    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault();

        const id = toast.loading("Validando formulario...")
        try {
            setdisabledButton(true);
            setFormSubmitted(true);

            if (currentMembershipByUser._id.length < 1 && (client === '')) {
                toast.dismiss(id);
                setdisabledButton(false);
                toast.error("Formulario incorrecto")
                return;
            }
            if (currentMembershipByUser._id.length > 1) {
                debugger
               
                const { success } = await updateMembershipByUser(currentMembershipByUser._id, total, billing, parseFloat(paid) || 0, room, paymentMethod);

                if (!success) {
                    toast.dismiss(id);
                    return;
                }
                toast.update(id, { render: "Membresía actualizada", type: "success", isLoading: false, autoClose: 2000 });
            } else {
                console.log(selectedMembership);
                var hrs = parseInt(hours, 10);
                console.log(room);

                const confirmAction = window.confirm("¿Estás seguro de que deseas crear la membresía? Revisa si los datos son correctos.");

                if (confirmAction) {
                  const { success } = await createMembershipByUser(client, room, hrs, parseFloat(total) || 0, billing, parseFloat(paid) || 0, paymentMethod);
                
                  if (!success) {
                    //toast.dismiss(id);
                    toast.update(id, { render: "Ya existe una membresía activa para este cliente, debe finalizarla para crear otra.", type: "success", isLoading: false, autoClose: 2000 });
                    return;
                  }
                
                  toast.update(id, { render: "Se activó la membresía", type: "success", isLoading: false, autoClose: 2000 });
                } else {
                  // El usuario ha cancelado la acción, puedes manejar esto según tus necesidades
                  console.log("Activación de membresía cancelada por el usuario");
                  toast.dismiss(id); // Otras acciones que puedas querer realizar en caso de cancelación
                }
            }
            setCurrentMembershipByUser(MembembershipByUserEmpty);
            reset();
            window.location.reload();
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
                    const dateObj = new Date(membership.created);
                    const day = dateObj.getDate();
                    const month = dateObj.getMonth() + 1; // Los meses comienzan en 0, por lo que se suma 1


                    // Convertir segundos a horas y minutos
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
        
                    // Convertir segundos a horas y minutos
                    const totalSeconds = membership.total_hours; // Valor obtenido de la base de datos
                    const remainingSeconds = membership.remaining_hours;
        
                    const totalSecsToHours = convertToHoursMinutes(totalSeconds);
                    const remainingSecsToHours = convertToHoursMinutes(remainingSeconds);

                    return {
                        ...membership,
                        clientID: membership.clientID.full_name || "",
                        roomID: membership.room,
                        membershipHours: membership.hours,
                        endDate: day + '/' + month,
                        hours: remainingSecsToHours,
                        totalRemainingString: remainingSecsToHours + ' de ' + totalSecsToHours + 'hs',
                        pendingString: '$ ' + (membership.total - membership.paid) + ' de $ ' + membership.total
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
        // setPaid(0);
        refreshList();
        setModal(false);
        setRemainingHours(0);
        setCurrentMembershipByUser(MembembershipByUserEmpty);

        
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
            <Button disabled={!isEdit} onClick={handleOpen}>NUEVA MEMBRESÍA</Button>
            <Button disabled={isEdit} onClick={handleOpen}>EDITAR </Button>
            <Dialog open={modal} onClose={handleClose}>
                <form onSubmit={handleSubmit}>
                    <DialogTitle>
                        <Typography hidden={!isEdit} color='primary.main' sx={{ ml: 1 }}>NUEVA MEMBRESÍA ACTIVA</Typography>
                        <Typography hidden={isEdit} color='primary.main' sx={{ ml: 1 }}>Membresía {membershipString}</Typography>
                        <Divider />
                    </DialogTitle>
 
                    <DialogContent>
                        <Grid container>

                        <> {isEdit &&

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

                            <Grid item xs={12} sx={{ mt: 2 }}>
                                        <InputLabel id="demo-simple-select-label">Sala</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            type="text"
                                            fullWidth
                                            name="room"
                                            onChange={onInputChange}
                                            value={room}
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

                            <Grid item xs={12} sx={{ mt: 2 }}>
                                <TextField
                                    label="Horas"
                                    type="text"
                                    fullWidth
                                    name="hours"
                                    onChange={onInputChange}
                                    value={hours}
                                    defaultValue={0}
                                />
                            </Grid>
                            </Grid>

                            }
                            </>

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
