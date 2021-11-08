import React from "react";
import { BiShieldAlt2 } from "react-icons/bi";
import { BiRupee } from "react-icons/bi";
import { FaUsers } from "react-icons/fa";
import { BsQuestionDiamond } from "react-icons/bs";
import Widget from "components/Widget";

const IconWithTextCard = ({ data }) => {
  const { iconName, iconColor, title, subTitle } = data;
  return (
    <Widget styleName="p-4">
      <div className="media align-items-center flex-nowrap">
        <div className="mr-lg-4 mr-3">
          <span className={iconColor}>
            {iconName == "BiShieldAlt2" ? (
              <BiShieldAlt2 className="size-40" />
            ) : iconName == "BiRupee" ? (
              <BiRupee className="size-40" />
            ) : iconName == "FaUsers" ? (
              <FaUsers className="size-40" />
            ) : iconName == "BsQuestionDiamond" ? (
              <BsQuestionDiamond className="size-40" />
            ) : (
              <FaUsers className="size-40" />
            )}
          </span>
        </div>
        <div className="media-body">
          <h1 className="jr-font-weight-bold mb-0">{title}</h1>
          <p className="text-grey mb-0">{subTitle}</p>
        </div>
      </div>
    </Widget>
  );
};

export default IconWithTextCard;
