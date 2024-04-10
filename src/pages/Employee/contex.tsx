import React, { createContext, useContext, useState } from 'react';

// Crea el contexto
const AppContext = createContext(null);

// Define el proveedor de contexto
export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mostrarOtroComponente, setMostrarOtroComponente] = useState(false);
  const [selectedCommentId, setSelectedCommentId] = useState<null | string>(null);

  const toggleSidebar = () => {
    setCollapsed((prevCollapsed) => !prevCollapsed);
  };

  const verComentarios = (id: string) => {
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

// Define el hook personalizado para consumir el contexto
export const useAppContext = () => {
  return useContext(AppContext);
};
