import {
  Tabs,
  Tab,
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminPanel } from "../../AppHooks/useAdminPanel";
import AddUserTab from "./AddUserTab";
import EditUserTab from "./EditUserTab";
import AdminCouponTable from "./AdminCouponTable";

const AdminPanel = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);

  const { loggedIn, loginDetails, setLoginDetails, handleLogin } =
    useAdminPanel();

  if (!loggedIn) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-100">
        <Card className="w-full max-w-md">
          <CardContent className="space-y-4">
            <Typography variant="h5">Admin Login</Typography>
            <TextField
              label="Admin Name"
              fullWidth
              value={loginDetails.name}
              onChange={(e) =>
                setLoginDetails({ ...loginDetails, name: e.target.value })
              }
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              value={loginDetails.password}
              onChange={(e) =>
                setLoginDetails({ ...loginDetails, password: e.target.value })
              }
            />
            <Button fullWidth variant="contained" onClick={handleLogin}>
              Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6! min-h-screen">
      <h2 className="text-[#12345A]! font-semibold! text-[24px]!">
        Dreamik AI Admin Panel
      </h2>
      <Card className="mx-auto">
        <CardContent>
          <Tabs value={tab} onChange={(_, v) => setTab(v)}>
            <Tab
              label="Add User"
              className="hover:bg-white! border-b-2! border-b-white! hover:border-b-gray-300!"
            />
            <Tab
              label="Edit User"
              className="hover:bg-white! border-b-2! border-b-white! hover:border-b-gray-300!"
            />
            <Tab
              label="Coupons"
              className="hover:bg-white! border-b-2! border-b-white! hover:border-b-gray-300!"
            />
          </Tabs>

          <Box className="mt-6">
            {tab === 0 && <AddUserTab />}
            {tab === 1 && <EditUserTab />}
            {tab === 2 && <AdminCouponTable />}
          </Box>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPanel;
