import React, { useEffect, useImperativeHandle, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import FileDropzone from "../../../components/FileZone";
import DeleteIcon from "@mui/icons-material/Delete";

const schema = yup.object().shape({
  domain: yup.string().required("Domain is Required."),
  file: yup
    .mixed()
    .test("fileType", "Only Excel or CSV files are accepted", (value) => {
      if (!value || value.length === 0) {
        return new yup.ValidationError("File is required", null, "file");
      }
      const fileType = value[0].type;
      const validTypes = [
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "text/csv",
      ];
      return validTypes.includes(fileType);
    }),
});

const domainList = [
  "Banking",
  "Insurance",
  "Telecom",
  "Retail",
  "IT",
  "Logistics",
  "Ecommerce",
  "Film Industry",
];

const FileUploadForm = ({ onChange, onSubmit, onCancel }, ref) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    // mode: "onChange",
    defaultValues: {
      domain: null,
      file: [],
    },
  });

  const inputRef = useRef();
  const [formStateValues, setFileValues] = useState({
    domain: null,
    fileInfos: [],
  });

  const [error, setError] = useState(false);

  const onDrop = (acceptedFiles) => {
    const updatedList = [...acceptedFiles];

    handleFileChange(updatedList);
  };

  useEffect(() => {
    reset({
      domain: formStateValues?.domain,
      file: formStateValues?.fileInfos || [],
    });
  }, [formStateValues]);

  const onLocalSubmit = (data) => {
    onSubmit(data);
  };

  const handleFileChange = (event) => {
    let files = Array.prototype.slice.call(event);
    if (files.length === 0) {
      setError(true);
      return;
    }
    files = files.filter(
      (file) =>
        file.type === "application/vnd.ms-excel" ||
        file.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        file.type === "text/csv"
    );
    setError(false);
    if (files.length === 0) {
      setError(true);
      return;
    }

    const newFileInfos = files.map((file) => ({
      name: file.name,
      size: file.size,
      type: file.type,
      file: file,
      blobFile: new Blob([file]),
    }));

    setFileValues({
      ...formStateValues,
      fileInfos: [
        ...(formStateValues?.fileInfos || []), // Correct property name and provide default empty array
        ...newFileInfos,
      ],
    });
    // setFileInfos([...fileInfos, ...newFileInfos]);

    onChange([...formStateValues?.fileInfos, ...newFileInfos]);
  };

  const handleRemoveFile = (index) => {
    const newFiles = [...formStateValues?.fileInfos];
    newFiles.splice(index, 1);
    setFileValues({
      ...formStateValues,
      fileInfos: newFiles,
    });
  };

  // Make sure the parent component can use checkValidity and focus
  useImperativeHandle(ref, () => ({
    reset: () => {
      setFileValues({
        domain: null,
        fileInfos: [],
      });
      reset({
        domain: null,
        file: null,
      });
      setError(false);
      return;
    },
  }));

  const handleClick = () => {
    inputRef.current.click();
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onLocalSubmit)}
      sx={{
        display: "flex",
        paddingX: "50px",
        flexDirection: "column",
        padding: "2px",
      }}
    >
      <Controller
        name="domain"
        control={control}
        render={({ field }) => (
          <Autocomplete
            {...field}
            options={domainList}
            getOptionLabel={(option) => option}
            isOptionEqualToValue={(option, value) => option === value}
            value={field.value || null}
            onChange={(_, data) => {
              field.onChange(data); // This updates the form value
              setFileValues({
                ...formStateValues,
                domain: data,
              });
            }}
            className="input-field"
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Enter domain"
                fullWidth
                error={!!errors.domain}
                helperText={errors.domain?.message}
                className="input-field"
              />
            )}
          />
        )}
      />
      <br />
      <FileDropzone onDrop={onDrop} />
      {errors.file && (
        <Typography
          sx={{
            fontWeight: "400",
            textAlign: "left",
            fontSize: "0.75rem",
            lineHeight: "1.66",
            letterSpacing: "0.03333em",
            marginTop: "3px",
            marginRight: "14px",
            marginBottom: "0",
            marginLeft: "14px",
          }}
          color="error"
        >
          {errors.file.message}
        </Typography>
      )}
      <br />
      <Grid container spacing={2}>
        {formStateValues?.fileInfos?.map((fileInfo, index) => (
          <Grid item xs={12} md={3} key={index}>
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
                  {fileInfo.name}
                </Typography>
                <IconButton
                  color="error"
                  onClick={() => handleRemoveFile(index)}
                  aria-label="remove"
                  sx={{ mt: 1 }}
                >
                  <DeleteIcon />
                </IconButton>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box
        display="flex"
        justifyContent="flex-end"
        alignItems="center"
        flexWrap="wrap"
        gap={2} // Adds space between buttons
      >
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: 3 }}
        >
          Upload
        </Button>
        <Button
          type="reset"
          variant="contained"
          color="secondary"
          onClick={onCancel}
          sx={{ mt: 3 }}
        >
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

export default React.forwardRef(FileUploadForm);
