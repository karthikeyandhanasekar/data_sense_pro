import { useCallback, useEffect, useRef, useState } from "react";
import { useLoading } from "../../components/Loading/loadingProvider";
import FileUploadForm from "./components/fileUploadForm";
import {
  getFileDetails,
  uploadFilesController,
} from "./controllers/fileUploadControllers";
import {
  AppBar,
  Box,
  Button,
  Container,
  Grid,
  Tab,
  Tabs,
  Toolbar,
  Typography,
} from "@mui/material";
import BoxComponent from "../../components/BoxComponent/Box";
import { useNavigate } from "react-router-dom";
import { getCookie } from "../../services/cookieServices";
import {
  formatNumbersIntoInternationStandard,
  removeDomainFromFileName,
} from "../../generals/generals";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DomainIcon from "@mui/icons-material/Domain";
const FileUploadPage = () => {
  const [fileNameList, setFileNameList] = useState({});
  const [displayForm, setDisplayForm] = useState(false);
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState(0);

  const { startLoading, stopLoading } = useLoading();
  const formRefs = useRef([]);
  const tableCurrentData = useRef(false);

  const handleUploadForm = () => {
    setDisplayForm(!displayForm);
  };

  const getFileList = useCallback(async () => {
    try {
      startLoading();
      const response = await getFileDetails();
      setFileNameList(response.file_details);
      formRefs.current[0] && formRefs.current[0].reset();
    } catch (error) {
      console.error(error);
    } finally {
      stopLoading();
    }
  }, []);

  const handleChange = () => {
    return;
  };

  const handleFileUpload = async (formData) => {
    try {
      startLoading();
      setFileNameList([]);
      const response = await uploadFilesController(formData);
      if (response) {
        await getFileList();
      }
    } catch (error) {
      console.error(error);
    } finally {
      stopLoading();
    }
  };

  useEffect(() => {
    if (!tableCurrentData.current) {
      const isLoginedCookie = getCookie("islogined");
      if (!isLoginedCookie) {
        return navigate("/login");
      }
      getFileList();
      tableCurrentData.current = true;
    }
  }, []);

  const handleOpenFile = (domain, file) => {
    navigate(`/profiler/${domain}/${file}`);
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <>
      <>
        {/* Header */}
        <AppBar position="static" color="primary" sx={{ boxShadow: "none" }}>
          <Toolbar
            sx={{
              color: "#ff5500",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <>
              <CloudUploadIcon sx={{ mr: 2 }} />
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Data Upload
              </Typography>
            </>

            {!displayForm && (
              <Button
                type="button"
                onClick={handleUploadForm}
                variant="contained"
                color="primary"
              >
                Upload Data
              </Button>
            )}
          </Toolbar>
        </AppBar>

        {displayForm && (
          <Box
            sx={{
              bgcolor: "#f5f4f2",
              color: "#000000",
              p: 1,
              marginBottom: "20px",
            }}
          >
            <FileUploadForm
              onSubmit={handleFileUpload}
              onChange={handleChange}
              onCancel={handleUploadForm}
              ref={(el) => (formRefs.current[0] = el)}
            />
          </Box>
        )}
      </>
      <br />

      <AppBar position="static" color="primary" sx={{ boxShadow: "none" }}>
        <Toolbar
          sx={{
            color: "#ff5500",
            display: "flex",
            alignItems: "center",
          }}
        >
          <>
            <DomainIcon sx={{ mr: 2 }} />
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
              {Object.keys(fileNameList).map((category, index) => (
                <Tab
                  sx={{
                    color: "#ffffff !important",
                    opacity: selectedTab === index ? "0.5" : "1",
                    cursor: selectedTab === index ? "none" : "pointer",
                    pointerEvents: selectedTab === index ? "none" : "auto",
                  }}
                  key={index}
                  label={`${category} Domain`}
                />
              ))}
            </Tabs>
          </>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          bgcolor: "#f5f4f2",
          color: "#000000",
          p: 1,
          marginBottom: "20px",
        }}
      >
        {Object.keys(fileNameList).map((category, index) => (
          <Box
            key={index}
            role="tabpanel"
            hidden={selectedTab !== index}
            id={`tabpanel-${index}`}
            aria-labelledby={`tab-${index}`}
          >
            {selectedTab === index && (
              <Grid container spacing={2} sx={{ p: 3 }}>
                {fileNameList[category].map((file, fileIndex) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={fileIndex}>
                    <BoxComponent
                      onClick={() => handleOpenFile(category, file.file_name)}
                    >
                      <Typography component={"h1"} fontWeight={"bold"}>
                        {removeDomainFromFileName(file.file_name)}
                      </Typography>
                      <Typography>
                        ({formatNumbersIntoInternationStandard(file.rows, 0)} X{" "}
                        {formatNumbersIntoInternationStandard(file.columns, 0)})
                      </Typography>
                      <Typography variant="body2" style={{ opacity: "0.4" }}>
                        (rows X columns)
                      </Typography>

                      {/* <AccordionWidget items={dynamicAccordingWidget()} /> */}
                    </BoxComponent>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        ))}
      </Box>
    </>
  );
};

export default FileUploadPage;
