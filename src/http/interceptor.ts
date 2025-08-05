import axios from "axios";
import { AxiosAdapter } from "./axios.adapter";
import { NUVEI_ENV } from "../../example/src/shared/utils/constants";

export interface ErrorModel {
    error: {
        type: string,
        help: string,
        description: string,
    };
}


export class InterceptorHttp{

    // private static instance = axios.create({
    //     baseURL= 
    // })

}