
export interface NuveiCard {
    bin: string;
    status: string;
    token: string;
    holder_name: string;
    expiry_year: string;
    expiry_month: string;
    transaction_reference: string | null;
    type: string;
    number: string;
  }

export default interface ListCard{
    cards: NuveiCard[];
    result_size: number;
}