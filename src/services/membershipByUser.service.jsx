const baseURL = 'https://orugacoworking.vercel.app/api/v1/membershipByUser';
const usageURL = 'https://orugacoworking.vercel.app/api/v1/usage';
// const baseURL = 'http://localhost:4000/api/v1/membershipByUser';
// const usageURL = 'http://localhost:4000/api/v1/usage';
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


export const createMembershipByUser = async (clientID, membershipID, room, hours, total, paymentMethod, billing) => {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            "clientID": clientID,
            "membershipID": membershipID,
            "roomID": room,
            "hours": hours,
            "total": total,
            "means_of_payment": paymentMethod,
            "billing": billing
        })
    };
    const response = await fetch(baseURL, requestOptions);
    return await response.json();
}

export const consumeHours = async (id, hours, startDateTime, endDateTime, member) => {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            "hours": hours,
        })
    };
    const response = await fetch(baseURL + "/useHours/" + id, requestOptions);

    const requestUsageOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            "membershipByUserID": id,
            "hours": hours,
            "startDateTime": startDateTime,
            "endDateTime": endDateTime,
            "member": member
        })
    };
    await fetch(usageURL, requestUsageOptions);

    return await response.json();
}

export const getMembershipByEmail = async (email) => {
    const response = await fetch(baseURL+ '/client/' + email);
    if (!response.ok) {
        throw new Error('Data coud not be fetched!')
    } else {
        return response.json()
    }
}