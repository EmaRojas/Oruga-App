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


export const createMembershipByUser = async (clientID, membershipID, paymentID, startDate, endDate) => {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            "clientID": clientID,
            "membershipID": membershipID,
            "paymentID": paymentID,
            "startDate": startDate,
            "endDate": endDate
        })
    };
    const response = await fetch(baseURL, requestOptions);
    return await response.json();
}
