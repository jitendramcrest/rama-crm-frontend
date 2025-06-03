import React from "react";
import { Button } from "@mui/material";

const MagicButton = ({ children, fullWidth = true, ...props }) => {
  return (
    <Button
      fullWidth={fullWidth}
      variant="contained"
      sx={{
        background: "linear-gradient(to right, #ff6ec4, #7873f5, #4adede)",
        color: "#ffff",
        fontWeight: "bold",
        boxShadow: "0 0 20px rgba(255,255,255,0.3)",
        borderRadius: "1rem",
        textTransform: "uppercase",
        letterSpacing: "1px",
        transition: "all 0.3s ease",
        float: 'right', mb: 2,
        '&:hover': {
          background: "linear-gradient(to right, #4adede, #7873f5, #ff6ec4)",
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

export default MagicButton;
