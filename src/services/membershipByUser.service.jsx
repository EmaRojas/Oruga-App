const baseURL = 'https://orugacoworking.vercel.app/api/v1/membershipByUser';

export const getAllMembershipsByUser = async () => {
    const response = await fetch(baseURL);
    if (!response.ok) {
        throw new Error('Data coud not be fetched!')
    } else {
        return response.json()
    }
}

export const deleteMembershipByUser = async (id) => {
    const requestOptions = {
        method: 'Delete',
        headers: { 'Content-Type': 'application/json' },
    };
    const response = await fetch(baseURL + "/" + id, requestOptions);
    return await response.json();
}


export const createMembershipByUser = async (clientID, membershipID, endDate, hours, total, paymentMethod) => {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            "clientID": clientID,
            "membershipID": membershipID,
            "endDate": endDate,
            "hours": hours,
            "total": total,
            "means_of_payment": paymentMethod
        })
    };
    const response = await fetch(baseURL, requestOptions);
    return await response.json();
}

export const consumeHours = async (id, hours) => {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            "hours": hours,
        })
    };
    const response = await fetch(baseURL + "/useHours/" + id, requestOptions);
    return await response.json();
}

