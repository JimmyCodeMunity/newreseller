import React, { createContext, useContext, useState } from 'react';

const CurrencyContext = createContext();

export function CurrencyProvider({ children }) {
  const [isDollar, setIsDollar] = useState(false);

  return (
    <CurrencyContext.Provider value={{ isDollar, setIsDollar }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  return useContext(CurrencyContext);
}