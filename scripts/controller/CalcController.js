class CalcController {

    constructor(){
        this._mainDisplayEl = document.querySelector('#display'); //display principal da calc
        this._topDisplayEl = document.querySelector('#data'); //display superior, memoria
        this._timeEl = document.querySelector('#hora');// display que mostra a hora       
        this._firstField = []; //armazena temporariamente os numeros do display principal
        this._othersFields = []; // memoria onde armazena os numeros do display superior para as operações
        this._keyboardOn = true; // bloqueia o teclado caso exceda o numero de caracteres do display
        this.initialize(); // função que inicia as informações para os displays
        this.initButtonsEvents();// função que gera eventos aos botões
        this.initKeyboard();//função que identifica as teclas pressionadas no teclado
    }

    initialize(){ 
        
        this._topDisplayEl.innerHTML = (this._othersFields == undefined ? '':this._othersFields);
        this._timeEl.innerHTML = new Date().toLocaleTimeString('pt-br',{'hour':'2-digit','minute':'2-digit'});

        //Atualizado a hora a cada segundo
        setInterval(()=>{
            this._timeEl.innerHTML = new Date().toLocaleTimeString('pt-br',{'hour':'2-digit','minute':'2-digit'});
            
        },1000);        
    }

    initButtonsEvents(){
        
        let buttons = document.querySelectorAll('#buttons > g, #parts > g');

        buttons.forEach(btn =>{
            btn.addEventListener('mouseover', event =>{
                btn.style.cursor = 'pointer';                
            })
            btn.addEventListener('click', event =>{
                this.inputs(btn.className.baseVal.replace('btn-',''));                
            })
        })
    }

    initKeyboard(){

        let keys = ['0','1','2','3','4','5','6','7',
            '8','9','.','=','+','-','*','/','%','ac','ce'];

        document.addEventListener('keyup', event =>{
            if(keys.includes(event.key) || event.key == 'Enter' || event.key == 'Escape'){

                if (event.key == 'Enter'){
                    this.inputs('=');
                }else if (event.key == 'Escape'){ 
                    this.inputs('ac');
                }else {
                    this.inputs(event.key);
                }                              
            }            
        })
    }

    inputs(btnValue){ //Função que trata os valores inseridos, recebe botao/tecla pressionado(a) como argumento
              
        if (isNaN(btnValue)==false || btnValue == '.'){//Condição caso o valor recebido seja um numero ou um ponto
            
            if (this._keyboardOn){//cond para bloquear a inclusão de novos numeros caso excedido os caracteres do display
                if (this._othersFields.join().slice(-1) == '='){//cond caso o ultimo caracter da memoria seja o btn igual

                    this.clear(this._firstField); 
                    this.clear(this._othersFields);
                    this.topDisplay = this._othersFields;                           
                    
                }
                this._firstField.push(btnValue)
                
                if (this._firstField.length > 1){//cond para concatenar mais de um numero
                    
                    this._firstField = [this._firstField.join('')];
                        
                }
                this.mainDisplay = this._firstField;

            }else{
                return false
            }
           
        }else if (btnValue == 'ac' || btnValue == 'ce'){//cond para limpar a tela conforme valor recebido
            
            if (btnValue == 'ac'){
                this.clear(this._firstField); 
                this.clear(this._othersFields);                
                
            }else {
                this.clear(this._firstField);                
            }

            this.mainDisplay = '0'; 
            this.topDisplay = this._othersFields;
            this._keyboardOn = true;

        }else if (btnValue == '='){// cond caso o valor recebido seja o sinal de igual
            this._keyboardOn = true;
            this.operations(btnValue);
            this._othersFields = [this._othersFields + this._firstField + btnValue];
            this.topDisplay = this._othersFields;
            
        }else{ // condição caso valor recebido seja um sinal de operação          
            this._keyboardOn = true;
            if(this._othersFields.length == 0){
                this._othersFields = [this._firstField+btnValue];
                this.topDisplay = this._othersFields;
                this._firstField = [];                

            }else if(this._firstField.length == 0){

                this._othersFields = [this._othersFields.join().slice(0,-1)+btnValue]
                this.topDisplay = this._othersFields;
                
            }else {                
                this.operations(btnValue);
                this.topDisplay = this._othersFields;                
            }
        }
    }

    clear(arr){//função que limpa o array informado no argumento

        arr.length = 0
    }
    
    operations(symbol){//função que realiza o calculo recebendo como parametro o sinal da operação pressionado

        try{
            if (symbol == "="){
                this.mainDisplay = eval(this._othersFields+this._firstField);
                this._othersFields = [eval(this._othersFields+this._firstField)];
                this._firstField = [];            

            }else if(symbol == '%') { 
                this._firstField = [eval(this._firstField / 100)];
                this.mainDisplay = this._firstField;
                
            }else{
                this.mainDisplay = eval(this._othersFields+this._firstField);
                this._othersFields = [eval(this._othersFields+this._firstField) + symbol]
                this._firstField = []
                this.topDisplay = this._othersFields;            
            }
        } catch{//caso de algum erro na operação
            this.mainDisplay = '0';
            this.topDisplay = '';
            this._othersFields = [];
            this._firstField = [];
        }     
    }

    get mainDisplay(){
        return this._mainDisplayEl.innerHTML;
    }

    set mainDisplay(value){//função que altera a informação do display principal

        if(value.toString().length <= 10){// cond para tratar a quantidade de numeros no display principal
            this._mainDisplayEl.innerHTML = value;
            this._mainDisplayEl.style.fontSize = '50px';

        }else if (value.toString().length < 22){
            this._mainDisplayEl.style.fontSize = `${45 - value.toString().length}px`;
            this._mainDisplayEl.innerHTML = value;

        }else{//cond para bloquear o teclado para inserção de novos numeros por exceder o display
            this._keyboardOn = false;
        }
    }

    get topDisplay(){
        return this._topDisplayEl.innerHTML;
    }

    set topDisplay(value){
        this._topDisplayEl.innerHTML = value;
    }
    
}