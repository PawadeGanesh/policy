import React from "react";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import TextField from "@material-ui/core/TextField";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import Select from "@material-ui/core/Select";
import ListItem from "../../../../customViews/routes/Component/ListItem";
import { data } from "../../../../customViews/routes/data";
import Drawer from "@material-ui/core/Drawer";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import AddBoxIcon from "@material-ui/icons/AddBox";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { withStyles } from "@material-ui/core/styles";
import UserCard from "./../../../../widgets/routes/Modern/UserCard";
import Aditya_Birla from "../../../../../../assets/images/health_insurance/Aditya_Birla.webp";
import Bharti_Axa from "../../../../../../assets/images/health_insurance/Bharti_Axa.webp";
import Care_Health from "../../../../../../assets/images/health_insurance/Care_Health.webp";

function getSteps() {
  return [
    "Please provide your details",
    "Please select members & their age",
    "Health details",
    "Please Enter OTP sent to you",
    "Confirm and Finish",
  ];
}

function getStepContent(stepIndex, self) {
  switch (stepIndex) {
    case 0:
      return getBasicInformation(self);
    case 1:
      return getFamilyInformation(self);
    case 2:
      return getDiseaseInformation(self);
    case 3:
      return getContactDetails(self);
    case 4:
      return getOTP_Confirmation(self);

    default:
      return "Uknown stepIndex";
  }
}
function countryToFlag(isoCode) {
  return typeof String.fromCodePoint !== "undefined"
    ? isoCode
        .toUpperCase()
        .replace(/./g, (char) =>
          String.fromCodePoint(char.charCodeAt(0) + 127397)
        )
    : isoCode;
}
const useStyles = withStyles({
  option: {
    fontSize: 15,
    "& > span": {
      marginRight: 10,
      fontSize: 18,
    },
  },
});

const getContactDetails = () => {
  return (
    <div>
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="form-group">
            <TextField
              id="fullName"
              label="Full Name"
              margin="normal"
              fullWidth
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="form-group">
            <TextField
              id="userPhoneNumber"
              label="Phone Number"
              margin="normal"
              fullWidth
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="form-group">
            <TextField id="userEmail" label="Email" margin="normal" fullWidth />
          </div>
        </div>
      </div>
    </div>
  );
};

function getOTP_Confirmation() {
  return (
    <div>
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="form-group">
            <TextField
              id="enterOTP"
              label="Enter OTP sent to mobile number"
              margin="normal"
              fullWidth
            />
          </div>
        </div>
        {/* <div className="col-md-6">
          <div className="form-group">
            <TextField
              id="password"
              label={<IntlMessages id="appModule.password" />}
              type="password"
              autoComplete="current-password"
              margin="normal"
              fullWidth
            />
          </div>
        </div> */}
      </div>
      {/* <div className="row">
        <div className="col-md-6">
          <div className="form-group">
            <TextField
              id="confirmPassword"
              label="Confirm Password"
              type="password"
              autoComplete="current-password"
              margin="normal"
              fullWidth
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="form-group">
            <TextField
              id="email"
              label={<IntlMessages id="appModule.email" />}
              margin="normal"
              fullWidth
            />
          </div>
        </div>
      </div> */}
    </div>
  );
}

function getBasicInformation(self) {
  const classes = useStyles;
  return (
    <div>
      <div className="row justify-content-center py-3">
        <div className="col-md-6 text-center">
          <div className="form-group">
            {/* <Button>
              <Paper>
                <img src={maleImage} className="img-thumbnail" />
              </Paper>
            </Button>
            <Button>
              <Paper>
                <img src={femaleImage} className="img-thumbnail" />
              </Paper>
            </Button> */}
            <FormControlLabel
              control={
                <Checkbox
                  checked={self.state.male}
                  onChange={self.handleMaleCheckboxChange}
                  name="male"
                  color="primary"
                />
              }
              label="Male"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={self.state.female}
                  onChange={self.handleFemaleCheckboxChange}
                  name="female"
                  color="primary"
                />
              }
              label="Female"
            />
            {/* <TextField
              id="fullName"
              label="City name"
              margin="normal"
              fullWidth
            /> */}
            <Autocomplete
              className="mx-auto mt-3"
              id="country-select-demo"
              style={{ width: 300 }}
              options={countries}
              classes={{
                option: classes.option,
              }}
              autoHighlight
              getOptionLabel={(option) => option.label}
              renderOption={(option) => (
                <React.Fragment>
                  <span>{countryToFlag(option.code)}</span>
                  {option.label} ({option.code}) +{option.phone}
                </React.Fragment>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Choose a city"
                  variant="outlined"
                  inputProps={{
                    ...params.inputProps,
                    autoComplete: "new-password", // disable autocomplete and autofill
                  }}
                />
              )}
            />
          </div>
        </div>
      </div>
      {/*<div className="row">
        <div className="col-md-6">
           <div className="form-group">
            <img src={maleImage} className="img-thumbnail" />
            <img src={femaleImage} className="img-thumbnail" />
          </div> 
        </div>*/}
      {/* <div className="col-md-6">
          <div className="form-group">
            <TextField
              id="userEmail"
              label="User Name"
              margin="normal"
              fullWidth
            />
          </div>
        </div> */}

      {/* <div className="col-md-6">
          <div className="form-group">
            <TextField
              id="userEmail"
              label="User Name"
              margin="normal"
              fullWidth
            />
          </div>
        </div> 
      </div>*/}
      {/* <div className="row">
        <div className="col-md-12">
          <div className="form-group">
            <TextField
              id="aboutUser"
              label="Write Something About You"
              margin="normal"
              multiline
              rowsMax="4"
              fullWidth
            />
          </div>
        </div>
      </div> */}
    </div>
  );
}

