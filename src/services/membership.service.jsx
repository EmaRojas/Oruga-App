
const baseURL = 'https://orugacoworking.vercel.app/api/v1/membership';
// const baseURL = 'http://localhost:4000/api/v1/membership';

export const getAllMemberships = async () => {
    const response = await fetch(baseURL);
    if (!response.ok) {
        throw new Error('Data coud not be fetched!')
    } else {
        return response.json()
    }
}

export const getMembershipById = async (id) => {
    const response = await fetch(baseURL+id);
    if (!response.ok) {
        throw new Error('Data coud not be fetched!')
    } else {
        return response.json()
    }
}

export const createMembership = async (name, roomID, price, hours, type) => {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            "name": name,
            "roomID": roomID,
            "price": price,
            "type": type,
            "hours": hours
        })
    };
    const response = await fetch(baseURL, requestOptions);
    return await response.json();
}

export const updateMembership = async (id, name, price, hours) => {
    const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            "name": name,
            "price": price,
            "hours": hours
        })
    };
    const response = await fetch(baseURL + "/" + id, requestOptions);
    return await response.json();
}

export const deleteMembership = async (id) => {
    const requestOptions = {
        method: 'Delete',
        headers: { 'Content-Type': 'application/json' },
    };
    const response = await fetch(baseURL + "/" + id, requestOptions);
    return await response.json();
}

