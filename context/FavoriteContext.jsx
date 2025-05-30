import React, { createContext, useState, useContext } from "react";

 const FavoriteContext = createContext();
export const FavoriteProvider = ({ children }) => {
  const [favoriteItemsLocal, setFavoriteItemsLocal] = useState(false);
  const [changeFirst, setChangeFirst] = useState(false);
  const [favoriteHarry, setFavoriteHarry] = useState(false);
  const [favoriteProductId, setFavoriteProductId] = useState(false);
  const [resetProfile, setResetProfile] = useState(false);

  return (
    <FavoriteContext.Provider value={{ favoriteItemsLocal, setFavoriteItemsLocal, changeFirst, setChangeFirst, favoriteHarry, setFavoriteHarry, favoriteProductId, setFavoriteProductId, resetProfile, setResetProfile }}>
      {children}
    </FavoriteContext.Provider>
  );
};

export const useCondition = () => useContext(FavoriteContext);