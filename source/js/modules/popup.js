'use strict';

(() => {
  const OPENED_CLASS = `popup--opened`;
  const NO_JS_CLASS = `popup--no-js`;
  const ERROR_SUBMIT_CLASS = `popup--error`;
  const ERROR_INPUT_CLASS = `popup__input--error`;
  const ERROR_MESSAGE = `Обязательное поле для заполнения`;
  const URL = `https://echo.htmlacademy.ru/`;

  const openPopupBtn = document.querySelector(`#placement__description-button-js`);
  const popup = document.querySelector(`#popup-js`);
  const popupForm = popup.querySelector(`#popup__form-js`);
  const closePopupBtn = popup.querySelector(`#popup__close-button-js`);
  const submitPopupFormBtn = popup.querySelector(`#popup__submit-js`);
  const nameInput = popup.querySelector(`#popup-field-name-js`);
  const emailInput = popup.querySelector(`#popup-field-email-js`);
  const letterTextarea = popup.querySelector(`#popup-field-letter-js`);

  const LocalStorageKey = {
    NAME: `userName`,
    EMAIL: `userEmail`,
  };

  const onEscKeyDown = (evt) => {
    if (evt.code === `Escape`) {
      closePopup();
    }
  };

  const openPopup = (evt) => {
    evt.preventDefault();

    popup.classList.add(OPENED_CLASS);

    nameInput.value = localStorage.getItem(LocalStorageKey.NAME);
    emailInput.value = localStorage.getItem(LocalStorageKey.EMAIL);

    closePopupBtn.addEventListener(`click`, closePopup);
    submitPopupFormBtn.addEventListener(`click`, submitForm);
    nameInput.addEventListener(`input`, onFieldDataChanged);
    emailInput.addEventListener(`input`, onFieldDataChanged);
    letterTextarea.addEventListener(`input`, onFieldDataChanged);
    document.addEventListener(`keydown`, onEscKeyDown);

    nameInput.focus();
  };

  const closePopup = (evt) => {
    if (evt) {
      evt.preventDefault();
    }

    popup.classList.remove(OPENED_CLASS);
    popup.classList.remove(ERROR_SUBMIT_CLASS);

    closePopupBtn.removeEventListener(`click`, closePopup);
    submitPopupFormBtn.removeEventListener(`click`, submitForm);
    nameInput.removeEventListener(`input`, onFieldDataChanged);
    emailInput.removeEventListener(`input`, onFieldDataChanged);
    letterTextarea.removeEventListener(`input`, onFieldDataChanged);
    document.removeEventListener(`keydown`, onEscKeyDown);

    openPopupBtn.focus();
  };

  const clearPopup = () => {
    nameInput.value = ``;
    emailInput.value = ``;
    letterTextarea.value = ``;
  };

  const submitForm = (evt) => {
    evt.preventDefault();

    popup.classList.remove(ERROR_SUBMIT_CLASS);

    if (isValidFormData()) {
      fetch(URL, {
        method: `POST`,
        body: new FormData(popupForm),
      })
        .then((response) => {
          if (!response.ok) {
            popup.classList.add(ERROR_SUBMIT_CLASS);

            throw new Error(`_${response.status}: ${response.statusText}`);
          }

          localStorage.setItem(LocalStorageKey.NAME, nameInput.value);
          localStorage.setItem(LocalStorageKey.EMAIL, emailInput.value);

          clearPopup();
          closePopup();

          return response;
        })
        .catch((error) => {
          popup.classList.add(ERROR_SUBMIT_CLASS);

          throw error;
        });
    }
  };

  const isValidField = (field) => {
    if (field.value.length > 0) {
      field.setCustomValidity(``);

      return true;
    }

    field.setCustomValidity(ERROR_MESSAGE);
    field.classList.add(ERROR_INPUT_CLASS);
    setTimeout(() => {
      field.classList.remove(ERROR_INPUT_CLASS);
    }, 500);

    return false;
  };

  const isValidFormData = () => {
    return isValidField(nameInput)
      && isValidField(emailInput)
      && isValidField(letterTextarea);
  };

  const onFieldDataChanged = (evt) => {
    isValidField(evt.target);
  };

  if (popup && openPopupBtn && closePopupBtn && submitPopupFormBtn) {
    popup.classList.remove(NO_JS_CLASS);
    openPopupBtn.addEventListener(`click`, openPopup);

    nameInput.required = false;
    emailInput.required = false;
    letterTextarea.required = false;
  }
})();
