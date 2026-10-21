import { checkedInDom } from '../js/utils.js';
import { informationPayment } from '../js/informPayments.js';
import { placeContainerPaymentPix } from '../js/paymentPix.js'
import { showContainerCreditCards } from './paymentCreditCard.js';



export function loadPagePayments(){
    checkedInDom()

    informationPayment();

    placeContainerPaymentPix();

    showContainerCreditCards()
}