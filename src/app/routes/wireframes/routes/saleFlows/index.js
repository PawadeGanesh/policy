import React from "react";
import {
  Stepper,
  Step,
  StepLabel,
  Button,
  Checkbox,
  TextField,
  Tooltip,
  Typography,
  IconButton,
} from "@material-ui/core";
import IntlMessages from "util/IntlMessages";
import { AiOutlineArrowRight } from "react-icons/ai";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { GiHealthNormal } from "react-icons/gi";
import Avatar from "@material-ui/core/Avatar";
import CardBox from "components/CardBox";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormLabel from "@material-ui/core/FormLabel";
import { AiFillPlusSquare } from "react-icons/ai";
import { AiFillMinusSquare } from "react-icons/ai";
import DobDatePicker from "./DobDatePicker";
import axios from "axios";
import "./master.css";
import ErrorModal from "../../../widgets/routes/Modal/Error";
import {
  CircularProgress,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
} from "@material-ui/core";
import Chip from "@material-ui/core/Chip";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import apiInstance from "setup";
import {
  apigetUrl,
  apipostUrl,
  apiputUrl,
} from "../../../../../setup/middleware";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import CountdownTimer from "./CountdownTimer";
import {
  IPPNotification,
  ippNotify,
} from "app/routes/widgets/routes/CommonComponents/IPPNotification";
import { getTermsAndCondition } from "setup/ApplicatoinConfigurations";

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
  2010: "File Selector",

  3001: "Normal Display",
  3002: "Duplicateable",
  3003: "For Each",
  3004: "Required on Another",

  4001: "Simple Field",
  4002: "Complex Field",
  4003: "Child Field",
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

function generateSequenceNumber() {
  return Math.floor(Math.random() * 10000);
}
class HorizontalLabelPositionBelowStepper extends React.Component {
  state = {
    activeStep: 0,
    existingCondition: 0,
    userInsuranceInputs: [],
    formData: [],
    typeIds: "",
    typedata: [],
    dropdownOpen: false,
    loading: true,
    buttonloading: false,
    quotesloading: false,
    fileUploadLoading: false,
    error: null,
    id: null,
    quoteId: "",
    enquiryid: "",
    sections: [],
    otp: "",
    agreeTC: false,
    productName: "",
    isErrorAlert: false,
    errorMsg: "",
    isPreQuote: true,
    uploadingFiles: {},
    cardWidthClass: "w-75",
    cellWidthClasses: "col-xs-8 col-sm-6 col-md-5",
    paymentGateWayLink: "",
    paymentGateWayLink_DialogOpen: false,
    showLink: false,
    GetPaymentGetWayButton: false,
    quotationsData: {},
  };

  async componentWillMount() {
    if (this.props.location.state) {
      /**
       * this component will render in 3-cases
       * case-1. Pre-quote stage (i.e Policy enquiry stage)
       * case-2. Edit-Pre-quote (i.e Enquiry is done. But, want to do some changes in Customer-info)
       * case-3. Post-quote (i.e Purchansing the Policy)
       *
       */

      let {
        quoteId,
        enquiryid,
        isPreQuoteEditMode,
      } = this.props.location.state;
      /**
       * In case-1 => "this.props.location.state" object will be null/undefined
       * In case-2 => "this.props.location.state.quoteId" will be undefined i.e Polict-id will not be available
       * In case-3 => "this.props.location.state.isPreQuoteEditMode" will be "undefined"
       */

      let isPreQuote = true;
      let cardWidthClass = "w-75";
      let cellWidthClasses = "col-xs-8 col-sm-6 col-md-5";
      if (enquiryid && !isPreQuoteEditMode) {
        isPreQuote = false;
        cardWidthClass = "w-90";
        cellWidthClasses = "col-xs-8 col-sm-6 col-md-3";
      }
      this.setState({
        quoteId: quoteId,
        enquiryid: enquiryid,
        isPreQuote: isPreQuote,
        cardWidthClass: cardWidthClass,
        cellWidthClasses: cellWidthClasses,
        isPreQuoteEditMode,
      });
      localStorage.setItem("quoteId", quoteId);
      localStorage.setItem("enquiryid", enquiryid);
    }
  }
  async componentDidMount() {
    let urlDet = {};
    let location = this.props.history.location;
    this.props.history.location.search.split("&").forEach((ser) => {
      urlDet[ser.split("=")[0].replace("?", "")] = ser.split("=")[1];
    });
    this.setState({ ...this.state, ...urlDet });
    // try {
    let formData = [];
    let typeIds = [];
    // let data = await api
    //   .get(
    //     baseURL +
    //       `/insurance/products/${Number(
    //         location.pathname.split("/")[
    //           location.pathname.split("/").length - 1
    //         ]
    //       ) || "1"}`,
    //     apiInstance
    //   )
    let data = await apigetUrl(
      `/insurance/products/${Number(
        location.pathname.split("/")[location.pathname.split("/").length - 1]
      ) || "1"}`
    ).catch((err) => {
      this.setState({
        loading: false,
        err: err.response.data,
      });
    });
    let enquiry =
      this.state.enquiryid &&
      // (await api.get(
      //   baseURL + `/insurance/enquiry/${this.state.enquiryid}`,
      //   apiInstance
      // ));
      (await apigetUrl(`/insurance/enquiry/${this.state.enquiryid}`));
    if (enquiry && enquiry.status == 200) {
      formData = enquiry.data.enquiryData;
    }
    let newData = [];
    let sections = [];
    let productName = "";
    if (data && data.status == 200) {
      sections = data.data.sections;
      productName = data.data.name;
      for (let index = 0; index < data.data.inputFields.length; index++) {
        const element = data.data.inputFields[index];
        let value =
          enquiry &&
          enquiry.data.enquiryData.find((x) => x.fieldId === element.fieldId);
        if (value) {
          // formData[element.fieldIdObj.key] = value.fieldValue;
        }
        if (element.isPreQuote === 1 || this.state.quoteId !== "") {
          if (
            test[element.fieldIdObj.fieldComposition] === "Complex Field" ||
            test[element.fieldIdObj.fieldComposition] === "For Each"
          ) {
            // let children = await api.get(
            //   baseURL +
            //     `/insurance/fields?page=1&limit=50&parentId=${element.fieldIdObj.id}`,
            //   apiInstance
            // );
            let children = await apigetUrl(
              `/insurance/fields?page=1&limit=50&parentId=${element.fieldIdObj.id}`
            );
            children.data.dataList.forEach((x) => {
              if (value && value.fieldValues && value.fieldValues.length > 0) {
                let det = value.fieldValues.find((y) => y.fieldId === x.id);
                // formData[x.key] = det && det.fieldValue;
              }
              if (x.dataListId && !typeIds.includes(x.dataListId))
                typeIds.push(x.dataListId);
            });
            element.fieldIdObj["children"] = children.data.dataList.map((x) => {
              let newdata = data.data.inputFields.filter(
                (n) => n.fieldId === x.id
              );
              if (newdata?.length > 0) x = newdata[0];
              return { ...x, parent: { ...element } };
            });
          } else if (test[element.fieldIdObj.displayMode] === "Duplicateable") {
            element.fieldIdObj["children"] = [element];
          }
          newData.push(element);
        }
      }
      data.data.inputFields.forEach(async (x) => {
        if (
          x.fieldIdObj.dataListId &&
          !typeIds.includes(x.fieldIdObj.dataListId)
        )
          typeIds.push(x.fieldIdObj.dataListId);
      });
    }
    let typedata = [];
    if (typeIds.length > 0) {
      // let response = await api.get(
      //   baseURL +
      //     `/insurance/multi-core-data?page=1&limit=1000&typeIds=${typeIds.join() ||
      //       0}`,
      //   apiInstance
      // );
      let response = await apigetUrl(
        `/insurance/multi-core-data?page=1&limit=1000&typeIds=${typeIds.join() ||
          0}`
      );
      if (response.status == 200) {
        response.data.dataList.forEach((list) => {
          typedata = [...typedata, ...list.dataList];
        });
      }
    }

    this.setState((state) => {
      return {
        userInsuranceInputs: newData,
      };
    });

    /**
     * looking for Duplicates and making them uniue record by keeing an extran field 'sequence'.
     * Later we'll make them unique based on the combo of 'fieldId' & 'sequence'.
     *
     *  if there is any duplicatoin, we have to create form fields for that duplicatoin
     */

    formData = (formData || []).map((obj, index) => {
      let subArr = (formData || []).slice(0, index);
      if (subArr.find((x) => x.fieldId === obj.fieldId)) {
        // generate 'sequence-id' and insert it into obj;
        const sequence = generateSequenceNumber();
        obj.sequence = sequence;
        this.updateUserInsuranceInputs(obj.fieldId, sequence, "Add");
      }
      return obj;
    });

    // modifiying the in formData as needed for UI components
    formData = formData.map((obj) => {
      if (obj.sequence) {
        let fieldInfo = this.state.userInsuranceInputs.find(
          (y) => y.fieldId == obj.fieldId
        );
        if (
          obj.fieldValues &&
          fieldInfo &&
          fieldInfo.fieldIdObj &&
          fieldInfo.fieldIdObj.duplicates
        ) {
          let currentDuplicates = fieldInfo.fieldIdObj.duplicates.filter(
            (o) => o.sequence === obj.sequence
          );
          obj.fieldValues = obj.fieldValues.map((k) => {
            let res =
              (currentDuplicates || []).find((r) => r.fieldId === k.fieldId) ||
              {};
            return {
              ...k,
              id: k.fieldId,
              fieldId: res.dupID || k.fieldId,
            };
          });
        }
      }
      return obj;
    });

    /**
     * bringing out 'health-conditions' info from 'inn.member.complex' info
     */
    let newFields = [];
    (newData || [])
      .filter((x) => x.fieldIdObj.secData)
      .forEach((x) => {
        formData = formData.map((y) => {
          if (y.fieldId == x.fieldIdObj.secData && y.fieldValues) {
            y.fieldValues = y.fieldValues.filter((obj) => {
              if (obj.fieldId === x.fieldId || obj.id === x.fieldId) {
                let newField = {
                  fieldId: obj.fieldId,
                  fieldValues: [
                    {
                      fieldId: Number(x.fieldIdObj.secData2),
                      fieldValue: obj.fieldValue,
                      id: obj.fieldId,
                    },
                  ],
                };

                if (y.sequence) {
                  let parentInfo = newData.find((p) => p.fieldId === y.fieldId);
                  let dupFields =
                    parentInfo.fieldIdObj.duplicates &&
                    parentInfo.fieldIdObj.duplicates.filter(
                      (o) => o.sequence == y.sequence
                    );

                  newField.sequence = y.sequence;
                  if (newField.fieldValues) {
                    newField.fieldValues = newField.fieldValues.map((k) => {
                      let res =
                        (dupFields || []).find(
                          (d) => d.fieldId === Number(x.fieldIdObj.secData2)
                        ) || {};
                      res && res.dupID && (k.fieldId = res.dupID);
                      return k;
                    });
                  }
                }

                newFields.push(newField);
                return false;
              }
              return true;
            });
          }
          return y;
        });
      });

    newFields.length && (formData = [...formData, ...newFields]);

    // let activeStep = sections[0] && sections[0].id;
    this.setState({
      // userInsuranceInputs: newData,
      typedata: typedata,
      loading: false,
      formData,
      sections,
      productName,
    });
    // } catch (error) {
    //   console.log(error);
    // }
  }

