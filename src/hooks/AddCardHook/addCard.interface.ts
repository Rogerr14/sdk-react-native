export interface AddCardRequest {
  session_id?: string;
  user: UserInfoAdd;
  card: CardInfoAdd;
  extra_params?: ExtraParams;
  billing_address?: BillingAddress;
}

export interface UserInfoAdd {
  id: string;
  email: string;
  phone?: string;
  ip_address?: string;
  fiscal_number?: string;
}

export interface CardInfoAdd {
  number: string;
  holder_name: string;
  expiry_month: number;
  expiry_year: number;
  cvc: string;
  type?: string;
  account_type?: 'C' | 'R' | 'A';
}

/** Parámetros extra opcionales */
export interface ExtraParams {
  threeDS2_data?: ThreeDS2Data;
  browser_info?: BrowserInfo;
  auth_data?: AuthData;
}

/** Datos de 3DS2 */
export interface ThreeDS2Data {
  term_url: string;
  device_type: 'browser' | 'SDK';
  process_anyway?: boolean;
  reference_id?: string;
}

/** Información del navegador */
export interface BrowserInfo {
  ip?: string;
  language?: string;
  java_enabled?: boolean;
  js_enabled?: boolean;
  color_depth?: number;
  screen_height?: number;
  screen_width?: number;
  timezone_offset?: number;
  user_agent?: string;
  accept_header?: string;
}

/** Datos de autenticación */
export interface AuthData {
  cavv: string;
  xid?: string;
  eci: string;
  version: string;
  reference_id: string;
  status: 'Y' | 'N' | 'U' | 'A' | 'R' | 'C';
}

/** Dirección de facturación */
export interface BillingAddress {
  first_name?: string;
  last_name?: string;
  street?: string;
  city?: string;
  state?: string;
  district?: string;
  zip?: string;
  house_number?: string;
  country?: string;
  additional_address_info?: string;
}

export interface AddCardResponse {
  card: CardResponse;
}

export interface CardResponse {
  number: string;
  bin: string;
  type: string;
  transaction_reference: string;
  status: string;
  token: string;
  expiry_year: string;
  expiry_month: string;
  origin: string;
  bank_name: string;
  message: string;
}
