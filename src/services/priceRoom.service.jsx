
const baseURL = 'https://orugacoworking.vercel.app/api/v1/priceRoom';

export const getAllRooms = async () => {
    const response = await fetch(baseURL);
    if (!response.ok) {
        throw new Error('Data coud not be fetched!')
    } else {
        return response.json()
    }
}

export const getPriceRoomById = async (id) => {
    const response = await fetch(baseURL+id);
    if (!response.ok) {
        throw new Error('Data coud not be fetched!')
    } else {
        return response.json()
    }
}

export const createPriceRoom = async (name, capacity) => {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            "name": name,
            "capacity": capacity
        })
    };
    const response = await fetch(baseURL, requestOptions);
    return await response.json();
}

export const updatePriceRoom = async (id, name, capacity) => {
    const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            "name": name,
            "capacity": capacity
        })
    };
    const response = await fetch(baseURL + "/" + id, requestOptions);
    return await response.json();
}

export const deletePriceRoom = async (id) => {
    const requestOptions = {
        method: 'Delete',
        headers: { 'Content-Type': 'application/json' },
    };
    const response = await fetch(baseURL + "/" + id, requestOptions);
    return await response.json();
}

