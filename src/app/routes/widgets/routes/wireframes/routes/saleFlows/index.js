import React from "react";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import IntlMessages from "util/IntlMessages";
import { AiOutlineArrowRight } from "react-icons/ai";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { GiHealthNormal } from "react-icons/gi";
import Avatar from "@material-ui/core/Avatar";
import CardBox from "components/CardBox";
import { Link } from "react-router-dom";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormLabel from "@material-ui/core/FormLabel";
import { AiFillPlusSquare } from "react-icons/ai";
import { AiFillMinusSquare } from "react-icons/ai";
import DobDatePicker from "./DobDatePicker";
import axios from "axios";
import { InputLabel, MenuItem, Select } from "@material-ui/core";
import { apigetUrl } from "setup/middleware";

let test = {
  2001: "String",
  2002: "Number",
  2003: "Date",
  2004: "Date & Time",
  2005: "Radio",
  2006: "Checkbox",
  2007: "Password",
  2008: "Dropdown",
  2009: "Boolean",

  3001: "Normal Display",
  3002: "Duplicateable",
  3003: "For Each",
  3004: "Required on Another",

  4001: "Simple Field",
  4002: "Complex Field",
  // 4003: 'Child Field',
};
const baseURL = `${process.env.REACT_APP_BASE_URL}`;
let id = "1";
const api = axios.create({
  baseURL: baseURL,
});
const config = {
  headers: {
    accept: "application/json",
  },
  data: {},
};

class HorizontalLabelPositionBelowStepper extends React.Component {
  state = {
    activeStep: 0,
    existingCondition: 0,
    userInsuranceInputs: [],
    formData: {},
    typeIds: "",
    typedata: [],
    dropdownOpen: false,
  };

  async componentDidMount() {
    let typeIds = undefined;
    // let data = await api.get(
    //   baseURL + `/insurance/products/${id || "4449"}`,
    //   {},
    //   config
    // );
    let data = await apigetUrl(`/insurance/products/${id || "4449"}`);
    let newData = [];
    if (data.status == 200) {
      for (let index = 0; index < data.data.inputFields.length; index++) {
        const element = data.data.inputFields[index];
        if (element.isPreQuote === 1) {
          if (
            test[element.fieldIdObj.fieldComposition] === "Complex Field" ||
            test[element.fieldIdObj.fieldComposition] === "For Each"
          ) {
            let children = await api.get(
              baseURL +
                `/insurance/fields?page=1&limit=50&parentId=${element.fieldIdObj.id}`,
              {},
              config
            );

            element.fieldIdObj["children"] = children.data.dataList.map((x) => {
              return { ...x, parent: element, sequence: element.fieldId };
            });
          }
          newData.push(element);
        }
      }
      data.data.inputFields.forEach(async (x) => {
        if (x.fieldIdObj.dataListId)
          typeIds = typeIds
            ? typeIds + "," + x.fieldIdObj.dataListId
            : x.fieldIdObj.dataListId;
      });
    }
    let response = await api.get(
      baseURL +
        `/insurance/multi-core-data?page=1&limit=1000&typeIds=${typeIds || 0}`,
      {},
      config
    );
    let typedata = [];
    if (response.status == 200) {
      response.data.dataList.forEach((list) => {
        typedata = [...typedata, ...list.dataList];
      });
    }
    this.setState({
      userInsuranceInputs: newData,
      typedata: typedata,
    });
  }
  handleNext = async (e, step) => {
    const { activeStep, userInsuranceInputs, formData } = this.state;
    if (step === 4) {
      let temp = {};
      let data = { productId: 1, agentId: 234, enquiryData: [] };
      userInsuranceInputs.forEach((input) => {
        temp[input.key || input.fieldIdObj.key] = input.fieldId;
      });
      Object.keys(temp).forEach((det, i) => {
        let detach = [];
        if (det.endsWith("complex")) {
          detach = [...detach, { fieldId: i, fieldValue: formData[det] }];
        }
        Array.isArray(formData[det]) &&
          formData[det].forEach((hash, i) => {
            detach = [...detach, { fieldId: i, fieldValue: hash.date }];
          });
        let objKey = temp[det];
        if (formData[det]) {
          let obj = {};
          obj[`fieldValue${detach.length > 0 ? "s" : ""}`] =
            detach.length > 0 ? detach : formData[det];
          data.enquiryData.push({
            fieldId: objKey,
            ...obj,
          });
        }
      });
      let response = await api.post(
        baseURL + `/insurance/enquiry`,
        data,
        config
      );
      if (response.status === 200) {
        this.setState({
          activeStep: activeStep + 1,
          enquiry: response.data,
          step: "otp",
        });
      }
    } else if (step === 5) {
      let response = await api.put(
        baseURL + `/insurance/enquiry/${this.state.enquiry.id}/otp`,
        { otp: formData["otp"], agentId: this.state.enquiry.agentId },
        config
      );
      if (response.status === 200) {
        this.props.history.push(
          "/app/wireframes/health/quotes/" + this.state.enquiry.id
        );
      }
    } else
      this.setState({
        activeStep: activeStep + 1,
        step: null,
      });
  };
  handleChange = (e) => {
    let { name, value, checked, sequence } = e.target;

    let formData = this.state.formData;
    if (
      e.nativeEvent &&
      e.nativeEvent.target &&
      e.nativeEvent.target.type === "checkbox"
    ) {
      formData[name] = checked;
    } else formData[name] = value;
    if (value === "Add" || value === "Pop") {
      let data = this.state.userInsuranceInputs.map((x) => {
        if (x.fieldId === name && value === "Add") {
          let dups = x.fieldIdObj.children.map((x) => {
            return { ...x, sequence: sequence };
          });
          x.fieldIdObj["duplicates"] = [
            ...(x.fieldIdObj.duplicates || []),
            ...dups,
          ];
          return x;
        } else if (x.fieldId === name && value === "Pop") {
          let dups = x.fieldIdObj.duplicates.filter((x) => {
            return x.sequence !== sequence;
          });
          x.fieldIdObj["duplicates"] = dups;
          return x;
        }
        return x;
      });

      this.setState({
        userInsuranceInputs: data,
      });
    } else
      this.setState({
        formData: formData,
      });
  };

