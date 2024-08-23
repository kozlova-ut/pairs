export const appContainer = document.getElementById('pairs-app');

export function createItem(tag, text, ...classes) {
    const element = document.createElement(tag);
    element.textContent = text;
    classes.map( item => element.classList.add(item) );
    return element
}

export function startTimer(game) {
    game.timer.textContent = game.timerValue;
    const boundTimer = reduceTimer.bind(game);
    game.intervalID = setInterval(boundTimer, 1000);
}

function reduceTimer() {
    this.timerValue -= 1;
    this.timer.textContent = this.timerValue;
    if (this.timerValue === -1) {
        clearInterval(this.intervalID);
        this.timerValue = 60;
        this.gameContent.remove();
        this.showResult('lose');
    }
}

export function createArray(size) {
    const arrLength = size ** 2;
    const array = [];

    for (let i=1; i <= arrLength/2; i++) {
        array.push(i, i);
    }

    const newArray = shuffleArray(array);
    return newArray;
}

function shuffleArray(array) {
    const newArray = [];

    while (array.length > 0) {
        const randomIndex = Math.round(Math.random()*(array.length-1));
        const randomItem = array[randomIndex];

        newArray.push(randomItem);
        array.splice(randomIndex,1);
      };

    return newArray;
};

function disablePointerEvents(cards) {
    cards.forEach(card => card.style.pointerEvents = 'none');
};

function enablePointerEvents(cards) {
    cards.forEach(card => card.style.pointerEvents = 'auto');
};

export class Card {
    constructor(game, container, cardNumber) {
        this.game = game
        this.container = container
        this.cardNumber = cardNumber
        this.createCard()
    }

    set cardNumber(value) {
        this._cardNumber = value;
    }

    get cardNumber() {
        return this._cardNumber;
    }


    set open(value) {
        this._open = value;

        switch (value) {
            case true: 
                this.card.classList.add('is-flipped');
                this.card.style.pointerEvents = 'none';
                break

            case false: 
                this.card.classList.remove('is-flipped');
                this.card.style.pointerEvents = 'auto';
                break
        }
    }

    get open() {
        return this._open;
    }

    set success(value) {
        this._success = value;

        if (value == false) {
            this.card.classList.remove('is-flipped');
            this.card.style.pointerEvents = 'auto';
        }
    }

    get success() {
        return this._success;
    }

    createCard() {
        const card = createItem('li');
        this.card = card;

        const front = createItem('div', this.cardNumber, 'card__face', 'card__face--front');
        const back = createItem('div', '', 'card__face', 'card__face--back');

        card.append(front, back);
        this.container.append(card);

        card.addEventListener('click', () => {
            this.open = !this.open;   
            
            if (this.open) {
                this.game.opened.push(this);

                if (this.game.opened.length === 2) {
                    const notFlipped = document.querySelectorAll('li:not(.is-flipped)');

                    disablePointerEvents(notFlipped);
                    setTimeout(() => enablePointerEvents(notFlipped), 1000);

                    if (this.game.opened[0].cardNumber === this.game.opened[1].cardNumber) {
                        this.game.opened[0].success = true;
                        this.game.opened[1].success = true;
                        this.game.opened = [];

                        if (notFlipped.length === 0) {
                            clearInterval(this.game.intervalID);
                            this.game.timerValue = 60;
                            setTimeout( () => {
                                this.game.gameContent.remove();
                                this.game.showResult('win');
                            }, 1000)
                        }
                    }
                    else {
                        setTimeout( () => {
                            this.game.opened[0].open = false;
                            this.game.opened[1].open = false;
                            this.game.opened = [];
                        }, 1000)        
                    }  
                }
            } 
        })
    }
}

export class AmazingCard extends Card {
    constructor(game, container, cardNumber) {
        super(game, container, cardNumber);
        this.changeToImg();
    }

    changeToImg() {
        const front = this.card.children[0];
        front.textContent = '';
        front.style.background = `url(pics/${this.cardNumber}.svg) center no-repeat`;
    }
}

export class Result {
    constructor(app, final, status) {
        this.app = app,
        this.final = final,
        this.message = status,
        this.create()
    }

    set message(status) {
        switch(status){
            case 'win':
                this._message = 'Поздравляю! Вы победили!';
                break;
            case 'lose':
                this._message = 'Время вышло';
                break;
        }       
    }

    get message() {
        return this._message
    }

    create() {
        const resultContent = createItem('div');   
        const message = createItem('h1', this.message);
        const button = createItem('button', 'Новая игра');
        resultContent.append(message, button);
        this.resultContent = resultContent;

        button.addEventListener('click', () => {
            this.final.clear();
            this.app.start();
        })
    }
}