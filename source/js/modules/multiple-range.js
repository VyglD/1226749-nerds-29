import {KeyCode, createElement} from "./utils";

const RANGE_BLOCK_TEMPLATE = (`
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

const init = () => {
  const prevElement = document.querySelector(`#filter-panel__cost-title-js`);
  const minCost = document.querySelector(`#cost-min-js`);
  const maxCost = document.querySelector(`#cost-max-js`);

  if (prevElement && minCost && maxCost) {
    const rangeBlock = createElement(RANGE_BLOCK_TEMPLATE);
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

    const InteractProp = {
      MOUSE: {
        move: `mousemove`,
        end: `mouseup`,
        getMoveCoord: (moveEvt) => moveEvt.x
      },
      TOUCH: {
        move: `touchmove`,
        end: `touchend`,
        getMoveCoord: (moveEvt) => moveEvt.touches[0].pageX
      }
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

      costObj.input.value = newCostValue;
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

    const onPointInteract = (props, startEvt) => {
      const costObj = startEvt.target === CostObj.MIN.point
        ? CostObj.MIN
        : CostObj.MAX;
      const lineWidth = rangeLine.clientWidth;
      const leftOffset = rangeLine.getBoundingClientRect().left;

      const onMovePoint = (moveEvt) => {
        const newPropValue = Math.round(
            (props.getMoveCoord(moveEvt) - leftOffset) / lineWidth * 100
        );

        changePropValue(costObj, newPropValue);
      };

      const onUpPoint = () => {
        document.removeEventListener(props.move, onMovePoint);
        document.removeEventListener(props.end, onUpPoint);
      };

      document.addEventListener(props.move, onMovePoint);
      document.addEventListener(props.end, onUpPoint);
    };

    const onPointMouseDown = onPointInteract.bind(null, InteractProp.MOUSE);
    const onPointTouch = onPointInteract.bind(null, InteractProp.TOUCH);

    const onPointKeyDown = (keyDownEvt) => {
      const costObj = keyDownEvt.target === CostObj.MIN.point
        ? CostObj.MIN
        : CostObj.MAX;

      if (keyDownEvt.code === KeyCode.LEFT) {
        changePropValue(costObj, getCurrentPropValue(costObj) - 1);
      } else if (keyDownEvt.code === KeyCode.RIGHT) {
        changePropValue(costObj, getCurrentPropValue(costObj) + 1);
      }
    };

    makeSynchronization(CostObj.MIN, CostObj.MIN.initPropValue);
    makeSynchronization(CostObj.MAX, CostObj.MAX.initPropValue);

    minCost.addEventListener(`input`, onChangeCostValue);
    maxCost.addEventListener(`input`, onChangeCostValue);

    pointMin.addEventListener(`mousedown`, onPointMouseDown);
    pointMax.addEventListener(`mousedown`, onPointMouseDown);

    pointMin.addEventListener(`touchstart`, onPointTouch);
    pointMax.addEventListener(`touchstart`, onPointTouch);

    pointMin.addEventListener(`keydown`, onPointKeyDown);
    pointMax.addEventListener(`keydown`, onPointKeyDown);

    prevElement.after(rangeBlock);
  }
};

export default {init};
