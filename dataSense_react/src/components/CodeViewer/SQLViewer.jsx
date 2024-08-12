import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Tooltip,
} from "@mui/material";
import { FileCopy, GetApp } from "@mui/icons-material";
import {
  getFileNameWithoutExtension,
  removeDomainFromFileName,
} from "../../generals/generals";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";

const SQLQueryViewer = ({ fileName, index, query, title, compareQuery }) => {
  const downloadQuery = () => {
    const element = document.createElement("a");
    const file = new Blob([query], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${getFileNameWithoutExtension(
      removeDomainFromFileName(fileName)
    )}_${title.toLowerCase().replace(" ", "_")}.sql`;
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
    document.body.removeChild(element);
  };

  const handleCopyData = () => {
    if (navigator.clipboard) navigator.clipboard.writeText(query);
  };
  const localHandleCompare = () => {
    compareQuery({
      engine: title,
      autoMatedQuery: query,
    });
  };

  return (
    <Card key={index} sx={{ marginBottom: 2 }}>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 1,
          }}
        >
          <Typography variant="h6">{title}</Typography>
          <Box>
            <Tooltip title="Compare">
              <IconButton
                aria-label="compare"
                size="small"
                onClick={localHandleCompare}
              >
                <CompareArrowsIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Copy" onClick={handleCopyData}>
              <IconButton aria-label="copy" size="small">
                <FileCopy />
              </IconButton>
            </Tooltip>

            <Tooltip title="Download as .sql">
              <IconButton
                aria-label="download"
                size="small"
                onClick={downloadQuery}
              >
                <GetApp />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        <Typography
          variant="body2"
          component="pre"
          sx={{
            whiteSpace: "pre-wrap",
            wordBreak: "break-word", // Wrap by word
            background: "#0902c9 ", // Dark background for code look
            color: "#ffffff", // White text for code
            padding: "10px",
            borderRadius: "5px",
            fontFamily: "'Courier New', Courier, monospace", // Monospace font for code
            overflowX: "auto", // Horizontal scroll for overflow
            maxWidth: "100%", // Full width of the container
          }}
        >
          {query}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default SQLQueryViewer;
