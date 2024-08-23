/// <reference types="cypress" />

describe('В начальном состоянии игра должна иметь поле четыре на четыре клетки, в каждой клетке цифра должна быть невидима.', () => {

  beforeEach(() => {
    cy.visit('http://localhost:3000')
    cy.get('button').click();
  })

  it('Игра запускается', () => {
    cy.get('ul').should('be.visible');
  });

  it('Цифра в каждой клетке невидима', () => {
    cy.get('ul li').should('not.have.class', 'is-flipped');
  });
})

describe('Нажать на одну произвольную карточку. Убедиться, что она осталась открытой.', () => {

  beforeEach(() => {
    cy.visit('http://localhost:3000')
    cy.get('button').click();
  })

  it('Нажата одна произвольная карточка, карточка осталась открыта', () => {
    cy.get('ul li').then((listItems) => {

      const randomIndex = Math.floor(Math.random() * listItems.length);

      cy.wrap(listItems[randomIndex]).click();
      cy.wait(2000);
      cy.wrap(listItems[randomIndex]).should('have.class', 'is-flipped');
    });
  })
})

describe('Нажать на левую верхнюю карточку, затем на следующую. Если это не пара, то повторять со следующей карточкой, пока не будет найдена пара. Проверить, что найденная пара карточек осталась видимой.', () => {

  beforeEach(() => {
    cy.visit('http://localhost:3000')
    cy.get('button').click();
  })

  it('Найдена пара, карточки остались открыты', () => {
    cy.get('ul li').then((listItems) => {
      let value1, item1;

      const checkPairs = (index) => {
        cy.wrap(listItems[0]).click().then(item => {
          cy.wrap(item).find('.card__face--front').invoke('text').then(value => {
            value1 = value;
            item1 = item;
          })
        }).then(() => {
          cy.wrap(listItems[index]).click().then(item2 => {
            cy.wrap(item2).find('.card__face--front').invoke('text').then(value2 => {
              if (value1 === value2) {
                cy.wrap(item1).should('have.class', 'is-flipped');
                cy.wrap(item2).should('have.class', 'is-flipped');
              } else {
                checkPairs(index+1);
              }
            })
          })
        })
      }

      checkPairs(1);
    });
  });
})

describe('Нажать на левую верхнюю карточку, затем на следующую. Если это пара, то повторять со следующими двумя карточками, пока не найдутся непарные карточки. Проверить, что после нажатия на третью карточку две несовпадающие карточки становятся закрытыми.', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000')
    cy.get('button').click();
  })

  it.only('Непарные карточки закрываются', () => {
    cy.get('ul li').then((listItems) => {
      let x = 0;
      let y = 1;

      const checkPairs = (index) => {
        cy.wrap(listItems[index]).click().then(item1 => {
          cy.wrap(item1).find('.card__face--front').invoke('text').then(value1 => {
            return {item1, value1}
          })
        }).then((data) => {
          const item1 = data.item1;
          const value1= data.value1;

          cy.wrap(listItems[index+1]).click().then(item2=> {
            cy.wrap(item2).find('.card__face--front').invoke('text').then(value2 => {
              if (value1 !== value2) {
                cy.wrap(item1).should('not.have.class', 'is-flipped');
                cy.wrap(item2).should('not.have.class', 'is-flipped');
              }
              else {
                checkPairs(index+2);
              }
            })
          })
        })
      }

      checkPairs(0);
    })
  })
})