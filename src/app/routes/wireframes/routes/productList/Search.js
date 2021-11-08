import React, { useEffect, useState } from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Slider from "@material-ui/core/Slider";
import Typography from "@material-ui/core/Typography";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import InputSearchButton from "app/routes/widgets/routes/CommonComponents/SearchButton";
import Checkbox from "@material-ui/core/Checkbox";
import InputResetButton from "app/routes/widgets/routes/CommonComponents/ResetButton";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";

const useStyles = makeStyles({
  root: {
    width: 350,
    marginLeft: 80,
    marginTop: 10,
  },
  list: {
    width: 380,
    marginLeft: 80,
  },
  checklist: {
    marginTop: 50,
    width: 380,
    marginLeft: 80,
  },
});

const PrettoSlider = withStyles({
  root: {
    color: "teal",
    height: 8,
    marginLeft: 30,
  },
  thumb: {
    height: 24,
    width: 24,
    backgroundColor: "#fff",
    border: "2px solid teal",
    marginTop: -8,
    marginLeft: -12,
    "&:focus, &:hover, &$active": {
      boxShadow: "inherit",
    },
  },
  active: {},
  valueLabel: {
    left: "calc(-50% + 4px)",
    top: -22,
    "& *": {
      background: "transparent",
      color: "#000",
    },
    fontWeight: "bold",
  },
  track: {
    height: 8,
    borderRadius: 4,
  },
  rail: {
    height: 8,
    borderRadius: 4,
  },
})(Slider);

const Search = ({
  data,
  price,
  minPrice,
  maxPrice,
  ratio,
  minRatio,
  maxRatio,
  handlePriceChange,
  handleRatioChange,
  handleSearchClick,
  handleChange,
  checkedA,
  handleCheck,
  handleResetClick,
  selectedProvider,
}) => {
  console.log("data", checkedA);
  const classes = useStyles();

  const PriceLabelFormat = (value) => {
    return <>&#8377;{value}</>;
  };

  const RatioLabelFormat = (value) => {
    return `${value}%`;
  };

  return (
    <>
      <div className="row">
        <div className={classes.root}>
          <Typography gutterBottom style={{ marginLeft: "-60px" }}>
            <h3>
              <b>Price Range :</b>
            </h3>
          </Typography>

          <PrettoSlider
            className="mt-3"
            value={price}
            onChange={handlePriceChange}
            aria-labelledby="range-slider"
            valueLabelDisplay="auto"
            aria-label="pretto slider"
            valueLabelFormat={PriceLabelFormat}
            valueLabelDisplay="on"
            min={minPrice}
            max={maxPrice}
          />
        </div>
        <div className={classes.root}>
          <Typography gutterBottom style={{ marginLeft: "-60px" }}>
            <h3>
              <b>Settlement Ratio :</b>
            </h3>
          </Typography>

          <PrettoSlider
            className="mt-3"
            value={ratio}
            onChange={handleRatioChange}
            aria-labelledby="range-slider"
            valueLabelDisplay="auto"
            aria-label="pretto slider"
            valueLabelFormat={RatioLabelFormat}
            valueLabelDisplay="on"
            min={minRatio}
            max={maxRatio}
          />
        </div>
        <div className={classes.list}>
          <Typography
            gutterBottom
            style={{ marginLeft: "-60px", marginTop: "10px" }}
          >
            <h3>
              <b>Providers :</b>
            </h3>
          </Typography>

          <Autocomplete
            multiple
            // limitTags={4}
            id="provider"
            name="provider"
            onChange={(e, value) => handleChange(e, value)}
            options={data || []}
            getOptionLabel={(option) => option.name}
            defaultValue={selectedProvider}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label="Providers"
                placeholder="Provider LIst"
              />
            )}
          />
        </div>

        <div className={classes.checklist}>
          <span>
            <Checkbox
              color="primary"
              checked={checkedA}
              onChange={handleCheck}
              inputProps={{ "aria-label": "primary checkbox" }}
            />
          </span>
          <span>
            <b>Exclude Non-availble Quotes</b>
          </span>
        </div>

        <div style={{ marginLeft: "150px", marginTop: "40px" }}>
          <InputSearchButton onClick={handleSearchClick} />
          <InputResetButton onClick={handleResetClick} />
        </div>
      </div>
    </>
  );
};

export default Search;
