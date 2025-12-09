// FilterDrawer.jsx
import {
  Drawer,
  Box,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  TextField,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";

const FilterDrawer = ({
  open,
  onClose,
  categories = [],
  templates = [],
  onApplyFilters,
  onClear,
}) => {
  const { control, handleSubmit, reset } = useForm({
    defaultValues: { category: "", template: "", minPrice: "", maxPrice: "" },
  });

  const submit = (vals) => {
    onApplyFilters(vals);
  };

  const clear = () => {
    reset();
    onClear();
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 320, p: 3 }}>
        <h3 className="text-lg font-semibold mb-3">Filters</h3>

        <form onSubmit={handleSubmit(submit)}>
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Category</InputLabel>
                <Select {...field} label="Category">
                  <MenuItem value="">Any</MenuItem>
                  {categories.map((c) => (
                    <MenuItem key={c} value={c}>
                      {c}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />

          <Controller
            name="template"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Template</InputLabel>
                <Select {...field} label="Template">
                  <MenuItem value="">Any</MenuItem>
                  {templates.map((t) => (
                    <MenuItem key={t} value={t}>
                      {t}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />

          <Controller
            name="minPrice"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Min Price"
                type="number"
                fullWidth
                sx={{ mb: 2 }}
              />
            )}
          />

          <Controller
            name="maxPrice"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Max Price"
                type="number"
                fullWidth
                sx={{ mb: 2 }}
              />
            )}
          />

          <div className="flex gap-2 mt-4">
            <Button type="submit" variant="contained" fullWidth>
              Apply
            </Button>
            <Button variant="outlined" fullWidth onClick={clear}>
              Clear
            </Button>
          </div>
        </form>
      </Box>
    </Drawer>
  );
};

export default FilterDrawer;
