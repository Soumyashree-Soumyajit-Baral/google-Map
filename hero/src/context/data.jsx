import { createContext, useState } from 'react';

export const DataContext = createContext();

export const DataContextProvider = ({ children }) => {
  const [sharedState, setSharedState] = useState({ distance: 0, price: 0 });
  const [sharedTo, setSharedTo] = useState("");
  const [sharedFrom, setSharedFrom] = useState("");


  return (
    <DataContext.Provider value={{ sharedState, setSharedState, sharedTo, setSharedTo, sharedFrom, setSharedFrom }}>
      {children}
    </DataContext.Provider>
  )
};