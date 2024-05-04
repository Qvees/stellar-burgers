import exp from 'constants';
import Cypress from 'cypress';

export const url = 'https://norma.nomoreparties.space/api';
describe('Stellar-burgers tests', async () => {
  const ingredientId = '643d69a5c3f7b9001cfa0941';
  beforeEach(() => {
    // моковые данные из файла ingredients.json
    cy.fixture('ingredients.json').as('ingredientsData');
    cy.intercept('GET', `${url}/ingredients`, {
      fixture: 'ingredients.json'
    }).as('getIngredients');

    // Установка моковых данных ответа на запрос данных пользователя
    cy.intercept('GET', `${url}/auth/user`, { fixture: 'userData.json' }).as(
      'getUserData'
    );

    // Установка моковых данных ответа на запрос данных о заказе
    cy.intercept('POST', `${url}/orders`, { fixture: 'orderData.json' }).as(
      'getOrderData'
    );
    // Подставляем моковые токены авторизации
    cy.fixture('authTokens.json').then((tokens) => {
      cy.setCookie('accessToken', tokens.accessToken);
      cy.setCookie('refreshToken', tokens.refreshToken);
    });
    cy.visit('/');
    // дождаться загрузки данных пользователя
    cy.wait('@getUserData');
    // ждем пока запрос на получение ингредиентов будет завершен
    cy.wait('@getIngredients');
  });

  afterEach(() => {
    cy.clearCookie('accessToken');
    cy.clearLocalStorage('refreshToken');
  });

  it('проверяем что данные об ингредиентах получены', () => {
    expect('@getIngredients');
  });

  it('проверяем что данные о пользователи получены', () => {
    expect('@getUserData');
  });

  it('добавляем ингредиенты в конструктор', () => {
    // Найдем все кнопки "Добавить" и кликнем на них // если ингредиентов будет много клик будет по всем(может нужен другой вариант)
    cy.get(`[data-cy=${ingredientId}]`).children('button').click();
    cy.get('[data-cy=643d69a5c3f7b9001cfa093c]').children('button').click();
    cy.get('[data-cy=643d69a5c3f7b9001cfa0943]').children('button').click();
  });

  it('открываем модальное окно ингредиента', () => {
    // Откроем модальное окно первого ингредиента
    cy.get(`[data-cy=${ingredientId}]`).click();
    // проверяем что модальное окно открыто
    cy.get('[data-cy=modal]').should('exist');
  });

  it('закрываем модальное окно на крестик', () => {
    cy.get(`[data-cy=${ingredientId}]`).click();
    // закроем модальное окно на крестик
    cy.get('[data-cy=closeModal]').click();
    // проверим что модальное окно больше не существует
    cy.get('[data-cy=modal]').should('not.exist');
  });

  it('закрываем модальное окно при клике на оверлей', () => {
    // откроем модальное окно первого ингредиента
    cy.get(`[data-cy=${ingredientId}]`).click();
    // проверим что модальное окно открыто
    cy.get('[data-cy=modal]').should('exist');
    // кликаем на оверлей чтобы закрыть модальное окно
    cy.get('[data-cy=overlay]').click({ force: true });
    // проверимчто модальное окно больше не существует
    cy.get('[data-cy=modal]').should('not.exist');
  });
  it('оформляем заказа бургера', () => {
    // найдем все кнопки "Добавить" и кликнем на них // если ингредиентов будет много клик будет по всем(может нужен другой вариант)
    cy.get(`[data-cy=${ingredientId}]`).children('button').click();
    cy.get('[data-cy=643d69a5c3f7b9001cfa093c]').children('button').click();
    cy.get('[data-cy=643d69a5c3f7b9001cfa0943]').children('button').click();
    // жмем кнопку оформит заказ
    cy.get('[data-cy=orderConstructor]')
      .find('button')
      .contains('Оформить заказ')
      .click();
    //проверяем что модальное окно открылось и содержит номер заказа
    expect(cy.get('[data-cy=modal]').contains('1'));
    //закрываем модальное окно (тут почему то находит 2 элемента кнопоки или оверлея)
    cy.get('[data-cy=overlay]').first().click({ multiple: true, force: true });
    //проверяем что конструктор пуст
    cy.get('[data-cy=orderConstructor]')
      .find('[data-cy=constructorIngredientsList]')
      .find('[data-cy=emptyConstructorIngredients]');
  });
});
