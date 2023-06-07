const baseURL = 'https://orugacoworking.vercel.app/api/v1/reservation';

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