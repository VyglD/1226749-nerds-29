'use strict';

(() => {
  const KeyCode = {
    left: `ArrowLeft`,
    right: `ArrowRight`,
  };

  const prevElement = document.querySelector(`#filter-panel__cost-title-js`);
  const minCost = document.querySelector(`#cost-min-js`);
  const maxCost = document.querySelector(`#cost-max-js`);

  const createElement = (template) => {
    const wrapper = document.createElement(`div`);
    wrapper.innerHTML = template;

    return wrapper.firstElementChild;
  };

  if (prevElement && minCost && maxCost) {
    const markup = (`
      <div class="filter-panel__cost-range">
        <div class="filter-panel__cost-range-line">
          <div
            class="filter-panel__cost-point filter-panel__cost-point--min"
            tabindex="0"
            id="filter-panel__cost-point-min-js"
            aria-label="Изменить минимальную стоимость"
          ></div>
          <div
            class="filter-panel__cost-point filter-panel__cost-point--max"
            tabindex="0"
            id="filter-panel__cost-point-max-js"
            aria-label="Изменить максимальную стоимость"
          ></div>
        </div>
      </div>
    `);

    const rangeBlock = createElement(markup);
    const rangeLine = rangeBlock.querySelector(`.filter-panel__cost-range-line`);
    const pointMin = rangeBlock.querySelector(`#filter-panel__cost-point-min-js`);
    const pointMax = rangeBlock.querySelector(`#filter-panel__cost-point-max-js`);

    const CostObj = {
      MIN: {
        propName: `--min-percent`,
        limitCostValue: 0,
        limitPropValue: 0,
        initPropValue: 0,
        input: minCost,
        point: pointMin,
      },
      MAX: {
        propName: `--max-percent`,
        limitCostValue: 22059,
        limitPropValue: 100,
        initPropValue: 68,
        input: maxCost,
        point: pointMax,
      },
    };

    const getCurrentPropValue = (costObj) => {
      return parseFloat(
          rangeBlock.style.getPropertyValue(costObj.propName).split(`%`)[0]
      );
    };

    const calculatePropValue = (costObj) => {
      const newCostValue = parseInt(costObj.input.value, 10);

      if (Number.isNaN(newCostValue)) {
        return costObj.limitPropValue;
      }

      return newCostValue / CostObj.MAX.limitCostValue * CostObj.MAX.limitPropValue;
    };

    const calculateCostValue = (costObj) => {
      const currentPropValue = getCurrentPropValue(costObj);

      return Math.round(
          CostObj.MAX.limitCostValue * currentPropValue / CostObj.MAX.limitPropValue
      );
    };

    const changeCostValue = (costObj) => {
      const newCostValue = calculateCostValue(costObj);

      if (parseFloat(costObj.input.value) !== newCostValue) {
        costObj.input.value = newCostValue;
      }
    };

    const makeSynchronization = (costObj, newPropValue) => {
      rangeBlock.style.setProperty(costObj.propName, `${newPropValue}%`);
      changeCostValue(costObj);
    };

    const changePropValue = (costObj, newPropValue) => {
      newPropValue = newPropValue ? newPropValue : calculatePropValue(costObj);

      if (newPropValue < CostObj.MIN.limitPropValue) {
        newPropValue = CostObj.MIN.limitPropValue;
      } else if (newPropValue > CostObj.MAX.limitPropValue) {
        newPropValue = CostObj.MAX.limitPropValue;
      }

      if (costObj === CostObj.MIN && newPropValue > getCurrentPropValue(CostObj.MAX)) {
        makeSynchronization(CostObj.MAX, newPropValue);
      } else if (costObj === CostObj.MAX && newPropValue < getCurrentPropValue(CostObj.MIN)) {
        makeSynchronization(CostObj.MIN, newPropValue);
      }

      makeSynchronization(costObj, newPropValue);
    };

    const onChangeCostValue = (evt) => {
      if (evt.target === CostObj.MIN.input) {
        changePropValue(CostObj.MIN);
      } else {
        changePropValue(CostObj.MAX);
      }
    };

    const onPointMouseDown = (downEvt) => {
      const costObj = downEvt.target === CostObj.MIN.point
        ? CostObj.MIN
        : CostObj.MAX;
      const lineWidth = rangeLine.clientWidth;
      const leftOffset = rangeLine.getBoundingClientRect().left;

      const onMovePoint = (mouseEvt) => {
        const newPropValue = Math.round((mouseEvt.x - leftOffset) / lineWidth * 100);

        changePropValue(costObj, newPropValue);
      };

      const onUpPoint = () => {
        document.removeEventListener(`mousemove`, onMovePoint);
        document.removeEventListener(`mouseup`, onUpPoint);
      };

      document.addEventListener(`mousemove`, onMovePoint);
      document.addEventListener(`mouseup`, onUpPoint);
    };

    const onPointKeyDown = (keyDownEvt) => {
      const costObj = keyDownEvt.target === CostObj.MIN.point
        ? CostObj.MIN
        : CostObj.MAX;

      if (keyDownEvt.code === KeyCode.left) {
        changePropValue(costObj, getCurrentPropValue(costObj) - 1);
      } else if (keyDownEvt.code === KeyCode.right) {
        changePropValue(costObj, getCurrentPropValue(costObj) + 1);
      }
    };

    makeSynchronization(CostObj.MIN, CostObj.MIN.initPropValue);
    makeSynchronization(CostObj.MAX, CostObj.MAX.initPropValue);

    minCost.addEventListener(`input`, onChangeCostValue);
    maxCost.addEventListener(`input`, onChangeCostValue);

    pointMin.addEventListener(`mousedown`, onPointMouseDown);
    pointMax.addEventListener(`mousedown`, onPointMouseDown);

    pointMin.addEventListener(`keydown`, onPointKeyDown);
    pointMax.addEventListener(`keydown`, onPointKeyDown);

    prevElement.after(rangeBlock);
  }
})();
