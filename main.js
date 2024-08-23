import { appContainer, createItem, startTimer, createArray, Card, AmazingCard, Result } from "./functions.js";

export const app = {
    start() {
        this.startMenu.create();
    },

    startMenu: {

        set enteredValue(value) {
            this._enteredValue = (value >= 2 && value <= 10 && value % 2 === 0 && value !== "") ? value : 4;
        },

        get enteredValue() {
            return this._enteredValue;
        },

        create(){
            const form = createItem('form');
            this.form = form;

            const question = createItem('h1', 'Введите размер поля');
            const description = createItem('span', 'Укажите четное число от 2 до 10');
            const input = createItem('input');
            const button = createItem('button', 'Start');

            form.append(question, description, input, button);
            appContainer.append(form);

            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.enteredValue = Number(input.value);
                input.value = '';
                this.clear();
                app.game.start();
            })
        },

        clear() {
            this.form.remove();
        }
    },

    game: {

        intervalID: null,
        timerValue: 60,
        opened: [],

        start(){
            const gameContent = createItem('div');
            const timer = createItem('div', '', 'timer');
            this.gameContent = gameContent;
            this.timer = timer;
            this.size= app.startMenu.enteredValue;


            const container = createItem('ul');
            container.style.width = 90 * this.size + 'px';
            const cardNumbersArray = createArray(this.size);

            for (const cardNumber of cardNumbersArray) {
                let card = new Card(this, container, cardNumber);
            }

            gameContent.append(timer, container);
            appContainer.append(gameContent);

            startTimer(this);
        },

        showResult(status) {
            app.final.show(status)
        },

        clear() {
            clearInterval(this.intervalID);
            this.timerValue = 60;
            this.gameContent.remove();
        }
    },

    final: {

        show(status){
            let result = new Result(app, this, status);
            this.result = result;
            appContainer.append(result.resultContent);
        },

        clear() {
            this.result.resultContent.remove();
        }
    }
}
