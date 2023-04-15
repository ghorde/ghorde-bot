import { defaultPrefix, mainLogger } from "../../main";
import { Axios } from "axios";

export const getServerPrefix: (axios: Axios, id: string) => Promise<string> = async(axios: Axios, id: string) => {
    const resData = (await axios.get(`/server/${id}`).catch((e) => {
        mainLogger.error(`Error while getting server prefix! ${e}`)
        return
    }))
    if (resData) {
        let data = resData.data
        if (!data.success && data.status === 404) {
            const resData = (await axios.post(`/server/${id}`, {prefix: defaultPrefix}).catch((e) => {
                mainLogger.error(`Error while getting server prefix! ${e}`)
                return
            }))
            if (resData) {
                data = resData.data
                mainLogger.info(`Created new server prefix! ${data.prefix}`)
            }
        }
       return data.data.prefix
    }
    return '!'
}