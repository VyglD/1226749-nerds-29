import {createElement} from "./utils";

const SLIDE_ACTIVE_CLASS = `principles__slide--active`;
const BUTTON_ACTIVE_CLASS = `principles__control-button--active`;
const MORE_INFO_BUTTON_CLASS = `principles__slide-button`;

const createButtonTemplate = (number) => {
  return (`
    <li>
      <button class="principles__control-button  ${number ? `` : BUTTON_ACTIVE_CLASS}" type="button">
        <span class="visually-hidden">Принцип ${number + 1}</span>
      </button>
    </li>
  `);
};

const createSliderButton = (sliderContainer, slide, number) => {
  const buttonWrapper = createElement(createButtonTemplate(number));
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

const init = () => {
  const sliderContainer = document.querySelector(`.principles`);

  if (sliderContainer) {

    const beforeInsertBlock = sliderContainer.querySelector(`#principles__slider-js`);
    const slides = sliderContainer.querySelectorAll(`.principles__slide`);

    const buttonsContainer = createElement(`<ul class="principles__control list-reset"></ul>`);

    slides.forEach((slide, index) => {
      slide.classList.remove(`principles__slide--no-js`);
      slide.querySelector(`.${MORE_INFO_BUTTON_CLASS}`)
        .classList.remove(`principles__slide-button--no-js`);

      buttonsContainer.append(createSliderButton(sliderContainer, slide, index));
    });

    beforeInsertBlock.after(buttonsContainer);
    beforeInsertBlock.classList.remove(`principles__slider--no-js`);
  }
};

export default {init};
