


export default interface RefundRequest{
    transaction: Transaction,
    order?: Order,
    more_info?: boolean
}

export interface Transaction{
    id?: string,
    reference_label?: number, 
    message?: string,
    installments?: number,
    amount?: number,
    status_detail?: number,
    carrier_code?: any,
    dev_reference?: string,
    refund_amount?: number,
    authorization_code?: string,
    payment_date?: string,
    status?: string
}

 interface Order{
    amount: number
}


export  interface TransactionResponse{
    status: string,
    transaction: Transaction,
    detail: string,
    card: CardInformation
}


  interface CardInformation{
    bin: string,
    status: string,
    token: string,
    expiry_year: string,
    expiry_month: string,
    transaction_reference: string,
    type: string,
    number: string,
    origin: string
}