function getFamilyInformation(self) {
  return (
    <div className="tab-pane" id="tab2-3">
      <div className="row justify-content-center">
        <FormControlLabel
          className="mr-0"
          control={
            <Checkbox
              checked={self.state.self}
              onChange={self.handleSelfCheckboxChange}
              name="Self"
              color="primary"
            />
          }
          label="Self"
        />
        <div className="col-lg-3 col-sm-6 col-12">
          <FormControl className="w-100 mb-2">
            <InputLabel htmlFor="age-helper">Select Age</InputLabel>
            <Select
              value={self.state.age}
              onChange={self.handleChange("age")}
              input={<Input id="age-helper" />}
            >
              {/* <MenuItem value="">
                <em>None</em>
              </MenuItem> */}
              <MenuItem value={10}>18 years</MenuItem>
              <MenuItem value={20}>20 years</MenuItem>
              <MenuItem value={30}>30 years</MenuItem>
            </Select>
            <FormHelperText>Please enter your age</FormHelperText>
          </FormControl>
        </div>
        <FormControlLabel
          className="mr-0"
          control={
            <Checkbox
              checked={self.state.spouse}
              onChange={self.handleSpouseCheckboxChange}
              name="Spouse"
              color="primary"
            />
          }
          label="Spouse"
        />
        <div className="col-lg-3 col-sm-6 col-12">
          <FormControl className="w-100 mb-2">
            <InputLabel htmlFor="age-helper">Select Age</InputLabel>
            <Select
              value={self.state.age}
              onChange={self.handleChange("age")}
              input={<Input id="age-helper" />}
            >
              {/* <MenuItem value="">
                <em>None</em>
              </MenuItem> */}
              <MenuItem value={10}>18 years</MenuItem>
              <MenuItem value={20}>20 years</MenuItem>
              <MenuItem value={30}>30 years</MenuItem>
            </Select>
            <FormHelperText>Please enter your age</FormHelperText>
          </FormControl>
        </div>
        <FormControlLabel
          className="mr-0"
          control={
            <Checkbox
              checked={self.state.son}
              onChange={self.handleSonCheckboxChange}
              name="Son"
              color="primary"
            />
          }
          label="Son"
        />
        <AddBoxIcon style={{ "margin-top": "25px" }} />
        <div className="col-lg-3 col-sm-6 col-12">
          <FormControl className="w-100 mb-2">
            <InputLabel htmlFor="age-helper">Select Age</InputLabel>
            <Select
              value={self.state.age}
              onChange={self.handleChange("age")}
              input={<Input id="age-helper" />}
            >
              {/* <MenuItem value="">
                <em>None</em>
              </MenuItem> */}
              <MenuItem value={10}>18 years</MenuItem>
              <MenuItem value={20}>20 years</MenuItem>
              <MenuItem value={30}>30 years</MenuItem>
            </Select>
            <FormHelperText>Please enter your age</FormHelperText>
          </FormControl>
        </div>
        <FormControlLabel
          className="mr-0"
          control={
            <Checkbox
              checked={self.state.daughter}
              onChange={self.handleDaughterCheckboxChange}
              name="Daughter"
              color="primary"
            />
          }
          label="Daughter"
        />
        <AddBoxIcon style={{ "margin-top": "25px" }} />
        <div className="col-lg-3 col-sm-6 col-12">
          <FormControl className="w-100 mb-2">
            <InputLabel htmlFor="age-helper">Select Age</InputLabel>
            <Select
              value={self.state.age}
              onChange={self.handleChange("age")}
              input={<Input id="age-helper" />}
            >
              {/* <MenuItem value="">
                <em>None</em>
              </MenuItem> */}
              <MenuItem value={10}>18 years</MenuItem>
              <MenuItem value={20}>20 years</MenuItem>
              <MenuItem value={30}>30 years</MenuItem>
            </Select>
            <FormHelperText>Please enter your age</FormHelperText>
          </FormControl>
        </div>
        <FormControlLabel
          className="mr-0"
          control={
            <Checkbox
              checked={self.state.father}
              onChange={self.handleFatherCheckboxChange}
              name="Father"
              color="primary"
            />
          }
          label="Father"
        />
        <div className="col-lg-3 col-sm-6 col-12">
          <FormControl className="w-100 mb-2">
            <InputLabel htmlFor="age-helper">Select Age</InputLabel>
            <Select
              value={self.state.age}
              onChange={self.handleChange("age")}
              input={<Input id="age-helper" />}
            >
              {/* <MenuItem value="">
                <em>None</em>
              </MenuItem> */}
              <MenuItem value={10}>18 years</MenuItem>
              <MenuItem value={20}>20 years</MenuItem>
              <MenuItem value={30}>30 years</MenuItem>
            </Select>
            <FormHelperText>Please enter your age</FormHelperText>
          </FormControl>
        </div>
        <FormControlLabel
          className="mr-0"
          control={
            <Checkbox
              checked={self.state.mother}
              onChange={self.handleMotherCheckboxChange}
              name="Mother"
              color="primary"
            />
          }
          label="Mother"
        />
        <div className="col-lg-3 col-sm-6 col-12">
          <FormControl className="w-100 mb-2">
            <InputLabel htmlFor="age-helper">Select Age</InputLabel>
            <Select
              value={self.state.age}
              onChange={self.handleChange("age")}
              input={<Input id="age-helper" />}
            >
              {/* <MenuItem value="">
                <em>None</em>
              </MenuItem> */}
              <MenuItem value={10}>18 years</MenuItem>
              <MenuItem value={20}>20 years</MenuItem>
              <MenuItem value={30}>30 years</MenuItem>
            </Select>
            <FormHelperText>Please enter your age</FormHelperText>
          </FormControl>
        </div>
        {/*<div className="col-md-8">
           <Button>
            <Paper>
              <img src={maleImage} className="img-thumbnail" />
            </Paper>
          </Button>
          <Button>
            <Paper>
              <img src={coupleImage} className="img-thumbnail" />
            </Paper>
          </Button>
          <Button>
            <Paper>
              <img src={familyImageOne} className="img-thumbnail" />
            </Paper>
          </Button>
        </div>
        <div className="col-md-8">
          <Button>
            <Paper>
              <img src={familyImageTwo} className="img-thumbnail" />
            </Paper>
          </Button>
          <Button>
            <Paper>
              <img src={oldCoupleImage} className="img-thumbnail" />
            </Paper>
          </Button>
          <Button>
            <Paper>
              <img src={otherFamilyMembers} className="img-thumbnail" />
            </Paper>
          </Button> 
        </div>*/}
      </div>
      {/* <div className="row">
        <div className="col-lg-3 col-sm-6 col-12">
          <FormControl className="w-100 mb-2">
            <InputLabel htmlFor="age-helper">Select Age</InputLabel>
            <Select
              value={self.state.age}
              onChange={self.handleChange("age")}
              input={<Input id="age-helper" />}
            >
              // <MenuItem value="">
              //   <em>None</em>
              // </MenuItem>
              <MenuItem value={10}>18 years</MenuItem>
              <MenuItem value={20}>20 years</MenuItem>
              <MenuItem value={30}>30 years</MenuItem>
            </Select>
            <FormHelperText>Please enter your age</FormHelperText>
          </FormControl>
        </div>
        <div className="col-lg-3 col-sm-6 col-12">
          <FormControl className="w-100 mb-2">
            <InputLabel htmlFor="age-helper">Age</InputLabel>
            <Select
              value={self.state.age}
              onChange={self.handleChange("age")}
              input={<Input id="age-helper" />}
            >
              // <MenuItem value="">
              //   <em>None</em>
              // </MenuItem>
              <MenuItem value={10}>18 years</MenuItem>
              <MenuItem value={20}>20 years</MenuItem>
              <MenuItem value={30}>30 years</MenuItem>
            </Select>
            <FormHelperText>Please enter your age</FormHelperText>
          </FormControl>
        </div>
      </div> */}
    </div>
  );
}

