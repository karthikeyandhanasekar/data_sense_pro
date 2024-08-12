import React, { useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Tooltip,
  IconButton,
  Box,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DownloadIcon from "@mui/icons-material/Download";
import { generateCSV } from "../../generals/generals";

// ReusableWidget Component
const AccordionWidget = ({ items }) => {
  const [expandedIndex, setExpandedIndex] = useState(0);

  const handleChange = (index) => (event, isExpanded) => {
    setExpandedIndex(isExpanded ? index : -1);
  };
  const handleDownloadTableData = (index) => {
    const columnOrder = [
      "Column",
      "Datatype",
      "Minimum Length",
      "Minimum Value",
      "Maximum Length",
      "Maximum Value",
      "#Unique",
      "%Unique",
      "#Non-Distinct",
      "%Non-Distinct",
      "#Null",
      "%NotNull",
      "#Blank",
      "%Blank",
    ];
    generateCSV(items[index].tableData, items[index].title, columnOrder);
  };
  return (
    <>
      {items.map((item, index) => (
        <Accordion
          key={index}
          expanded={expandedIndex === index}
          onChange={handleChange(index)}
          sx={{ mb: 2 }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`panel${index}-content`}
            id={`panel${index}-header`}
          >
            <Typography variant="h6">{item.title}</Typography>
            <Tooltip title="Download" arrow>
              <IconButton
                onClick={(event) => {
                  event.stopPropagation();
                  handleDownloadTableData(index);
                }}
                style={{ color: "#ffffff" }}
              >
                <DownloadIcon />
              </IconButton>
            </Tooltip>
          </AccordionSummary>
          <AccordionDetails>{item.component}</AccordionDetails>
        </Accordion>
      ))}
    </>
  );
};

export default AccordionWidget;
