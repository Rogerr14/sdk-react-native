import type { PaymentDebitResponse } from '../../../src/hooks';
import type { CardListItem } from '../../../src/hooks/ListCardHook/listCard.interface';

export type RootStackParamList = {
  Presentation: undefined;
  Home: { selectedCard?: CardListItem };
  ListCard: { onCardSelected?: (card: CardListItem) => void };
  AddCardPage: undefined;
  DetailsPayment: {paymentResponse: PaymentDebitResponse};
};
