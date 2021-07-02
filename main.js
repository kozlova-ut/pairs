(() => {

    function createArray(value) {
        const size = value * value;
        const array = [];

        for (let s = 1; s <= size/2; s++) {
            array.push(s);
            array.push(s);
        };

        const newArray = shuffleArr(array);

        return {
            newArray,
            value,
            size,
        };
    };

    function shuffleArr(array) {
        const newArray = [];

        while (array.length > 0) {
            const randomIndex = Math.round(Math.random()*(array.length-1));
            const randomItem = array[randomIndex];

            newArray.push(randomItem);
            array.splice(randomIndex,1);
          };

        return newArray;
    };

    function startGame(container, input, field) {
        let value = input.value;

        if (value < 2 || value > 10 || value % 2 != 0) {
            value = 4;
        };

        const finish = document.createElement('div');
        const losing = document.createElement('div');

        const congratulations = document.createElement('h2');
        const lossMessage = document.createElement('h2');
        const newGameWIN = document.createElement('button');
        const newGameLOSE = document.createElement('button');

        congratulations.textContent = 'Поздравляю! Вы победили!';
        lossMessage.textContent = 'Время вышло';
        newGameWIN.textContent = 'Новая игра';
        newGameLOSE.textContent = 'Новая игра';
        newGameWIN.classList.add('new-game');
        newGameLOSE.classList.add('new-game');

        finish.append(congratulations);
        finish.append(newGameWIN);
        losing.append(lossMessage);
        losing.append(newGameLOSE);

        const array = createArray(value).newArray;
        const cardList = document.createElement('ul');
        const timer = document.createElement('div');
        const flipped = document.getElementsByClassName('is-flipped');

        let timerValue = '60';
        let counter = 0;
        
        timer.textContent = '60';
        timer.classList.add('timer');
        cardList.style.width = 90 * value + 'px';

        field.append(timer);
        field.append(cardList);
        container.append(field);

        function flipBack(){
            const timeoutIDFlip = window.setTimeout(flipDelay, 1200);
            const timeoutIDPointer = window.setTimeout(pointerDelay, 1400);
        };

        function flipDelay(){
            flipped[1].classList.remove('is-flipped');
            flipped[0].classList.remove('is-flipped');
        };

        function pointerDelay() {
            const cards = document.getElementsByTagName('li');
            for (const c of cards) {
                c.style.pointerEvents = 'auto';
            };
        };

        function reduseTimer(){
            timerValue -=1;
            timer.textContent = timerValue;
            if (timerValue === -1) {
                field.style.display = 'none';
                container.append(losing);
            };
        };

        (function startTimer(){
            timer.textContent = timerValue;
            const intervalID = window.setInterval(reduseTimer, 1000)
        })();

        for (const a of array) {
            const card = document.createElement('li');
            const front = document.createElement('div');
            const back = document.createElement('div');

            front.classList.add('card__face', 'card__face--front');
            back.classList.add('card__face', 'card__face--back');

            card.append(front);
            card.append(back);
            cardList.append(card);
            front.textContent = a;

            card.addEventListener('click', () => {
                card.classList.add('is-flipped');
                card.style.pointerEvents = 'none';
                counter++;

                if (counter === 2 ) {
                    const notFlipped = document.querySelectorAll('li:not(.is-flipped)');

                    for (const n of notFlipped) {
                        n.style.pointerEvents = 'none';
                    };

                    if (flipped[0].textContent === flipped[1].textContent){
                        flipped[0].classList.add('founded');
                        flipped[1].classList.add('founded');
                    };

                    const founded = document.querySelectorAll('.founded');

                    if (founded.length === value*value) {
                      const timeoutIDFinish = window.setTimeout(finishDelay, 1200);
                    };

                    flipBack();
                    counter = 0;

                    function finishDelay() {
                        field.style.display = 'none';
                        container.append(finish);
                    };

                    newGameWIN.addEventListener('click', () => {
                      window.location.reload();
                    });
                };
            });
        };

        newGameLOSE.addEventListener('click', () => {
            window.location.reload();
        });
    };

    function createApp(container) {
        const questionForm = document.createElement('div');
        const field = document.createElement('div');

        const form = document.createElement('form');
        const question = document.createElement('h2');
        const condition = document.createElement('p');
        const input = document.createElement('input');
        const button = document.createElement('button');
        
        question.textContent = 'Введите размер поля';
        condition.textContent = 'Укажите четное число от 2 до 10';
        button.textContent = 'START';

        form.append(question);
        form.append(condition);
        form.append(input);
        form.append(button);
        questionForm.append(form);
        container.append(questionForm);

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            questionForm.style.display = 'none';
            startGame(container ,input, field);
        });
    };

    window.createApp = createApp;
})();
