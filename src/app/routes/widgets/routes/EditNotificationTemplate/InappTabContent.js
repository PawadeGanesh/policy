import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import PropTypes from "prop-types";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import localforage from "localforage";
import INAPP_TAB_FixedToExpression from "./INAPP_TAB_FixedToExpression";
import INAPP_TAB_FixedNotifyLanguage from "./INAPP_TAB_FixedNotifyLanguage";
import INAPP_TAB_LanguageContent from "./INAPP_TAB_LanguageContent";

const InappTabContent = forwardRef((props, ref) => {
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
    selected_EditForm_INAPP_MODE_ToExpression: "",
    selected_EditForm_INAPP_MODE_ToExpression: "",
    selected_EditForm_PUSH_MODE_ToExpression: "",
    editNotificationTemplate_AvailableLanguages_Value: "",
    dynamicEventNameList: [],
    addLanguageContent_Value: "",
    addLanguageTitle_Value: "",
    selected_EditForm_INAPP_MODE_NotifyLanguage: "",
    selected_EditForm_INAPP_MODE_ContentDetails: [],
    addLanguageAvailable: false,
    errors: {},
    validation: {
      toExpression: "",
      notifyLanguage: "",
      availableLanguages: "",
      addLanguageContent: "",
      addLanguageTitle: "",
    },
    inapp_rows: "",
  });

  useEffect(() => {
    setState((prevState) => ({
      ...prevState,
      validation: {
        toExpression: props.template.toExpression,
        notifyLanguage: props.template.notifyLanguage,
      },
      selected_EditForm_INAPP_MODE_ContentDetails:
        props.template.contentDetails,
      inapp_rows: props.template.contentDetails,
    }));

    if (props.template.contentDetails != undefined) {
      props.template.contentDetails.map((a) => {
        return (a["isEditMode"] = false);
      });
      //DRY !!!!!
      props.template.contentDetails.map((b) => {
        return (b["id"] = b.language);
      });

      //setInapp_Rows(props.template.contentDetails);
    }

    //props.getInappTabData("hi from inapp");

    //console.log("props.template = ", props.template.contentDetails);

    localforage
      .setItem("inappTabData", {
        mode: props.template.mode,
        id: props.template.id,
        contentDetails: props.template.contentDetails,
        toExpression: props.template.toExpression,
        notifyLanguage: props.template.notifyLanguage,
      })
      .then(function() {
        return localforage.getItem("inappTabData");
      })
      .then(function(value) {
        // we got our value
        console.log("Data stored initially", value);
      })
      .catch(function(err) {
        // we got an error
        console.log("Data store error on initial run = ", err);
      });
  }, [props]);

  const joinAllINAPP_TabData = () => {
    console.log("joinAllINAPP_TabData called");
    let notifyLanguage = "";
    let toExpression = "";
    let contentDetails = "";

    Promise.all([
      localforage.getItem("INAPP_TAB_FixedNotifyLanguage"),
      localforage.getItem("INAPP_TAB_FixedToExpression"),
      localforage.getItem("inapp_rows"),
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
              contentDetails = (item.inapp_rows || []).map((n) => {
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
          .setItem("inappTabData", {
            mode: "inapp",
            id: 3,
            contentDetails,
            toExpression: state.validation.toExpression,
            notifyLanguage: state.validation.notifyLanguage,
          })
          .then(function() {
            return localforage.getItem("inappTabData");
          })
          .then(function(value) {
            // we got our value
            console.log("inappTabData Data stored", value);
            localForageSaveStatus({ name: "inappTabData" });
          })
          .catch(function(err) {
            // we got an error
            console.log("Data store error = ", err);
          });
      });
  };

  useImperativeHandle(ref, () => ({
    joinAllINAPP_TabData,
  }));

  const multiLineStyling_UseStyles = makeStyles((theme) => ({
    root: {
      "& .MuiTextField-root": {
        margin: theme.spacing(5),
      },
    },
    textarea: {
      resize: "both",
    },
  }));

  const multiLineStyling_Classes = multiLineStyling_UseStyles();

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

  console.log("props.tabValue", props.template.id);
  return (
    <TabPanel
      value={props.tabValue}
      index={props.tabValue}
      key={props.template.id}
    >
      <div className="row">
        <div className="col-lg-4">
          <INAPP_TAB_FixedToExpression
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
          <INAPP_TAB_FixedNotifyLanguage
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
      <INAPP_TAB_LanguageContent
        contentDetails={state.selected_EditForm_INAPP_MODE_ContentDetails}
        langData={props.langData}
      />
    </TabPanel>
  );
});

export default InappTabContent;
