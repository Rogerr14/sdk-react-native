import  axios, { type AxiosInstance } from "axios";
import { HttpAdapter } from "./http.adapter";



interface Options{
    baseUrl: string,
    params: Record<string, any>,
    data: any

}



export class AxiosAdapter extends HttpAdapter{

    private axiosInstance: AxiosInstance;



    constructor( options: Options ) {
        super();
        this.axiosInstance = axios.create({
          baseURL: options.baseUrl,
          params: options.params,
        })
      }


   async get<T>(url: string, options?: Record<string, any> | undefined): Promise<T> {
        try {
            const {data} = await this.axiosInstance.get<T>(url, options);
            
            return data;
        } catch (error) {
            throw new Error(`Error fetching get: ${url}`);
            
        }
    }
    post<T>(url: string, options?: Record<string, any> | undefined, data?: any): Promise<T> {
        throw new Error("Method not implemented.");
    }
    
}