  setDefaultValuesOnEditOrPostQuote = () => {
    let { userInsuranceInputs, formData } = this.state;
    (userInsuranceInputs || []).forEach((field) => {
      if ("Boolean" === test[field?.fieldIdObj?.fieldType]) {
        let defualtBooleanValue = false;
        // checking at parentLevel in this.state.formdata
        if (
          !field?.fieldIdObj?.parentId &&
          !formData.find((f) => f.fieldId == field?.fieldIdObj?.id)
        ) {
          formData = [
            ...formData,
            {
              fieldId: field?.fieldIdObj?.id,
              fieldValue: defualtBooleanValue,
              id: field?.fieldIdObj?.id,
            },
          ];
        }

        // checking at child level in this.state.formdata
        if (field?.fieldIdObj?.parentId) {
          // checking for the presence of it's parent obj in this.state.formdata
          if (!formData.find((f) => f.fieldId == field?.fieldIdObj?.parentId)) {
            formData = [
              ...formData,
              {
                fieldId: field?.fieldIdObj?.parentId,
                fieldValues: [
                  {
                    fieldId: field?.fieldIdObj?.id,
                    fieldValue: defualtBooleanValue,
                    id: field?.fieldIdObj?.id,
                  },
                ],
              },
            ];
          } else {
            // checking for the fields values in this.state.formdata
            formData = formData.map((f) => {
              if (
                f.fieldId == field?.fieldIdObj?.parentId &&
                !f.fieldValues.find((o) => o.id == field?.fieldIdObj?.id)
              ) {
                let dupId;
                if (f.sequence) {
                  let parentInfo = userInsuranceInputs.find(
                    (p) => p.fieldId == field?.fieldIdObj?.parentId
                  );
                  let currentSet =
                    parentInfo.fieldIdObj.duplicates &&
                    parentInfo.fieldIdObj.duplicates.filter(
                      (c) => c.sequence == f.sequence
                    );
                  dupId = (
                    (currentSet || []).find(
                      (s) => s?.fieldIdObj?.id == field?.fieldIdObj?.id
                    ) || {}
                  ).dupID;
                }
                f.fieldValues = [
                  ...f.fieldValues,
                  {
                    fieldId: dupId || field?.fieldIdObj?.id,
                    fieldValue: defualtBooleanValue,
                    id: field?.fieldIdObj?.id,
                  },
                ];
                return f;
              }
              return f;
            });
          }
        }
      }
    });
    this.setState({ formData });
    console.log("updated formData => ", this.state.formData);
  };

  getPolicyInfo = async (policyId) => {
    this.setState({
      buttonloading: true,
    });
    let url = `/insurance/policy/${policyId}`;
    // let res = await api.get(url, apiInstance);
    let res = await apigetUrl(url);
    if (res.status === 200 && res.data && [0, 2].includes(res.data.status)) {
      return res;
    } else {
      // call this same API after 5 sec
      setTimeout(() => {
        this.getPolicyInfo(policyId);
      }, 5000);
    }
  };

  closeErrorAlert = () => {
    this.setState((prevState) => ({
      ...prevState,
      isErrorAlert: false,
    }));
  };

  handlePaymentGateway = async () => {
    let OTPString = this.state.otp;
    if (OTPString.length === 0) {
      this.setState({
        isErrorAlert: true,
        errorMsg: "Please Enter One Time Password",
        buttonloading: false,
      });
    } else {
      let otpData = { otp: this.state.otp };

      apipostUrl(
        `/insurance/enquiry/${this.state.enquiryid}/quotes/${this.state.quoteId}/otp`,
        otpData
      )
        .then(async (response) => {
          this.setState({
            buttonloading: true,
          });
          let policyId = localStorage.getItem("policyId");

          let res = await this.getPolicyInfo(policyId);
          if (res.data && res.status === 200) {
            let { paymentLink, status } = res.data;

            this.setState({
              policyInfo: response.data,
            });
            if (status === 2) {
              if (paymentLink === null || paymentLink === undefined) {
                this.setState({
                  isErrorAlert: true,
                  errorMsg: "Payment Link Not Available!",
                  buttonloading: false,
                });
              } else {
                //e.preventDefault();
                this.setState({
                  paymentGateWayLink: paymentLink,
                  buttonloading: true,
                  paymentGateWayLink_DialogOpen: true,
                });
              }
            } else if (status === 0) {
              this.setState({
                buttonloading: false,
                isErrorAlert: true,
                errorMsg: (res.data || {}).remarks || "Policy status is '0'",
              });
            }
          } else {
            this.setState({
              isErrorAlert: true,
              errorMsg: response.data.responseMessage || "",
              buttonloading: false,
            });
          }
        })

        .catch((err) => {
          this.setState({
            err: (err.response || {}).data,
            buttonloading: false,
          });
        });
    }
  };

