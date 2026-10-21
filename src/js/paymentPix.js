import { 
    valueInput, informButton, 
    areaPix, buttonPagar, buttonPayPix, 
    returnError 
} from '../js/elementsDom.js';

import { pagamentoSuccess } from '../js/utils.js';

const qrCodeContainer = document.createElement('div');
qrCodeContainer.id = 'qr-code';

const contador = document.createElement('span');
contador.id = 'contadorShow';

let tempoRestante = 60;
let intervalo = null;

let totalValue = 0;


// função para mostrar o container do pix e o botão de pagamento
export function showContainerPix(paramStyle = "none") {

    const radios = document.querySelector('input[name="type-pay"]:checked');

    if(paramStyle === "none"){
        // para o intervalo
        clearInterval(intervalo);
        // remove a class
        contador.classList.remove('aviso');

        // reabilita o botao de inserir dados
        informButton.disabled = false;
        // limpa o campo de inserir a chave pix
        document.getElementById('pix-pagamento').value = '';

        // valida se os elementos existe
        if(!contador && !qrCodeContainer) return;

        // aplicando display none 
        contador.style.display = 'none'
        qrCodeContainer.style.display = 'none';
    }

    let valorLimpo = valueInput.value.replace(/\D/g, '');

    totalValue = valorLimpo - (valorLimpo * 0.10);

    totalValue = totalValue / 100;

    document.getElementById('total').innerText = totalValue.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
        
    });

    areaPix.style.display = paramStyle;

    if(!radios)return;

    if(radios.value === 'pix'){
        
        buttonPagar.style.display = paramStyle;
        
    }
    buttonPayPix.style.display = paramStyle;
}

// função de cronometro
function formatarTempo(segundos) {
    const minutos = Math.floor(segundos / 60);
    const seg = segundos % 60;
    
    // padStart garante que tenha 2 dígitos (adiciona zero à esquerda)
    const minFormatado = String(minutos).padStart(2, '0');
    const segFormatado = String(seg).padStart(2, '0');
    
    return `${minFormatado}:${segFormatado}`;
}

export function placeContainerPaymentPix() {

    // botao de ação para pagamento do pix
    buttonPayPix.addEventListener('click', () => {
        const pixKey = document.getElementById('pix-pagamento').value;
        informButton.disabled = true;

        if(pixKey === '') {
            returnError.innerText = 'O campo de chave pix está vazio!';
            
            setTimeout(() => {
                returnError.innerText = '';
            }, 3000);
        
        } else {

            // Limpa a área do PIX antes de gerar um novo (evita duplicar)
            // Se já existir um QR Code antigo ou contador, removemos.
            contador.style.display = 'flex'
            contador.innerText = ''
            qrCodeContainer.style.display = 'flex';
            qrCodeContainer.innerText = ''
            
            const oldQr = document.getElementById('qr-code');
            const oldContador = document.getElementById('contadorShow');
            if (oldQr) oldQr.remove();
            if (oldContador) oldContador.remove();

            // os adicionando na area do pix 
            areaPix.appendChild(qrCodeContainer);
            areaPix.appendChild(contador);
            

            // Gera o QR Code
            new QRCode(qrCodeContainer, {
                text: `Chave Pix: ${pixKey}, Valor: R$ ${totalValue.toFixed(2)}`,
                width: 200,
                height: 200
            });

            // retirada do auto title
            qrCodeContainer.removeAttribute('title');

            // Esconde o botão e reinicia o tempo (caso o usuário esteja gerando de novo)
            buttonPayPix.style.display = 'none';
            buttonPagar.style.display = 'none';
            
            // Limpa o intervalo antigo se existir (para não rodar dois cronômetros)
            if (intervalo) clearInterval(intervalo);
            
            tempoRestante = 10; // Reset o tempo para 60s

            // 5. Inicia o cronômetro
            intervalo = setInterval(() => {
                tempoRestante--;

                // Atualiza o texto (corrigido o "minutos" que estava sobrando)
                contador.innerText = `${formatarTempo(tempoRestante)} para confirmar o pagamento`;

                // remove a classe 
                contador.classList.remove('aviso');

                // atribui a classe quando o tempo chegar a 10s
                if (tempoRestante <= 10) {
                    contador.classList.add('aviso');
                }

                if (tempoRestante <= 0) {
                    clearInterval(intervalo); // Para o cronômetro
                    
                    // Limpa a tela
                    contador.innerText = "00:00 - QR Code Expirado!";
                    pagamentoSuccess();
                    setTimeout(() => {
                        contador.style.display = 'none'
                        qrCodeContainer.style.display = 'none';
                    }, 1500)
                    
                }

            }, 1000);
        }
    });
        
}


