import React from "react";
import TablePagination from "@material-ui/core/TablePagination";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles, useTheme } from "@material-ui/core/styles";

const paginationNavigation_UseStyles = makeStyles((theme) => ({
  root: {
    flexShrink: 0,
    marginLeft: theme.spacing(2.5),
  },
}));

const TablePaginationComponent = ({
  rowsPerPage,
  count,
  page,
  from,
  limit,
  to,
  pageCount,
  onChangeRowsPerPage,
  getPageFromBackEnd,
  update_from,
  update_to,
}) => {
  const paginationNavigation_Classes = paginationNavigation_UseStyles();
  const theme = useTheme();

  const handleBackButtonClick = (event) => {
    // const { page, limit } = props;
    let actionType = "handleBackButtonClick"
    let pageNumber = page;
    pageNumber--;

    let temp_from = (pageNumber - 1) * limit + 1;
    // console.log("temp_form in back button = ", temp_from);
    //update_from(temp_from);
    let temp_to = temp_from + limit - 1;
    // console.log("data.length = ", data.length);
    // console.log("temp_to in back button = ", temp_to);
    //update_to(temp_to);

    //getPageFromBackEnd(pageNumber, limit);
    getPageFromBackEnd(pageNumber, limit,temp_from,temp_to,0,actionType);
  };

  const handleNextButtonClick = (event) => {
    // const { page, limit, pageCount } = props;
    let actionType = "handleNextButtonClick"
    let pageNumber = page;
    pageNumber++;

    let temp_from = (pageNumber - 1) * limit + 1;
    //update_from(temp_from);
    let temp_to = temp_from + limit - 1;
    // if (temp_to >= pageCount) {
    //   update_to(pageCount);
    // } else {
    //   update_to(temp_to);
    // }

    getPageFromBackEnd(pageNumber, limit,temp_from,temp_to,pageCount,actionType);
  };
  return (
    <React.Fragment>
      <TablePagination
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
        count={count}
        page={page}
        labelDisplayedRows={() => {
          return to >= pageCount
            ? `${from}-${pageCount} of total ${pageCount} items`
            : `${from}-${to} of total ${pageCount} items`;
        }}
        onChangeRowsPerPage={onChangeRowsPerPage}
        onChangePage={(event, newPage) => {
          console.log("newPage: ", newPage);
        }}
        ActionsComponent={(subProps) => (
          <div className={paginationNavigation_Classes.root}>
            <IconButton
              onClick={handleBackButtonClick}
              disabled={page === 1}
              aria-label="previous page"
            >
              {theme.direction === "rtl" ? (
                <KeyboardArrowRight />
              ) : (
                <KeyboardArrowLeft />
              )}
            </IconButton>
            <IconButton
              onClick={handleNextButtonClick}
              disabled={to >= pageCount}
              aria-label="next page"
            >
              {theme.direction === "rtl" ? (
                <KeyboardArrowLeft />
              ) : (
                <KeyboardArrowRight />
              )}
            </IconButton>
          </div>
        )}
      />
    </React.Fragment>
  );
};

export default TablePaginationComponent;
