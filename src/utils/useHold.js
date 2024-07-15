import { useRef } from "react";

const useHold = (
  onHoldComplete,
  holdDuration = 2000,
  animationDuration = 300
) => {
  const holdTimeout = useRef(null);
  const pressTimeout = useRef(null);

  const startHold = (element) => {
    pressTimeout.current = setTimeout(() => {
      element.classList.add("deleting");
    }, animationDuration);

    holdTimeout.current = setTimeout(() => {
      onHoldComplete();
      element.classList.remove("deleting");
    }, holdDuration);
  };

  const stopHold = (element) => {
    setTimeout(() => {
      element.classList.remove("deleting");
    }, animationDuration);
    clearTimeout(pressTimeout.current);
    clearTimeout(holdTimeout.current);
  };

  return { startHold, stopHold };
};

export default useHold;
