import axios, {Axios} from 'axios'

export const startAxios: (baseURL: string) => Axios = (baseURL) => {
    const axiosInstance = axios.create({
        baseURL
    })
    return axiosInstance
}