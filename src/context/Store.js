import { createContext } from "react";

const initialState = {
  winner: "winner",
  chicken: "dinner",
};

const Store = createContext(initialState);

export { Store, initialState };