  handleNext = async (e, step) => {
    const {
      activeStep,
      otp,
      formData,
      typedata,
      isPreQuoteEditMode,
    } = this.state;
    let steps = this.getSteps();
    //Here the -2 is because the getSteps method includes the otp step as well
    if (this.getSteps().length - 2 === activeStep) {
      this.setDefaultValuesOnEditOrPostQuote();
      let conData = formData.map((x) => {
        return x.fieldValues
          ? {
              ...x,
              fieldValues: x.fieldValues.map((y) => {
                return { fieldValue: y.fieldValue, fieldId: y.id || y.fieldId };
              }),
            }
          : x;
      });
      this.state.userInsuranceInputs
        .filter((x) => x.fieldIdObj.secData)
        .forEach((x) => {
          // let chunk = conData.find((y) => y.fieldId === x.fieldId) || {};
          let chunkCopy = conData.filter((y) => y.fieldId === x.fieldId) || [];
          conData = conData
            .filter((k) => k.fieldId !== x.fieldId)
            .map((n) => {
              let chunk;
              if (n.sequence) {
                chunk =
                  chunkCopy.find((obj) => obj.sequence == n.sequence) || {};
              } else {
                chunk = chunkCopy.find((obj) => !obj.sequence) || {};
              }

              if (n.fieldId == x.fieldIdObj.secData) {
                return {
                  ...n,
                  fieldValues: chunk.fieldValues
                    ? [...n.fieldValues, ...chunk.fieldValues]
                    : [...n.fieldValues],
                };
              } else return n;
            });
        });
      let data = { productId: 1, agentId: 234, enquiryData: conData };
      if (this.state.quoteId !== "" && !isPreQuoteEditMode) {
        /**
         * In this case, we are allowing the customer to purchase a Policy
         */
        // api
        //   .post(
        //     baseURL +
        //       `/insurance/enquiry/${this.state.enquiryid}/quotes/${this.state.quoteId}/sale`,
        //     data,
        //     apiInstance
        //   )
        this.setState({
          quotationsData: data,
        });
        apipostUrl(
          `/insurance/enquiry/${this.state.enquiryid}/quotes/${this.state.quoteId}/sale`,
          data
        )
          .then(async (response) => {
            if (response.status === 200) {
              let { policyId } = response.data;

              // store the 'policyId' in 'session' for further actions
              localStorage.setItem("policyId", policyId);

              this.setState({
                enquiry: this.state.enquiryid,
                activeStep: activeStep + 1,
                step: "otp",
                buttonloading: false,
                agreeTC: false,
                GetPaymentGetWayButton: true,
                otp: "",
              });
            }

            //   let res = await this.getPolicyInfo(policyId);
            //   if (res.data && res.status === 200) {
            //     let { paymentLink, status } = res.data;

            //     this.setState({
            //       policyInfo: response.data,
            //     });
            //     if (status === 2) {
            //       if (paymentLink === null || paymentLink === undefined) {
            //         this.setState({
            //           isErrorAlert: true,
            //           errorMsg: "Payment Link Not Available!",
            //           buttonloading: false,
            //         });
            //       } else {
            //         //e.preventDefault();
            //         this.setState({
            //           paymentGateWayLink: paymentLink,
            //           buttonloading: true,
            //           paymentGateWayLink_DialogOpen: true,
            //         });
            //       }
            //     } else if (status === 0) {
            //       this.setState({
            //         buttonloading: false,
            //         isErrorAlert: true,
            //         errorMsg:
            //           (res.data || {}).remarks || "Policy status is '0'",
            //       });
            //     }
            //   } else {
            //     this.setState({
            //       isErrorAlert: true,
            //       errorMsg: response.data.responseMessage || "",
            //       buttonloading: false,
            //     });
            //   }
            // } else {
            //   this.setState({
            //     isErrorAlert: true,
            //     errorMsg: response.data.responseMessage || "",
            //     buttonloading: false,
            //   });
            // }
          })
          .catch((err) => {
            this.setState({
              err: (err.response || {}).data,
              buttonloading: false,
            });
          });
      } else {
        /**
         * In this case, we are allowing the customer to go for a Policy-enquiry
         */
        // api
        //   .post(baseURL + `/insurance/enquiry`, data, apiInstance)
        apipostUrl(`/insurance/enquiry`, data)
          .then((response) => {
            if (response.status === 200) {
              this.setState({
                enquiry: response.data,
                activeStep: activeStep + 1,
                step: "otp",
                quotesloading: false,
                agreeTC: false,
              });
            }
          })
          .catch((err) => {
            this.setState({
              err: err?.response?.data,
            });
          });
      }
    } else if (steps[activeStep]?.id === "otp") {
      // api.put(
      //   baseURL + `/insurance/enquiry/${this.state.enquiry.id}/otp`,
      //   { otp, agentId: this.state.enquiry.agentId },
      //   apiInstance
      // );
      this.setState({ quotesloading: true });
      apiputUrl(`/insurance/enquiry/${this.state.enquiry.id}/otp`, {
        otp,
        agentId: this.state.enquiry.agentId,
      })
        .then((res) => {
          if (res.data.responseCode === "200") {
            this.props.history.push({
              pathname: "/app/wireframes/health/quotes/",
              state: { id: this.state.enquiry.id },
            });
          }
          if (res.data.responseStatus === "failure") {
            ippNotify.error(res.data.responseMessage);
          }
        })
        .catch((err) => {
          this.setState({
            err: err?.response?.data,
            quotesloading: false,
          });
        });
    } else {
      this.setState({
        activeStep: this.state.activeStep + 1,
        step: null,
      });
    }
  };

  uploadFile = (eventObj) => {
    const target = eventObj.currentTarget;
    const file = target.files.item(0);
    // // validate file as image
    // if (!file.type.startsWith("image/")) {
    //   setState((prevState) => ({
    //     ...prevState,
    //     isInvalidFile: true,
    //     invalidFileMsg: "File is not an image",
    //   }));
    //   // alert("File is not an image");
    //   return;
    // }

    // if (!file.name.match(/\.(jpg|jpeg|png|gif)$/)) {
    //   setState((prevState) => ({
    //     ...prevState,
    //     isInvalidFile: true,
    //     invalidFileMsg: "Please select valid image.",
    //   }));
    //   // this.setState({ invalidImage: "Please select valid image." });
    //   // alert("Please select valid image.");
    //   return;
    // }

    if (!file) {
      return;
    }

    // Create an object of formData
    const formData = new FormData();

    // Update the formData object
    formData.append("file", file, file.name);

    return apipostUrl("/docs/upload", formData);
  };

