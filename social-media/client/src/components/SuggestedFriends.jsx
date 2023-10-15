/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { NoProfile } from "../assets";
import { apiRequest, sendFriendRequest } from "../utils";
import { useDispatch, useSelector } from "react-redux";
import CustomButton from "./CustomButton";
import TopBar from "./TopBar";
import { selectButtonState, setFriendRequestSend } from "../redux/userSlice";

const SuggestedFriends = () => {
  const [suggestedFriends, setSuggestedFriends] = useState([]);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch()
  const requestSend = useSelector(selectButtonState)

  const fetchSuggestedFriends = async () => {
    try {
      const res = await apiRequest({
        url: "/users/suggested-friends",
        token: user?.token,
        method: "POST",
      });
      setSuggestedFriends(res?.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleFriendRequest = async (id) => {
    try {
      const res = await sendFriendRequest(user.token, id);
      dispatch(setFriendRequestSend())
      await fetchSuggestedFriends();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchSuggestedFriends();
  }, []);

  return (
    <>
      <div className="topbar block lg:hidden" >
        <TopBar />
      </div>
      <div className="w-full bg-primary lg:rounded-lg px-6 py-5 h-screen overflow-y-auto">
        <div className="flex items-center justify-between text-xl text-ascent-1 pb-2 border-b border-[#66666645]">
          <span>Friend Suggestion</span>
          <span>{suggestedFriends?.length}</span>
        </div>

        {suggestedFriends?.length === 0 ? (
          <div className="w-full h-full items-center justify-center pt-4 border-[#66666645]">
            <p className="text-lg text-ascent-2">
              We don't have friends to suggest you !!
            </p>
          </div>
        ) : (
          <div className="w-full flex flex-col gap-4 pt-4">
            {suggestedFriends?.map((friend) => (
              <div
                className="flex items-center justify-between"
                key={friend._id}
              >
                <Link
                  to={"/profile/" + friend?._id}
                  key={friend?._id}
                  className="w-full flex gap-4 items-center cursor-pointer"
                >
                  <img
                    src={friend?.profileUrl ?? NoProfile}
                    alt={friend?.firstName}
                    className="w-10 h-10 object-cover rounded-full"
                  />

                  <div className="flex-1">
                    <p className="text-base font-medium text-ascent-1">
                      {friend?.firstName} {friend?.lastName}
                    </p>
                    <span className="text-sm text-ascent-2">
                      {friend?.profession ?? "No Profession"}
                    </span>
                  </div>
                </Link>

                <div className="flex gap-1">
                  <CustomButton
                    title={requestSend ? "Requested" : "Add"}
                    type="submit"
                    onClick={() => handleFriendRequest(friend?._id)}
                    containerStyles="bg-[#1877F2] text-white py-1 px-3 rounded-full font-semibold text-sm"
                  />

                  {/* <button
                  className="text-sm text-white px-1 rounded"
                  onClick={() => handleFriendRequest(friend?._id)}
                >
                  {requestSend ? "Requested" : "Add"}
                  <BsPersonFillAdd size={20} className="text-[#1877F2]" />
                </button> */}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default SuggestedFriends;
