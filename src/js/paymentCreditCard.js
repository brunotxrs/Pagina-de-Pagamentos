import { areaCardCredito, buttonPagar, buttonPayCreditCard, informButton, inputCvv, inputData, inputNumberCard, selectParcelas, valueInput } from "./elementsDom.js";
import { changeIconCards, iStringValid, mascaraCvv, mascaraData, pagamentoSuccess, validInput } from "./utils.js";

const maxParcelas = 5;

// função de exibir container informações do cartão
export function showContainerCardCredit(paramStyle = 'none'){
    
    if(paramStyle === 'none'){
        // reabilita o botao de inserir dados
        informButton.disabled = false;
    }

    const radios = document.querySelector('input[name="type-pay"]:checked');

    if(!radios)return;

    areaCardCredito.style.display = paramStyle;
    
    if(radios.value === 'credit-card'){
        buttonPagar.style.display = paramStyle;
    }
    buttonPayCreditCard.style.display = paramStyle;


    //Criar toda a logica de negocio aplicando os juros
    atualizarParcelas();

}

// Função para atualizar as opções do select e calcular o valor
function atualizarParcelas() {
    let valorLimpo = valueInput.value.replace(/\D/g, '');
    
    

    valorLimpo = valorLimpo / 100;

    // Limpa as opções anteriores do select
    selectParcelas.innerHTML = '';

    if (valorLimpo <= 0) {
        //divResultado.innerHTML = 'Por favor, insira um valor válido.';
        return;
    }

    // Loop para gerar as opções de 1 até o máximo de parcelas
    for (let i = 1; i <= maxParcelas; i++) {
        let juros = 0;

        // Aplicação das regras de juros
        if (i === 4) {
            juros = 0.05; // 5% de juros
        } else if (i >= 5) {
            juros = 0.10; // 10% de juros
        }

        // Cálculo do valor total com juros e o valor de cada parcela
        const valorComJuros = valorLimpo * (1 + juros);
        const valorParcela = valorComJuros / i;

        // Texto informativo para a opção do select
        let textOption = `${i}x de R$ ${valorParcela.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'               
        })}`;

        if (juros === 0) {
            textOption += ' (Sem Juros)';
        } else {
            textOption += ` (Com juros de ${(juros * 100)}%)`;
        }

        // Cria o elemento <option> e adiciona ao <select>
        const option = document.createElement('option');
        option.value = i;
        

        option.setAttribute('data-total', valorComJuros.toFixed(2));
        
        option.setAttribute('data-parcela', valorParcela.toFixed(2));
        option.textContent = textOption;
        
        selectParcelas.appendChild(option);
    }

    exibirResumo();

}

// Função para mostrar o resumo da opção selecionada
function exibirResumo() {
    
    const optionSelecionada = selectParcelas.options[selectParcelas.selectedIndex];
    if (!optionSelecionada) return;

    const total = optionSelecionada.getAttribute('data-total');
 
    let valorLimpo = total.replace(/\D/g, '');
    valorLimpo = valorLimpo / 100;

    document.getElementById('resultado').innerText = `${valorLimpo.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'               
    })}`;
}

// função pra aplicar mensagem de retorno ao user
function applyReturnUser(paramId, paramMessage){
    document.getElementById(paramId).classList.add('apply-outline-aviso');
    document.getElementById(paramId).style.outline = '2px solid red';
    document.getElementById('showErrorCreditCard').innerText = paramMessage;
    setTimeout(() => {
        document.getElementById(paramId).classList.remove('apply-outline-aviso');
        document.getElementById(paramId).style.outline = '';
        document.getElementById('showErrorCreditCard').innerText = '';
    }, 1500)
}

export function showContainerCreditCards(){
    // mascara com jquery para o numero do cartão
    $(document).ready(function(){
        $('#date-number-card').inputmask('9999 9999 9999 9999');
    });

    valueInput.addEventListener('input', atualizarParcelas);
    selectParcelas.addEventListener('change', exibirResumo);

    document.getElementById('data-card').addEventListener('input', mascaraData);
    document.getElementById('id-cvv').addEventListener('input', mascaraCvv);


    // ouvinte ao imputar
    inputNumberCard.addEventListener('keyup', (e) => {
        const inputNumbers = e.target.value.replace(/\D/g, "");
        
        if (inputNumbers.startsWith('1234')) {
            changeIconCards('1234')
            return
        }else if(inputNumbers.startsWith('4321')){
            changeIconCards('4321')
            return
        } else{
            changeIconCards(false);
            const apenasNumbers = e.target.value.replace(/\D/g, "");
            
            if (apenasNumbers.length >= 4) {
                document.getElementById('showErrorCreditCard').innerText = "Número de cartão inválido";
                
            } else if(apenasNumbers.length >= 3){
                document.getElementById('showErrorCreditCard').innerText = '';
            
            }

            return
        }
    });

    // ouvinte do botao pagar com cartão de credito
    buttonPayCreditCard.addEventListener('click', () => {
        informButton.disabled = true;

        // limpando inputs
        let numeroCard = inputNumberCard.value.replace(/\D/g, '');
        let numberCardFourFirst = numeroCard.substring(0, 4);
        let dataLimpa = inputData.value.replace(/\D/g, '');
        let cvvLimpo = inputCvv.value.replace(/\D/g, '');

        // chamada da função de validar as entradas
        if(validInput('date-number-card')){
            applyReturnUser('number-credit-card',"Campo Numero do Cartão vazio!");
            return
        } else if(numberCardFourFirst != '1234' && numberCardFourFirst != '4321'){
            applyReturnUser('number-credit-card',"Numero do Cartão inválido!");
            return
        } else if(numeroCard.length != 16){
            applyReturnUser('number-credit-card',"Numero do Cartão não confere!");
            return;
        } else if(validInput('name-card')){
            applyReturnUser('name-card',"Campo Nome do Cartão vazio!");
            return;
        } else if(!iStringValid('name-card')){
            applyReturnUser('name-card',"Nome do Cartão não é válido! Digite apenas letras.");
            return;
        } else if(validInput('data-card')){
            applyReturnUser('data-card',"Campo data vazio!");
            return;
        } else if(dataLimpa.length != 4){
            applyReturnUser('data-card',"Data inválida!");
            return;
        } else if(validInput('id-cvv')){
            applyReturnUser('box-cvv',"Campo CVV vazio!");
            return;
        } else if(cvvLimpo.length != 4){
            applyReturnUser('box-cvv',"CVV inválido!");
            return;
        }else {
            pagamentoSuccess();
        }

    })

}