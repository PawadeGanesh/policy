import React from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import IntlMessages from "util/IntlMessages";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Paper from "@material-ui/core/Paper";

function ListItem({ styleName, data, toggleDrawer }) {
  const { image, name, designation, description } = data;
  const [state, setState] = React.useState({
    checkedB: false,
  });
  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
    toggleDrawer("bottom", true);
  };

  return (
    <>
      <div className={`user-list d-flex flex-row  ${styleName}`}>
        {/* <Avatar alt="..." src={image} className="user-avatar avatar-shadow" /> */}
        <Paper className="user-avatar avatar-shadow">
          <img src={image} />
        </Paper>
        <div className="description">
          <h5>{name}</h5>
          <h6>{designation}</h6>
          <p className="text-muted">{description}</p>
          {/*  jr-mbtn-list */}
          <ul className="list-inline d-sm-flex flex-sm-row mb-0 ">
            {/* <li><Button color="primary"><IntlMessages id="button.modify"/></Button></li>
          <li><Button color="secondary"><IntlMessages id="button.delete"/></Button></li> */}
            {/* <li>
            <Button color="primary">Add to Compare</Button>
          </li> */}
            <FormControlLabel
              control={
                <Checkbox
                  checked={state.checkedB}
                  onChange={handleChange}
                  name="checkedB"
                  color="primary"
                />
              }
              label="Add to compare"
            />
            <li className="mt-1">
              <Button variant="contained" color="secondary">
                View Details
              </Button>
            </li>
            <li className="mt-1">
              <Button variant="contained" color="primary">
                Buy Now
              </Button>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}

export default ListItem;
