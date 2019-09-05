import * as React from "react";
import { TextField } from "@material-ui/core";

export const MyField = ({ placeholder, field }) => {
  return <TextField placeholder={placeholder} {...field} />;
};