  handleChange = async (e, isMulti, Iobj) => {
    let { name, value, checked, sequence } = e.target;
    if (name === "otp" || name === "agreeTC") {
      this.setState((prev) => {
        prev[name] = name === "agreeTC" ? checked : value;
        return prev;
      });
      return;
    }
    let formData = this.state.formData;
    let cur =
      this.state.userInsuranceInputs.filter(
        (x) =>
          x.fieldId == name ||
          // x.id == name ||
          (Iobj && Iobj.dupID && x.fieldId == Iobj.id)
      )[0] || Iobj;
    if (!cur || !cur.fieldIdObj) {
      this.state.userInsuranceInputs.forEach((x) => {
        x.fieldIdObj.children &&
          x.fieldIdObj.children.forEach((y) => {
            if (y.id == name) {
              cur = y;
            }
          });
      });
    }
    if (test[cur?.fieldIdObj?.fieldType] === "Radio" || test[cur?.fieldType]) {
      checked = undefined;
    }
    if (
      (test[cur?.fieldType] || test[cur?.fieldIdObj?.fieldType]) ===
      "File Selector"
    ) {
      /**
       * upload the file to an API, which returns an 'id', that we have to send in 'heath-quote' API
       */
      if (value) {
        let targetObj = { ...e };

        let file = targetObj.target.files.item(0);
        this.setState({
          fileUploadLoading: true,
        });
        let res = await this.uploadFile(targetObj);
        if (`${res.status}` === "200") {
          let { uploadingFiles = {} } = this.state;
          uploadingFiles[res.data.id] = file;

          await this.setState((prevState) => ({
            ...prevState,
            uploadingFiles,
          }));

          // replace 'filePath' with documentId;
          value = res.data.id;
          this.setState({
            fileUploadLoading: false,
            buttonloading: false,
          });
        } else {
          this.setState({
            fileUploadLoading: false,
            buttonloading: false,
            isErrorAlert: true,
            errorMsg: "File Upload Failed!",
          });
        }
      }
    }
    if (isMulti) {
      let parent =
        cur.parent ||
        this.state.userInsuranceInputs.filter(
          (x) => x.fieldId == cur.fieldIdObj.parentId
        )[0] ||
        {};
      parent = parent.fieldId ? parent : cur;
      if (Iobj.dupID && Iobj.sequence) {
        let child = formData.filter(
          (x) => x.fieldId == parent.fieldId && x.sequence === Iobj.sequence
        );
        if (
          child.length > 0 &&
          child[0].fieldValues &&
          child[0].fieldValues.length > 0 &&
          child[0].fieldValues.filter(
            (k) => k.fieldId == name || k.fieldId == Iobj.secID
          ).length > 0
        ) {
          child[0].fieldValues = child[0].fieldValues.map((key) =>
            key.fieldId == name || key.fieldId == Iobj.secID
              ? {
                  ...key,
                  fieldValue: checked || value,
                  id: Iobj.fieldId || Iobj.id,
                }
              : key
          );
          formData = formData.map((n) =>
            n.fieldId === parent.fieldId && n.sequence === Iobj.sequence
              ? { ...n, fieldValues: child[0].fieldValues }
              : n
          );
        } else {
          if (
            formData.filter(
              (x) => x.fieldId == parent.fieldId && x.sequence === Iobj.sequence
            ).length > 0
          ) {
            formData = formData.map((x) =>
              x.fieldId == parent.fieldId && x.sequence === Iobj.sequence
                ? {
                    ...x,
                    fieldValues: [
                      ...(x.fieldValues || []),
                      {
                        fieldId: Iobj.secID || name,
                        fieldValue: checked || value,
                        id: Iobj.fieldId || Iobj.id,
                      },
                    ],
                  }
                : x
            );
          } else
            formData.push({
              fieldId: parent.fieldId,
              sequence: Iobj.sequence,
              fieldValues: [
                {
                  fieldId: Iobj.secID || name,
                  fieldValue: checked || value,
                  id: Iobj.fieldId || Iobj.id,
                },
              ],
            });
        }
      } else {
        let child = formData.filter(
          (x) => x.fieldId == parent.fieldId && !x.sequence
        );
        if (
          child.length > 0 &&
          child[0].fieldValues &&
          child[0].fieldValues.length > 0 &&
          child[0].fieldValues.filter(
            (k) => k.fieldId == name || k.fieldId == Iobj.secID
          ).length > 0
        ) {
          child[0].fieldValues = child[0].fieldValues.map((key) =>
            key.fieldId == name || key.fieldId == Iobj.secID
              ? {
                  ...key,
                  fieldValue: checked || value,
                  id: Iobj.fieldId || Iobj.id,
                }
              : key
          );
          formData = formData.map((n) =>
            n.fieldId === parent.fieldId && !n.sequence
              ? { ...n, fieldValues: child[0].fieldValues }
              : n
          );
        } else {
          if (
            formData.filter((x) => x.fieldId == parent.fieldId && !x.sequence)
              .length > 0
          ) {
            formData = formData.map((x) =>
              x.fieldId == parent.fieldId && !x.sequence
                ? {
                    ...x,
                    fieldValues: [
                      ...(x.fieldValues || []),
                      {
                        fieldId: Iobj.secID || name,
                        fieldValue: checked || value,
                        id: Iobj.fieldId || Iobj.id,
                      },
                    ],
                  }
                : x
            );
          } else
            formData.push({
              fieldId: parent.fieldId,
              fieldValues: [
                {
                  fieldId: Iobj.secID || name,
                  fieldValue: checked || value,
                  id: Iobj.fieldId || Iobj.id,
                },
              ],
            });
        }
      }
    } else if (value !== "Add" && value !== "Pop") {
      if (formData.filter((x) => x.fieldId === name).length > 0) {
        formData = formData.map((key) =>
          key.fieldId == name ? { ...key, fieldValue: value || checked } : key
        );
      } else
        formData.push({
          fieldId: name,
          fieldValue: checked || value,
        });
    }
    if (value === "Add" || value === "Pop") {
      this.updateUserInsuranceInputs(name, sequence, value);
      // let data = this.state.userInsuranceInputs.map((x) => {
      //   if (x.fieldId === name && value === "Add") {
      //     let dups = x.fieldIdObj.children
      //       ? x.fieldIdObj.children.map((x) => {
      //           return {
      //             ...x,
      //             dupID: Math.floor(Math.random() * 100000),
      //             sequence: sequence,
      //           };
      //         })
      //       : [];
      //     x.fieldIdObj["duplicates"] = [
      //       ...(x.fieldIdObj.duplicates || []),
      //       ...dups,
      //     ];
      //     return x;
      //   } else if (x.fieldId === name && value === "Pop") {
      //     let dups = x.fieldIdObj.duplicates.filter((x) => {
      //       return x.sequence !== sequence;
      //     });
      //     x.fieldIdObj["duplicates"] = dups;
      //     return x;
      //   }
      //   return x;
      // });

      // this.setState({
      //   userInsuranceInputs: data,
      // });
    } else
      this.setState({
        formData: formData,
      });
  };

  updateUserInsuranceInputs = (fieldId, sequence, action) => {
    let formData = this.state.formData || [];
    let data = this.state.userInsuranceInputs.map((x) => {
      if (x.fieldId === fieldId && action === "Add") {
        let dups = x.fieldIdObj.children
          ? x.fieldIdObj.children.map((x) => {
              return {
                ...x,
                dupID: Math.floor(Math.random() * 100000),
                sequence: sequence,
              };
            })
          : [];
        dups = dups.sort((x, y) => x.id - y.id);
        x.fieldIdObj["duplicates"] = [
          ...(x.fieldIdObj.duplicates || []),
          ...dups,
        ];
        return x;
      } else if (x.fieldId === fieldId && action === "Pop") {
        let dups = x.fieldIdObj.duplicates.filter((x) => {
          return x.sequence !== sequence;
        });
        x.fieldIdObj["duplicates"] = dups;

        // and delete the formData from state
        formData = formData.filter((obj) => {
          if (obj.fieldId === fieldId && obj.sequence === sequence) {
            return false;
          }
          return true;
        });
        return x;
      }
      return x;
    });

    this.setState((state) => {
      return {
        userInsuranceInputs: data,
        formData: formData,
      };
    });
  };

  getSteps = () => {
    /**
     * this component will render in 3-cases
     * case-1. Pre-quote stage (i.e Policy enquiry stage)
     * case-2. Edit-Pre-quote (i.e Enquiry is done. But, customer want to do some changes in Customer-info)
     * case-3. Post-quote (i.e Purchansing the Policy)
     *
     *
     * In case-1 & 2 => we should show only th 'pre-quote' sections, i.e 'seciton.isPreQuote => 1'
     * In case-3 => we should show all the sections, i.e 'isPreQuote => 0 (or) 1'
     *
     * In case-1 => enquiryid & isPreQuoteEditMode filed values will be null/undefined/false
     * In case-2 => 'isPreQuoteEditMode' will be 'true' & 'enquiryid' will be some 'id'
     * In case-3 => 'isPreQuoteEditMode' will be 'undefined' & 'enquiryid' will be some 'id'
     */
    const { isPreQuoteEditMode } = this.state;
    if (this.state.enquiryid && !isPreQuoteEditMode) {
      return (
        (this.state.sections?.length > 0 && [
          ...this.state.sections,
          { id: "otp", name: "Verify" },
        ]) ||
        []
      );
    } else {
      return (
        (this.state.sections?.length > 0 && [
          ...this.state.sections.filter((t) => t.isPreQuote === 1),
          { id: "otp", name: "Verify" },
        ]) ||
        []
      );
    }
  };

