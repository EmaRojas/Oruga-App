const baseURL = 'https://orugacoworking.vercel.app/api/v1/usage';

export const getAllUsages = async () => {
    const response = await fetch(baseURL);
    if (!response.ok) {
        throw new Error('Data coud not be fetched!')
    } else {
        return response.json()
    }
}

