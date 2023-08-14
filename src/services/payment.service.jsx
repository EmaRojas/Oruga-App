
const baseURL = 'https://orugacoworking.vercel.app/api/v1/payment';

export const getAll = async () => {
    const response = await fetch(baseURL);
    if (!response.ok) {
        throw new Error('Data coud not be fetched!')
    } else {
        return response.json()
    }
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

export const getAllPaymentsFilter = async (start, end) => {

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

export const getClientById = async (id) => {
    const response = await fetch(baseURL+id);
    if (!response.ok) {
        throw new Error('Data coud not be fetched!')
    } else {
        return response.json()
    }
}



export const updatePayment = async (id, paid) => {
    const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            "paid": paid,
        })
    };
    const response = await fetch(baseURL + "/" + id, requestOptions);
    return await response.json();
}

