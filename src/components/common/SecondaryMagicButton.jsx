import React from "react";
import { Button } from "@mui/material";

const SecondaryMagicButton = ({ children, fullWidth = true, ...props }) => {
  return (
    <Button
      fullWidth={fullWidth}
      variant="contained"
      sx={{
        background: "linear-gradient(to right, #ff9a9e, #fad0c4, #fbc2eb)", // different color gradient
        color: "#000", // darker text for contrast
        fontWeight: "bold",
        boxShadow: "0 0 20px rgba(255,255,255,0.2)",
        borderRadius: "1rem",
        textTransform: "uppercase",
        letterSpacing: "1px",
        transition: "all 0.3s ease",
        float: 'right', mb: 2,
        '&:hover': {
          background: "linear-gradient(to right, #fbc2eb, #fad0c4, #ff9a9e)",
        },
        '&:active': {
          transform: "scale(0.97)",
        },
      }}
      {...props}
    >
      {children}
    </Button>
  );
};

export default SecondaryMagicButton;
