// utils/typingTimeoutManager.ts

const typingTimers: Record<string, NodeJS.Timeout> = {};

export const setTypingTimeout = (
  partnerId: string,
  clearTyping: (partnerId: string) => void,
  delay: number = 5000,
) => {
  if (typingTimers[partnerId]) clearTimeout(typingTimers[partnerId]);

  typingTimers[partnerId] = setTimeout(() => {
    clearTyping(partnerId);
    delete typingTimers[partnerId];
  }, delay);
};

export const clearTypingTimeout = (partnerId: string) => {
  if (typingTimers[partnerId]) {
    clearTimeout(typingTimers[partnerId]);
    delete typingTimers[partnerId];
  }
};
