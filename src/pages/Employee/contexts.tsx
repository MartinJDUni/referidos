import React, { createContext, useContext, useState } from 'react';

interface AppContextType {
  collapsed: boolean;
  mostrarOtroComponente: boolean;
  selectedCommentId: string | null;
  toggleSidebar: () => void;
  verComentarios: (id: string) => void;
}

// Crea el contexto con un valor inicial del tipo AppContextType
const AppContext = createContext<AppContextType>({
  collapsed: false,
  mostrarOtroComponente: false,
  selectedCommentId: null,
  toggleSidebar: () => {},
  verComentarios: () => {},
});

// Define el proveedor de contexto
export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mostrarOtroComponente, setMostrarOtroComponente] = useState(false);
  const [selectedCommentId, setSelectedCommentId] = useState<string | null>(null);

  const toggleSidebar = () => {
    setCollapsed((prevCollapsed) => !prevCollapsed);
  };

  const verComentarios = (id: string) => {
    setMostrarOtroComponente(true);
    setSelectedCommentId(id);
  };

  const contextValue: AppContextType = {
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
