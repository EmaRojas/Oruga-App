const baseURL = 'https://orugacoworking.vercel.app/api/v1/reservation';

export const getAllReservations = async () => {
    const response = await fetch(baseURL);
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


export const createReservation = async (clientID, priceRoomID, roomID, dateTime, date, time, means_of_payment, total, paid) => {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            "clientID": clientID,
            "priceRoomID": priceRoomID,
            "roomID": roomID,
            "dateTime": dateTime,
            "date": date,
            "time": time,
            "means_of_payment": means_of_payment,
            "total": total,
            "paid": paid
        })
    };
    const response = await fetch(baseURL, requestOptions);
    return await response.json();
}

export const updateReservation = async (id, clientID) => {
    const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            "clientID": clientID
        })
    };
    const response = await fetch(baseURL + "/" + id, requestOptions);
    return await response.json();
}