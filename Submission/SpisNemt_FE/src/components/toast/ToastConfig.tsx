import { globalColors, globalSizes } from "@/src/theme";
import React from "react";
import { BaseToast, ErrorToast, ToastConfig } from "react-native-toast-message";

export const toastConfig: ToastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      style={{
        borderColor: globalColors.successColor,
        borderWidth: 2,
        borderLeftColor: globalColors.successColor,
        borderLeftWidth: 2,
        borderRadius: globalSizes.borderRadius,
        backgroundColor: globalColors.whiteColor,
      }}
      contentContainerStyle={{ paddingHorizontal: 12 }}
      text1Style={{
        color: globalColors.headerColor,
        fontSize: 15,
        fontWeight: "700",
      }}
      text2Style={{
        color: globalColors.textColor,
        fontSize: 13,
      }}
    />
  ),
  error: (props) => (
    <ErrorToast
      {...props}
      style={{
        borderColor: globalColors.dangerColor,
        borderWidth: 2,
        borderLeftColor: globalColors.dangerColor,
        borderLeftWidth: 2,
        borderRadius: globalSizes.borderRadius,
        backgroundColor: globalColors.whiteColor,
      }}
      contentContainerStyle={{ paddingHorizontal: 12 }}
      text1Style={{
        color: globalColors.dangerColor,
        fontSize: 15,
        fontWeight: "700",
      }}
      text2Style={{
        color: globalColors.textColor,
        fontSize: 13,
      }}
    />
  ),
};
