import { useContext } from "react";
import { SymbolContext } from "./SymbolContext";

export function useSymbol() {

  return useContext(
    SymbolContext
  );
}