  getStepContent = (stepIndex) => {
    return this.getFieldType(this.getSteps()[stepIndex]?.id);
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
            return (
              <>
                <>
                  {input.fieldIdObj.children
                    .sort((x, y) => (x.id < y.id ? -1 : 1))
                    .map((child, index) =>
                      this.selectDynamicInputs(
                        test[child.fieldIdObj.fieldType],
                        child,
                        index,
                        true,
                        true
                      )
                    )}
                  {this.getDuplcate(input, true)}
                </>
                <>
                  {input.fieldIdObj.duplicates &&
                    input.fieldIdObj.duplicates
                      // .sort((x, y) => (x.id < y.id ? -1 : 1))
                      .map((child, index) => (
                        <>
                          {this.selectDynamicInputs(
                            test[child.fieldType || child.fieldIdObj.fieldType],
                            child,
                            index,
                            false,
                            true
                          )}
                          {input.fieldIdObj.duplicates &&
                            (index + 1) % input.fieldIdObj.children.length ===
                              0 &&
                            this.getDuplcate(
                              input,
                              false,
                              input.fieldIdObj.duplicates[index].sequence
                            )}
                        </>
                      ))}
                </>
              </>
            );
          case "For Each": {
            let series = [];
            let children = this.state.typedata.filter(
              (t) =>
                t.typeId ===
                (input.dataListId ||
                  (input.fieldIdObj && input.fieldIdObj.dataListId))
            );
            this.state.userInsuranceInputs
              .filter((x) => x.fieldId == input.fieldIdObj.secData)
              .forEach((x) => {
                if (test[x.fieldIdObj.fieldComposition] === "Complex Field") {
                  let name = this.state.formData.find(
                    (x) => x.fieldId == input.fieldIdObj.secData
                  );
                  let field = name?.fieldValues?.find(
                    (x) => input?.fieldIdObj?.secData2 == x?.fieldId
                  );
                  name =
                    (field &&
                      this.state.typedata.find(
                        (ff) => ff.id == field.fieldValue
                      ).name) ||
                    input?.fieldIdObj?.name ||
                    input?.name;
                  series.push({
                    ...input,
                    name,
                    secID: field && field.fieldId,
                    children,
                  });

                  if (x.fieldIdObj.duplicates) {
                    x.fieldIdObj.duplicates.forEach((y, ind) => {
                      if (y.fieldId == input.fieldIdObj.secData2) {
                        let name = this.state.formData.find(
                          (x) =>
                            x.fieldId == input.fieldIdObj.secData &&
                            x.sequence === y.sequence
                        );

                        let ntemp = name?.fieldValues?.find(
                          (x) => y.dupID == x.fieldId
                        );
                        let lname =
                          (ntemp &&
                            this.state.typedata.find(
                              (ff) => ff.id == ntemp?.fieldValue
                            )) ||
                          y;
                        series.push({
                          ...input,
                          name: lname.fieldValue || lname.name,
                          secID: ntemp?.fieldId,
                          children,
                          dupID: y.dupID,
                          sequence: y.sequence,
                        });
                      }
                    });
                  }
                }
              });

            return series.length > 0
              ? series.map((seri, ind) =>
                  this.selectDynamicInputs(
                    test[seri.fieldType || seri.fieldIdObj.fieldType],
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
          return (
            <fieldset>
              <legend class="diplicateFieldLegend">
                {input.fieldIdObj.name}
              </legend>
              <div className="row">
                {input.fieldIdObj.children
                  .sort((x, y) => (x.id < y.id ? -1 : 1))
                  .map((child, index) =>
                    this.selectDynamicInputs(
                      test[child?.fieldType || child?.fieldIdObj?.fieldType],
                      child,
                      index,
                      false,
                      true
                    )
                  )}
              </div>
            </fieldset>
          );
        }
        if (test[input.fieldIdObj.displayMode] == "Duplicateable") {
          let uniqueSequenceIds = [];
          input.fieldIdObj.duplicates &&
            input.fieldIdObj.duplicates.forEach((c) => {
              if (!uniqueSequenceIds.find((id) => id === c.sequence)) {
                uniqueSequenceIds.push(c.sequence);
              }
            });
          return (
            <>
              <fieldset>
                <legend class="diplicateFieldLegend">
                  {input.fieldIdObj.name}
                </legend>
                <div className="row">
                  {input.fieldIdObj.children
                    .sort((x, y) => (x.id < y.id ? -1 : 1))
                    .map((child, index) =>
                      this.selectDynamicInputs(
                        test[child.fieldType || child.fieldIdObj.fieldType],
                        child,
                        index,
                        true,
                        true
                      )
                    )}
                  {this.getDuplcate(input, true)}
                </div>
              </fieldset>
              {!(input.fieldIdObj.duplicates && uniqueSequenceIds.length)
                ? null
                : uniqueSequenceIds.map((seqId) => {
                    const groupFields = input.fieldIdObj.duplicates.filter(
                      (f) => f.sequence === seqId
                    );
                    return (
                      <fieldset>
                        <legend class="diplicateFieldLegend">
                          {input.fieldIdObj.name}
                        </legend>
                        <div className="row">
                          {(groupFields || []).map((child, index) => {
                            return (
                              <>
                                {this.selectDynamicInputs(
                                  test[
                                    child.fieldType ||
                                      child.fieldIdObj.fieldType
                                  ],
                                  child,
                                  index,
                                  false,
                                  true
                                )}
                                {input.fieldIdObj.duplicates &&
                                  (index + 1) %
                                    input.fieldIdObj.children.length ===
                                    0 &&
                                  this.getDuplcate(input, false, seqId)}
                              </>
                            );
                          })}
                        </div>
                      </fieldset>
                    );
                  })}
              {/* <>
                {input.fieldIdObj.duplicates &&
                  input.fieldIdObj.duplicates
                    // .sort((x, y) => (x.id < y.id ? -1 : 1))
                    .map((child, index) => (
                      <>
                        {this.selectDynamicInputs(
                          test[child.fieldType || child.fieldIdObj.fieldType],
                          child,
                          index,
                          false,
                          true
                        )}
                        {input.fieldIdObj.duplicates &&
                          (index + 1) % input.fieldIdObj.children.length ===
                            0 &&
                          this.getDuplcate(
                            input,
                            false,
                            input.fieldIdObj.duplicates[index].sequence
                          )}
                      </>
                    ))}
              </> */}
            </>
          );
        }
      } else if (test[input.fieldIdObj.fieldComposition] === "Child Field") {
        if (test[input.fieldIdObj.displayMode] == "Normal Display") {
          return (
            input.fieldIdObj.children &&
            input.fieldIdObj.children
              .sort((x, y) => (x.id < y.id ? -1 : 1))
              .map((child, index) =>
                this.selectDynamicInputs(
                  test[child?.fieldType || child?.fieldIdObj?.fieldType],
                  child,
                  index,
                  undefined,
                  true
                )
              )
          );
        }
        if (test[input.fieldIdObj.displayMode] == "Duplicateable") {
          return (
            <>
              {input.fieldIdObj.children
                .sort((x, y) => (x.id < y.id ? -1 : 1))
                .map((child, index) =>
                  this.selectDynamicInputs(
                    test[child?.fieldType || child?.fieldIdObj?.fieldType],
                    child,
                    index,
                    true,
                    true
                  )
                )}
              {input.fieldIdObj.duplicates &&
                input.fieldIdObj.duplicates
                  // .sort((x, y) => (x.id < y.id ? -1 : 1))
                  .map((child, index) =>
                    this.selectDynamicInputs(
                      test[child?.fieldType || child?.fieldIdObj?.fieldType],
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

  handleDelete = () => {
    console.info("You clicked the delete icon.");
  };

  // paymentGateWayLink_content=() => (
  //   <>
  //     <DialogTitle>
  //       Payment Link
  //     </DialogTitle>
  //     <DialogContent>
  //       <p>
  //         <b>
  //         You will now be redirected to the payment gateway page,
  //         please do not refresh the screen or click on the browser back button,
  //         Once payment is completed you will return back to the portal automatically.
  //          Please click on OK to continue.
  //         </b>
  //       </p>
  //     </DialogContent>
  //     <DialogActions>
  //       <Button onClick={(e) => this.paymentGateWayLink_YesConfirm(e)} color="secondary">
  //         Ok
  //       </Button>
  //     </DialogActions>
  //   </>
  // );

  paymentGateWayLink_YesConfirm = () => {
    this.setState((prevState) => ({
      ...prevState,
      paymentGateWayLink_DialogOpen: false,
    }));
    window.location.replace(this.state.paymentGateWayLink);
  };

  handle_paymentGateWayLink_RequestClose = () => {
    this.setState((prevState) => ({
      ...prevState,
      paymentGateWayLink_DialogOpen: false,
    }));
  };

  selectDynamicInputs = (type, input, index, isDuplicate, isMulti) => {
    let { isPreQuoteEditMode } = this.state;
    /**
     * this component will render in 3-cases
     * case-1. Pre-quote stage (i.e Policy enquiry stage)
     * case-2. Edit-Pre-quote (i.e Enquiry is done. But, customer want to do some changes in Customer-info)
     * case-3. Post-quote (i.e Purchansing the Policy)
     *
     *
     * In case-1 & 2 => we should show only the 'pre-quote' fields, i.e 'isPreQuote => 1'
     * In case-3 => we should show all the fields, i.e 'isPreQuote => 0 (or) 1'
     *
     * In case-1 => enquiryid && isPreQuoteEditMode filed values will be null/undefined/false
     * In case-2 => 'isPreQuoteEditMode' will be 'true' & 'enquiryid' will be some 'id'
     * In case-3 => 'isPreQuoteEditMode' will be 'undefined' & 'enquiryid' will be some 'id'
     */

    const isTrue = !this.state.enquiryid
      ? input.isPreQuote != 0
      : isPreQuoteEditMode
      ? input.isPreQuote != 0
      : this.state.enquiryid;
    if (isTrue) {
      let localCommute = ["otp"];
      let typedetails = localCommute.includes(type)
        ? type
        : this.state.typedata.filter(
            (t) =>
              t.typeId ===
              (input.dataListId ||
                (input.fieldIdObj && input.fieldIdObj.dataListId))
          );
      let obj;
      if (input.sequence) {
        obj = this.state.formData.find(
          (x) =>
            (x.fieldId == input.fieldId ||
              x.fieldId == input.id ||
              x.fieldId == input.parentId ||
              x.fieldId == input?.fieldIdObj?.parentId) &&
            input.sequence == x.sequence
        );
      } else {
        obj = this.state.formData.find(
          (x) =>
            x.fieldId == input.fieldId ||
            x.fieldId == input.id ||
            x.fieldId == input.parentId ||
            x.fieldId == input?.fieldIdObj?.parentId
        );
      }
      let value = "";
      let valueObj = {};
      if (obj && obj.fieldValues) {
        if (input.dupID) {
          valueObj =
            obj.fieldValues.find((x) => x.fieldId == input.dupID) || {};
          value = valueObj.fieldValue;
        } else
          valueObj =
            obj.fieldValues.find(
              (x) =>
                x.fieldId == input.id ||
                x.fieldId === input.parentId ||
                x.fieldId == input.fieldId
            ) || {};
        value = valueObj.fieldValue;
      } else value = (obj && obj.fieldValue) || "";
      let error = false;
      let maxLength = input.maxLength || input?.fieldIdObj?.maxLength;
      let minLength = input.minLength || input?.fieldIdObj?.minLength;
      let errorMessage = null;
      if (input?.isMandatory || input?.fieldIdObj?.isMandatory) {
        if (minLength && !error && value?.toString()?.length < minLength) {
          {
            error = true;
            errorMessage = `${input.name ||
              input?.fieldIdObj
                ?.name} length should be greather then ${minLength}`;
          }
        }
        if (maxLength && !error && value?.toString()?.length > maxLength) {
          {
            error = true;
            errorMessage = `${input.name ||
              input?.fieldIdObj?.name} length should be less then ${maxLength}`;
          }
        }
        if (!error) error = value?.toString()?.length == 0;
        if (
          (input?.regExp || input?.fieldIdObj?.regExp)?.test &&
          (input?.regExp || input?.fieldIdObj?.regExp)?.test(value)
        ) {
          error = true;
          errorMessage = `${input.name ||
            input?.fieldIdObj
              ?.name} length should be greather then ${minLength}`;
        }
      }
      switch (type) {
        case "String":
        case "Password":
        case "Number":
          return (
            <>
              <div
                className={this.state.cellWidthClasses + " int-content-center"}
              >
                <TextField
                  className="mb-3"
                  variant="outlined"
                  key={input.dupID || input.fieldId || input.id}
                  id={input.dupID || input.fieldId || input.id}
                  name={input.dupID || input.fieldId || input.id}
                  label={
                    input.name || (input.fieldIdObj && input.fieldIdObj.name)
                  }
                  margin="normal"
                  fullWidth
                  inputProps={{
                    pattern:
                      input.regExp ||
                      (input.fieldIdObj && input.fieldIdObj.regExp),
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
                  onChange={(e) => this.handleChange(e, isMulti, input)}
                  value={value}
                  error={error}
                  helperText={
                    error && (errorMessage || "This field is required")
                  }
                />
              </div>
            </>
          );
        case "Radio":
          return (
            <div
              className={this.state.cellWidthClasses + " int-content-center"}
            >
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
                  id={input.dupID || input.fieldId || input.id}
                  name={input.dupID || input.fieldId || input.id}
                  label={input.name || input.fieldIdObj.name}
                  onChange={(e) => this.handleChange(e, isMulti, input)}
                  value={value}
                >
                  {typedetails.map((x) => (
                    <FormControlLabel
                      value={x.id.toString()}
                      control={<Radio color="primary" />}
                      label={x.name}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </div>
          );
        case "otp":
          return (
            <div className="tab-pane" id="tab2-4">
              <h3 className="title text-primary">Terms and Conditions</h3>
              {getTermsAndCondition().length >= 500 ? (
                <div
                  style={{ height: "25%", overflowY: "scroll", width: "100%" }}
                  dangerouslySetInnerHTML={{ __html: getTermsAndCondition() }}
                />
              ) : (
                <div
                  style={{ height: "25%", width: "100%" }}
                  dangerouslySetInnerHTML={{ __html: getTermsAndCondition() }}
                />
              )}

              <div className="d-flex align-items-center">
                <Checkbox
                  color="primary"
                  name="agreeTC"
                  onChange={this.handleChange}
                  checked={this.state.agreeTC}
                />
                <span>I agree with the Terms and Conditions.</span>
              </div>
              <div>
                Enter the OTP sent to your entered mobile number / email id
                <strong>{input.number || ""}</strong>
              </div>
              <div className="form-group">
                <TextField
                  className="mb-3"
                  variant="outlined"
                  key={index}
                  id={"otp"}
                  name={"otp"}
                  label={"OTP"}
                  onChange={this.handleChange}
                  value={this.state.otp}
                  margin="normal"
                  w-50
                />
              </div>
              <div>
                {this.state.quotesloading ? null : (
                  <CountdownTimer
                    enquiryId={this.state.enquiry.id}
                    showLink={this.state.showLink}
                    quotationId={this.state.quoteId}
                    GetPaymentGetWayButton={this.state.GetPaymentGetWayButton}
                    quotationsData={this.state.quotationsData}
                    enquiryQuotationId={this.state.enquiryid}
                  />
                )}
              </div>
            </div>
          );
        case "Dropdown":
          return (
            <div
              className={
                this.state.cellWidthClasses + " mt-3 int-content-center"
              }
            >
              <div
                className={`${isDuplicate === (true || false) ? "row" : ""}`}
              >
                <div
                  className={`${
                    isDuplicate === (true || false) ? "col-md-10 text-left" : ""
                  }`}
                >
                  <FormControl
                    className="w-100 mb-3"
                    required={Boolean(input.isMandatory)}
                  >
                    <InputLabel
                      htmlFor={input.dupID || input.fieldId || input.id}
                      required={Boolean(input.isMandatory)}
                      inputProps={{
                        id: input.fieldId || input.id,
                      }}
                    >
                      {input.name || input.fieldIdObj.name}
                    </InputLabel>
                    <Select
                      inputProps={{
                        id: input.fieldId || input.id,
                      }}
                      className="mb-3 text-left"
                      fullWidth
                      label={input.name || input.fieldIdObj.name}
                      value={value}
                      name={input.dupID || input.fieldId || input.id}
                      labelId={input.dupID || input.fieldId || input.id}
                      id={input.dupID || input.fieldId || input.id}
                      required={Boolean(input.isMandatory)}
                      /* helperText={state.errors.section} */
                      onChange={(e) => this.handleChange(e, isMulti, input)}
                      error={error}
                      helperText={error && "This field is required"}
                      variant="outlined"
                    >
                      <MenuItem value="">
                        <em>Select</em>
                      </MenuItem>
                      {typedetails.map((option) => (
                        <MenuItem
                          key={option.id}
                          name={option.typeId}
                          value={option.id}
                          label={option.name}
                        >
                          {option.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
              </div>
            </div>
          );
        case "Date":
          return (
            <div
              className={
                this.state.cellWidthClasses + " mt-3 int-content-center"
              }
            >
              <DobDatePicker
                className="mb-3"
                isTimePicker={type === "Date & Time"}
                key={index}
                id={input.dupID || input.fieldId || input.id}
                name={input.dupID || input.fieldId || input.id}
                label={input.name || input.fieldIdObj.name}
                value={value}
                onChange={(e) => this.handleChange(e, isMulti, input)}
              />
              {/* {this.getDuplcate(input, isDuplicate)} */}
            </div>
          );
        case "Date & Time":
          return (
            <div
              className={
                this.state.cellWidthClasses + " mt-3 int-content-center"
              }
            >
              <DobDatePicker
                isTimePicker={type === "Date & Time"}
                key={index}
                fullWidth
                id={input.dupID || input.fieldId || input.fieldIdObj.key}
                name={input.dupID || input.fieldId || input.fieldIdObj.key}
                label={input.name || input.fieldIdObj.name}
                value={value}
                onChange={(e) => this.handleChange(e, isMulti, input)}
                inputProps={{
                  key: index,
                  id: input.fieldId || input.fieldIdObj.key,
                  name: input.fieldId || input.fieldIdObj.key,
                  label: input.name || input.fieldIdObj.name,
                }}
              />
              {/* {this.getDuplcate(input, isDuplicate)} */}
            </div>
          );
        case "Boolean":
        case "Checkbox":
          return (
            <>
              {input.children || typedetails.length > 0 ? (
                <div className="col-md-12 text-left">
                  <label>{input.name || input.fieldIdObj.name}</label>
                  <div className={"row"}>
                    {(input.children?.length > 0
                      ? input.children
                      : typedetails
                    ).map((bools) => {
                      let check =
                        obj &&
                        obj.fieldValues &&
                        obj.fieldValues.find(
                          (x) =>
                            x.fieldId ===
                            (input.secID || input.dupID || input.fieldId)
                        );
                      check =
                        check &&
                        check.fieldValue &&
                        check.fieldValue
                          .split(",")
                          .includes(bools.id.toString());
                      return (
                        <div className="col-md-3 text-left">
                          <Checkbox
                            key={index}
                            id={
                              bools.key ||
                              input.fieldId ||
                              (input.fieldIdObj && input.fieldIdObj.key)
                            }
                            name={
                              input.fieldId ||
                              input.id ||
                              (input.fieldIdObj && input.fieldIdObj.id)
                            }
                            required={Boolean(
                              input.isMandatory ||
                                (input.fieldIdObj &&
                                  input.fieldIdObj.isMandatory) ||
                                false
                            )}
                            checked={Boolean(check)}
                            color="primary"
                            onChange={(e) => {
                              let ids =
                                input.secID ||
                                input.dupID ||
                                input.id ||
                                input.fieldId;
                              let a =
                                obj?.fieldValues?.find((x) => x.fieldId == ids)
                                  ?.fieldValue || "";
                              if (a?.split(",").includes(bools.id.toString())) {
                                a = a
                                  .split(",")
                                  .filter(
                                    (x) => x !== bools.id.toString() && x !== ""
                                  )
                                  .join();
                              } else {
                                a = [a, bools.id];
                                a = a?.filter((x) => x !== "").join();
                              }
                              this.handleChange(
                                {
                                  ...e,
                                  target: {
                                    name:
                                      input.dupID || input.fieldId || input.id,
                                    value: a,
                                  },
                                },
                                true,
                                input
                              );
                            }}
                          />
                          <span>{bools.name || bools.fieldIdObj.name}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div
                  className={
                    this.state.cellWidthClasses + " int-content-center"
                  }
                >
                  <div className="text-left">
                    <Checkbox
                      key={index}
                      id={
                        input.dupID ||
                        input?.fieldId ||
                        input.id ||
                        input?.fieldIdObj?.id
                      }
                      name={
                        input.dupID ||
                        input.fieldId ||
                        input.id ||
                        input?.fieldIdObj?.id
                      }
                      label={input.name || input?.fieldIdObj?.name}
                      required={Boolean(
                        input.isMandatory ||
                          input?.fieldIdObj?.isMandatory ||
                          false
                      )}
                      checked={Boolean(value)}
                      color="primary"
                      onChange={(e) => {
                        this.handleChange(
                          {
                            ...e,
                            target: {
                              name:
                                input.dupID ||
                                input.fieldId ||
                                input.id ||
                                input?.fieldIdObj?.id,
                              value: e.target.checked,
                            },
                          },
                          isMulti,
                          input
                        );
                      }}
                      error={error}
                      helperText={error && "This field is required"}
                    />
                    <span>{input.name || input.fieldIdObj.name}</span>
                  </div>
                </div>
              )}
            </>
          );
        case "File Selector":
          const fileName =
            this.state.uploadingFiles[value] &&
            this.state.uploadingFiles[value].name;
          return (
            <>
              <div
                className={this.state.cellWidthClasses + " int-content-center"}
              >
                <div className="row">
                  <fieldset
                    className="w-100 mb-3"
                    style={{ textAlign: "left" }}
                  >
                    <legend
                      class="fileUploadLegend"
                      style={{ margin: "0px", marginLeft: "20px" }}
                    >
                      {input.fieldIdObj.name}
                    </legend>
                    <Button
                      variant="contained"
                      component="label"
                      style={{ margin: "10px", marginTop: "0px" }}
                    >
                      Upload File
                      <input
                        type="file"
                        className="mb-3"
                        variant="outlined"
                        key={input.dupID || input.fieldId || input.id}
                        id={input.dupID || input.fieldId || input.id}
                        name={input.dupID || input.fieldId || input.id}
                        label={
                          input.name ||
                          (input.fieldIdObj && input.fieldIdObj.name)
                        }
                        margin="normal"
                        fullWidth
                        onChange={(e) => {
                          this.handleChange(e, isMulti, input);
                        }}
                        hidden
                      />
                    </Button>
                    {!value ? null : (
                      <Chip
                        className="mb-3"
                        icon={<AttachFileIcon />}
                        label={fileName || "tempFileName"}
                        color="primary"
                        deleteIcon={
                          <HighlightOffIcon
                            id={input.dupID || input.fieldId || input.id}
                            Name={input.dupID || input.fieldId || input.id}
                            Value=""
                            // onClick={(e)=>this.handleChange(e, isMulti, input)}
                          />
                        }
                        onDelete={(e) => {
                          //
                          let eventObj = { ...e };
                          eventObj.target = {
                            ...eventObj.target,
                            name: eventObj.target.id,
                            value: "",
                          };
                          this.handleChange(eventObj, isMulti, input);
                        }}
                      />
                    )}
                  </fieldset>
                </div>
              </div>
            </>
          );
        default:
          break;
      }
    }
  };
  getDuplcate = (input, symb, sequence) =>
    symb === true ? (
      <Tooltip title="Add Another">
        <IconButton
          style={{ verticalAlign: "top", placeSelf: "center" }}
          key={input.fieldId}
          id={input.fieldId}
          name={input.fieldId}
          color="primary"
          onClick={(e) => {
            this.handleChange({
              target: {
                ...e,
                sequence: sequence || generateSequenceNumber(),
                name: (input.parent && input.parent.fieldId) || input.fieldId,
                value: "Add",
              },
            });
          }}
        >
          <AiFillPlusSquare />
        </IconButton>
      </Tooltip>
    ) : symb === false ? (
      <Tooltip title="Remove">
        <IconButton
          style={{ verticalAlign: "top", placeSelf: "center" }}
          key={input.fieldId}
          id={input.fieldId}
          name={input.fieldId}
          color="primary"
          sequence={sequence}
          // sequence={Array.isArray(input.fieldIdObj.duplicates)&&input.fieldIdObj.duplicates[0].sequence}
          onClick={(e) => {
            this.handleChange({
              target: {
                ...e,
                sequence: sequence || input.sequence,
                name: (input.parent && input.parent.fieldId) || input.fieldId,
                value: "Pop",
              },
            });
          }}
        >
          <AiFillMinusSquare />
        </IconButton>
      </Tooltip>
    ) : null;

  handleBack = () => {
    const { activeStep } = this.state;
    const steps = this.getSteps();
    // let ind = this.state.sections.findIndex((x) => x.id === activeStep);
    this.setState({
      activeStep: activeStep - 1,
      step: steps.length - 1 === activeStep - 1 ? "otp" : null,
      showLink: false,
      GetPaymentGetWayButton: false,
    });
  };

  render() {
    const steps = this.getSteps();
    const { activeStep } = this.state;

    return (
      <>
        <div className="row">
          <div className="col-lg-4"></div>
          <div className="col-lg-4"></div>
          <div className="col-lg-4">
            <IPPNotification />
          </div>
        </div>
        <div
          className={
            this.state.cardWidthClass + " int-content-center int-top-offset"
          }
        >
          <div className="row">
            <CardBox
              styleName="col-lg-12"
              cardStyle="text-center mb-0"
              heading={
                this.state.isPreQuote
                  ? this.state.productName + " - Quick Quote"
                  : this.state.productName + " - Policy Purchase"
              }
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
                  {steps.map((label) => {
                    return (
                      <Step
                        key={label.id}
                        className={`horizontal-stepper ${
                          label.id === activeStep ? "active" : ""
                        }`}
                        // completed={false}
                      >
                        <StepLabel className="stepperlabel">
                          {label.name}
                        </StepLabel>
                      </Step>
                    );
                  })}
                </Stepper>

                <div>
                  <div>
                    <div className="container">
                      <div className="row int-content-center">
                        {this.state.loading ? (
                          <div
                            className={
                              this.state.cellWidthClasses +
                              " int-content-center"
                            }
                          >
                            <CircularProgress></CircularProgress>
                          </div>
                        ) : (
                          this.getStepContent(activeStep)
                        )}
                      </div>
                    </div>
                    {!this.state.loading && (
                      <div className="text-center">
                        <div className="row">
                          <br></br>
                        </div>
                        {this.state.buttonloading ? (
                          <>
                            <div
                              className={
                                this.state.cellWidthClasses +
                                " int-content-center"
                              }
                            >
                              <CircularProgress></CircularProgress>
                              <br></br>
                              <b>
                                Please wait, we are validating the details and
                                getting the Policy issued...
                              </b>
                            </div>
                          </>
                        ) : this.state.fileUploadLoading ? (
                          <>
                            <div
                              className={
                                this.state.cellWidthClasses +
                                " int-content-center"
                              }
                            >
                              <CircularProgress></CircularProgress>
                              <br></br>
                              <b>Please wait, the file is uploading...</b>
                            </div>
                          </>
                        ) : this.state.quotesloading ? (
                          <>
                            <div
                              className={
                                this.state.cellWidthClasses +
                                " int-content-center"
                              }
                            >
                              <CircularProgress></CircularProgress>
                              <br></br>
                              <b>
                                Please wait, we are validating the details and
                                getting the quotations...
                              </b>
                            </div>
                            <div style={{ display: "none" }}>
                              {setTimeout(() => {
                                this.setState((prevState) => ({
                                  ...prevState,
                                  quotesloading: false,
                                  showLink: true,
                                  otp: "",
                                }));
                              }, 5500)}
                            </div>
                          </>
                        ) : (
                          <>
                            <Button
                              disabled={!activeStep}
                              onClick={(e) => this.handleBack(e, activeStep)}
                              className="mr-2"
                            >
                              <AiOutlineArrowLeft />
                              &nbsp;&nbsp;
                              <IntlMessages id="retailinsurance.health.button.back" />
                            </Button>
                            {this.state.GetPaymentGetWayButton === true ? (
                              <>
                                <Button
                                  variant="contained"
                                  color="primary"
                                  onClick={(e) => this.handlePaymentGateway(e)}
                                  disabled={
                                    activeStep === steps.length - 1 &&
                                    !this.state.agreeTC
                                  }
                                >
                                  <IntlMessages
                                    id={`${
                                      activeStep === steps.length - 1
                                        ? "retailinsurance.health.button.getpayment"
                                        : "retailinsurance.health.button.next"
                                    }`}
                                  />
                                  &nbsp;&nbsp;
                                  <AiOutlineArrowRight />
                                </Button>
                              </>
                            ) : (
                              <>
                                <Button
                                  variant="contained"
                                  color="primary"
                                  onClick={(e) =>
                                    this.handleNext(e, activeStep)
                                  }
                                  disabled={
                                    activeStep === steps.length - 1 &&
                                    !this.state.agreeTC
                                  }
                                >
                                  <IntlMessages
                                    id={`${
                                      activeStep === steps.length - 1
                                        ? "retailinsurance.health.button.getquotes"
                                        : "retailinsurance.health.button.next"
                                    }`}
                                  />
                                  &nbsp;&nbsp;
                                  <AiOutlineArrowRight />
                                </Button>
                              </>
                            )}
                          </>
                        )}
                      </div>
                    )}
                    {this.state.err && (
                      <FormHelperText error={Boolean(this.state.err)}>
                        {this.state.err.responseMessage}
                      </FormHelperText>
                    )}
                  </div>
                </div>
              </div>
            </CardBox>
          </div>
          {this.state.isErrorAlert === true ? (
            <div className="row">
              <ErrorModal
                message={this.state.errorMsg}
                closeError={this.closeErrorAlert}
              />
            </div>
          ) : null}
          <Dialog
            maxWidth="sm"
            open={this.state.paymentGateWayLink_DialogOpen}
            onClose={this.handle_paymentGateWayLink_RequestClose}
          >
            <DialogTitle>
              <IntlMessages id="product.name" />
            </DialogTitle>
            <DialogContent>
              <p>
                <b>
                  You will now be redirected to the payment gateway page, please
                  do not refresh the screen or click on the browser back button,
                  Once payment is completed you will return back to the portal
                  automatically. Please click on OK to continue.
                </b>
              </p>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={(e) => this.paymentGateWayLink_YesConfirm(e)}
                color="secondary"
              >
                Ok
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </>
    );
  }
}

export default HorizontalLabelPositionBelowStepper;
