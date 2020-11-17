'use strict';

(() => {
  const sliderContainer = document.querySelector(`.principles`);

  if (sliderContainer) {
    const SLIDE_ACTIVE_CLASS = `principles__slide--active`;
    const BUTTON_ACTIVE_CLASS = `principles__control-button--active`;

    const createElement = (template) => {
      const newElement = document.createElement(`div`);
      newElement.innerHTML = template;

      return newElement.firstChild;
    };

    const createSliderButton = (slide, number) => {
      const buttonTemplate = (
        `<li>
          <button class="principles__control-button  ${number ? `` : BUTTON_ACTIVE_CLASS}" type="button">
            <span class="visually-hidden">Принцип ${number + 1}</span>
          </button>
        </li>`
      );

      const buttonWrapper = createElement(buttonTemplate);
      buttonWrapper.firstElementChild.addEventListener(`click`, (evt) => {
        const currentSlide = sliderContainer.querySelector(`.${SLIDE_ACTIVE_CLASS}`);

        if (currentSlide !== slide) {
          sliderContainer.querySelector(`.${BUTTON_ACTIVE_CLASS}`)
            .classList.remove(BUTTON_ACTIVE_CLASS);
          currentSlide.classList.remove(SLIDE_ACTIVE_CLASS);

          slide.classList.add(SLIDE_ACTIVE_CLASS);
          evt.target.classList.add(BUTTON_ACTIVE_CLASS);
        }
      });

      if (!number) {
        slide.classList.add(SLIDE_ACTIVE_CLASS);
      }

      return buttonWrapper;
    };

    const beforeInsertBlock = sliderContainer.querySelector(`#principles__slider-js`);
    const slides = sliderContainer.querySelectorAll(`.principles__slide`);

    const buttonsContainer = createElement(`<ul class="principles__control list-reset"></ul>`);

    slides.forEach((slide, index) => {
      slide.classList.remove(`principles__slide--no-js`);

      buttonsContainer.append(createSliderButton(slide, index));
    });


    beforeInsertBlock.after(buttonsContainer);
  }
})();
