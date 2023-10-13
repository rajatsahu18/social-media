/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  CustomButton,
  EditProfile,
  FriendsCard,
  Loading,
  PostCard,
  ProfileCard,
  SuggestedFriends,
  TextInput,
  TopBar,
} from "../components";
import { Link } from "react-router-dom";
import { NoProfile } from "../assets";
import {
  BsFiletypeGif,
  BsPerson,
  BsPersonFillAdd,
  BsPersonPlus,
} from "react-icons/bs";
import { BiHome, BiImages, BiSolidVideo } from "react-icons/bi";
import { useForm } from "react-hook-form";
import {
  apiRequest,
  deletePost,
  fetchPosts,
  getUserInfo,
  handleFileUpload,
  likePost,
  sendFriendRequest,
} from "../utils";
import { UserLogin } from "../redux/userSlice";
import FriendRequests from "../components/FriendRequests";
import { LiaUserFriendsSolid } from "react-icons/lia";
import { IoMdNotificationsOutline } from "react-icons/io";

const Home = () => {
  const { user, edit } = useSelector((state) => state.user);
  const { posts } = useSelector((state) => state.posts);
  const [errMsg, setErrMsg] = useState("");
  const [file, setFile] = useState(null);
  const [posting, setPosting] = useState(false);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const handlePostSubmit = async (data) => {
    setPosting(true);
    setErrMsg("");

    try {
      const uri = file && (await handleFileUpload(file));

      const newData = uri ? { ...data, image: uri } : data;

      const res = await apiRequest({
        url: "/posts/create-post",
        data: newData,
        token: user?.token,
        method: "POST",
      });

      if (res?.status === "failed") {
        setErrMsg(res);
      } else {
        reset({
          description: "",
        });
        setFile(null);
        setErrMsg("");
        await fetchPost();
      }
      setPosting(false);
    } catch (error) {
      console.log(error);
      setPosting(false);
    }
  };

  const fetchPost = async () => {
    await fetchPosts(user?.token, dispatch);
    setLoading(false);
  };

  const handleLikePost = async (uri) => {
    await likePost({ uri: uri, token: user?.token });

    await fetchPost();
  };

  const handleDelete = async (id) => {
    await deletePost(id, user.token);
    await fetchPost();
  };

  const getUser = async () => {
    const res = await getUserInfo(user?.token);
    const newData = { token: user?.token, ...res };
    dispatch(UserLogin(newData));
  };

  useEffect(() => {
    setLoading(true);
    getUser();
    fetchPost();
  }, []);

  return (
    <>
      <div className="home w-full px-0 lg:px-10 2xl:px-40 bg-bgColor h-screen overflow-hidden">
        <div className="w-full flex gap-2 lg:gap-4 pt-5 pb-10 h-full">
          {/* LEFT */}
          <div className="hidden w-1/3 lg:w-1/4 h-full md:flex flex-col gap-6 overflow-y-auto">
            <ProfileCard user={user} />
            <FriendsCard friends={user?.friends} />
          </div>

          {/* Center */}
          <div className="flex-1 h-full px-4 flex flex-col gap-6 overflow-y-auto rounded-lg">
            <form
              onSubmit={handleSubmit(handlePostSubmit)}
              className="bg-primary px-4 rounded-lg"
            >
              <div className="w-full flex items-center gap-2 py-4 border-b border-[#66666645]">
                <img
                  src={user?.profileUrl ?? NoProfile}
                  alt={user?.firstName}
                  className="w-14 h-14 object-cover rounded-full"
                />
                <TextInput
                  styles="w-full rounded-full py-5"
                  placeholder="What's on your mind..."
                  name="description"
                  register={register("description", {
                    required: "Write something about post",
                  })}
                  error={errors.description ? errors.description.message : ""}
                />
              </div>
              {errMsg?.message && (
                <span
                  role="alert"
                  className={`text-sm ${
                    errMsg?.status === "failed"
                      ? "text-[#f6494fe]"
                      : "text-[#2ba150fe]"
                  } mt-0.5`}
                >
                  {errMsg?.message}
                </span>
              )}

              <div className="flex items-center justify-between py-4">
                <label
                  htmlFor="imgUpload"
                  className="flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer"
                >
                  <input
                    type="file"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="hidden"
                    id="imgUpload"
                    data-max-size="5120"
                    accept=".jpg, .png, .jpeg"
                  />
                  <BiImages />
                  <span>Images</span>
                </label>

                <label
                  htmlFor="videoUpload"
                  className="flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer"
                >
                  <input
                    type="file"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="hidden"
                    id="videoUpload"
                    data-max-size="5120"
                    accept=".mp4, .wav"
                  />
                  <BiSolidVideo />
                  <span>Video</span>
                </label>

                <label
                  htmlFor="vgifUpload"
                  className="flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer"
                >
                  <input
                    type="file"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="hidden"
                    id="vgifUpload"
                    data-max-size="5120"
                    accept=".gif"
                  />
                  <BsFiletypeGif />
                  <span>Gif</span>
                </label>

                <div>
                  {posting ? (
                    <Loading />
                  ) : (
                    <CustomButton
                      type="submit"
                      title="Post"
                      containerStyles="bg-[#1877F2] text-white py-1 px-6 rounded-full font-semibold text-sm"
                    />
                  )}
                </div>
              </div>
            </form>

            {loading ? (
              <Loading />
            ) : posts?.length > 0 ? (
              posts?.map((post) => (
                <PostCard
                  key={post?._id}
                  post={post}
                  user={user}
                  deletePost={handleDelete}
                  likePost={handleLikePost}
                />
              ))
            ) : (
              <div className="flex w-full h-full items-center justify-center">
                <p className="text-lg text-ascent-2">No Post Available</p>
              </div>
            )}
          </div>

          {/* RIGHT */}
          <div className="hidden w-1/4 h-full lg:flex flex-col gap-8 overflow-y-auto">
            {/* Friend Request */}
            <FriendRequests />

            {/* Suggested Friends */}
            <SuggestedFriends />
          </div>
        </div>
      </div>

      {edit && <EditProfile />}
    </>
  );
};

export default Home;
