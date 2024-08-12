import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useLoading } from "../../components/Loading/loadingProvider";
import { getFileDetailsInformation } from "../fileUpload/controllers/fileUploadControllers";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  AppBar,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Toolbar,
  Typography,
} from "@mui/material";
import {
  getComparsionDetails,
  getComparsionFiles,
  getProfileDetailsController,
  getQueryFiles,
  getTableQuery,
} from "./controllers/dataProfilerContorller";
import { useDialog } from "../../components/alerts/DialogContent";
import SQLQueryViewer from "../../components/CodeViewer/SQLViewer";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import {
  formatNumbersIntoInternationStandard,
  generatePdfFromHtml,
  removeDomainFromFileName,
  titleCaseFirstWord,
} from "../../generals/generals";
import QueryForm from "./components/manualQueryForm";
import SummarizeIcon from "@mui/icons-material/Summarize";
import { getCookie } from "../../services/cookieServices";
import ProfileTableComponent from "./components/ProfileTableComponent";
import DatabaseInputForm from "./components/DataBaseInput";
import CodeIcon from "@mui/icons-material/Code";
import ArticleIcon from "@mui/icons-material/Article";
import { Key } from "@mui/icons-material";
const ProfilePage = () => {
  const { fileName, domain } = useParams(); // Destructure the parameter value
  const [fileDetails, setFileDetails] = useState({});
  const [openQueryForm, setOpenQueryForm] = useState(false);
  const [dataProfile, setDataProfileList] = useState({});
  const [queryDetails, setQueryDetails] = useState({});
  const [comparisonReports, setComparisonFiles] = useState({});
  const [queryFiles, setQueryFiles] = useState({});

  const navigate = useNavigate();

  const tableCurrentData = useRef(false);
  const { startLoading, stopLoading } = useLoading();
  const { openDialog } = useDialog();
  const compareQuerydDetails = useRef({});
  const formRefs = useRef({});

  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const getProfileDetails = useCallback(async (fileNameList) => {
    try {
      startLoading();
      const response = await getProfileDetailsController(fileNameList);
      await getFileList();
      setDataProfileList({
        profile: response?.data_profile_details,
        pattern: response?.pattern_df,
      });
    } catch (error) {
      console.error(error);
    } finally {
      stopLoading();
    }
  }, []);
  const profileColumns = {
    // USER_ID: "Username",
    Column: "Column",
    Datatype: "DataType",
    "#Null": "Null Count",
    "%Null": "Null(%)",
    "#NotNull": "Not Null Count",
    "%NotNull": "Not Null(%)",
    "#Unique": "Unique Count",
    "%Unique": "Unique (%)",
    "#Non-Distinct": "Non-Distinct Count",
    "%Non-Distinct": "Non-Distinct(%)",
    "Minimum Length": "Minimum Length",
    "Maximum Length": "Maximum Length",
    "Minimum Value": "Minimum Value",
    "Maximum Value": "Maximum Value",
    "#Blank": "Blank Count",
    "%Blank": "Blank(%)",
  };

  const patternColumns = {
    Column: "Column",
    Pattern: "Pattern",
    Frequency: "Frequency",
  };

  const getFileList = useCallback(async () => {
    try {
      startLoading();
      const response = await getFileDetailsInformation(domain, fileName);
      setFileDetails(response);
    } catch (error) {
      console.error(error);
    } finally {
      stopLoading();
    }
  }, []);

  useEffect(() => {
    if (!tableCurrentData.current) {
      const isLoginedCookie = getCookie("islogined");
      if (!isLoginedCookie) {
        return navigate("/login");
      }
      getProfileDetails([fileName]);
      getComparisonReport(fileName);
      getQuerues(fileName);
      tableCurrentData.current = true;
    }
  }, [fileName]);

  const getComparisonReport = useCallback(async (fileName) => {
    try {
      startLoading();
      const response = await getComparsionFiles(fileName);
      setComparisonFiles(response.compare_files);
    } catch (error) {
      console.error(error);
    } finally {
      stopLoading();
    }
  }, []);

  const getQuerues = useCallback(async (fileName) => {
    try {
      startLoading();
      const response = await getQueryFiles(fileName);
      setQueryFiles(response.query_files);
    } catch (error) {
      console.error(error);
    } finally {
      stopLoading();
    }
  }, []);

  const generateTableQuery = useCallback(async (dbname) => {
    try {
      startLoading();
      const response = await getTableQuery(domain, fileName, dbname);
      await getQuerues(fileName);
      setQueryDetails(response.query_details);
    } catch (error) {
      console.error(error);
    } finally {
      stopLoading();
    }
  }, []);

  // const handleDownloadProfile = async () => {
  //   try {
  //     startLoading();
  //     const response = await downloadFile(fileName, {
  //       responseType: "blob",
  //       // headers: {
  //       //   Accept: getMimeType(fileName.split(".").pop().toLowerCase()),
  //       // },
  //     });
  //     // Extract filename from Content-Disposition header
  //     const contentDisposition = response.headers["content-disposition"];
  //     const filename = contentDisposition
  //       ? contentDisposition.split("filename=")[1].replace(/"/g, "")
  //       : "downloaded-file";

  //     // Determine the file extension from the filename
  //     const extension = filename.split(".").pop().toLowerCase();
  //     const mimeType = getMimeType(extension);

  //     const url = window.URL.createObjectURL(new Blob([response.data]), {
  //       type: mimeType,
  //     });
  //     // Create a link element
  //     const link = document.createElement("a");
  //     link.href = url;
  //     link.setAttribute("download", filename); // Set the download attribute with the filename
  //     // Append to the body and click to trigger download
  //     document.body.appendChild(link);
  //     link.click();
  //     // Clean up
  //     link.remove();
  //     window.URL.revokeObjectURL(url);
  //   } catch (error) {
  //     console.error(error);
  //   } finally {
  //     stopLoading();
  //   }
  // };

  const openTableDialog = (key) => {
    openDialog(
      "primary",
      `Profilling Details`,
      <ProfileTableComponent
        dataProfile={dataProfile}
        profileColumns={profileColumns}
        patternColumns={patternColumns}
        fileName={fileName}
      />,

      {
        confirm: {
          name: "Ok",
          isNeed: false,
        },
        cancel: {
          name: "Cancel",
          isNeed: false,
        },
      },
      (confirmed) => {
        if (confirmed) {
          return;
        }
      }
    );
  };

  const handleCompareQuery = (data) => {
    compareQuerydDetails.current = data;
    setOpenQueryForm(true);
  };

  const handleQueryFormClose = () => {
    formRefs.current["queryForm"].reset();

    setOpenQueryForm(false);
  };

  const handleDownloadPDF = (title, html) => {
    try {
      startLoading();
      generatePdfFromHtml(
        title.toLowerCase().replace(" ", "_") + "_comparison_report.pdf",
        title,
        html
      );
    } catch (error) {
      console.error(error);
    } finally {
      stopLoading();
    }
  };
  const handleQueryFormComplete = async (data) => {
    try {
      startLoading();
      compareQuerydDetails.current["manualQuery"] = data["manualQuery"];
      compareQuerydDetails.current["file_name"] = fileName;
      const response = await getComparsionDetails(compareQuerydDetails.current);
      if (response) {
        formRefs.current["queryForm"].reset();
        setOpenQueryForm(false);
        await getComparisonReport(fileName);
      }
    } catch (error) {
      console.error(error);
    } finally {
      stopLoading();
    }
  };

  const handleDBSubmit = async (data) => {
    generateTableQuery(data.database);
  };

  const openReport = (fileName) => {
    openDialog(
      "primary",
      fileName,
      <Box>
        {/* <Button
          type="submit"
          variant="contained"
          color="primary"
          onClick={() =>
            handleDownloadPDF(
              compareQuerydDetails.current["engine"],
              response.comparison_details
            )
          }
          sx={{ mt: 3 }}
        >
          Download
        </Button> */}
        <Box
          dangerouslySetInnerHTML={{ __html: comparisonReports[fileName] }}
          sx={{
            "& .code-snippet": {
              whiteSpace: "pre-wrap",
              wordBreak: "break-word", // Wrap by word
              background: "#0902c9 ", // Dark background for code look
              color: "#ffffff", // White text for code
              padding: "10px",
              borderRadius: "5px",
              fontFamily: "'Courier New', Courier, monospace", // Monospace font for code
              overflowX: "auto", // Horizontal scroll for overflow
              maxWidth: "100%", // Full width of the container
            },
          }}
        ></Box>
      </Box>,
      {
        confirm: {
          name: "Ok",
          isNeed: false,
        },
        cancel: {
          name: "Cancel",
          isNeed: false,
        },
      },
      (confirmed) => {
        if (confirmed) {
          return;
        }
      }
    );
  };

  return (
    <>
      {/* <Typography
        variant="h4"
        sx={{ textAlign: "center", fontWeight: "bolder", marginBottom: "10px" }}
      >
        Data Profiler Output
      </Typography> */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-evenly",
          alignItems: "center",
          marginY: "50px",
        }}
      >
        <Typography>
          <b>Domain:</b> {domain}
        </Typography>
        <Typography>
          <b>File Name:</b> {removeDomainFromFileName(fileName)}
        </Typography>
        <Typography>
          <b>Total Rows :</b>{" "}
          {fileDetails?.rows &&
            formatNumbersIntoInternationStandard(fileDetails?.rows)}
        </Typography>
        <Typography>
          <b>Total Columns :</b>{" "}
          {fileDetails?.columns &&
            formatNumbersIntoInternationStandard(fileDetails?.columns)}
        </Typography>
        <Typography>
          <b>File Size :</b> {fileDetails?.fileSize}
        </Typography>
      </Box>

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
            <SummarizeIcon sx={{ mr: 2 }} />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Data Summary
            </Typography>
          </>
          <Button
            type="button"
            onClick={() => openTableDialog("profile")}
            variant="contained"
            color="primary"
          >
            View Profile
          </Button>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: "#f5f4f2",
          color: "#000000",
          py: 1,
          marginBottom: "20px",
        }}
      >
        <Container
          sx={{
            color: "#0902c9 ",
            maxWidth: "none !important",
          }}
          dangerouslySetInnerHTML={{ __html: fileDetails.profile_summary }}
        ></Container>
      </Box>

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
            <CodeIcon sx={{ mr: 2 }} />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Table Creation Query
            </Typography>
          </>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: "#f5f4f2",
          color: "#000000",
          p: 1,
          marginBottom: "20px",
        }}
      >
        <DatabaseInputForm onSubmit={handleDBSubmit} />
        <br />

        <Box
          sx={{
            marginBottom: "10px",
          }}
        >
          {queryDetails[fileName]?.map((queryObj, index) => (
            <SQLQueryViewer
              fileName={fileName}
              query={queryObj.query}
              title={queryObj.title}
              index={index}
              compareQuery={handleCompareQuery}
            />
          ))}
        </Box>
      </Box>
      <br />

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
            <ArticleIcon sx={{ mr: 2 }} />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Generated Queries
            </Typography>
          </>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: "#f5f4f2",
          color: "#000000",
          p: 1,
          marginBottom: "20px",
        }}
      >
        <Grid container spacing={2}>
          {Object.keys(queryFiles)?.map((fileName, index) => (
            <>
              <Grid item xs={12} md={6}>
                <Accordion
                  expanded={openIndex === index}
                  onChange={() => toggleAccordion(index)}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls={`panel${index}-content`}
                    id={`panel${index}-header`}
                    sx={{
                      background: "#0902c9",
                      color: "#ffffff",
                    }}
                  >
                    <Typography>
                      {titleCaseFirstWord(fileName?.split("_").pop())}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails
                    sx={{
                      background: "transparent",
                    }}
                  >
                    <SQLQueryViewer
                      fileName={fileName}
                      query={queryFiles[fileName]}
                      title={""}
                      index={index}
                      compareQuery={handleCompareQuery}
                    />
                  </AccordionDetails>
                </Accordion>
              </Grid>
            </>
          ))}
        </Grid>
      </Box>
      <br />

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
            <ArticleIcon sx={{ mr: 2 }} />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Comparison Report
            </Typography>
          </>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: "#f5f4f2",
          color: "#000000",
          p: 1,
          marginBottom: "20px",
        }}
      >
        <Grid container spacing={2}>
          {Object.keys(comparisonReports)?.map((fileName) => (
            <>
              <Grid
                sx={{
                  cursor: "pointer",
                }}
                item
                xs={12}
                sm={12}
                md={6}
                key={fileName}
                onClick={() => openReport(fileName)}
              >
                <Card>
                  <CardContent
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      color: "#0902c9",
                      background: "#f5f4f2",
                    }}
                  >
                    <Typography variant="h6" component="div">
                      {fileName}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </>
          ))}
        </Grid>
      </Box>

      <QueryForm
        open={openQueryForm}
        title={compareQuerydDetails.current.engine}
        onSubmit={handleQueryFormComplete}
        onClose={handleQueryFormClose}
        ref={(el) => (formRefs.current["queryForm"] = el)}
      ></QueryForm>
    </>
  );
};

export default ProfilePage;
