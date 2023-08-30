
// const baseURL = 'https://orugacoworking.vercel.app/api/v1/client';
const baseURL = 'http://localhost:4000/api/v1/client';
export const getAll = async () => {
    const response = await fetch(baseURL);
    if (!response.ok) {
        throw new Error('Data coud not be fetched!')
    } else {
        return response.json()
    }
}

export const getClientById = async (id) => {
    const response = await fetch(baseURL+id);
    if (!response.ok) {
        throw new Error('Data coud not be fetched!')
    } else {
        return response.json()
    }
}

export const createClient = async (full_name, phone, email, company_name, assistance, cuit) => {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            "full_name": full_name,
            "phone": phone,
            "email": email,
            "company_name": company_name,
            "cuit": cuit,
            "assistance": assistance
        })
    };
    const response = await fetch(baseURL, requestOptions);
    return await response.json();
}

export const updateClient = async (id, full_name, phone, email, company_name, description, assistance, cuit) => {
    const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            "full_name": full_name,
            "phone": phone,
            "email": email,
            "company_name": company_name,
            "cuit": cuit,
            "description": description,
            "assistance": assistance
        })
    };
    const response = await fetch(baseURL + "/" + id, requestOptions);
    return await response.json();
}

export const deleteClient = async (id) => {
    const requestOptions = {
        method: 'Delete',
        headers: { 'Content-Type': 'application/json' },
    };
    const response = await fetch(baseURL + "/" + id, requestOptions);
    return await response.json();
}

