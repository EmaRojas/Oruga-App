import React, { useEffect, useState } from "react";
import { Grid, Card, CardContent, Typography } from "@mui/material";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DemoItem } from '@mui/x-date-pickers/internals/demo';
import "dayjs/locale/es";
import dayjs from 'dayjs';
import { PieChart } from 'react-minimal-pie-chart';
import { getAllReservationsFilter } from "../../services/reservation.service";

export const Overview = () => {
    dayjs.locale('es');
    const [reservations, setReservations] = useState([]);
    const [roomStats, setRoomStats] = useState([]);
    const [earningsStats, setEarningsStats] = useState([]);
    const [hourStats, setHourStats] = useState([]);
    const today = dayjs().startOf('day');
    const nextWeek = dayjs().add(1, 'week');

    const [start, setStart] = useState(today);
    const [end, setEnd] = useState(nextWeek);

    const handleDateChange = (newStart, newEnd) => {
        setStart(newStart);
        setEnd(newEnd);
    };

    useEffect(() => {
        async function fetchData() {
            const response = await getAllReservationsFilter(start, end);
            setReservations(response.reservations);
        }
        fetchData();
    }, [start, end]);

    useEffect(() => {
        // Calculate room statistics, earnings, and booked hours
        const stats = reservations.reduce((acc, reservation) => {
            const roomName = reservation.room;
            if (roomName && roomName.trim() !== "") {
                if (!acc[roomName]) {
                    acc[roomName] = { count: 0, earnings: 0, bookedHours: 0, membershipCounted: {} };
                }
                acc[roomName].count++;
                
                // Handle earnings calculation
                if (reservation.membershipID) {
                    if (!acc[roomName].membershipCounted[reservation.membershipID]) {
                        acc[roomName].earnings += parseFloat(reservation.paid) || 0;
                        acc[roomName].membershipCounted[reservation.membershipID] = true;
                    }
                } else {
                    acc[roomName].earnings += parseFloat(reservation.paid) || 0;
                }
                
                // Calculate booked hours
                const start = dayjs(reservation.startDateTime);
                const end = dayjs(reservation.endDateTime);
                const duration = end.diff(start, 'hour', true);
                acc[roomName].bookedHours += duration;
            }
            return acc;
        }, {});

        const daysBetween = end.diff(start, 'day') + 1;
        const totalAvailableHours = daysBetween * 14; // 14 hours per day

        const roomStatsArray = Object.entries(stats).map(([roomName, data]) => ({
            roomName,
            count: data.count,
            earnings: data.earnings,
            bookedHours: data.bookedHours,
            availableHours: totalAvailableHours
        }));

        setRoomStats(roomStatsArray);
        setEarningsStats(roomStatsArray);
        setHourStats(roomStatsArray);
    }, [reservations, start, end]);

    const cardStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '130px',
        marginLeft: '15px'
    };

    const roomColors = {
        Alocasia: "#FF6B6B",
        Bromeliad: "#4ECDC4",
        Peperomia: "#45B7D1",
        Begonia: "#FFA07A",
        Calathea: "#98D8C8",
        Pothus: "#F7DC6F",
        Pandurata: "#BB8FCE"
    };

    const getColor = (roomName) => roomColors[roomName] || "#000000"; // Default to black if room not found

    // Generate random colors for the pie chart
    const generateRandomColor = () => '#' + Math.floor(Math.random()*16777215).toString(16);

    // Prepare data for the pie charts
    const pieChartData = roomStats.map(roomStat => ({
        title: roomStat.roomName,
        value: roomStat.count,
        color: getColor(roomStat.roomName)
    }));

    const earningsPieChartData = earningsStats.map(roomStat => ({
        title: roomStat.roomName,
        value: roomStat.earnings,
        color: getColor(roomStat.roomName)
    }));

    const hoursPieChartData = hourStats.map(roomStat => ({
        title: roomStat.roomName,
        value: roomStat.bookedHours,
        color: getColor(roomStat.roomName)
    }));

    return (
        <>
            <Grid container style={cardStyle}>
                <form>
                    <Grid item>
                        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
                            <DemoItem components={['DatePicker']}>
                                <DatePicker
                                    label="Inicio"
                                    name="start"
                                    value={start}
                                    onChange={(newStart) => handleDateChange(newStart, end)}
                                />
                            </DemoItem>
                        </LocalizationProvider>
                    </Grid>
                    <br />
                    <Grid item>
                        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
                            <DemoItem components={['DatePicker']}>
                                <DatePicker
                                    label="Fin"
                                    name="end"
                                    value={end}
                                    onChange={(newEnd) => handleDateChange(start, newEnd)}
                                />
                            </DemoItem>
                        </LocalizationProvider>
                    </Grid>
                </form>
            </Grid>
            <br />

            <Grid container spacing={3}>
                {roomStats.length > 0 && (
                    <Grid item xs={12} md={4}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Reservas por Sala
                                </Typography>
                                <div style={{ height: '300px' }}>
                                    <PieChart
                                        data={pieChartData}
                                        label={({ dataEntry }) => `${dataEntry.title}: ${dataEntry.value}`}
                                        labelStyle={{
                                            fontSize: '4px',
                                            fontFamily: 'sans-serif',
                                        }}
                                        radius={40}
                                        labelPosition={112}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </Grid>
                )}

                {earningsStats.length > 0 && (
                    <Grid item xs={12} md={4}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Ingresos por Sala
                                </Typography>
                                <div style={{ height: '300px' }}>
                                    <PieChart
                                        data={earningsPieChartData}
                                        label={({ dataEntry }) => `${dataEntry.title}: $${dataEntry.value.toFixed(2)}`}
                                        labelStyle={{
                                            fontSize: '4px',
                                            fontFamily: 'sans-serif',
                                        }}
                                        radius={40}
                                        labelPosition={112}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </Grid>
                )}

                {hourStats.length > 0 && (
                    <Grid item xs={12} md={4}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Horas Reservadas por Sala
                                </Typography>
                                <div style={{ height: '300px' }}>
                                    <PieChart
                                        data={hoursPieChartData}
                                        label={({ dataEntry }) => `${dataEntry.title}: ${dataEntry.value.toFixed(1)}/${hourStats.find(stat => stat.roomName === dataEntry.title).availableHours}`}
                                        labelStyle={{
                                            fontSize: '4px',
                                            fontFamily: 'sans-serif',
                                        }}
                                        radius={40}
                                        labelPosition={112}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </Grid>
                )}
            </Grid>
        </>
    );
}