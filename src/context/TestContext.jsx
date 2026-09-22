import { createContext, useContext, useReducer } from "react";

const TestContext = createContext(null);

const initialState = {
  sessionUuid: null,
  language: "en",
  questions: [],
  currentIdx: 0,
  answers: {},          // { [qid]: { selected_index, time_spent } }
  secondsLeft: 40 * 60,
  status: "idle",       // idle | loading | in_progress | submitting | completed
};

function reducer(state, action) {
  switch (action.type) {
    case "START_LOADING":
      return { ...state, status: "loading" };
    case "INIT":
      return {
        ...state,
        ...action.payload,
        status: "in_progress",
      };
    case "SET_CURRENT":
      return { ...state, currentIdx: action.payload };
    case "ANSWER":
      return {
        ...state,
        answers: { ...state.answers, [action.payload.qid]: action.payload.value },
      };
    case "TICK":
      return { ...state, secondsLeft: Math.max(0, state.secondsLeft - 1) };
    case "SUBMITTING":
      return { ...state, status: "submitting" };
    case "COMPLETED":
      return { ...state, status: "completed" };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

export function TestProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <TestContext.Provider value={{ state, dispatch }}>
      {children}
    </TestContext.Provider>
  );
}

export function useTest() {
  const ctx = useContext(TestContext);
  if (!ctx) throw new Error("useTest must be used within <TestProvider>");
  return ctx;
}