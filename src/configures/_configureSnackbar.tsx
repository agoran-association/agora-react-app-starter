import React from "react";
import {
  SnackbarProvider as OriginSnackbarProvider,
  useSnackbar as OriginUseSnackbar
} from "notistack";

export const SnackbarProvider: React.FC = props => (
  <OriginSnackbarProvider
    anchorOrigin={{ vertical: "top", horizontal: "right" }}
    autoHideDuration={2500}
    maxSnack={5}
  >
    {props.children}
  </OriginSnackbarProvider>
);

export const useSnackbar = OriginUseSnackbar
