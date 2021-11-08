import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import IntlMessages from "util/IntlMessages";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import PropTypes from "prop-types";
import localforage from "localforage";
import Joi from "joi-browser";
import FixedToExpressionTextInput from "./FixedToExpressionTextInput";
import FixedNotifyLanguageTextInput from "./FixedNotifyLanguageTextInput";
import SMS_TAB_LanguageContent from "./SMS_TAB_LanguageContent";

const schema = {
  toExpression: Joi.string()
    .required()
    .label("To Expression"),
  notifyLanguage: Joi.string()
    .required()
    .label("Notify Language"),
  availableLanguages: Joi.string()
    .required()
    .label("Available Languages"),
  addLanguageContent: Joi.string()
    .required()
    .label("Add Language Content"),
};

const SmsTabContent = forwardRef((props, ref) => {
  const { localForageSaveStatus } = props;
  const [state, setState] = useState({
    validation: {
      toExpression: "",
      notifyLanguage: "",
      availableLanguages: "",
      addLanguageContent: "",
      isEnabled: "",
    },
    errors: {},
    selected_EditForm_SMS_MODE_ToExpression: "",
    dynamicEventNameList: [],
    selected_EditForm_SMS_MODE_NotifyLanguage: "",
    selected_EditForm_SMS_MODE_ContentDetails: [],
    addLanguageAvailable: false,
    // isTableSelectable: true,
    sms_rows: "",
  });

  useEffect(() => {
    setState((prevState) => ({
      ...prevState,
      validation: {
        toExpression: props.template.toExpression,
        notifyLanguage: props.template.notifyLanguage,
      },
      selected_EditForm_SMS_MODE_ContentDetails: props.template.contentDetails,
      sms_rows: props.template.contentDetails,
    }));

    if (props.template.contentDetails != undefined) {
      props.template.contentDetails.map((a) => {
        return (a["isEditMode"] = false);
      });
      //DRY !!!!!
      props.template.contentDetails.map((b) => {
        return (b["id"] = b.language);
      });

      // setSms_Rows(props.template.contentDetails);
    }
    //getSmsTabData

    // console.log("props.template = ", props.template.contentDetails);

    localforage
      .setItem("smsTabData", {
        mode: props.template.mode,
        id: props.template.id,
        contentDetails: props.template.contentDetails,
        toExpression: props.template.toExpression,
        notifyLanguage: props.template.notifyLanguage,
      })
      .then(function() {
        return localforage.getItem("smsTabData");
      })
      .then(function(value) {
        // we got our value
        //console.log("Data stored initially", value);
      })
      .catch(function(err) {
        // we got an error
        console.log("Data store error on initial run = ", err);
      });
  }, [props]);

  const joinAllSMS_TabData = () => {
    console.log("joinAllSMS_TabData called");
    let notifyLanguage = "";
    let toExpression = "";
    let contentDetails = "";
    Promise.all([
      localforage.getItem("SMS_TAB_FixedNotifyLanguage"),
      localforage.getItem("SMS_TAB_FixedToExpression"),
      localforage.getItem("sms_rows"),
    ])
      .then(function(results) {
        console.log("results = ", results);
        results.map((item) => {
          if (item) {
            if (item.name === "notifyLanguage") {
              notifyLanguage = item.notifyLanguage;
              console.log("notifyLanguage = ", notifyLanguage);
            }
            if (item.name === "toExpression") {
              toExpression = item.toExpression;
              console.log("toExpression = ", toExpression);
            }
            if (item.name === "contentDetails") {
              contentDetails = (item.sms_rows || []).map((n) => {
                delete n.isEditMode;
                delete n.isContentChange;
                delete n.isLangChange;
                delete n.id;
                return n;
              });
              console.log("contentDetails = ", contentDetails);
            }
          }
        });
      })
      .then(function() {
        localforage
          .setItem("smsTabData", {
            mode: "sms",
            id: 1,
            contentDetails,
            toExpression: state.validation.toExpression,
            notifyLanguage: state.validation.notifyLanguage,
          })
          .then(function() {
            return localforage.getItem("smsTabData");
          })
          .then(function(value) {
            // we got our value
            console.log("smsTabData Data stored", value);
            localForageSaveStatus({ name: "smsTabData" });
          })
          .catch(function(err) {
            // we got an error
            console.log("Data store error = ", err);
          });
      });
  };

  useImperativeHandle(ref, () => ({
    joinAllSMS_TabData,
  }));

  function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box p={3}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }

  TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
  };

  return (
    <TabPanel
      value={props.tabValue}
      index={props.tabValue}
      key={props.template.id}
    >
      <div className="row">
        <div className="col-lg-4">
          <FixedToExpressionTextInput
            id="toExpression"
            label={
              <IntlMessages id="notificationtempalet.master.modal.edit.felid.sms.ToExpression" />
            }
            name="toExpression"
            className="mb-4"
            value={state.validation.toExpression}
            helperText={state.errors.toExpression}
            error={state.errors.toExpression}
          />
        </div>
        <div className="col-lg-4">
          <FixedNotifyLanguageTextInput
            id="notifyLanguage"
            name="notifyLanguage"
            helperText={state.errors.notifyLanguage}
            error={state.errors.notifyLanguage}
            label={
              <IntlMessages id="notificationtempalet.master.modal.edit.felid.sms.NotifyLanguage" />
            }
            className="mb-4"
            // onChange={onContentDetailsFieldsChange}
            value={state.validation.notifyLanguage}
          />
        </div>
      </div>
      <SMS_TAB_LanguageContent
        contentDetails={state.selected_EditForm_SMS_MODE_ContentDetails}
        langData={props.langData}
      />
    </TabPanel>
  );
});

export default SmsTabContent;
