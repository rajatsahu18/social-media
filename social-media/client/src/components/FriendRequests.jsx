/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect, useState } from "react";
import CustomButton from "./CustomButton";
import { NoProfile } from "../assets";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { apiRequest } from "../utils";

const FriendRequests = () => {
  const [friendRequest, setFriendRequest] = useState([]);
  const { user } = useSelector((state) => state.user);

  const fetchFriendRequests = async () => {
    try {
      const res = await apiRequest({
        url: "/users/get-friend-request",
        token: user?.token,
        method: "POST",
      });
      setFriendRequest(res?.data);
    } catch (error) {
      console.log(error);
    }
  };
  const acceptFriendRequest = async (id, status) => {
    try {
      const res = await apiRequest({
        url: "/users/accept-request",
        token: user?.token,
        method: "POST",
        data: { rid: id, status },
      });
      setFriendRequest(res?.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchFriendRequests();
  }, []);
  return (
    <div className="w-full bg-primary lg:rounded-lg px-6 py-5 h-screen overflow-y-auto">
      <div className="flex items-center justify-between text-xl text-ascent-1 pb-2 border-b border-[#66666645]">
        <span>Friend Request</span>
        <span>{friendRequest?.length}</span>
      </div>

      {friendRequest?.length === 0 ? (
        <div className="w-full h-full items-center justify-center pt-4 border-[#66666645]">
          <p className="text-lg text-ascent-2">
            You don't have any friend request !!
          </p>
        </div>
      ) : (
        <div className="w-full flex flex-col gap-4 pt-4">
          {friendRequest?.map(({ _id, requestFrom: from }) => (
            <div key={_id} className="flex items-center justify-between">
              <Link
                to={"/profile/" + from._id}
                className="w-full flex gap-4 items-center cursor-pointer"
              >
                <img
                  src={from?.profileUrl ?? NoProfile}
                  alt={from?.firstName}
                  className="w-10 h-10 object-cover rounded-full"
                />

                <div className="flex-1">
                  <p className="text-base font-medium text-ascent-1">
                    {from?.firstName} {from?.lastName}
                  </p>
                  <span className="text-sm text-ascent-2">
                    {from?.profession ?? "No Profession"}
                  </span>
                </div>
              </Link>

              <div className="flex gap-1">
                <CustomButton
                  title="Confirm"
                  onClick={() => acceptFriendRequest(_id, "Accepted")}
                  containerStyles="bg-[#1877F2] text-xs text-white px-1.5 py-1 rounded-full"
                />

                <CustomButton
                  title="Deny"
                  onClick={() => acceptFriendRequest(_id, "Denied")}
                  containerStyles="border border-[#666] text-xs text-ascent-1 px-1.5 py-1 rounded-full"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FriendRequests;
