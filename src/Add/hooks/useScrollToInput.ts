import { findNodeHandle, ScrollView } from "react-native";

export const useScrollToInput = (
  scrollViewRef: React.RefObject<ScrollView>
) => {
  const scrollToInput = (inputRef: any) => {
    if (!inputRef || !scrollViewRef.current) return;

    // Wait a bit for keyboard to appear
    setTimeout(() => {
      const nodeHandle = findNodeHandle(inputRef);
      if (nodeHandle) {
        inputRef.measureLayout(
          findNodeHandle(scrollViewRef.current),
          (x: number, y: number, width: number, height: number) => {
            // Scroll to position with some offset for better visibility
            scrollViewRef.current?.scrollTo({
              y: y - 100,
              animated: true,
            });
          },
          () => {
            // Fallback: just scroll a bit
            console.log("measureLayout failed");
          }
        );
      }
    }, 100);
  };

  return { scrollToInput };
};
