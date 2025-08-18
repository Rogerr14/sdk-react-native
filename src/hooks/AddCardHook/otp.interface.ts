



export interface OtpRequest{
    user: otpUser,
    transaction: otpTransaction
    type: "BY_OTP"| "BY_CRES"
    value: string
    more_info: boolean
}

export interface otpUser{
    id: string
}

export interface otpTransaction{
    id: string
}

//Response 
export interface OtpResponse {
    status?:         number;
    payment_date?:   Date;
    amount?:         number;
    transaction_id?: string;
    status_detail?:  number;
    message?:        string;
    transaction?: TransactionOtpResponse;
    card?:        CardOtpResponse;
    "3ds"?:       The3DsOtpResposne;
}



export interface The3DsOtpResposne {
    sdk_response:     SDKResponseOtpResponse;
    authentication:   AuthenticationOtpResponse;
    browser_response: BrowserResponse;
}

export interface AuthenticationOtpResponse {
    status:         string;
    return_message: string;
    version:        null;
    xid:            string;
    reference_id:   string;
    cavv:           null;
    return_code:    string;
    eci:            null;
}

export interface BrowserResponse {
    hidden_iframe:     string;
    challenge_request: string;
}

export interface SDKResponseOtpResponse {
    acs_trans_id:         string;
    acs_signed_content:   null;
    acs_reference_number: string;
}

export interface CardOtpResponse {
    bin:                   string;
    status:                string;
    token:                 string;
    expiry_year:           string;
    expiry_month:          string;
    transaction_reference: string;
    type:                  string;
    number:                string;
    origin:                string;
}

export interface TransactionOtpResponse {
    status:             string;
    payment_date:       null;
    amount:             number;
    authorization_code: null;
    installments:       number;
    dev_reference:      string;
    message:            null;
    carrier_code:       null;
    id:                 string;
    status_detail:      number;
}