function getDiseaseInformation(self) {
  return (
    <div className="row justify-content-center text-center">
      <div className="col-md-6">
        <div className="form-group">
          <div>Any pre existing disease?</div>
          <FormControlLabel
            control={
              <Checkbox
                checked={self.state.yes}
                onChange={self.handleYesCheckboxChange}
                name="Yes"
                color="primary"
              />
            }
            label="Yes"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={self.state.no}
                onChange={self.handleNoCheckboxChange}
                name="No"
                color="primary"
              />
            }
            label="No"
          />
        </div>
      </div>
    </div>
    // <div className="tab-pane" id="tab2-4">
    //   <h3 className="title text-primary">Terms and Conditions</h3>
    //   <p>
    //     <strong>Lorem</strong> Ipsum is simply dummy text of the printing and
    //     typesetting industry. Lorem Ipsum has been the industry's standard dummy
    //     text ever since the 1500s, when an unknown printer took a galley of type
    //     and scrambled it to make a type specimen book. It has survived not only
    //     five centuries, but also the leap into electronic typesetting, remaining
    //     essentially unchanged.
    //   </p>
    //   <div className="d-flex align-items-center">
    //     <Checkbox color="primary" />{" "}
    //     <span>I agree with the Terms and Conditions.</span>
    //   </div>
    // </div>
  );
}

