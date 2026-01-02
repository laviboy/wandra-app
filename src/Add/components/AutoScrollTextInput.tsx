import React, { useRef } from "react";
import {
  TextInput as RNTextInput,
  TextInputProps,
  View,
  findNodeHandle,
} from "react-native";
import { useScrollContext } from "./ScrollContext";

interface AutoScrollTextInputProps extends TextInputProps {
  containerStyle?: any;
}

export const AutoScrollTextInput: React.FC<AutoScrollTextInputProps> = ({
  containerStyle,
  onFocus,
  ...props
}) => {
  const inputRef = useRef<RNTextInput>(null);
  const containerRef = useRef<View>(null);
  const { scrollViewRef, scrollToPosition } = useScrollContext();

  const handleFocus = (e: any) => {
    // Call original onFocus if provided
    onFocus?.(e);

    // Scroll to input after a small delay to ensure keyboard is shown
    setTimeout(() => {
      if (containerRef.current && scrollViewRef.current) {
        containerRef.current.measureLayout(
          findNodeHandle(scrollViewRef.current) as number,
          (_x: number, y: number) => {
            scrollToPosition(y);
          },
          () => {
            console.log("measureLayout failed");
          }
        );
      }
    }, 100);
  };

  return (
    <View ref={containerRef} style={containerStyle}>
      <RNTextInput ref={inputRef} onFocus={handleFocus} {...props} />
    </View>
  );
};
