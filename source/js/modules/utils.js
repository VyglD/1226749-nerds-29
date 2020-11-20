
const KeyCode = {
  ESC: `Escape`,
  LEFT: `ArrowLeft`,
  RIGHT: `ArrowRight`,
};

const isEscKey = (evt) => {
  return evt.code === KeyCode.ESC;
};

const createElement = (template) => {
  const wrapper = document.createElement(`div`);
  wrapper.innerHTML = template;

  return wrapper.firstElementChild;
};

export {
  KeyCode,
  isEscKey,
  createElement,
};
