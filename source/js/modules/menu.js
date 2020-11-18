'use strict';

(() => {
  const container = document.querySelector(`#main-header-js`);

  if (container) {

    const BUTTON_OPEN_CLASS = `main-header__toggle-button--opened`;
    const MENU_OPEN_CLASS = `main-header__menu--opened`;
    const BASKET_OPEN_CLASS = `main-header__basket--opened`;

    const createElement = (template) => {
      const newElement = document.createElement(`div`);
      newElement.innerHTML = template;

      return newElement.firstChild;
    };

    const createToggleButton = () => {
      const buttonTemplate = (
        `<button class="main-header__toggle-button" type="button">
          <span>Изменить видимость меню</span>
        </button>`
      );

      const button = createElement(buttonTemplate);
      button.addEventListener(`click`, () => {
        if (toggleButton.classList.contains(BUTTON_OPEN_CLASS)) {
          toggleButton.classList.remove(BUTTON_OPEN_CLASS);
          menu.classList.remove(MENU_OPEN_CLASS);
          basket.classList.remove(BASKET_OPEN_CLASS);
        } else {
          toggleButton.classList.add(BUTTON_OPEN_CLASS);
          menu.classList.add(MENU_OPEN_CLASS);
          basket.classList.add(BASKET_OPEN_CLASS);
        }
      });

      return button;
    };

    const menu = container.querySelector(`#main-header__menu-js`);
    const basket = container.querySelector(`#main-header__basket-js`);
    const toggleButton = createToggleButton();

    container.insertAdjacentElement(`afterBegin`, toggleButton);
  }
})();
