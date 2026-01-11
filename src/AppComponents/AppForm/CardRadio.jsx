import { Box, FormControlLabel, Radio, Typography } from "@mui/material";

const CardRadioOption = ({ value, label, selected }) => {
  const isActive = selected === value;

  return (
    <FormControlLabel
      value={value}
      className="w-fit!"
      control={<Radio sx={{ display: "none" }} />}
      label={
        <Box
          className={`w-fit min-w-[60px] rounded-lg border px-4! py-2! flex items-center gap-3! transition-all
            ${
              isActive
                ? "border-green-500 bg-green-50"
                : "border-gray-300 bg-white hover:border-gray-400"
            }`}
        >
          {/* Custom radio */}
          <Box
            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
              ${isActive ? "border-green-500" : "border-gray-300"}`}
          >
            {isActive && (
              <Box className="w-2.5 h-2.5 rounded-full bg-green-500" />
            )}
          </Box>

          <Typography className="font-medium">{label}</Typography>
        </Box>
      }
      sx={{
        margin: 0,
        width: "100%",
      }}
    />
  );
};

export default CardRadioOption;
