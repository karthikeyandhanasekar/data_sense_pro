import React, { useEffect, useImperativeHandle, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Autocomplete, Box, Button, TextField } from "@mui/material";

const schema = yup.object().shape({
  database: yup.string().required("Database is Required."),
});

const domainList = [
  "MySQL",
  "Oracle",
  "Snowflake",
  "Amazon Redshift",
  "PostgreSql",
];

const DatabaseInputForm = ({ onChange, onSubmit, onCancel }, ref) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    // mode: "onChange",
    defaultValues: {
      database: null,
    },
  });

  const inputRef = useRef();
  const [error, setError] = useState(false);

  const onLocalSubmit = (data) => {
    onSubmit(data);
  };

  // Make sure the parent component can use checkValidity and focus
  useImperativeHandle(ref, () => ({
    reset: () => {
      reset({
        database: null,
      });
      setError(false);
      return;
    },
  }));

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onLocalSubmit)}
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        padding: "2px",
        gap: 2,
      }}
    >
      <Box
        sx={{
          flexGrow: 1, // Allow this Box to take available space
          minWidth: "200px", // Set a minimum width
          "@media (max-width:600px)": {
            minWidth: "150px", // Adjust width for smaller screens
          },
        }}
      >
        <Controller
          name="database"
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
              }}
              className="input-field"
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Enter database"
                  fullWidth
                  error={!!errors.database}
                  helperText={errors.database?.message}
                  className="input-field"
                />
              )}
            />
          )}
        />
      </Box>

      <Button type="submit" variant="contained" color="primary">
        Generate
      </Button>
    </Box>
  );
};

export default React.forwardRef(DatabaseInputForm);
