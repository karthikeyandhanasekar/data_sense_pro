import React, { useImperativeHandle } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Grid,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

// Define validation schema with Yup
const schema = yup.object().shape({
  manualQuery: yup.string().required("Query is required"),
});

const QueryForm = ({ open, onClose, title, onSubmit }, ref) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  // Make sure the parent component can use checkValidity and focus
  useImperativeHandle(ref, () => ({
    reset: () => {
      reset({
        manualQuery: null,
      });
      return;
    },
  }));

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle
        sx={{
          bgcolor: "primary.main",
          color: "white",
          display: "flex",
          alignItems: "center",
        }}
      >
        {title} Manual Query Comparison
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8, color: "white" }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Controller
                name="manualQuery"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    // label="Enter Query"
                    placeholder="Enter query"
                    multiline
                    rows={15}
                    variant="outlined"
                    fullWidth
                    error={!!errors.manualQuery}
                    helperText={
                      errors.manualQuery ? errors.manualQuery.message : ""
                    }
                    onChange={(e) => {
                      field.onChange(e);
                    }}
                  />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="secondary" variant="outlined">
            Cancel
          </Button>
          <Button type="submit" color="primary" variant="contained">
            Compare
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default React.forwardRef(QueryForm);
