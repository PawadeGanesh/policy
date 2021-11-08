import React from "react";
import IntlMessages from "util/IntlMessages";
import {
  TableHead,
  TableCell,
  Tooltip,
  TableRow,
  TableSortLabel,
} from "@material-ui/core";

const EnhancedTableHead = (props) => {
  const { order, orderBy, headCell } = props;

  const createSortHandler = (property) => (event) => {
    console.log("property", property);
    props.onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCell &&
          headCell.map((n) => {
            if (n.isActive) {
              return (
                <TableCell key={headCell.id}>
                  <Tooltip title="Sort" enterDelay={300}>
                    <TableSortLabel
                      active={orderBy === n.id}
                      direction={orderBy === n.id ? order : "asc"}
                      onClick={createSortHandler(n.id)}
                    >
                      <IntlMessages id={n.label} />
                    </TableSortLabel>
                  </Tooltip>
                </TableCell>
              );
            } else {
              return (
                <TableCell key={headCell.id}>
                  <IntlMessages id={n.label} />
                </TableCell>
              );
            }
          })}
      </TableRow>
    </TableHead>
  );
};

export default EnhancedTableHead;
