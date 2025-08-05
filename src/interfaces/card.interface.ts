
export interface CardInfo {
    type: CardType;
    regex: RegExp;
    mask: string;
    validLengths: number[];
    typeCode: string;
    icon: string;
  }


  export type CardType =
  | 'Visa' | 'Mastercard' | 'American Express' | 'Diners'
  | 'Discover' | 'Maestro' | 'Exito' | 'Alkosto' | 'Codensa'
  | 'Olimpica' | 'EPM' | 'Colsubsidio' | 'BBVA' | 'Falabella'
  | 'Carnet' | 'Credisensa' | 'Solidario' | 'Union Pay'
  | 'Elo' | 'JCB' | 'Aura' | 'Sodexo' | 'Hipercard'
  | 'Unknown';

  