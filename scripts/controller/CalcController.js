class CalcController {

    constructor(){
        this._mainDisplayEl = document.querySelector('#display'); //display principal da calc
        this._topDisplayEl = document.querySelector('#data'); //display superior, memoria
        this._timeEl = document.querySelector('#hora');// display que mostra a hora       
        this._currentNumber = []; //armazena temporariamente os numeros do display principal
        this._memoryNumber = []; // memoria onde armazena os numeros do display superior para as operações
        this._keyboardOn = true; // bloqueia o teclado caso exceda o numero de caracteres do display
        this.initialize(); // função que inicia as informações para os displays
        this.initButtonsEvents();// função que gera eventos aos botões
        this.initKeyboardEvents();//função que identifica as teclas pressionadas no teclado
    }

    initialize(){ 
        
        this._topDisplayEl.innerHTML = (this._memoryNumber == undefined ? '':this._memoryNumber);
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

    initKeyboardEvents(){

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
                if (this._memoryNumber.join().slice(-1) == '='){//cond caso o ultimo caracter da memoria seja o btn igual

                    this.clear(this._currentNumber); 
                    this.clear(this._memoryNumber);
                    this.topDisplay = this._memoryNumber;                           
                    
                }
                this._currentNumber.push(btnValue)
                
                if (this._currentNumber.length > 1){//cond para concatenar mais de um numero
                    
                    this._currentNumber = [this._currentNumber.join('')];
                        
                }
                this.mainDisplay = this._currentNumber;

            }else{
                return false
            }
           
        }else if (btnValue == 'ac' || btnValue == 'ce'){//cond para limpar a tela conforme valor recebido
            
            if (btnValue == 'ac'){
                this.clear(this._currentNumber); 
                this.clear(this._memoryNumber);                
                
            }else {
                this.clear(this._currentNumber);                
            }

            this.mainDisplay = '0'; 
            this.topDisplay = this._memoryNumber;
            this._keyboardOn = true;

        }else if (btnValue == '='){// cond caso o valor recebido seja o sinal de igual
            this._keyboardOn = true;
            this.operations(btnValue);
            this._memoryNumber = [this._memoryNumber + this._currentNumber + btnValue];
            this.topDisplay = this._memoryNumber;
            
        }else{ // condição caso valor recebido seja um sinal de operação          
            this._keyboardOn = true;
            if(this._memoryNumber.length == 0){
                this._memoryNumber = [this._currentNumber+btnValue];
                this.topDisplay = this._memoryNumber;
                this._currentNumber = [];                

            }else if(this._currentNumber.length == 0){
                this._memoryNumber = [this._memoryNumber.join().slice(0,-1)+btnValue]
                this.topDisplay = this._memoryNumber;
                
            }else {                
                this.operations(btnValue);
                this.topDisplay = this._memoryNumber;                
            }
        }
    }

    clear(arr){//função que limpa o array informado no argumento

        arr.length = 0
    }
    
    operations(symbol){//função que realiza o calculo recebendo como parametro o sinal da operação pressionado

        try{
            if (symbol == "="){
                this.mainDisplay = eval(this._memoryNumber+this._currentNumber);
                this._memoryNumber = [eval(this._memoryNumber+this._currentNumber)];
                this._currentNumber = [];            

            }else if(symbol == '%') { 
                this._currentNumber = [eval(this._currentNumber / 100)];
                this.mainDisplay = this._currentNumber;
                
            }else{
                this.mainDisplay = eval(this._memoryNumber+this._currentNumber);
                this._memoryNumber = [eval(this._memoryNumber+this._currentNumber) + symbol]
                this._currentNumber = []
                this.topDisplay = this._memoryNumber;            
            }
        } catch{//caso de algum erro na operação
            this.mainDisplay = '0';
            this.topDisplay = '';
            this._memoryNumber = [];
            this._currentNumber = [];
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