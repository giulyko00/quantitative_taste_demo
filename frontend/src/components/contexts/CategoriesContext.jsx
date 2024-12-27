// frontend/context/CategoriesContext.jsx
"use client";

import React, { createContext, useState, useContext } from "react";

// Creazione del contesto
const CategoriesContext = createContext();

// Provider del contesto
export const CategoriesProvider = ({ children }) => {
  const [categories, setCategories] = useState([]); // Lista delle categorie
  const [selectedCategory, setSelectedCategory] = useState(null); // Categoria selezionata
  const [ideas, setIdeas] = useState([]); // Idee di investimento

  return (
    <CategoriesContext.Provider
      value={{
        categories,
        setCategories,
        selectedCategory,
        setSelectedCategory,
        ideas,
        setIdeas,
      }}
    >
      {children}
    </CategoriesContext.Provider>
  );
};

// Hook personalizzato per consumare il contesto
export const useCategories = () => {
  return useContext(CategoriesContext);
};
