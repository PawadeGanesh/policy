import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import PropTypes from "prop-types";
import localforage from "localforage";
import Joi from "joi-browser";
import PUSH_TAB_FixedNotifyLanguage from "./PUSH_TAB_FixedNotifyLanguage";
import PUSH_TAB_FixedToExpression from "./PUSH_TAB_FixedToExpression";
import PUSH_TAB_LanguageContent from "./PUSH_TAB_LanguageContent";

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
  addLanguageTitle: Joi.string()
    .required()
    .label("Add Language Title"),
};

const PushTabContent = forwardRef((props, ref) => {
  const { localForageSaveStatus } = props;
  const [state, setState] = useState({
    name: "",
    archiveIn: "",
    purgeIn: "",
    isEnabled: "",
    createdBy: "",
    createdDate: "",
    modifiedName: "",
    modifiedDate: "",
    order: "asc",
    orderBy: "name",
    selected: [],
    page: 1,
    rowsPerPage: 2,
    data: [],
    formDialogOpen: false,
    selectedEditId: "",
    isEditForm_NameError: false,
    isEditForm_DescriptionError: false,
    isEditForm_ArchiveInError: false,
    isEditForm_PurgeInError: false,
    isEditForm_isEnabledError: false,
    selected_EditForm_Name_Value: "",
    selected_EditForm_Description_Value: "",
    selected_EditForm_ArchiveIn_Value: "",
    selected_EditForm_PurgeIn_Value: "",
    selected_EditForm_IsEnabled_Value: "Yes",
    selected_EditForm_RowVersion_Value: 1,
    isSortAsc: true,
    deleteFormDialogOpen: false,
    tabHeaderData: [],
    tabGroupData: [],
    configData: [],
    selected_EditForm_SMS_MODE_ToExpression: "",
    selected_EditForm_PUSH_MODE_ToExpression: "",
    selected_EditForm_INAPP_MODE_ToExpression: "",
    selected_EditForm_PUSH_MODE_ToExpression: "",
    editNotificationTemplate_AvailableLanguages_Value: "",
    dynamicEventNameList: [],
    addLanguageContent_Value: "",
    addLanguageTitle_Value: "",
    selected_EditForm_PUSH_MODE_NotifyLanguage: "",
    selected_EditForm_PUSH_MODE_ContentDetails: [],
    addLanguageAvailable: false,
    errors: {},
    validation: {
      toExpression: "",
      notifyLanguage: "",
      availableLanguages: "",
      addLanguageContent: "",
      addLanguageTitle: "",
    },
    push_rows: "",
  });

  useEffect(() => {
    setState((prevState) => ({
      ...prevState,
      validation: {
        toExpression: props.template.toExpression,
        notifyLanguage: props.template.notifyLanguage,
      },
      selected_EditForm_PUSH_MODE_ContentDetails: props.template.contentDetails,
      push_rows: props.template.contentDetails,
    }));

    if (props.template.contentDetails != undefined) {
      props.template.contentDetails.map((a) => {
        return (a["isEditMode"] = false);
      });
      //DRY !!!!!
      props.template.contentDetails.map((b) => {
        return (b["id"] = b.language);
      });

      //setPush_Rows(props.template.contentDetails);
    }

    //console.log("props.template = ", props.template.contentDetails);
    localforage
      .setItem("pushTabData", {
        mode: props.template.mode,
        id: props.template.id,
        contentDetails: props.template.contentDetails,
        toExpression: props.template.toExpression,
        notifyLanguage: props.template.notifyLanguage,
      })
      .then(function() {
        return localforage.getItem("pushTabData");
      })
      .then(function(value) {
        // we got our value
        console.log("pushTabData Data stored initially", value);
      })
      .catch(function(err) {
        // we got an error
        console.log("Data store error on initial run = ", err);
      });
  }, [props]);

  const joinAllPUSH_TabData = () => {
    console.log("joinAllPUSH_TabData called");
    let notifyLanguage = "";
    let toExpression = "";
    let contentDetails = "";

    Promise.all([
      localforage.getItem("PUSH_TAB_FixedNotifyLanguage"),
      localforage.getItem("PUSH_TAB_FixedToExpression"),
      localforage.getItem("push_rows"),
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
              console.log("notifyLanguage = ", toExpression);
            }
            if (item.name === "contentDetails") {
              contentDetails = (item.push_rows || []).map((n) => {
                delete n.isEditMode;
                delete n.isContentChange;
                delete n.isLangChange;
                delete n.isTitleChange;
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
          .setItem("pushTabData", {
            mode: "push",
            id: 4,
            contentDetails,
            toExpression: state.validation.toExpression,
            notifyLanguage: state.validation.notifyLanguage,
          })
          .then(function() {
            return localforage.getItem("pushTabData");
          })
          .then(function(value) {
            // we got our value
            console.log("pushTabData Data stored", value);
            localForageSaveStatus({ name: "pushTabData" });
          })
          .catch(function(err) {
            // we got an error
            console.log("Data store error = ", err);
          });
      });
  };

  useImperativeHandle(ref, () => ({
    joinAllPUSH_TabData,
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
          <PUSH_TAB_FixedToExpression
            key="toExpression"
            id="toExpression"
            label="To Expression"
            name="toExpression"
            className="mb-4"
            // onChange={onTextFieldsChange}
            value={state.validation.toExpression}
            helperText={state.errors.toExpression}
            error={state.errors.toExpression}
            // getReturnedValue={getReturnedValue}
          />
        </div>
        <div className="col-lg-4">
          <PUSH_TAB_FixedNotifyLanguage
            key="notifyLanguage"
            id="notifyLanguage"
            name="notifyLanguage"
            helperText={state.errors.notifyLanguage}
            error={state.errors.notifyLanguage}
            label="Notify Language"
            className="mb-4"
            // onChange={onContentDetailsFieldsChange}
            value={state.validation.notifyLanguage}
          />
        </div>
      </div>
      <PUSH_TAB_LanguageContent
        contentDetails={state.selected_EditForm_PUSH_MODE_ContentDetails}
        langData={props.langData}
      />
    </TabPanel>
  );
});

export default PushTabContent;
