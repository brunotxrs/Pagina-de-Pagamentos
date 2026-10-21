import { cleaningInputs, mascaraMoeda } from '../js/utils.js';
import { 
    valueInput, boxLabels, informButton, 
    showInfoError, boxCardCredit, boxPix 
} from '../js/elementsDom.js';
import { showContainerPix } from '../js/paymentPix.js';
import { showContainerCardCredit } from './paymentCreditCard.js';


export function informationPayment(){

    // ouvinte se houver delete no campo do valor
    valueInput.addEventListener('keydown', function(event) {
        if (event.key === "Backspace") {
            showContainerPix('none');
            showContainerCardCredit('none');
        }
    })

    // adicionando um ouvinte para area pix esteja ativa ao selecionar o cartão
    // credito possa ser ocultada.
    boxCardCredit.addEventListener('click', () => {
        showContainerPix('none');
        cleaningInputs('date-number-card');
        cleaningInputs('name-card');
        cleaningInputs('data-card');
        cleaningInputs('id-cvv');
        document.getElementById('showErrorCreditCard').innerText = '';
    })

    boxPix.addEventListener('click', () => {
        showContainerCardCredit('none');
    })
    
    // aplicando mascara ao input do valores pagamento
    valueInput.addEventListener('input', mascaraMoeda);

    // aplicando outline em todos os campos
    boxLabels.forEach((label) => {
        label.addEventListener('click', () => {
            boxLabels.forEach((label) => {
                label.classList.remove('apply-outline');
            })
            label.classList.add('apply-outline');
        })
    })


    // ouvinte ao clicar no botao de inserir informações valida outros elementos
    informButton.addEventListener('click', () => {
        const radios = document.querySelector('input[name="type-pay"]:checked');

        if(valueInput.value === '') {
            showInfoError.innerText = 'O campo de valor está vazio!';
            showContainerPix('none');
            showContainerCardCredit('none');

            setTimeout(() => {
                showInfoError.innerText = '';
            }, 3000);

        }else if(!radios){
            showInfoError.innerText = `Selecione o tipo de pagamento 'Pix' ou 'Cartão de credito'!` ;
            setTimeout(() => {
                showInfoError.innerText = '';
            }, 3000);

        } else if(radios.value === 'pix') {
            
            showContainerPix("flex");
            showContainerCardCredit('none');

        } else if(radios.value === 'credit-card') {
            
            showContainerPix("none");
            showContainerCardCredit('flex');
        
        }
    })
}