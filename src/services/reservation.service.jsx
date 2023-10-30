const baseURL = 'https://orugacoworking.vercel.app/api/v1/reservation';
// const baseURL = 'http://localhost:4000/api/v1/reservation';
export const getAllReservations = async () => {
    const response = await fetch(baseURL);
    if (!response.ok) {
        throw new Error('Data coud not be fetched!')
    } else {
        return response.json()
    }
}

export const getAllReservationsFilter = async (start, end) => {

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                "start": start,
                "end": end
            })
        };
        const response = await fetch(baseURL + "/filter", requestOptions);
        return await response.json();
}

export const getStats = async (start, end) => {

    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            "start": start,
            "end": end
        })
    };
    const response = await fetch(baseURL + "/filter/stats", requestOptions);
    return await response.json();
}

export const getReservationsByDate = async (date) => {

    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            "date": date
        })
    };
    const response = await fetch(baseURL + "/by-date", requestOptions);
    return await response.json();
}

export const getTodayReservations = async () => {
    const response = await fetch(baseURL + '/today');
    if (!response.ok) {
        throw new Error('Data coud not be fetched!')
    } else {
        return response.json()
    }
}

export const getNowReservations = async () => {
    const response = await fetch(baseURL + '/current');
    if (!response.ok) {
        throw new Error('Data coud not be fetched!')
    } else {
        return response.json()
    }
}

export const deleteReservation = async (id) => {
    const requestOptions = {
        method: 'Delete',
        headers: { 'Content-Type': 'application/json' },
    };
    const response = await fetch(baseURL + "/" + id, requestOptions);
    return await response.json();
}


export const createReservation = async (clientID, priceRoomID, roomID, fechaArgentina, fechaArgentinaEnd, date, time, endTimeString, means_of_payment, total, paid, billing, note) => {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            "clientID": clientID,
            "priceRoomID": priceRoomID,
            "roomID": roomID,
            "dateTime": fechaArgentina,
            "endDateTime": fechaArgentinaEnd,
            "date": date,
            "time": time,
            "endTime": endTimeString,
            "means_of_payment": means_of_payment,
            "total": total,
            "paid": paid,
            "billing": billing,
            "note": note
        })
    };
    const response = await fetch(baseURL, requestOptions);
    return await response.json();
}

export const updateReservation = async (id, priceRoomID, roomID, fechaArgentina, fechaArgentinaEnd, date, time, endTimeString, means_of_payment, total, paid, billing, note) => {
    const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            "priceRoomID": priceRoomID,
            "roomID": roomID,
            "dateTime": fechaArgentina,
            "endDateTime": fechaArgentinaEnd,
            "date": date,
            "time": time,
            "endTime": endTimeString,
            "means_of_payment": means_of_payment,
            "total": total,
            "paid": paid,
            "billing": billing,
            "note": note
        })
    };
    const response = await fetch(baseURL + "/" + id, requestOptions);
    return await response.json();
}

export const createReservationMembership = async (clientID, date, startDateTime, endDateDime, time, endtime, roomId, note) => {
    debugger;
     const requestOptions = {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({
             "clientID": clientID,
             "dateTime": startDateTime,
             "endDateTime" : endDateDime,
             "date": date,
             "time": time,
             "endTime": endtime,
             "roomID": roomId,
             "note": note
         })
     };
     const response = await fetch(baseURL + "/membership", requestOptions);
     return await response.json();
 }