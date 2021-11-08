import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Chip from "@material-ui/core/Chip";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    "& > *": {
      margin: theme.spacing(0.5),
    },
  },
}));

const FieldArea = ({ userSelectedData, handleDelete }) => {
  const classes = useStyles();
  console.log("data-userSelectedData", userSelectedData);

  // const handleDelete = () => {};

  return (
    <>
      <div>
        <span className={classes.root}>
          {userSelectedData.map((n) => {
            return (
              <>
                <Chip
                  label={n.username}
                  onDelete={(e) => handleDelete(n.keyCloakId)}
                  color="primary"
                />
              </>
            );
          })}
        </span>
      </div>
    </>
  );
};

export default FieldArea;
