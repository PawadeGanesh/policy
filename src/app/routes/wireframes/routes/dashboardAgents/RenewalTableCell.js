import React, { useState } from "react";
import Avatar from "@material-ui/core/Avatar";

const RenewalTableCell = (props) => {
  // const [anchorE1, setAnchorE1] = useState(undefined);

  // const onOptionMenuSelect = event => {
  //   setAnchorE1(event.currentTarget);
  // };
  // const handleRequestClose = () => {
  //   setAnchorE1(null);
  // };

  const { id, orderId, name, image, orderDate, provider, status } = props.data;
  return (
    <tr tabIndex={-1} key={id} style={{ height: "50vh" }}>
      <td>{orderId}</td>
      <td>
        <div className="user-profile d-flex flex-row align-items-center">
          <Avatar alt={name} src={image} className="user-avatar" />
          <div className="user-detail">
            <h5 className="user-name">{name} </h5>
          </div>
        </div>
      </td>
      <td>{orderDate}</td>
      <td>{provider}</td>
      <td className="status-cell text-right">
        <button>Renew Now</button>
      </td>
    </tr>
  );
};

export default RenewalTableCell;
