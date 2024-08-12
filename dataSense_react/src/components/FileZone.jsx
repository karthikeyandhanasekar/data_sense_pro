import React from "react";
import { useDropzone } from "react-dropzone";
import { Box, Card, styled, Typography } from "@mui/material";

// Styled components
const FeatureCard = styled(Card)({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  cursor: "pointer",
  padding: "50px",
  color:"#0902c9",
  background: "#f5f4f2",
  // transition: "transform 0.2s ease-in-out",
  // "&:hover": {
  //   transform: "scale(1.05)",
  // },
});

const FileDropzone = ({ onDrop }) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ".csv",
  });

  return (
    <FeatureCard {...getRootProps()} className="dropzone">
      <input {...getInputProps()} />
      {isDragActive ? (
        <Typography variant="body1" fontWeight={"bold"}>Drop the files here...</Typography>
      ) : (
        <Typography variant="body1" fontWeight={"bold"}>
          Drag 'n' drop csv files here, or click to select csv files
        </Typography>
      )}
    </FeatureCard>
  );
};

export default FileDropzone;
