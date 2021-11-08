import React from "react";
import RenewalTableCell from "./RenewalTableCell";

let counter = 0;

function createData(orderId, name, image, orderDate, provider, status) {
  counter += 1;
  return { id: counter, orderId, name, image, orderDate, provider, status };
}

const data = [
  createData(
    "23545",
    "Rakesh N P",
    require("assets/images/insurance/user_blank.png"),
    "25 Dec",
    "Max Bupa",
    "Renewed"
  ),
  createData(
    "23653",
    "Jitendra M",
    require("assets/images/insurance/user_blank.png"),
    "18 Dec",
    "Max Bupa",
    "Pending"
  ),
  createData(
    "24567",
    "Mithun T J",
    require("assets/images/insurance/user_blank.png"),
    "11 Dec",
    "HDFC ERGO",
    "Delayed"
  ),
  createData(
    "25745",
    "Nikhl K",
    require("assets/images/insurance/user_blank.png"),
    "31 Dec",
    "Star",
    "Cancelled"
  ),
  createData(
    "11567",
    "Diwakar",
    require("assets/images/insurance/user_blank.png"),
    "20 Dec",
    "HDFC ERGO",
    "Delayed"
  ),
];

const RenewalTable = () => {
  return (
    <div className="table-responsive-material">
      <table className="default-table table-unbordered table table-sm table-hover">
        <thead className="th-border-b">
          <tr>
            <th>Policy No.</th>
            <th>Customer</th>
            <th>Renewal Date</th>
            <th>Provider</th>
            <th className="status-cell text-right">Action</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {data.map((data) => {
            return <RenewalTableCell key={data.id} data={data} />;
          })}
        </tbody>
      </table>
    </div>
  );
};

export default RenewalTable;
