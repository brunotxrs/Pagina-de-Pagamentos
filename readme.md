# 💳 Página de Pagamentos (Checkout)

Projeto desenvolvido para a **Atividade 3** da UC 13 — Codificação de Páginas Web (Tec_System_Developer). O objetivo é implementar a lógica de negócios de uma tela de checkout, permitindo o pagamento via **Pix** (com desconto) ou **Cartão de Crédito** (com parcelamento e juros), controlando dinamicamente a exibição de painéis e validando as entradas do usuário.

## 🎯 Funcionalidades Implementadas

O projeto atende e supera todos os requisitos do enunciado:

- **Validação de Valor:** Aviso em tela caso o usuário tente informar os dados sem preencher o valor da compra.
- **Painel Dinâmico:** Exibição exclusiva dos painéis de Pix ou Cartão de Crédito (nunca os dois ao mesmo tempo).
- **Lógica do Pix:**
  - Aplicação automática de **10% de desconto** sobre o valor informado.
  - Geração de QR Code simulado para pagamento.
  - *(Extra)* Cronômetro regressivo de expiração do QR Code.
- **Lógica do Cartão de Crédito:**
  - Identificação de bandeira em tempo real ao digitar (iniciando com `1234` exibe bandeira Visa; `4321` exibe Mastercard).
  - Alerta de "Número de cartão inválido" caso a numeração não corresponda às bandeiras.
  - Cálculo automático de parcelamento:
    - 1x a 3x: **Sem juros**.
    - 4x: **5% de juros** sobre o valor base.
    - 5x: **10% de juros** sobre o valor base.
  - Atualização dinâmica do valor Total ao trocar a quantidade de parcelas.
- **Feedback de Pagamento:** Exibição de um *overlay* de sucesso ao finalizar a compra em ambos os métodos.
- *(Extra)* Máscaras de entrada para Moeda (R$), Data de Vencimento (MM/AA) e CVV.

## 🛠️ Tecnologias e Arquitetura

O grande diferencial deste projeto foi a separação do código em **Módulos ES6 (ES Modules)**, garantindo que cada arquivo tenha apenas uma responsabilidade.

- **HTML5 / CSS3**
- **JavaScript (ES6+)**
- **Bibliotecas Externas (via CDN):**
  - [QRCode.js](https://github.com/davidshimjs/qrcodejs) (Geração do QR Code do Pix)
  - [jQuery](https://jquery.com/) + [Inputmask](https://github.com/RobinHerbots/Inputmask) (Máscara do cartão de crédito)
  - [Font Awesome](https://fontawesome.com/) (Ícones)

## 📁 Estrutura de Pastas (JavaScript)

A arquitetura do JavaScript foi desenhada da seguinte forma:

```text
src/
├── css/
│   └── pagina-pagamentos.css      # Estilos globais e animações
├── assets/                        # Imagens, ícones e favicon
└── js/
    ├── engineer.js                # Ponto de entrada (Startup do sistema)
    ├── pagePayments.js            # Orquestrador (Chama as funções de inicialização)
    ├── elementsDom.js             # Mapeamento e exportação de todos os elementos do DOM
    ├── utils.js                   # Funções puras (Máscaras, Validadores, limpeza de input)
    ├── informPayments.js          # Lógica do formulário principal e dos radio buttons
    ├── paymentPix.js              # Toda a regra de negócio do Pix (Desconto, QRCode, Timer)
    └── paymentCreditCard.js       # Toda a regra de negócio do Cartão (Juros, Bandeiras, Validação)
```

### 🧠 Decisões Técnicas da Refatoração
1. **`elementsDom.js` centralizado:** Todos os `document.getElementById` são feitos em um único lugar. Se o HTML mudar, só precisamos atualizar um arquivo.
2. **`utils.js` isolado:** As funções não dependem de estado global. Recebem parâmetros e devolvem resultados puros.
3. **Desacoplamento:** Os arquivos de Pix e Cartão não sabem da existência um do outro. Quem controla a exclusividade dos painéis é o `informPayments.js`.

## 🚀 Como Executar o Projeto

1. Clone o repositório:
   ```bash
   git clone https://github.com/brunotxrs/Pagina-de-Pagamentos
   ```
2. Como o projeto utiliza **ES Modules**, ele precisa ser executado em um servidor local (não pode ser aberto clicando duas vezes no `index.html`).
3. Abra a pasta no VS Code e utilize a extensão **Live Server**, ou rode via terminal:
   ```bash
   npx serve .
   # ou
   python -m http.server
   ```
4. Acesse a URL gerada pelo servidor (ex: `http://localhost:5500`).

## 🧪 Como Testar a Regra de Negócio

- **Pix:** Insira o valor `100,00` e clique em informar dados. O total deverá ser `R$ 90,00` (10% de desconto).
- **Cartão:** Insira o valor `100,00`, escolha Cartão, digite `1234` ou `4321` no número. O select de parcelas mostrará até 5x. Ao selecionar 4x, o total será `R$ 105,00` (5% de juros).
- **Validações:** Tente pagar sem preencher algum campo para ver os alertas.

## 👤 Autor

**Bruno Teixeira**
- GitHub: [@brunotxrs](https://github.com/brunotxrs)

---

*Projeto acadêmico desenvolvido para o Senac EAD.*