import { 
    form,
    valueInput,
    informButton,
    areaPix,
    areaCardCredito,
    showInfoError,
    boxLabels,
    buttonPagar,
    buttonPayPix,
    buttonPayCreditCard,
    returnError,
    boxCardCredit,
    boxPix,
    inputNumberCard,
    inputData,
    inputCvv,
    selectParcelas
} from '../js/elementsDom.js';

import { showContainerPix } from '../js/paymentPix.js';
import { showContainerCardCredit } from './paymentCreditCard.js';

const mascaraMoeda = (event) => {
    let valor = event.target.value.replace(/\D/g, ""); // Remove tudo que não é dígito
    
    if (!valor) {
        event.target.value = "";
        return;
    }

    valor = (valor / 100).toFixed(2); // Transforma em centavos
    valor = valor.replace('.', ','); // Troca ponto por vírgula
    valor = valor.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');

    event.target.value = valor;
}

// mascara para data MM / AA
const mascaraData = (event) => {
    let valor = event.target.value.replace(/\D/g, ''); // Remove tudo que não for número

    if (valor.length > 4) {
        valor = valor.slice(0, 4); // Limita a 4 dígitos (MMrevistaAA)
    }

    // 2. Lógica para corrigir o Mês automaticamente
    if (valor.length >= 1) {
        let mes = valor.slice(0, 2);
        
        // Se o primeiro dígito for maior que 1 (ex: digitou 3), vira 03
        if (Number(mes[0]) > 1) {
            mes = '0' + mes[0];
        } 
        // Se o primeiro for 1 e o segundo for maior que 2 (ex: digitou 13), vira 12
        else if (mes.length === 2 && Number(mes) > 12) {
            mes = '12';
        }

        // Atualiza a parte dos meses no valor principal
        valor = mes + valor.slice(2);
    }


    if (valor.length >= 3) {
        // Adiciona a barra após os 2 primeiros dígitos (MM/AA)
        event.target.value = valor.slice(0, 2) + '/' + valor.slice(2, 4);
    } else {
        event.target.value = valor;
    }
}

const mascaraCvv = (event) => {
    // Remove tudo o que não for número
    let value = event.target.value.replace(/\D/g, '');
        
    // Limita o máximo em 4 caracteres (garantia extra via JS)
    if (value.length > 4) {
        value = value.slice(0, 4);
    }
        
    // Atualiza o valor do campo
    event.target.value = value;
}

// function for checked if has for no broken system
function checkedInDom(){
    
    if(
        !form ||
        !valueInput ||
        !informButton ||
        !areaPix ||
        !areaCardCredito ||
        !showInfoError ||
        !boxLabels ||
        !buttonPagar ||
        !buttonPayPix ||
        !buttonPayCreditCard ||
        !returnError ||
        !boxCardCredit ||
        !boxPix ||
        !inputNumberCard ||
        !inputData ||
        !inputCvv ||
        !selectParcelas
    ) return;
}

// função para mudar os ícones das bandeiras dos cartões
function changeIconCards(param){
    document.getElementById('iconCard').style.display = (param != '1234' && param != '4321')? 'flex': 'none';
    document.getElementById('cc-visa').style.display = (param === '1234' && param != '4321')? 'flex': 'none';
    document.getElementById('cc-master-card').style.display = (param != '1234' && param === '4321')? 'flex': 'none';
}

function pagamentoSuccess(){
    showContainerCardCredit('none');
    showContainerPix('none');
    document.getElementById('pix-pagamento').value = ''; // limpa a chave pix
    document.getElementById('valor').value = '';
    document.getElementById('name-card').value = '';
    inputNumberCard.value = '';
    inputData.value = '';
    inputCvv.value = '';

    document.getElementById('success-pagamento').style.display = 'flex';
    changeIconCards(false);
    
    setTimeout(() => {
        document.getElementById('success-pagamento').style.display = 'none';
    },4000)

}

// validar inputs ser estão vazios
function validInput(paramId){
    
    const elementInput = document.getElementById(paramId);

    if(elementInput.value === ""){
        return true;
    }

}

// função para validar as entrada de campos nomes
function iStringValid(paramId){         
    const input = document.getElementById(paramId);
    if (!input) return false;
    
    const valor = input.value.trim();
    
    // Regex: Verifica se tem APENAS letras (com ou sem acento) e espaços.
    // E verifica se tem pelo menos 3 letras (para não aceitar "a" ou "ab").
    const regex = /^[A-Za-zÀ-ÿ\s]+$/;
    
    // Retorna true se o valor for válido, e false se estiver vazio ou tiver números/símbolos
    return valor.length >= 3 && regex.test(valor);

}

function cleaningInputs(paramInputs){
    if(!paramInputs) return;

    document.getElementById(paramInputs).value = '';
}

export { checkedInDom, mascaraMoeda, mascaraData, mascaraCvv, pagamentoSuccess, changeIconCards,  validInput, iStringValid, cleaningInputs }; 