
// const baseURL = 'https://orugacoworking.vercel.app/api/v1/payment';
const baseURL = 'http://localhost:4000/api/v1/payment';

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



export const updatePayment = async (id, total, paid, billing) => {
    const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            "total": total,
            "paid": paid,
            "billing": billing,
        })
    };
    const response = await fetch(baseURL + "/" + id, requestOptions);
    return await response.json();
}