  getSteps = () => {
    return [
      "Your Details",
      "Family Members",
      "Health Conditions",
      "Personal Details",
      "Communication Details",
      "Confirm and Finish",
    ];
  };

  getStepContent = (stepIndex) => {
    return this.getFieldType(stepIndex + 1);
  };
  getFieldType = (section) => {
    let currentInputs =
      this.state.userInsuranceInputs &&
      this.state.userInsuranceInputs.filter(
        (detail) => detail.section === section
      );
    if (this.state.step)
      return this.selectDynamicInputs(this.state.step, {}, {});

    return currentInputs.map((input, index) => {
      if (test[input.fieldIdObj.fieldComposition] === "Simple Field") {
        switch (test[input.fieldIdObj.displayMode]) {
          case "Normal Display":
            return this.selectDynamicInputs(
              test[input.fieldIdObj.fieldType],
              input,
              index
            );
          case "Duplicateable":
            return this.selectDynamicInputs(
              test[input.fieldIdObj.fieldType],
              input,
              index
            );
          case "For Each": {
            let series = [];
            let children = this.state.typedata.filter(
              (t) =>
                t.typeId ===
                (input.dataListId ||
                  (input.fieldIdObj && input.fieldIdObj.dataListId))
            );
            this.state.userInsuranceInputs.forEach((x) => {
              if (test[x.fieldIdObj.fieldComposition] === "Complex Field") {
                if (x.fieldIdObj.children) {
                  // x.fieldIdObj.children.forEach((y) => {
                  //   series.push({...input, name: y.name, children });
                  // });
                }
                series.push({ ...input, name: x.fieldIdObj.name, children });
              }
            });

            return series.length > 0
              ? series.map((seri, ind) =>
                  this.selectDynamicInputs(
                    test[input.fieldIdObj.fieldType],
                    seri,
                    ind
                  )
                )
              : null;
          }
          default:
            break;
        }
      } else if (test[input.fieldIdObj.fieldComposition] === "Complex Field") {
        if (test[input.fieldIdObj.displayMode] == "Normal Display") {
          return input.fieldIdObj.children
            .sort((x, y) => (x.id < y.id ? -1 : 1))
            .map((child, index) =>
              this.selectDynamicInputs(test[child.fieldType], child, index)
            );
        }
        if (test[input.fieldIdObj.displayMode] == "Duplicateable") {
          return (
            <>
              {input.fieldIdObj.children
                .sort((x, y) => (x.id < y.id ? -1 : 1))
                .map((child, index) =>
                  this.selectDynamicInputs(
                    test[child.fieldType],
                    child,
                    index,
                    true
                  )
                )}
              {input.fieldIdObj.duplicates &&
                input.fieldIdObj.duplicates
                  // .sort((x, y) => (x.id < y.id ? -1 : 1))
                  .map((child, index) =>
                    this.selectDynamicInputs(
                      test[child.fieldType],
                      child,
                      index,
                      false
                    )
                  )}
            </>
          );
        }
      }
    });
  };