class HorizontalLabelPositionBelowStepper extends React.Component {
  state = {
    activeStep: 0,
    age: "",
    name: "hai",
    isStepperVisible: true,
    bottom: false,
    checkedB: false,
  };

  handleMaleCheckboxChange = (event) => {
    this.setState({ ...this.state, [event.target.name]: event.target.checked });
  };

  handleFemaleCheckboxChange = (event) => {
    this.setState({
      ...this.state,
      [event.target.name]: event.target.checked,
    });
  };

  handleChange = (name) => (event) => {
    this.setState({ [name]: event.target.value });
  };

  handleNext = () => {
    const { activeStep } = this.state;
    this.setState({
      activeStep: activeStep + 1,
    });
  };

  handleBack = () => {
    const { activeStep } = this.state;
    this.setState({
      activeStep: activeStep - 1,
    });
  };

  handleReset = () => {
    this.setState({
      activeStep: 0,
    });
  };

  showInsurancePlans = () => {
    const { isStepperVisible } = this.state;
    this.setState({
      isStepperVisible: !isStepperVisible,
    });
  };

  toggleDrawer = (side, open) => {
    this.setState({
      [side]: open,
    });
  };

  render() {
    const steps = getSteps();
    const { activeStep } = this.state;
    const self = this;
    const { isStepperVisible } = this.state;

    // const fullList = (
    //   <div className="full-drawer">
    //     <List>{mailFolderListItems}</List>
    //     <Divider />
    //     {/* <List>{otherMailFolderListItems}</List> */}
    //   </div>
    // );

    return (
      <div className="w-100">
        {isStepperVisible ? (
          <>
            <Stepper
              activeStep={activeStep}
              alternativeLabel
              className="horizontal-stepper-linear"
            >
              {steps.map((label, index) => {
                return (
                  <Step
                    key={label}
                    className={`horizontal-stepper ${
                      index === activeStep ? "active" : ""
                    }`}
                  >
                    <StepLabel className="stepperlabel">{label}</StepLabel>
                  </Step>
                );
              })}
            </Stepper>
            <div>
              {this.state.activeStep === steps.length ? (
                <div className="text-center">
                  {/* <Typography className="my-2">
                All steps completed - you&quot;re finished
              </Typography> */}

                  <Button
                    variant="contained"
                    color="primary"
                    onClick={this.showInsurancePlans}
                  >
                    Show Plans
                  </Button>
                </div>
              ) : (
                <div>
                  {getStepContent(activeStep, self)}
                  <div className="text-center">
                    <Button
                      disabled={activeStep === 0}
                      onClick={this.handleBack}
                      className="mr-2"
                    >
                      Back
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={this.handleNext}
                    >
                      {activeStep === steps.length - 1 ? "Finish" : "Next"}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="animated slideInUpTiny animation-duration-3 mb-n4">
              {data.map((data, index) => (
                <ListItem
                  key={index}
                  data={data}
                  styleName="card shadow "
                  toggleDrawer={this.toggleDrawer}
                />
              ))}
            </div>
            <Drawer
              anchor="bottom"
              open={this.state.bottom}
              onClose={() => this.toggleDrawer("bottom", false)}
            >
              <div
                tabIndex={0}
                role="button"
                onClick={() => this.toggleDrawer("bottom", false)}
                onKeyDown={() => this.toggleDrawer("bottom", false)}
              >
                {/* {fullList} */}

                <div className="animated slideInUpTiny animation-duration-3">
                  <div className="row mt-4 justify-content-center">
                    <div className="col-xl-3 col-sm-6 order-xl-1">
                      <UserCard
                        thumbnailImage={Aditya_Birla}
                        name="Aditya Birla Capital Insurance"
                        details="Aditya Birla Health Insurance"
                      />
                    </div>
                    <div className="col-xl-3 col-sm-6 order-xl-2">
                      <UserCard
                        thumbnailImage={Bharti_Axa}
                        name="Bharti Axa Insurance"
                        details="Health Insurance from Bharti Axa Insurance"
                      />
                    </div>
                    <div className="col-xl-3 col-sm-6 order-xl-3">
                      <UserCard
                        thumbnailImage={Care_Health}
                        name="Care Health Insurance"
                        details="Insurance from Care Health"
                      />
                    </div>
                    <div className="col-xl-3 col-sm-6 order-xl-4 mt-4">
                      <Button variant="contained" color="secondary">
                        Compare
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Drawer>
          </>
        )}
      </div>
    );
  }
}

export default HorizontalLabelPositionBelowStepper;

// From https://bitbucket.org/atlassian/atlaskit-mk-2/raw/4ad0e56649c3e6c973e226b7efaeb28cb240ccb0/packages/core/select/src/data/countries.js
const countries = [
  { code: "AD", label: "Andorra", phone: "376" },
  { code: "AE", label: "United Arab Emirates", phone: "971" },
  { code: "AF", label: "Afghanistan", phone: "93" },
  { code: "AG", label: "Antigua and Barbuda", phone: "1-268" },
  { code: "AI", label: "Anguilla", phone: "1-264" },
  { code: "AL", label: "Albania", phone: "355" },
  { code: "AM", label: "Armenia", phone: "374" },
  { code: "AO", label: "Angola", phone: "244" },
  { code: "AQ", label: "Antarctica", phone: "672" },
  { code: "AR", label: "Argentina", phone: "54" },
  { code: "AS", label: "American Samoa", phone: "1-684" },
  { code: "AT", label: "Austria", phone: "43" },
  { code: "AU", label: "Australia", phone: "61", suggested: true },
  { code: "AW", label: "Aruba", phone: "297" },
  { code: "AX", label: "Alland Islands", phone: "358" },
  { code: "AZ", label: "Azerbaijan", phone: "994" },
  { code: "BA", label: "Bosnia and Herzegovina", phone: "387" },
  { code: "BB", label: "Barbados", phone: "1-246" },
  { code: "BD", label: "Bangladesh", phone: "880" },
  { code: "BE", label: "Belgium", phone: "32" },
  { code: "BF", label: "Burkina Faso", phone: "226" },
  { code: "BG", label: "Bulgaria", phone: "359" },
  { code: "BH", label: "Bahrain", phone: "973" },
  { code: "BI", label: "Burundi", phone: "257" },
  { code: "BJ", label: "Benin", phone: "229" },
  { code: "BL", label: "Saint Barthelemy", phone: "590" },
  { code: "BM", label: "Bermuda", phone: "1-441" },
  { code: "BN", label: "Brunei Darussalam", phone: "673" },
  { code: "BO", label: "Bolivia", phone: "591" },
  { code: "BR", label: "Brazil", phone: "55" },
  { code: "BS", label: "Bahamas", phone: "1-242" },
  { code: "BT", label: "Bhutan", phone: "975" },
  { code: "BV", label: "Bouvet Island", phone: "47" },
  { code: "BW", label: "Botswana", phone: "267" },
  { code: "BY", label: "Belarus", phone: "375" },
  { code: "BZ", label: "Belize", phone: "501" },
  { code: "CA", label: "Canada", phone: "1", suggested: true },
  { code: "CC", label: "Cocos (Keeling) Islands", phone: "61" },
  { code: "CD", label: "Congo, Democratic Republic of the", phone: "243" },
  { code: "CF", label: "Central African Republic", phone: "236" },
  { code: "CG", label: "Congo, Republic of the", phone: "242" },
  { code: "CH", label: "Switzerland", phone: "41" },
  { code: "CI", label: "Cote d'Ivoire", phone: "225" },
  { code: "CK", label: "Cook Islands", phone: "682" },
  { code: "CL", label: "Chile", phone: "56" },
  { code: "CM", label: "Cameroon", phone: "237" },
  { code: "CN", label: "China", phone: "86" },
  { code: "CO", label: "Colombia", phone: "57" },
  { code: "CR", label: "Costa Rica", phone: "506" },
  { code: "CU", label: "Cuba", phone: "53" },
  { code: "CV", label: "Cape Verde", phone: "238" },
  { code: "CW", label: "Curacao", phone: "599" },
  { code: "CX", label: "Christmas Island", phone: "61" },
  { code: "CY", label: "Cyprus", phone: "357" },
  { code: "CZ", label: "Czech Republic", phone: "420" },
  { code: "DE", label: "Germany", phone: "49", suggested: true },
  { code: "DJ", label: "Djibouti", phone: "253" },
  { code: "DK", label: "Denmark", phone: "45" },
  { code: "DM", label: "Dominica", phone: "1-767" },
  { code: "DO", label: "Dominican Republic", phone: "1-809" },
  { code: "DZ", label: "Algeria", phone: "213" },
  { code: "EC", label: "Ecuador", phone: "593" },
  { code: "EE", label: "Estonia", phone: "372" },
  { code: "EG", label: "Egypt", phone: "20" },
  { code: "EH", label: "Western Sahara", phone: "212" },
  { code: "ER", label: "Eritrea", phone: "291" },
  { code: "ES", label: "Spain", phone: "34" },
  { code: "ET", label: "Ethiopia", phone: "251" },
  { code: "FI", label: "Finland", phone: "358" },
  { code: "FJ", label: "Fiji", phone: "679" },
  { code: "FK", label: "Falkland Islands (Malvinas)", phone: "500" },
  { code: "FM", label: "Micronesia, Federated States of", phone: "691" },
  { code: "FO", label: "Faroe Islands", phone: "298" },
  { code: "FR", label: "France", phone: "33", suggested: true },
  { code: "GA", label: "Gabon", phone: "241" },
  { code: "GB", label: "United Kingdom", phone: "44" },
  { code: "GD", label: "Grenada", phone: "1-473" },
  { code: "GE", label: "Georgia", phone: "995" },
  { code: "GF", label: "French Guiana", phone: "594" },
  { code: "GG", label: "Guernsey", phone: "44" },
  { code: "GH", label: "Ghana", phone: "233" },
  { code: "GI", label: "Gibraltar", phone: "350" },
  { code: "GL", label: "Greenland", phone: "299" },
  { code: "GM", label: "Gambia", phone: "220" },
  { code: "GN", label: "Guinea", phone: "224" },
  { code: "GP", label: "Guadeloupe", phone: "590" },
  { code: "GQ", label: "Equatorial Guinea", phone: "240" },
  { code: "GR", label: "Greece", phone: "30" },
  {
    code: "GS",
    label: "South Georgia and the South Sandwich Islands",
    phone: "500",
  },
  { code: "GT", label: "Guatemala", phone: "502" },
  { code: "GU", label: "Guam", phone: "1-671" },
  { code: "GW", label: "Guinea-Bissau", phone: "245" },
  { code: "GY", label: "Guyana", phone: "592" },
  { code: "HK", label: "Hong Kong", phone: "852" },
  { code: "HM", label: "Heard Island and McDonald Islands", phone: "672" },
  { code: "HN", label: "Honduras", phone: "504" },
  { code: "HR", label: "Croatia", phone: "385" },
  { code: "HT", label: "Haiti", phone: "509" },
  { code: "HU", label: "Hungary", phone: "36" },
  { code: "ID", label: "Indonesia", phone: "62" },
  { code: "IE", label: "Ireland", phone: "353" },
  { code: "IL", label: "Israel", phone: "972" },
  { code: "IM", label: "Isle of Man", phone: "44" },
  { code: "IN", label: "India", phone: "91" },
  { code: "IO", label: "British Indian Ocean Territory", phone: "246" },
  { code: "IQ", label: "Iraq", phone: "964" },
  { code: "IR", label: "Iran, Islamic Republic of", phone: "98" },
  { code: "IS", label: "Iceland", phone: "354" },
  { code: "IT", label: "Italy", phone: "39" },
  { code: "JE", label: "Jersey", phone: "44" },
  { code: "JM", label: "Jamaica", phone: "1-876" },
  { code: "JO", label: "Jordan", phone: "962" },
  { code: "JP", label: "Japan", phone: "81", suggested: true },
  { code: "KE", label: "Kenya", phone: "254" },
  { code: "KG", label: "Kyrgyzstan", phone: "996" },
  { code: "KH", label: "Cambodia", phone: "855" },
  { code: "KI", label: "Kiribati", phone: "686" },
  { code: "KM", label: "Comoros", phone: "269" },
  { code: "KN", label: "Saint Kitts and Nevis", phone: "1-869" },
  { code: "KP", label: "Korea, Democratic People's Republic of", phone: "850" },
  { code: "KR", label: "Korea, Republic of", phone: "82" },
  { code: "KW", label: "Kuwait", phone: "965" },
  { code: "KY", label: "Cayman Islands", phone: "1-345" },
  { code: "KZ", label: "Kazakhstan", phone: "7" },
  { code: "LA", label: "Lao People's Democratic Republic", phone: "856" },
  { code: "LB", label: "Lebanon", phone: "961" },
  { code: "LC", label: "Saint Lucia", phone: "1-758" },
  { code: "LI", label: "Liechtenstein", phone: "423" },
  { code: "LK", label: "Sri Lanka", phone: "94" },
  { code: "LR", label: "Liberia", phone: "231" },
  { code: "LS", label: "Lesotho", phone: "266" },
  { code: "LT", label: "Lithuania", phone: "370" },
  { code: "LU", label: "Luxembourg", phone: "352" },
  { code: "LV", label: "Latvia", phone: "371" },
  { code: "LY", label: "Libya", phone: "218" },
  { code: "MA", label: "Morocco", phone: "212" },
  { code: "MC", label: "Monaco", phone: "377" },
  { code: "MD", label: "Moldova, Republic of", phone: "373" },
  { code: "ME", label: "Montenegro", phone: "382" },
  { code: "MF", label: "Saint Martin (French part)", phone: "590" },
  { code: "MG", label: "Madagascar", phone: "261" },
  { code: "MH", label: "Marshall Islands", phone: "692" },
  {
    code: "MK",
    label: "Macedonia, the Former Yugoslav Republic of",
    phone: "389",
  },
  { code: "ML", label: "Mali", phone: "223" },
  { code: "MM", label: "Myanmar", phone: "95" },
  { code: "MN", label: "Mongolia", phone: "976" },
  { code: "MO", label: "Macao", phone: "853" },
  { code: "MP", label: "Northern Mariana Islands", phone: "1-670" },
  { code: "MQ", label: "Martinique", phone: "596" },
  { code: "MR", label: "Mauritania", phone: "222" },
  { code: "MS", label: "Montserrat", phone: "1-664" },
  { code: "MT", label: "Malta", phone: "356" },
  { code: "MU", label: "Mauritius", phone: "230" },
  { code: "MV", label: "Maldives", phone: "960" },
  { code: "MW", label: "Malawi", phone: "265" },
  { code: "MX", label: "Mexico", phone: "52" },
  { code: "MY", label: "Malaysia", phone: "60" },
  { code: "MZ", label: "Mozambique", phone: "258" },
  { code: "NA", label: "Namibia", phone: "264" },
  { code: "NC", label: "New Caledonia", phone: "687" },
  { code: "NE", label: "Niger", phone: "227" },
  { code: "NF", label: "Norfolk Island", phone: "672" },
  { code: "NG", label: "Nigeria", phone: "234" },
  { code: "NI", label: "Nicaragua", phone: "505" },
  { code: "NL", label: "Netherlands", phone: "31" },
  { code: "NO", label: "Norway", phone: "47" },
  { code: "NP", label: "Nepal", phone: "977" },
  { code: "NR", label: "Nauru", phone: "674" },
  { code: "NU", label: "Niue", phone: "683" },
  { code: "NZ", label: "New Zealand", phone: "64" },
  { code: "OM", label: "Oman", phone: "968" },
  { code: "PA", label: "Panama", phone: "507" },
  { code: "PE", label: "Peru", phone: "51" },
  { code: "PF", label: "French Polynesia", phone: "689" },
  { code: "PG", label: "Papua New Guinea", phone: "675" },
  { code: "PH", label: "Philippines", phone: "63" },
  { code: "PK", label: "Pakistan", phone: "92" },
  { code: "PL", label: "Poland", phone: "48" },
  { code: "PM", label: "Saint Pierre and Miquelon", phone: "508" },
  { code: "PN", label: "Pitcairn", phone: "870" },
  { code: "PR", label: "Puerto Rico", phone: "1" },
  { code: "PS", label: "Palestine, State of", phone: "970" },
  { code: "PT", label: "Portugal", phone: "351" },
  { code: "PW", label: "Palau", phone: "680" },
  { code: "PY", label: "Paraguay", phone: "595" },
  { code: "QA", label: "Qatar", phone: "974" },
  { code: "RE", label: "Reunion", phone: "262" },
  { code: "RO", label: "Romania", phone: "40" },
  { code: "RS", label: "Serbia", phone: "381" },
  { code: "RU", label: "Russian Federation", phone: "7" },
  { code: "RW", label: "Rwanda", phone: "250" },
  { code: "SA", label: "Saudi Arabia", phone: "966" },
  { code: "SB", label: "Solomon Islands", phone: "677" },
  { code: "SC", label: "Seychelles", phone: "248" },
  { code: "SD", label: "Sudan", phone: "249" },
  { code: "SE", label: "Sweden", phone: "46" },
  { code: "SG", label: "Singapore", phone: "65" },
  { code: "SH", label: "Saint Helena", phone: "290" },
  { code: "SI", label: "Slovenia", phone: "386" },
  { code: "SJ", label: "Svalbard and Jan Mayen", phone: "47" },
  { code: "SK", label: "Slovakia", phone: "421" },
  { code: "SL", label: "Sierra Leone", phone: "232" },
  { code: "SM", label: "San Marino", phone: "378" },
  { code: "SN", label: "Senegal", phone: "221" },
  { code: "SO", label: "Somalia", phone: "252" },
  { code: "SR", label: "Suriname", phone: "597" },
  { code: "SS", label: "South Sudan", phone: "211" },
  { code: "ST", label: "Sao Tome and Principe", phone: "239" },
  { code: "SV", label: "El Salvador", phone: "503" },
  { code: "SX", label: "Sint Maarten (Dutch part)", phone: "1-721" },
  { code: "SY", label: "Syrian Arab Republic", phone: "963" },
  { code: "SZ", label: "Swaziland", phone: "268" },
  { code: "TC", label: "Turks and Caicos Islands", phone: "1-649" },
  { code: "TD", label: "Chad", phone: "235" },
  { code: "TF", label: "French Southern Territories", phone: "262" },
  { code: "TG", label: "Togo", phone: "228" },
  { code: "TH", label: "Thailand", phone: "66" },
  { code: "TJ", label: "Tajikistan", phone: "992" },
  { code: "TK", label: "Tokelau", phone: "690" },
  { code: "TL", label: "Timor-Leste", phone: "670" },
  { code: "TM", label: "Turkmenistan", phone: "993" },
  { code: "TN", label: "Tunisia", phone: "216" },
  { code: "TO", label: "Tonga", phone: "676" },
  { code: "TR", label: "Turkey", phone: "90" },
  { code: "TT", label: "Trinidad and Tobago", phone: "1-868" },
  { code: "TV", label: "Tuvalu", phone: "688" },
  { code: "TW", label: "Taiwan, Province of China", phone: "886" },
  { code: "TZ", label: "United Republic of Tanzania", phone: "255" },
  { code: "UA", label: "Ukraine", phone: "380" },
  { code: "UG", label: "Uganda", phone: "256" },
  { code: "US", label: "United States", phone: "1", suggested: true },
  { code: "UY", label: "Uruguay", phone: "598" },
  { code: "UZ", label: "Uzbekistan", phone: "998" },
  { code: "VA", label: "Holy See (Vatican City State)", phone: "379" },
  { code: "VC", label: "Saint Vincent and the Grenadines", phone: "1-784" },
  { code: "VE", label: "Venezuela", phone: "58" },
  { code: "VG", label: "British Virgin Islands", phone: "1-284" },
  { code: "VI", label: "US Virgin Islands", phone: "1-340" },
  { code: "VN", label: "Vietnam", phone: "84" },
  { code: "VU", label: "Vanuatu", phone: "678" },
  { code: "WF", label: "Wallis and Futuna", phone: "681" },
  { code: "WS", label: "Samoa", phone: "685" },
  { code: "XK", label: "Kosovo", phone: "383" },
  { code: "YE", label: "Yemen", phone: "967" },
  { code: "YT", label: "Mayotte", phone: "262" },
  { code: "ZA", label: "South Africa", phone: "27" },
  { code: "ZM", label: "Zambia", phone: "260" },
  { code: "ZW", label: "Zimbabwe", phone: "263" },
];
