import React, { createContext, useContext } from "react";
import { ScrollView } from "react-native";

interface ScrollContextType {
  scrollViewRef: React.RefObject<ScrollView | null>;
  scrollToPosition: (y: number) => void;
}

const ScrollContext = createContext<ScrollContextType | null>(null);

export const useScrollContext = () => {
  const context = useContext(ScrollContext);
  if (!context) {
    throw new Error("useScrollContext must be used within ScrollProvider");
  }
  return context;
};

export const ScrollProvider: React.FC<{
  children: React.ReactNode;
  scrollViewRef: React.RefObject<ScrollView | null>;
}> = ({ children, scrollViewRef }) => {
  const scrollToPosition = (y: number) => {
    scrollViewRef.current?.scrollTo({
      y: Math.max(0, y - 50), // Offset to keep input visible above keyboard
      animated: true,
    });
  };

  return (
    <ScrollContext.Provider value={{ scrollViewRef, scrollToPosition }}>
      {children}
    </ScrollContext.Provider>
  );
};
