import { useCallback, useState } from 'react';
import type ListCardResponse from './listCard.interface';
import type ErrorModel from '../../interfaces/error.interface';
import NuveiSdk from '../../NuveiSdk';
import { getCardInfo } from '../../components/PaymentGatewayForm/helpers';

type ListCard = ListCardResponse & {
  cards: (ListCardResponse['cards'][0] & { icon: string })[];
};

const ListCardHook = () => {
  const [cardsList, setCardsList] = useState<ListCard>({
    cards: [],
    result_size: 0,
  } as ListCard);
  const [isLoadingList, setIsLoadingList] = useState<boolean>(false);
  const [errorList, setErrorList] = useState<ErrorModel['error'] | null>(null);

  const getCardsList = useCallback(async ({ userId }: { userId: string }) => {
    if (!userId) {
      setErrorList({
        type: 'Invalid input',
        help: '',
        description: 'uid is required but is empty',
      });
      return;
    }

    if (!NuveiSdk.isInitialized()) {
      setErrorList({
        type: 'sdk_not_initialized',
        help: 'SDK not initialized',
        description: 'Nuvei SDK must be initialized before use',
      });
      return;
    }
    setIsLoadingList(true);
    setErrorList(null);

    const interceptor = NuveiSdk.createInterceptor(
      '/v2/card/list',
      'GET',
      {
        uid: userId,
      },
      true
    );
    try {
      await interceptor.init();
      const response = await interceptor.request<ListCardResponse>();
      const listCard = response.cards.map((card) => {

        const { icon } = getCardInfo(card.number);
        return { ...card, icon };
      });
      const validCards = listCard.filter(
        (card) => card.status === 'valid'
      ) ?? [];
      setCardsList({ ...response, cards: validCards });
    } catch (err: any) {
      setErrorList(
        err.error || {
          type: 'Invalid request',
          help: '',
          description: err.message || 'An unexpected error ocurrred',
        }
      );
    } finally {
      setIsLoadingList(false);
    }
  }, []);

  return {
    cardsList,
    isLoadingList,
    errorList,
    getCardsList,
  };
};

export default ListCardHook;
