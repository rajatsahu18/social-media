import { Outlet, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { Home, Login, Profile, Register, ResetPassword } from "./pages";
import {
  SuggestedFriends,
  FriendRequests,
  Notifications,
  TopBar,
} from "./components";

function Layout() {
  const { user } = useSelector((state) => state.user);
  const location = useLocation();

  return user?.token ? (
    <Outlet />
  ) : (
    <Navigate to="login" state={{ from: location }} replace />
  );
}

function App() {
  const { theme } = useSelector((state) => state.theme);
  const { user } = useSelector((state) => state.user);

  return (
    <>
      <div data-theme={theme} className="w-full min-h-[100vh]">
        {user?.token ? (
          <div className="topbar w-full px-0 lg:px-10 2xl:px-40 bg-bgColor">
          <TopBar />
        </div>
        ) : (
          ""
        )}

        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/profile/:id?" element={<Profile />} />
          </Route>

          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/suggested-friends" element={<SuggestedFriends />} />
          <Route path="/friend-request" element={<FriendRequests />} />
          <Route path="/notifications" element={<Notifications />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
