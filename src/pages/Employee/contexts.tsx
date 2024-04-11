import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AppContextType {
  collapsed: boolean;
  mostrarOtroComponente: boolean;
  selectedCommentId: string | null;
  toggleSidebar: () => void;
  verComentarios: (id: string) => void;
}

// Crea el contexto con un valor inicial del tipo AppContextType
const AppContext = createContext<AppContextType | undefined>(undefined);

// Define el proveedor de contexto
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [mostrarOtroComponente, setMostrarOtroComponente] = useState<boolean>(false);
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
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext debe ser usado dentro de un AppProvider');
  }
  return context;
};

export default AppContext; // Exporta el contexto por defecto