  selectDynamicInputs = (type, input, index, isDuplicate) => {
    let localCommute = ["otp"];
    let typedetails = localCommute.includes(type)
      ? type
      : this.state.typedata.filter(
          (t) =>
            t.typeId ===
            (input.dataListId ||
              (input.fieldIdObj && input.fieldIdObj.dataListId))
        );
    let numberOfChilds = (!typedetails &&
      this.state.formData[input.key || input.fieldIdObj.key]) || [
      { checked: false, sequence: 0, date: "" },
    ];
    switch (type) {
      case "String":
      case "Password":
      case "Number":
        return (
          <div className="col-xs-8 col-sm-6 col-md-5 int-content-center">
            <TextField
              key={index}
              id={input.key || (input.fieldIdObj && input.fieldIdObj.key)}
              name={input.key || (input.fieldIdObj && input.fieldIdObj.key)}
              label={input.name || (input.fieldIdObj && input.fieldIdObj.name)}
              margin="normal"
              fullWidth
              inputProps={{
                pattern:
                  input.regExp || (input.fieldIdObj && input.fieldIdObj.regExp),
                maxLength:
                  input.maxLength ||
                  (input.fieldIdObj && input.fieldIdObj.maxLength),
                minLength:
                  input.minLength ||
                  (input.fieldIdObj && input.fieldIdObj.minLength),
              }}
              type={type.toLowerCase()}
              required={Boolean(
                input.isMandatory ||
                  (input.fieldIdObj && input.fieldIdObj.isMandatory)
              )}
              onChange={this.handleChange}
              value={
                this.state.formData[
                  input.key || (input.fieldIdObj && input.fieldIdObj.key)
                ]
              }
            />
          </div>
        );
      case "Radio":
        return (
          <div className="col-xs-8 col-sm-6 col-md-5 int-content-center">
            <FormControl
              component="fieldset"
              required={Boolean(input.isMandatory)}
            >
              <FormLabel component="legend">
                {input.name || input.fieldIdObj.name}
              </FormLabel>
              <RadioGroup
                className="d-flex flex-row"
                aria-label={input.name}
                id={input.key || input.fieldIdObj.key}
                name={input.key || input.fieldIdObj.key}
                label={input.name || input.fieldIdObj.name}
                onChange={this.handleChange}
                value={this.state.formData[input.name]}
              >
                {typedetails.map((x) => (
                  <FormControlLabel
                    value={x.name}
                    control={<Radio color="primary" />}
                    label={x.name}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </div>
        );
      case "Simple Field":
        return (
          <div className="col-xs-8 col-sm-6 col-md-5 int-content-center">
            <div className="row">
              <div className="col-md-2 text-left">
                <Checkbox
                  key={index}
                  id={input.key || input.fieldIdObj.key}
                  name={input.key || input.fieldIdObj.key}
                  label={input.name || input.fieldIdObj.name}
                  required={Boolean(input.fieldIdObj.isMandatory)}
                  checked={Boolean(this.state.formData[input.fieldIdObj.key])}
                  color="primary"
                  onChange={this.handleChange}
                />{" "}
                <span>{input.name || input.fieldIdObj.name}</span>
              </div>
              <div className="col-md-10 text-left">
                <DobDatePicker
                  key={index + "dob"}
                  id={input.fieldIdObj.key + "dob"}
                  name={input.fieldIdObj.key + "dob"}
                  label={input.fieldIdObj.name + "dob"}
                  value={this.state.formData[input.fieldIdObj.key + "dob"]}
                  onChange={this.handleChange}
                />
              </div>
            </div>
          </div>
        );
      case "Complex Field":
        let childData = numberOfChilds.slice(1);
        return (
          <div className="col-xs-8 col-sm-6 col-md-5 int-content-center">
            <div className="row">&nbsp;</div>
            <div className="row">
              <div className="col-md-2 text-left">
                <Checkbox
                  key={index}
                  id={input.key || input.fieldIdObj.key}
                  name={input.key || input.fieldIdObj.key}
                  label={input.name || input.fieldIdObj.name}
                  required={Boolean(input.isMandatory)}
                  checked={Boolean(
                    numberOfChilds[0] && numberOfChilds[0].checked
                  )}
                  color="primary"
                  onChange={(e) =>
                    this.handleChange({
                      target: {
                        name: input.fieldIdObj.name,
                        value: (numberOfChilds[0] = {
                          ...numberOfChilds[0],
                          checked: e.target.checked,
                        }),
                      },
                    })
                  }
                  color="primary"
                />
                <span>{input.name || input.fieldIdObj.name}</span>
                <AiFillPlusSquare
                  key={index}
                  id={input.key || input.fieldIdObj.key}
                  name={input.key || input.fieldIdObj.key}
                  color="primary"
                  onClick={(e) => {
                    numberOfChilds[0].checked = e.target.checked ? 1 : 0;
                    this.handleChange({
                      target: {
                        ...e,
                        name: input.fieldIdObj.key,
                        value: [
                          ...numberOfChilds,
                          {
                            checked: false,
                            sequence: numberOfChilds.length,
                            date: null,
                          },
                        ],
                      },
                    });
                  }}
                />
              </div>
              <div className="col-md-4 text-left">
                <DobDatePicker
                  key={input.key || input.fieldIdObj.key}
                  id={input.key || input.fieldIdObj.key}
                  name={input.key || input.fieldIdObj.key}
                  label={input.name || input.fieldIdObj.name}
                  value={numberOfChilds[0] && numberOfChilds[0].date}
                  required={Boolean(input.isMandatory)}
                  onChange={(e) => {
                    numberOfChilds[0].date = e.target.value;
                    this.handleChange({
                      target: {
                        ...e,
                        name: input.fieldIdObj.key,
                        value: numberOfChilds,
                      },
                    });
                  }}
                />
              </div>
            </div>

            {childData &&
              childData.map((son) => (
                <div>
                  <div className="row">&nbsp;</div>
                  <div className="row">
                    <div className="col-md-2 text-left">
                      <Checkbox
                        key={son.sequence}
                        id={son.sequence}
                        name={son.sequence}
                        label={input.name || input.fieldIdObj.name}
                        color="primary"
                        checked={Boolean(
                          numberOfChilds[son.sequence] &&
                            numberOfChilds[son.sequence].checked
                        )}
                        onChange={(e) => {
                          numberOfChilds[son.sequence].checked = e.target
                            .checked
                            ? 1
                            : 0;
                          this.handleChange({
                            target: {
                              name: input.fieldIdObj.key,
                              value: numberOfChilds,
                            },
                          });
                        }}
                      />
                      <span>{input.name || input.fieldIdObj.name}</span>
                      <AiFillMinusSquare
                        key={index}
                        id={son.sequence}
                        name={son.sequence}
                        props={son}
                        color="primary"
                        onClick={() => {
                          let values = numberOfChilds.filter(
                            (x) => x.sequence !== son.sequence
                          );
                          this.handleChange({
                            target: {
                              name: input.fieldIdObj.key,
                              value: values,
                            },
                          });
                        }}
                      />
                    </div>
                    <div className="col-md-4 text-left">
                      <DobDatePicker
                        key={index + "" + index}
                        id={son.sequence}
                        name={son.sequence}
                        label={input.name || input.fieldIdObj.name}
                        value={
                          numberOfChilds[son.sequence] &&
                          numberOfChilds[son.sequence].date
                        }
                        onChange={(e) => {
                          numberOfChilds[son.sequence].date = e.target.value;
                          this.handleChange({
                            target: {
                              name: input.fieldIdObj.key,
                              value: numberOfChilds,
                            },
                          });
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
          </div>
        );
      case "otp":
        return (
          <div className="tab-pane" id="tab2-4">
            <h3 className="title text-primary">Terms and Conditions</h3>
            <p>
              <strong>Lorem</strong>
              {`Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has
      been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type
      and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap
      into electronic typesetting, remaining essentially unchanged.`}
            </p>
            <div className="d-flex align-items-center">
              <Checkbox color="primary" />{" "}
              <span>I agree with the Terms and Conditions.</span>
            </div>
            <div>
              Enter the OTP sent to your entered mobile number
              <strong>{input.number || ""}</strong>
            </div>
            <div className="form-group">
              <TextField
                key={index}
                id={"otp"}
                name={"otp"}
                label={"OTP"}
                onChange={this.handleChange}
                value={this.state.formData["otp"]}
                margin="normal"
                w-50
              />
            </div>
          </div>
        );
      case "Dropdown":
        return (
          <div className="col-xs-8 col-sm-6 col-md-5 int-content-left">
            <FormControl
              className="w-100 mb-3"
              required={Boolean(input.isMandatory)}
            >
              <InputLabel
                htmlFor={input.key || input.fieldIdObj.key}
                required={Boolean(input.isMandatory)}
                inputProps={{
                  id: input.fieldIdObj.key,
                }}
              >
                {input.name || input.fieldIdObj.name}
              </InputLabel>
              <Select
                inputProps={{
                  id: input.fieldIdObj.key,
                }}
                className="mb-3"
                fullWidth
                label={input.name || input.fieldIdObj.name}
                name={input.key || input.fieldIdObj.key}
                labelId={input.key || input.fieldIdObj.key}
                id={input.key || input.fieldIdObj.key}
                required={Boolean(input.isMandatory)}
                /* helperText={state.errors.section} */
                onChange={this.handleChange}
              >
                <MenuItem value="">
                  <em>Select</em>
                </MenuItem>
                {typedetails.map((option) => (
                  <MenuItem
                    key={option.id}
                    name={option.typeId}
                    value={option.name}
                    label={option.name}
                  >
                    {option.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        );
      case "Date":
      case "Date & Time":
        return (
          <div
            className={`col-xs-8 col-sm-6 col-md-${
              type === "Date & Time" ? 6 : 4
            } int-content-center`}
          >
            <div
              className={`col-md-${
                type === "Date & Time" ? 12 : 10
              } text-left int-content-center`}
            >
              <DobDatePicker
                isTimePicker={type === "Date & Time"}
                key={index}
                id={input.key || input.fieldIdObj.key}
                name={input.key || input.fieldIdObj.key}
                label={input.name || input.fieldIdObj.name}
                value={this.state.formData[input.key || input.fieldIdObj.key]}
                onChange={this.handleChange}
              />
              {this.getDuplcate(input, isDuplicate)}
            </div>
          </div>
        );
      case "Checkbox":
        return (
          <div className="col-md-2 text-left">
            <Checkbox
              key={index}
              id={input.key || input.fieldIdObj.key}
              name={input.key || input.fieldIdObj.key}
              label={input.name || input.fieldIdObj.name}
              required={Boolean(
                input.isMandatory ||
                  (input.fieldIdObj && input.fieldIdObj.isMandatory) ||
                  false
              )}
              checked={Boolean(
                this.state.formData[input.key || input.fieldIdObj.key]
              )}
              color="primary"
              onChange={this.handleChange}
            />
            <span>{input.name || input.fieldIdObj.name}</span>
          </div>
        );
      case "Boolean":
        return (
          // <div className='col-xs-8 col-sm-6 col-md-5 int-content-center'>
          <div className="col-md-10 text-left">
            <label>{input.name || input.fieldIdObj.name}</label>
            <div className="row">
              {input.children ? (
                input.children.map((bools) => (
                  <div className="col-md-3 text-left">
                    <Checkbox
                      key={index}
                      id={bools.key || input.fieldIdObj.key}
                      name={input.key || input.fieldIdObj.key}
                      label={bools.name || input.fieldIdObj.name}
                      required={Boolean(
                        input.isMandatory ||
                          (input.fieldIdObj && input.fieldIdObj.isMandatory) ||
                          false
                      )}
                      checked={Boolean(
                        this.state.formData[input.key || input.fieldIdObj.key]
                      )}
                      color="primary"
                      onChange={this.handleChange}
                    />
                    <span>{bools.name || bools.fieldIdObj.name}</span>
                  </div>
                ))
              ) : (
                <div className="col-md-3 text-left">
                  <Checkbox
                    key={index}
                    id={input.key || input.fieldIdObj.key}
                    name={input.key || input.fieldIdObj.key}
                    label={input.name || input.fieldIdObj.name}
                    required={Boolean(
                      input.isMandatory ||
                        (input.fieldIdObj && input.fieldIdObj.isMandatory) ||
                        false
                    )}
                    checked={Boolean(
                      this.state.formData[input.key || input.fieldIdObj.key]
                    )}
                    color="primary"
                    onChange={this.handleChange}
                  />
                  <span>{input.name || input.fieldIdObj.name}</span>
                </div>
              )}
            </div>
          </div>
        );
      default:
        break;
    }
  };
  getDuplcate = (input, symb) =>
    symb === true ? (
      <AiFillPlusSquare
        key={input.key}
        id={input.key}
        name={input.key}
        color="primary"
        onClick={(e) => {
          this.handleChange({
            target: {
              ...e,
              sequence: Math.floor(Math.random() * 10),
              name: input.parent.fieldId,
              value: "Add",
            },
          });
        }}
      />
    ) : symb === false ? (
      <AiFillMinusSquare
        key={input.key}
        id={input.key}
        name={input.key}
        color="primary"
        onClick={(e) => {
          this.handleChange({
            target: {
              ...e,
              sequence: input.sequence,
              name: input.parent.fieldId,
              value: "Pop",
            },
          });
        }}
      />
    ) : null;

  handleBack = () => {
    const { activeStep } = this.state;
    this.setState({
      activeStep: activeStep - 1,
      step: activeStep - 1 === 4 ? "otp" : null,
    });
  };

  render() {
    const steps = this.getSteps();
    const { activeStep } = this.state;

    return (
      <div className="w-75 int-content-center int-top-offset">
        <div className="row">
          <CardBox
            styleName="col-lg-12"
            cardStyle="text-center mb-0"
            heading={<IntlMessages id="insurance.sale.health" />}
          >
            <div className="manage-margin d-flex align-items-center justify-content-around flex-wrap">
              <Avatar className="bg-warning size-60 int-top-offset-icon">
                <GiHealthNormal className=" text-white" />
              </Avatar>
            </div>

            <div>
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
                  <div>
                    <Typography className="my-2">
                      All steps completed - you&quot;re finished
                    </Typography>
                    <Button onClick={(e) => this.handleNext(e, activeStep)}>
                      {/* <Link to={{ pathname: '/app/wireframes/health/quotes' }}>
                        Get Quotes
                      </Link> */}
                      Get Quotes
                    </Button>
                  </div>
                ) : (
                  <div>
                    <div className="container">
                      <div className="row int-content-center">
                        {this.getStepContent(activeStep)}
                      </div>
                    </div>
                    <div className="text-center">
                      <Button
                        disabled={activeStep === 0}
                        onClick={(e) => this.handleBack(e, activeStep)}
                        className="mr-2"
                      >
                        <AiOutlineArrowLeft />
                        &nbsp;&nbsp;Back
                      </Button>

                      {activeStep === steps.length - 1 ? (
                        <div>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={(e) => this.handleNext(e, activeStep)}
                          >
                            Get Quotes&nbsp;&nbsp;
                            <AiOutlineArrowRight />
                          </Button>
                        </div>
                      ) : (
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={(e) => this.handleNext(e, activeStep)}
                        >
                          Next&nbsp;&nbsp;
                          <AiOutlineArrowRight />
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardBox>
        </div>
      </div>
    );
  }
}

export default HorizontalLabelPositionBelowStepper;
