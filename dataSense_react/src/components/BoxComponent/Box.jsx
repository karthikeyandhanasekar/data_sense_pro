import { Card, createTheme, styled, useMediaQuery } from "@mui/material";

// Styled components
const FeatureCard = styled(Card)({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  padding: "25px",
  background: "#f5f4f2",
  color: "#0902c9",
  fontWeight: "bolder",
  cursor: "pointer",
  transition: "transform 0.2s ease-in-out",
  "&:hover": {
    transform: "scale(1.05)",
  },
});

const BoxComponent = ({ children, onClick }) => {
  const theme = createTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <FeatureCard
      onClick={onClick}
      sx={{
        height: isMobile ? "40vh" : "25vh",
        borderRadius: "10px !important",
      }}
    >
      {children}
    </FeatureCard>
  );
};

export default BoxComponent;
