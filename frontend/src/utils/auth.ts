// gen a random user id
const generateUserId = () => {
  return "user_" + Math.random().toString(36).substring(2, 11);
};

// get or create user ID
export const getUserId = (): string => {
  let userId = localStorage.getItem("userId");
  if (!userId) {
    userId = generateUserId();
    localStorage.setItem("userId", userId);
  }
  return userId;
};

// clear user ID
export const clearUserId = () => {
  localStorage.removeItem("userId");
};

export const addSpeech = (speechId: string) => {
  let speeches = JSON.parse(localStorage.getItem("speeches") || "[]");
  if (!speeches) {
    speeches = [];
  }
  speeches.push(speechId);
  localStorage.setItem("speeches", JSON.stringify(speeches));
  localStorage.setItem("currentSpeech", speechId);
};

export const addRehearsal = (rehearsalId: string) => {
  localStorage.setItem("currentRehearsal", rehearsalId);
};

export const getCurrentRehearsal = () => {
  return localStorage.getItem("currentRehearsal");
};
