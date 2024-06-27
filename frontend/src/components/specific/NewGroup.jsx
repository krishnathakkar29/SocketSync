import React, { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "../ui/input";
import { sampleUsers } from "@/constant/sampleData";
import UserItem from "../shared/UserItem";
import { Button } from "../ui/button";
import { useInputValidation } from "6pp";
import { useDispatch, useSelector } from "react-redux";
import { useAvailableFriendsQuery, useNewGroupMutation } from "@/redux/api/api";
import { useAsyncMutation, useErrors } from "@/hooks/hook";
import { Skeleton } from "@mui/material";
import toast from "react-hot-toast";
import { setIsNewGroup } from "@/redux/reducers/misc";

export default function NewGroup({ isOpen, onOpenChange }) {
  const dispatch = useDispatch();
  const groupName = useInputValidation("");

  // const { isNewGroup } = useSelector((state) => state.misc);

  const { isError, isLoading, error, data } = useAvailableFriendsQuery();
  const [newGroup, isLoadingNewGroup] = useAsyncMutation(useNewGroupMutation);

  const [members, setMembers] = useState(sampleUsers);
  const [selectedMembers, setSelectedMembers] = useState([]);

  const errors = [
    {
      isError,
      error,
    },
  ];

  useErrors(errors);

  const selectMemberHandler = (id) => {
    if (selectedMembers.includes(id)) {
      const newMembers = selectedMembers.filter(
        (single) => single.toString() !== id.toString()
      );
      setSelectedMembers(newMembers);
    } else {
      setSelectedMembers((prev) => [...prev, id]);
    }
  };

  const submitHandler = () => {
    if (!groupName.value) return toast.error("Group name is required");

    if (selectedMembers.length < 2)
      return toast.error("Please Select Atleast 3 Members");

    newGroup("Creating New Group...", {
      name: groupName.value,
      members: selectedMembers,
    });

    dispatch(setIsNewGroup(false));
  };
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[25rem]">
        <h1 className="text-center text-xl">New Group</h1>

        <Input
          placeholder="Enter Group Name"
          className=" outline-none"
          value={groupName.value}
          onChange={groupName.changeHandler}
        />

        <h1 className="text-gray-600 font-normal my-2">Members</h1>
        <div className="h-[40vh]">
          {isLoading ? (
            <>
              <Skeleton />
            </>
          ) : (
            <>
              <ul className=" heyo list-none overflow-y-scroll h-full">
                {data?.friends?.map((user) => {
                  return (
                    <li key={user._id}>
                      <UserItem
                        user={user}
                        handler={selectMemberHandler}
                        isAdded={selectedMembers.includes(user._id)}
                      />
                    </li>
                  );
                })}
              </ul>
            </>
          )}
        </div>

        <div className="flex items-center justify-center gap-3">
          <Button
            className="bg-green-500 hover:bg-green-700"
            onClick={submitHandler}
            disabled={isLoadingNewGroup}
          >
            Create
          </Button>
          <Button
            className="bg-red-500 hover:bg-red-700"
            onClick={() => {
              dispatch(setIsNewGroup(false));
            }}
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
