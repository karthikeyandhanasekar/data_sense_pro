import { Box, IconButton, Tab, Tabs, Tooltip, Typography } from "@mui/material";
import { useState } from "react";
import DataTable from "../../../components/DataTable";
import { GetApp } from "@mui/icons-material";
import {
  generateCSV,
  getFileNameWithoutExtension,
  removeDomainFromFileName,
} from "../../../generals/generals";

const ProfileTableComponent = ({
  dataProfile,
  profileColumns,
  patternColumns,
  fileName,
}) => {
  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const displayTableForTabs = (key) => {
    const data = dataProfile[key.toLowerCase()];

    const columnsOrder =
      key.toLowerCase() === "profile" ? profileColumns : patternColumns;
    return <DataTable columns={columnsOrder} tableData={data} />;
  };

  const handleDownloadProfile = async (key) => {
    try {
      const data = dataProfile[key.toLowerCase()];
      const columnOrder = Object.keys(
        key.toLowerCase() === "profile" ? profileColumns : patternColumns
      );
      generateCSV(
        data,
        `${getFileNameWithoutExtension(
          removeDomainFromFileName(fileName)
        )}_${key}_details`,
        columnOrder
      );
    } catch (error) {
      console.error(error);
    } finally {
    }
  };

  return (
    <Box>
      <Tabs
        value={selectedTab}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
        aria-label="file categories"
        sx={{
          "& .MuiTab-root": {
            textTransform: "none",
            fontSize: { xs: "0.875rem", sm: "1rem" },
          },
        }}
      >
        {["Profile", "Pattern"].map((category, index) => (
          <Tab
            key={index}
            label={
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography sx={{ marginRight: 1 }}>{category}</Typography>
                <Tooltip title={`Download ${category}`}>
                  <IconButton
                    aria-label="download"
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent the tab from switching
                      handleDownloadProfile(category); // Your download function
                    }}
                  >
                    <GetApp />
                  </IconButton>
                </Tooltip>
              </Box>
            }
          />
        ))}
      </Tabs>
      {["Profile", "Pattern"].map((category, index) => (
        <Box
          key={index}
          role="tabpanel"
          hidden={selectedTab !== index}
          id={`tabpanel-${index}`}
          aria-labelledby={`tab-${index}`}
        >
          {selectedTab === index && displayTableForTabs(category)}
        </Box>
      ))}
    </Box>
  );
};

export default ProfileTableComponent;
