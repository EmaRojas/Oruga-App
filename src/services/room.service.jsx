const baseURL = 'https://orugacoworking.vercel.app/api/v1/room';

export const getAllRooms = async () => {
    const response = await fetch(baseURL);
    if (!response.ok) {
        throw new Error('Data coud not be fetched!')
    } else {
        return response.json()
    }
}

export const getRoomById = async (id) => {
    const response = await fetch(baseURL+id);
    if (!response.ok) {
        throw new Error('Data coud not be fetched!')
    } else {
        return response.json()
    }
}

export const createRoom = async (name, capacity) => {
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

export const updateRoom = async (id, name, capacity) => {
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

export const deleteRoom = async (id) => {
    const requestOptions = {
        method: 'Delete',
        headers: { 'Content-Type': 'application/json' },
    };
    const response = await fetch(baseURL + "/" + id, requestOptions);
    return await response.json();
}