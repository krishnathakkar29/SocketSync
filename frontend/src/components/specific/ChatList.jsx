import { Stack } from "@mui/material";
import React from "react";
import ChatItem from "../shared/ChatItem";

const ChatList = ({
  width = "100%",
  chats = [],
  chatId,
  onlineUsers = [],
  newMessagesAlert = [
    {
      chatId: "",
      count: 0,
    },
  ],
  handleDeleteChat,
}) => {
  return (
    <Stack direction={"column"} width={width} overflow={"auto"} height={"100%"}>
      {chats?.map((data, index) => {
        const { avatar, name, _id, groupChat, members } = data;

        const newMessageAlert = newMessagesAlert.find(
          ({ chatId }) => chatId == _id
        );

        const isOnline = members?.some((member) =>
          onlineUsers.includes(member)
        );

        return (
          <ChatItem
            index={index}
            newMessageAlert={newMessagesAlert}
            isOnline={isOnline}
            avatar={avatar}
            name={name}
            _id={_id}
            key={index}
            groupChat={groupChat}
            sameSender={chatId == _id}
            handleDeleteChat={handleDeleteChat}
          />
        );
      })}
    </Stack>
  );
};

export default ChatList;
