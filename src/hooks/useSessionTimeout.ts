import { useEffect } from "react";

const SESSION_TIMEOUT = 10 * 60 * 1000; 

export const useSessionTimeout = (logout: () => void) => {
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    const resetTimer = () => {
      clearTimeout(timeout);

      timeout = setTimeout(() => {
        logout();
      }, SESSION_TIMEOUT);
    };

    const events = [
      "mousemove",
      "mousedown",
      "keydown",
      "scroll",
      "touchstart",
    ];

    events.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });

    resetTimer();

    return () => {
      clearTimeout(timeout);

      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [logout]);
};