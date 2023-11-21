import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mostrarOtroComponente, setMostrarOtroComponente] = useState(false);
  const [selectedCommentId, setSelectedCommentId] = useState(null);

  const toggleSidebar = () => {
    setCollapsed((prevCollapsed) => !prevCollapsed);
  };

  const verComentarios = (id) => {
    setMostrarOtroComponente(true);
    setSelectedCommentId(id);
  };

  const contextValue = {
    collapsed,
    mostrarOtroComponente,
    selectedCommentId,
    toggleSidebar,
    verComentarios,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};
