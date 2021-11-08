import React from "react";
import CustomScrollbars from "util/CustomScrollbars";
import Navigation from "../../components/Navigation";
// import {menuDetails} from '../AppLayout/data';
import { useSelector } from "react-redux";

const SideBarContent = () => {
  const { authUser } = useSelector(({ auth }) => auth);
  console.log("authUser", authUser);
  let menuDetails = authUser.menuDetails;
  return (
    <CustomScrollbars className=" scrollbar">
      <Navigation menuItems={menuDetails} />
    </CustomScrollbars>
  );
};

export default SideBarContent;
