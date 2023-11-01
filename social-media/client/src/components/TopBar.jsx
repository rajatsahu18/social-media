/* eslint-disable no-unused-vars */
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink } from "react-router-dom";
import TextInput from "./TextInput";
import CustomButton from "./CustomButton";
import { useForm } from "react-hook-form";
import { BsMoon, BsPerson, BsPersonPlus, BsSun } from "react-icons/bs";
import { IoMdNotificationsOutline } from "react-icons/io";
import { SetTheme } from "../redux/theme";
import { Logout } from "../redux/userSlice";
import { fetchPosts } from "../utils";
import { BiHome } from "react-icons/bi";
import { LiaUserFriendsSolid } from "react-icons/lia";

const TopBar = () => {
  const { theme } = useSelector((state) => state.theme);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleSearch = async (data) => {
    await fetchPosts(user.token, dispatch, "", data);
  };

  const handleTheme = () => {
    const themeValue = theme === "light" ? "dark" : "light";
    dispatch(SetTheme(themeValue));
  };

  const isActive = (path) => {
    return window.location.pathname === path ? { color: "#1877F2" } : null;
  };

  return (
    <>
      <div className="topbar w-full flex items-center justify-between py-3 md:py-6 px-4 bg-primary">
        <Link to="/" className="flex gap-2 items-center">
          <div className="p-1 md:p-2 bg-[#1877F2] rounded text-white">
            {/* <SlSocialSkype /> */}
            SG
          </div>
          <span className="text-xl md:text-2xl text-[#1877F2] font-semibold">
            Socialgram
          </span>
        </Link>

        <form
          className="hidden md:flex items-center justify-center"
          onSubmit={handleSubmit(handleSearch)}
        >
          <TextInput
            placeholder="Search..."
            styles="w-[18rem] lg:w-[38rem] rounded-l-full py-3"
            register={register("search")}
          />
          <CustomButton
            title="Search"
            type="submit"
            containerStyles="bg-[#1877F2] text-white  px-6 py-2.5 border-[#1877F2] mt-2 rounded-r-full"
          />
        </form>

        {/* ICONS */}

        <div className="flex gap-4 items-center text-ascent-1 text-md md:text-xl">
          <button onClick={() => handleTheme()}>
            {theme === "light" ? <BsMoon /> : <BsSun />}
          </button>
          <div className="hidden lg:flex">
            <IoMdNotificationsOutline />
          </div>
          <CustomButton
            onClick={() => dispatch(Logout())}
            containerStyles="text-sm bg-[#1877F2] text-white px-4 md:px-6 py-1 md:py-2 rounded-full"
            title="Log out"
          />
        </div>
      </div>
      <div className="topbar lg:hidden w-full flex items-center justify-between py-3 md:py-6 px-8 bg-secondary">
        <NavLink exact to="/" className="text-ascent-2" style={isActive("/")}>
          <BiHome size={25} />
        </NavLink>
        <NavLink
          to="/friend-request"
          className="text-ascent-2"
          style={isActive("/friend-request")}
        >
          <LiaUserFriendsSolid size={25} />
        </NavLink>
        <NavLink
          to="/suggested-friends"
          className="text-ascent-2"
          style={isActive("/suggested-friends")}
        >
          <BsPersonPlus size={25} />
        </NavLink>
        <NavLink
          to="/notifications"
          className="text-ascent-2"
          style={isActive("/notifications")}
        >
          <IoMdNotificationsOutline size={25} />
        </NavLink>
        <NavLink
          to={"/profile/" + user?._id}
          className="text-ascent-2"
          style={isActive(`/profile/${user?._id}`)}
        >
          <BsPerson size={25} />
        </NavLink>
      </div>
    </>
  );
};

export default TopBar;
