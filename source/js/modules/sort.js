'use strict';

(() => {
  const ACTIVE_SORT_TYPE_CLASS = `sort-panel__type--active`;
  const ACTIVE_SORT_DIRECTION_CLASS = `sort-panel__direction--active`;

  const sortTypeButtons = Array.from(document.querySelectorAll(`.sort-panel__type`));
  const sortDirectionButtons = Array.from(document.querySelectorAll(`.sort-panel__direction`));

  const onBtnClick = (evt) => {
    const selectedBtn = evt.target;
    let activeClass = ``;
    let btns = [];

    if (sortTypeButtons.includes(selectedBtn)) {
      activeClass = ACTIVE_SORT_TYPE_CLASS;
      btns = sortTypeButtons;
    } else {
      activeClass = ACTIVE_SORT_DIRECTION_CLASS;
      btns = sortDirectionButtons;
    }

    btns
      .filter((btn) => btn.classList.contains(activeClass))
      .forEach((btn) => btn.classList.remove(activeClass));

    selectedBtn.classList.add(activeClass);
  };

  sortTypeButtons.forEach((btn) => btn.addEventListener(`click`, onBtnClick));
  sortDirectionButtons.forEach((btn) => btn.addEventListener(`click`, onBtnClick));
})();
