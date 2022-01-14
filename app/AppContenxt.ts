import {createContext, useContext} from 'react';

const context = {
  songId: null,
};

export const AppContext = createContext(context);
export const UseContext = () => useContext(AppContext);
