import React, { useState, useEffect } from "react";
import { apigetUrl, apiputUrl } from "setup/middleware";
import "./root.component.css";
import { TextField } from "@material-ui/core";
import CardBox from "../../../../../components/CardBox/index";
import InputSubmitButton from "../CommonComponents/SubmitButton";
import InputCancelButton from "../CommonComponents/CancelButton";
import InputField from "../CommonComponents/TextField";
import InputAutocomplete from "../CommonComponents/Autocomplete";
import "../CommonComponents/tableStyle.css";
import IntlMessages from "util/IntlMessages";
import {
  IPPNotification,
  ippNotify,
} from "../CommonComponents/IPPNotification";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import SMSTab from "./SMSTab";
import EmailTab from "./EmailTab";
import InappTab from "./InappTab";
import PushTab from "./PushTab";

const EditNotificationTemplate = ({
  selectedId,
  eventData,
  handleRequestClose,
  getSuccessUpdate,
  callLocalBaseURL,
}) => {
  const [state, setState] = useState({
    data: [],
    langData: [],
    eventId: "",
    eventName: "",
    code: "",
    type: "",
    name: "",
    description: "",
    rowVersion: "",
    templateData: [],
    dynamicWidth: "",
    tabValue: 0,
    smsNotifyLang: "",
    smsExp: "",
    smsContentDetail: [],
    emailNotifyLang: "",
    emailExp: "",
    emailContentDetail: [],
    inappNotifyLang: "",
    inappExp: "",
    inappContentDetail: [],
    pushNotifyLang: "",
    pushExp: "",
    pushContentDetail: [],
    isEditFormSubmitDisabled: false,
    isEditContentDetailDisbaled: false,
    formDialogOpen: false,
    selectedObj: {},
    findItem: [],
    language: "",
    title: "",
    content: "",
    selectedId: "",
    isLangChange: false,
    addFormDialogOpen: false,
    modifiedSMSLangData: [],
    smsLangData: [],
    modifiedEmailLangData: [],
    emailLangData: [],
    modifiedInappLangData: [],
    inappLangData: [],
    modifiedPushLangData: [],
    pushLangData: [],
  });

  useEffect(() => {
    console.log("language-123", state.smsContentDetail);
  }, [state.smsContentDetail]);

  useEffect(() => {
    let arr1 = state.langData;
    let arr2 = state.smsContentDetail;
    let arr3 = state.emailContentDetail;
    let arr4 = state.inappContentDetail;
    let arr5 = state.pushContentDetail;
    let selectedObj = state.selectedObj;

    filterBySMSReference(arr1, arr2, selectedObj);
    filterByEmailReference(arr1, arr3, selectedObj);
    filterByInappReference(arr1, arr4, selectedObj);
    filterByPushReference(arr1, arr5, selectedObj);
  }, [
    state.smsContentDetail,
    state.emailContentDetail,
    state.inappContentDetail,
    state.pushContentDetail,
    state.langData,
    state.selectedObj,
  ]);

  const filterBySMSReference = (arr1, arr2, selectedObj) => {
    if (selectedObj) {
      const findItem = arr1.find(
        (n) => (n.additionalData || {}).key === selectedObj.language
      );
      setState((prevState) => ({
        ...prevState,
        findItem: findItem,
      }));
    }

    const res = arr1.filter((el) => {
      return !arr2.find((element) => {
        return element.language === (el.additionalData || {}).key;
      });
    });

    setState((prevState) => ({
      ...prevState,
      modifiedSMSLangData: res,
    }));
  };

  useEffect(() => {
    const item1 = state.findItem || [];
    const item2 = state.modifiedSMSLangData || [];
    const result = [...item2, item1];

    setState((prevState) => ({
      ...prevState,
      smsLangData: result,
    }));
  }, [state.findItem, state.modifiedSMSLangData]);

  const filterByEmailReference = (arr1, arr3, selectedObj) => {
    if (selectedObj) {
      const findItem = arr1.find(
        (n) => (n.additionalData || {}).key === selectedObj.language
      );
      setState((prevState) => ({
        ...prevState,
        findItem: findItem,
      }));
    }

    const res = arr1.filter((el) => {
      return !arr3.find((element) => {
        return element.language === (el.additionalData || {}).key;
      });
    });
    setState((prevState) => ({
      ...prevState,
      modifiedEmailLangData: res,
    }));
  };

  useEffect(() => {
    const item1 = state.findItem || [];
    const item2 = state.modifiedEmailLangData || [];
    const result = [...item2, item1];
    setState((prevState) => ({
      ...prevState,
      emailLangData: result,
    }));
  }, [state.findItem, state.modifiedEmailLangData]);

  const filterByInappReference = (arr1, arr4, selectedObj) => {
    if (selectedObj) {
      const findItem = arr1.find(
        (n) => (n.additionalData || {}).key === selectedObj.language
      );
      setState((prevState) => ({
        ...prevState,
        findItem: findItem,
      }));
    }

    const res = arr1.filter((el) => {
      return !arr4.find((element) => {
        return element.language === (el.additionalData || {}).key;
      });
    });
    setState((prevState) => ({
      ...prevState,
      modifiedInappLangData: res,
    }));
  };

  useEffect(() => {
    const item1 = state.findItem || [];
    const item2 = state.modifiedInappLangData || [];
    const result = [...item2, item1];
    setState((prevState) => ({
      ...prevState,
      inappLangData: result,
    }));
  }, [state.findItem, state.modifiedInappLangData]);

  const filterByPushReference = (arr1, arr5, selectedObj) => {
    if (selectedObj) {
      const findItem = arr1.find(
        (n) => (n.additionalData || {}).key === selectedObj.language
      );
      setState((prevState) => ({
        ...prevState,
        findItem: findItem,
      }));
    }

    const res = arr1.filter((el) => {
      return !arr5.find((element) => {
        return element.language === (el.additionalData || {}).key;
      });
    });
    setState((prevState) => ({
      ...prevState,
      modifiedPushLangData: res,
    }));
  };

  useEffect(() => {
    const item1 = state.findItem || [];
    const item2 = state.modifiedPushLangData || [];
    const result = [...item2, item1];
    setState((prevState) => ({
      ...prevState,
      pushLangData: result,
    }));
  }, [state.findItem, state.modifiedPushLangData]);

  useEffect(() => {
    console.log("eventId-sms", state.smsNotifyLang);
    console.log("eventId-email", state.emailNotifyLang);
    console.log("eventId-inapp", state.inappNotifyLang);
    console.log("eventId-push", state.pushNotifyLang);
    if (state.name === "" || state.code === "" || state.type === "") {
      setState((prevState) => ({
        ...prevState,
        isEditFormSubmitDisabled: false,
      }));
    }

    if (
      (state.smsContentDetail || []).map((n) => {
        if (n.language === "") {
          setState((prevState) => ({
            ...prevState,
            isEditFormSubmitDisabled: false,
          }));
        }
      })
    ) {
    }

    if (
      (state.emailContentDetail || []).map((n) => {
        if (n.language === "") {
          setState((prevState) => ({
            ...prevState,
            isEditFormSubmitDisabled: false,
          }));
        }
      })
    ) {
    }
  }, [
    state.name,
    state.eventId,
    state.code,
    state.type,
    state.smsContentDetail,
    state.emailContentDetail,
  ]);

  useEffect(() => {
    apigetUrl(
      `/config/core-data?page=1&limit=10&typeId=40&sortBy=name&sortType=asc`
    )
      .then((res) => {
        console.log("res-langauge", res);
        if (`${res.data.responseCode}` === "200") {
          setState((prevState) => ({
            ...prevState,
            langData: res.data.dataList,
          }));
        }
      })
      .catch((err) => console.log("err", err));
  }, []);

  useEffect(() => {
    console.log("eventData", eventData);
    apigetUrl(`/notify/templates/${selectedId}`)
      .then((res) => {
        console.log("res-template", res);
        let dynamicWidth = 100 / (res.data.template || []).length;
        let smsTemplateData = (res.data.template || []).find(
          (n) => n.mode === "sms"
        );
        let smsDetail = smsTemplateData.contentDetails.map((n, index) => {
          n.id = index + 1;
          return n;
        });

        let emailTemplateData = (res.data.template || []).find(
          (n) => n.mode === "email"
        );

        let emailMapData = emailTemplateData.contentDetails.map((n, index) => {
          n.id = index + 1;
          return n;
        });
        let inappTemplateData = (res.data.template || []).find(
          (n) => n.mode === "inapp"
        );
        let inappMapData = ((inappTemplateData || {}).contentDetails || []).map(
          (n, index) => {
            n.id = index + 1;
            return n;
          }
        );
        let pushTemplateData = (res.data.template || []).find(
          (n) => n.mode === "push"
        );
        let pushMapData = ((pushTemplateData || {}).contentDetails || []).map(
          (n, index) => {
            n.id = index + 1;
            return n;
          }
        );
        console.log("dynamicWidth-123", dynamicWidth);
        if (res.status === 200) {
          setState((prevState) => ({
            ...prevState,
            data: res.data,
            eventId: res.data.eventId,
            code: res.data.code,
            type: res.data.type,
            name: res.data.name,
            description: res.data.description,
            rowVersion: res.data.rowVersion,
            templateData: res.data.template,
            dynamicWidth: dynamicWidth,
            smsNotifyLang: (smsTemplateData || {}).notifyLanguage || "",
            smsExp: (smsTemplateData || {}).toExpression || "",

            smsContentDetail: smsDetail,
            emailNotifyLang: (emailTemplateData || {}).notifyLanguage || "",
            emailExp: (emailTemplateData || {}).toExpression || "",
            // emailContentDetail: (emailTemplateData || {}).contentDetails || [],
            emailContentDetail: emailMapData,
            inappNotifyLang: (inappTemplateData || {}).notifyLanguage || "",
            inappExp: (inappTemplateData || {}).toExpression || "",
            inappContentDetail: inappMapData,
            pushNotifyLang: (pushTemplateData || {}).notifyLanguage || "",
            pushExp: (pushTemplateData || {}).toExpression || "",
            pushContentDetail: pushMapData,
            isEditFormSubmitDisabled: false,
          }));
        }
      })
      .catch((err) => console.log("err", err));
  }, []);

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    console.log("event", name, value);

    if (name === "name") {
      if (value) {
        setState((prevState) => ({
          ...prevState,
          [name]: value,
          isNameChange: false,
          isEditFormSubmitDisabled: true,
        }));
      } else {
        setState((prevState) => ({
          ...prevState,
          [name]: value,
          isNameChange: true,
        }));
      }
    }

    if (name === "description") {
      if (value) {
        setState((prevState) => ({
          ...prevState,
          [name]: value,
        }));
      } else {
        setState((prevState) => ({
          ...prevState,
          [name]: value,
        }));
      }
    }

    if (name === "code") {
      if (value) {
        setState((prevState) => ({
          ...prevState,
          [name]: value,
          isCodeChange: false,
          isEditFormSubmitDisabled: true,
        }));
      } else {
        setState((prevState) => ({
          ...prevState,
          [name]: value,
          isCodeChange: true,
        }));
      }
    }

    if (name === "type") {
      if (value) {
        setState((prevState) => ({
          ...prevState,
          [name]: value,
          isTypeChange: false,
          isEditFormSubmitDisabled: true,
        }));
      } else {
        setState((prevState) => ({
          ...prevState,
          [name]: value,
          isTypeChange: true,
        }));
      }
    }
  };

  const handleEditEventChange = (e, value) => {
    console.log("value", value);
    let findEventId = (eventData || []).find((n) => n.name === value);
    if (value === null) {
      setState((prevState) => ({
        ...prevState,
        eventId: (findEventId || {}).id,
        isEventNameChange: true,
        isEditFormSubmitDisabled: false,
      }));
    } else {
      setState((prevState) => ({
        ...prevState,
        eventId: (findEventId || {}).id,
        isEventNameChange: false,
        isEditFormSubmitDisabled: true,
      }));
    }
  };

  const getEventSelected = (eventId) => {
    console.log("eventId-123", eventId);
    const item = (eventData || []).find((n) => n.id === eventId);
    console.log("eventId-345", item);
    return (item || {}).name;
  };

  const handleTabChange = (e, newValue) => {
    console.log("newValue", newValue);
    setState((prevState) => ({
      ...prevState,
      tabValue: newValue,
    }));
  };

  const handleFormDialogClose = () => {
    setState((prevState) => ({
      ...prevState,
      formDialogOpen: false,
    }));
  };

  const onTableEditButtonClick = (e, id, name) => {
    console.log("id", id);

    if (name === "sms") {
      let findObj = state.smsContentDetail.find((n) => n.id === id);
      console.log("findObj", findObj);
      setState((prevState) => ({
        ...prevState,
        formDialogOpen: true,
        selectedObj: findObj,
        language: findObj.language,
        title: findObj.title,
        content: findObj.content,
        isEditContentDetailDisbaled: false,
        selectedId: id,
      }));
    }

    if (name === "email") {
      let findObj = state.emailContentDetail.find((n) => n.id === id);
      console.log("findObj", findObj);
      setState((prevState) => ({
        ...prevState,
        formDialogOpen: true,
        selectedObj: findObj,
        language: findObj.language,
        title: findObj.title,
        content: findObj.content,
        isEditContentDetailDisbaled: false,
        selectedId: id,
      }));
    }

    if (name === "inapp") {
      let findObj = state.inappContentDetail.find((n) => n.id === id);
      console.log("findObj", findObj);
      setState((prevState) => ({
        ...prevState,
        formDialogOpen: true,
        selectedObj: findObj,
        language: findObj.language,
        title: findObj.title,
        content: findObj.content,
        isEditContentDetailDisbaled: false,
        selectedId: id,
      }));
    }

    if (name === "push") {
      let findObj = state.pushContentDetail.find((n) => n.id === id);
      console.log("findObj", findObj);
      setState((prevState) => ({
        ...prevState,
        formDialogOpen: true,
        // selectedObj: findObj,
        language: findObj.language,
        title: findObj.title,
        content: findObj.content,
        isEditContentDetailDisbaled: false,
        selectedId: id,
      }));
    }
  };

  const handleEditFormSubmit = (e, name) => {
    if (name === "sms") {
      let a1 = [
        {
          language: state.language,
          title: state.title,
          content: state.content,
          id: state.selectedId,
        },
      ];
      console.log("a-1", a1);
      let a2 = state.smsContentDetail;
      console.log("a-12", a2);
      const updatedArr = a2.map((n) => {
        let a3 = a1.find((m) => m.id === n.id);
        return { ...n, ...a3 };
      });
      console.log("updatedArr", updatedArr);
      setState((prevState) => ({
        ...prevState,
        formDialogOpen: false,
        smsContentDetail: updatedArr,
        isEditFormSubmitDisabled: true,
      }));
    }

    if (name === "email") {
      let a1 = [
        {
          language: state.language,
          title: state.title,
          content: state.content,
          id: state.selectedId,
        },
      ];
      console.log("a-1", a1);
      let a2 = state.emailContentDetail;
      console.log("a-12", a2);
      const updatedArr = a2.map((n) => {
        let a3 = a1.find((m) => m.id === n.id);
        return { ...n, ...a3 };
      });
      console.log("updatedArr", updatedArr);
      setState((prevState) => ({
        ...prevState,
        formDialogOpen: false,
        emailContentDetail: updatedArr,
        isEditFormSubmitDisabled: true,
      }));
    }

    if (name === "inapp") {
      let a1 = [
        {
          language: state.language,
          title: state.title,
          content: state.content,
          id: state.selectedId,
        },
      ];
      console.log("a-1", a1);
      let a2 = state.inappContentDetail;
      console.log("a-12", a2);
      const updatedArr = a2.map((n) => {
        let a3 = a1.find((m) => m.id === n.id);
        return { ...n, ...a3 };
      });
      console.log("updatedArr", updatedArr);
      setState((prevState) => ({
        ...prevState,
        formDialogOpen: false,
        inappContentDetail: updatedArr,
        isEditFormSubmitDisabled: true,
      }));
    }

    if (name === "push") {
      let a1 = [
        {
          language: state.language,
          title: state.title,
          content: state.content,
          id: state.selectedId,
        },
      ];
      console.log("a-1", a1);
      let a2 = state.pushContentDetail;
      console.log("a-12", a2);
      const updatedArr = a2.map((n) => {
        let a3 = a1.find((m) => m.id === n.id);
        return { ...n, ...a3 };
      });
      console.log("updatedArr", updatedArr);
      setState((prevState) => ({
        ...prevState,
        formDialogOpen: false,
        pushContentDetail: updatedArr,
        isEditFormSubmitDisabled: true,
      }));
    }
  };

  const onAddButtonClick = () => {
    setState((prevState) => ({
      ...prevState,
      addFormDialogOpen: true,
      language: "",
      title: "",
      content: "",
    }));
  };

  const handleAddFormDialogClose = () => {
    setState((prevState) => ({
      ...prevState,
      addFormDialogOpen: false,
      isEditFormSubmitDisabled: false,
    }));
  };

  const handleAddFormSubmit = (e, name) => {
    if (name === "sms") {
      setState((prevState) => ({
        ...prevState,
        addFormDialogOpen: false,
        isEditFormSubmitDisabled: true,
        smsContentDetail: [
          ...state.smsContentDetail,
          {
            title: state.title,
            language: state.language,
            content: state.content,
            id: parseInt(state.smsContentDetail.length),
          },
        ],
      }));
    }

    if (name === "email") {
      setState((prevState) => ({
        ...prevState,
        addFormDialogOpen: false,
        isEditFormSubmitDisabled: true,
        emailContentDetail: [
          ...state.emailContentDetail,
          {
            title: state.title,
            language: state.language,
            content: state.content,
            id: parseInt(state.emailContentDetail.length),
          },
        ],
      }));
    }

    if (name === "inapp") {
      setState((prevState) => ({
        ...prevState,
        addFormDialogOpen: false,
        isEditFormSubmitDisabled: true,
        inappContentDetail: [
          ...state.inappContentDetail,
          {
            title: state.title,
            language: state.language,
            content: state.content,
            id: parseInt(state.inappContentDetail.length),
          },
        ],
      }));
    }

    if (name === "push") {
      setState((prevState) => ({
        ...prevState,
        addFormDialogOpen: false,
        isEditFormSubmitDisabled: true,
        pushContentDetail: [
          ...state.pushContentDetail,
          {
            title: state.title,
            language: state.language,
            content: state.content,
            id: parseInt(state.pushContentDetail.length),
          },
        ],
      }));
    }
  };

  const onTableDeleteButtonClick = (e, id, name) => {
    console.log("ID", id);

    if (name === "sms") {
      const list = state.smsContentDetail.filter((item) => item.id !== id);
      setState((prevState) => ({
        ...prevState,
        smsContentDetail: list,
        isEditFormSubmitDisabled: true,
      }));
    }

    if (name === "email") {
      const list = state.emailContentDetail.filter((item) => item.id !== id);
      setState((prevState) => ({
        ...prevState,
        emailContentDetail: list,
        isEditFormSubmitDisabled: true,
      }));
    }

    if (name === "inapp") {
      const list = state.inappContentDetail.filter((item) => item.id !== id);
      setState((prevState) => ({
        ...prevState,
        inappContentDetail: list,
        isEditFormSubmitDisabled: true,
      }));
    }

    if (name === "push") {
      const list = state.pushContentDetail.filter((item) => item.id !== id);
      setState((prevState) => ({
        ...prevState,
        pushContentDetail: list,
        isEditFormSubmitDisabled: true,
      }));
    }
  };

  const getTabs = (mode) => {
    switch (mode) {
      case "sms":
        return (
          <SMSTab
            //   langData={state.langData}
            langData={state.modifiedSMSLangData}
            smsLangData={state.smsLangData}
            smsData={state.smsContentDetail}
            smsNotifyLang={state.smsNotifyLang}
            smsExp={state.smsExp}
            handleSMSInputChange={handleSMSInputChange}
            handleSMSChange={handleSMSChange}
            // handleSMSEditorChange={handleSMSEditorChange}
            isSMSNotifyLangChange={state.isSMSNotifyLangChange}
            isSMSExpChange={state.isSMSExpChange}
            formDialogOpen={state.formDialogOpen}
            handleFormDialogClose={handleFormDialogClose}
            onTableEditButtonClick={onTableEditButtonClick}
            handleEditFormSubmit={handleEditFormSubmit}
            language={state.language}
            title={state.title}
            content={state.content}
            selectedId={state.selectedId}
            isEditContentDetailDisbaled={state.isEditContentDetailDisbaled}
            isLangChange={state.isLangChange}
            onAddButtonClick={onAddButtonClick}
            addFormDialogOpen={state.addFormDialogOpen}
            handleAddFormDialogClose={handleAddFormDialogClose}
            handleAddFormSubmit={handleAddFormSubmit}
            onTableDeleteButtonClick={onTableDeleteButtonClick}
          />
        );
      case "email":
        return (
          <EmailTab
            // langData={state.langData}
            langData={state.modifiedEmailLangData}
            emailLangData={state.emailLangData}
            emailData={state.emailContentDetail}
            emailNotifyLang={state.emailNotifyLang}
            emailExp={state.emailExp}
            handleEmailInputChange={handleEmailInputChange}
            handleEmailChange={handleEmailChange}
            handleEmailEditorChange={handleEmailEditorChange}
            isEmailNotifyLangChange={state.isEmailNotifyLangChange}
            isEmailExpChange={state.isEmailExpChange}
            formDialogOpen={state.formDialogOpen}
            handleFormDialogClose={handleFormDialogClose}
            onTableEditButtonClick={onTableEditButtonClick}
            handleEditFormSubmit={handleEditFormSubmit}
            language={state.language}
            title={state.title}
            content={state.content}
            selectedId={state.selectedId}
            isEditContentDetailDisbaled={state.isEditContentDetailDisbaled}
            isLangChange={state.isLangChange}
            onAddButtonClick={onAddButtonClick}
            addFormDialogOpen={state.addFormDialogOpen}
            handleAddFormDialogClose={handleAddFormDialogClose}
            handleAddFormSubmit={handleAddFormSubmit}
            onTableDeleteButtonClick={onTableDeleteButtonClick}
          />
        );
      case "inapp":
        return (
          <InappTab
            langData={state.modifiedInappLangData}
            inappLangData={state.inappLangData}
            inappData={state.inappContentDetail}
            inappNotifyLang={state.inappNotifyLang}
            inappExp={state.inappExp}
            handleInappInputChange={handleInappInputChange}
            handleInappChange={handleInappChange}
            handleInappEditorChange={handleInappEditorChange}
            isInappNotifyLangChange={state.isInappNotifyLangChange}
            isInappExpChange={state.isInappExpChange}
            formDialogOpen={state.formDialogOpen}
            handleFormDialogClose={handleFormDialogClose}
            onTableEditButtonClick={onTableEditButtonClick}
            handleEditFormSubmit={handleEditFormSubmit}
            language={state.language}
            title={state.title}
            content={state.content}
            selectedId={state.selectedId}
            isEditContentDetailDisbaled={state.isEditContentDetailDisbaled}
            isLangChange={state.isLangChange}
            onAddButtonClick={onAddButtonClick}
            addFormDialogOpen={state.addFormDialogOpen}
            handleAddFormDialogClose={handleAddFormDialogClose}
            handleAddFormSubmit={handleAddFormSubmit}
            onTableDeleteButtonClick={onTableDeleteButtonClick}
          />
        );
      case "push":
        return (
          <PushTab
            langData={state.modifiedPushLangData}
            pushLangData={state.pushLangData}
            pushData={state.pushContentDetail}
            pushNotifyLang={state.pushNotifyLang}
            pushExp={state.pushExp}
            handlePushInputChange={handlePushInputChange}
            handlePushChange={handlePushChange}
            // handlePushEditorChange={handlePushEditorChange}
            isPushNotifyLangChange={state.isPushNotifyLangChange}
            isPushExpChange={state.isPushExpChange}
            formDialogOpen={state.formDialogOpen}
            handleFormDialogClose={handleFormDialogClose}
            onTableEditButtonClick={onTableEditButtonClick}
            handleEditFormSubmit={handleEditFormSubmit}
            language={state.language}
            title={state.title}
            content={state.content}
            selectedId={state.selectedId}
            isEditContentDetailDisbaled={state.isEditContentDetailDisbaled}
            isLangChange={state.isLangChange}
            onAddButtonClick={onAddButtonClick}
            addFormDialogOpen={state.addFormDialogOpen}
            handleAddFormDialogClose={handleAddFormDialogClose}
            handleAddFormSubmit={handleAddFormSubmit}
            onTableDeleteButtonClick={onTableDeleteButtonClick}
          />
        );
    }
  };

  const handleSMSInputChange = (e) => {
    const { name, value } = e.target;
    console.log("event", e.target.value);

    if (name === "notifyLanguage") {
      if (value) {
        setState((prevState) => ({
          ...prevState,
          smsNotifyLang: value,
          isSMSNotifyLangChange: false,
          isEditFormSubmitDisabled: true,
        }));
      } else {
        setState((prevState) => ({
          ...prevState,
          smsNotifyLang: value,
          isSMSNotifyLangChange: true,
          isEditFormSubmitDisabled: false,
        }));
      }
    }

    if (name === "toExpression") {
      if (value) {
        setState((prevState) => ({
          ...prevState,
          smsExp: value,
          isSMSExpChange: false,
          isEditFormSubmitDisabled: true,
        }));
      } else {
        setState((prevState) => ({
          ...prevState,
          smsExp: value,
          isSMSExpChange: true,
          isEditFormSubmitDisabled: false,
        }));
      }
    }
  };

  const handleEmailInputChange = (e) => {
    const { name, value } = e.target;
    console.log("event", e.target.value);

    if (name === "notifyLanguage") {
      if (value) {
        setState((prevState) => ({
          ...prevState,
          emailNotifyLang: value,
          isEmailNotifyLangChange: false,
          isEditFormSubmitDisabled: true,
        }));
      } else {
        setState((prevState) => ({
          ...prevState,
          emailNotifyLang: value,
          isEmailNotifyLangChange: true,
          isEditFormSubmitDisabled: false,
        }));
      }
    }

    if (name === "toExpression") {
      if (value) {
        setState((prevState) => ({
          ...prevState,
          emailExp: value,
          isEmailExpChange: false,
          isEditFormSubmitDisabled: true,
        }));
      } else {
        setState((prevState) => ({
          ...prevState,
          emailExp: value,
          isEmailExpChange: true,
          isEditFormSubmitDisabled: false,
        }));
      }
    }
  };

  const handleInappInputChange = (e) => {
    const { name, value } = e.target;
    console.log("event", e.target.value);

    if (name === "notifyLanguage") {
      if (value) {
        setState((prevState) => ({
          ...prevState,
          inappNotifyLang: value,
          isInappNotifyLangChange: false,
          isEditFormSubmitDisabled: true,
        }));
      } else {
        setState((prevState) => ({
          ...prevState,
          inappNotifyLang: value,
          isInappNotifyLangChange: true,
          isEditFormSubmitDisabled: false,
        }));
      }
    }

    if (name === "toExpression") {
      if (value) {
        setState((prevState) => ({
          ...prevState,
          inappExp: value,
          isInappExpChange: false,
          isEditFormSubmitDisabled: true,
        }));
      } else {
        setState((prevState) => ({
          ...prevState,
          inappExp: value,
          isInappExpChange: true,
          isEditFormSubmitDisabled: false,
        }));
      }
    }
  };

  const handlePushInputChange = (e) => {
    const { name, value } = e.target;
    console.log("event", e.target.value);

    if (name === "notifyLanguage") {
      if (value) {
        setState((prevState) => ({
          ...prevState,
          pushNotifyLang: value,
          isPushNotifyLangChange: false,
          isEditFormSubmitDisabled: true,
        }));
      } else {
        setState((prevState) => ({
          ...prevState,
          pushNotifyLang: value,
          isPushNotifyLangChange: true,
          isEditFormSubmitDisabled: false,
        }));
      }
    }

    if (name === "toExpression") {
      if (value) {
        setState((prevState) => ({
          ...prevState,
          pushExp: value,
          isPushExpChange: false,
          isEditFormSubmitDisabled: true,
        }));
      } else {
        setState((prevState) => ({
          ...prevState,
          pushExp: value,
          isPushExpChange: true,
          isEditFormSubmitDisabled: false,
        }));
      }
    }
  };

  const handleSMSChange = (e) => {
    const { name, value } = e.target;
    console.log("event", e.target.value);

    if (name === "language") {
      if (value) {
        setState((prevState) => ({
          ...prevState,
          language: value,
          isLangChange: false,
          isEditContentDetailDisbaled: true,
        }));
      } else {
        setState((prevState) => ({
          ...prevState,
          isLangChange: true,
          language: value,
          isEditContentDetailDisbaled: false,
        }));
      }
    }

    if (name === "content") {
      if (value) {
        setState((prevState) => ({
          ...prevState,
          content: value,
        }));
      } else {
        setState((prevState) => ({
          ...prevState,
          content: value,
        }));
      }
    }
  };

  const handleEmailChange = (e) => {
    const { name, value } = e.target;
    console.log("event", e.target.value);

    if (name === "language") {
      if (value) {
        setState((prevState) => ({
          ...prevState,
          language: value,
          isLangChange: false,
          isEditContentDetailDisbaled: true,
        }));
      } else {
        setState((prevState) => ({
          ...prevState,
          isLangChange: true,
          language: value,
          isEditContentDetailDisbaled: false,
        }));
      }
    }

    if (name === "title") {
      if (value) {
        setState((prevState) => ({
          ...prevState,
          title: value,
        }));
      } else {
        setState((prevState) => ({
          ...prevState,
          title: value,
        }));
      }
    }
  };

  const handleEmailEditorChange = (e) => {
    const data = e.editor.getData();
    setState((prevState) => ({
      ...prevState,
      content: data,
    }));
  };

  const handleInappChange = (e) => {
    const { name, value } = e.target;
    console.log("event", e.target.value);

    if (name === "language") {
      if (value) {
        setState((prevState) => ({
          ...prevState,
          language: value,
          isLangChange: false,
          isEditContentDetailDisbaled: true,
        }));
      } else {
        setState((prevState) => ({
          ...prevState,
          isLangChange: true,
          language: value,
          isEditContentDetailDisbaled: false,
        }));
      }
    }

    if (name === "title") {
      if (value) {
        setState((prevState) => ({
          ...prevState,
          title: value,
        }));
      } else {
        setState((prevState) => ({
          ...prevState,
          title: value,
        }));
      }
    }
  };

  const handleInappEditorChange = (e) => {
    const data = e.editor.getData();
    setState((prevState) => ({
      ...prevState,
      content: data,
    }));
  };

  const handlePushChange = (e, index) => {
    const { name, value } = e.target;
    console.log("event", e.target.value);

    if (name === "language") {
      if (value) {
        setState((prevState) => ({
          ...prevState,
          language: value,
          isLangChange: false,
          isEditContentDetailDisbaled: true,
        }));
      } else {
        setState((prevState) => ({
          ...prevState,
          isLangChange: true,
          language: value,
          isEditContentDetailDisbaled: false,
        }));
      }
    }

    if (name === "title") {
      if (value) {
        setState((prevState) => ({
          ...prevState,
          title: value,
        }));
      } else {
        setState((prevState) => ({
          ...prevState,
          title: value,
        }));
      }
    }

    if (name === "content") {
      if (value) {
        setState((prevState) => ({
          ...prevState,
          content: value,
        }));
      } else {
        setState((prevState) => ({
          ...prevState,
          content: value,
        }));
      }
    }
  };

  const handleEditFormDataSubmit = () => {
    let templateArr = [];
    console.log("tempArr", state.templateData);
    if (state.templateData[0]) {
      const smsTempData = {
        mode: "sms",
        notifyLanguage: state.smsNotifyLang,
        toExpression: state.smsExp,
        contentDetails: state.smsContentDetail.map((n) => {
          delete n.isLangChange;
          return n;
        }),
      };
      templateArr.push(smsTempData);
    }
    if (state.templateData[1]) {
      const emailTempData = {
        mode: "email",
        notifyLanguage: state.emailNotifyLang,
        toExpression: state.emailExp,
        contentDetails: state.emailContentDetail.map((n) => {
          delete n.isLangChange;
          delete n.id;
          return n;
        }),
      };
      templateArr.push(emailTempData);
    }
    if (state.templateData[2]) {
      const inappTempData = {
        mode: "inapp",
        notifyLanguage: state.inappNotifyLang,
        toExpression: state.inappExp,
        contentDetails: state.inappContentDetail.map((n) => {
          delete n.isLangChange;
          return n;
        }),
      };
      templateArr.push(inappTempData);
    }
    if (state.templateData[3]) {
      const pushTempData = {
        mode: "push",
        notifyLanguage: state.pushNotifyLang,
        toExpression: state.pushExp,
        contentDetails: state.pushContentDetail.map((n) => {
          delete n.isLangChange;
          return n;
        }),
      };
      templateArr.push(pushTempData);
    }

    const finalUpdateObject = {
      eventId: state.eventId,
      code: state.code,
      type: state.type,
      name: state.name,
      description: state.description,
      rowVersion: state.rowVersion,
      template: templateArr,
    };

    console.log("finalUpdateObject", finalUpdateObject);

    apiputUrl(`/notify/templates/${selectedId}`, finalUpdateObject)
      .then((res) => {
        console.log("Result", res);

        if (`${res.data.responseCode}` === "200") {
          getSuccessUpdate();
          handleRequestClose();
          callLocalBaseURL();
          // closeEditCommission();
        }
        if (`${res.data.status}` === "500") {
          // getErrorUpdate(res.data.error);
          ippNotify.error(res.data.error);
        }
        if (`${res.data.responseStatus}` === "failure") {
          ippNotify.error(res.data.responseMessage);
        }
      })
      .catch((err) => {
        console.log("Error", err);
        // getErrorUpdate(err.data.responseMessage);
        ippNotify.error(err.data.responseMessage);
      });
  };

  return (
    <>
      <div className="row">
        <div className="row">
          <div className="col-lg-4"></div>
          <div className="col-lg-4"></div>
          <div className="col-lg-4">
            <IPPNotification />
          </div>
        </div>
        <CardBox styleName="col-md-12">
          <div className="cardBox">
            <div className="row">
              <div className="col-lg-4">
                <InputField
                  required
                  className="mb-3"
                  autoFocus
                  id="name"
                  label={
                    <IntlMessages id="notificationtempalet.master.modal.edit.felid.Name" />
                  }
                  name="name"
                  onChange={(e) => handleEditFormChange(e)}
                  value={state.name}
                  error={state.isNameChange}
                  helperText={state.isNameChange ? "Name is Required" : null}
                  fullWidth
                />
              </div>
              <div className="col-lg-4">
                <InputField
                  className="mb-3"
                  autoFocus
                  id="description"
                  //
                  label={
                    <IntlMessages id="notificationtempalet.master.modal.edit.felid.Description" />
                  }
                  name="description"
                  onChange={(e) => handleEditFormChange(e)}
                  value={state.description}
                  fullWidth
                />
              </div>
              <div className="col-lg-4">
                <InputAutocomplete
                  className="mb-4"
                  id="eventName"
                  name="eventName"
                  options={(eventData || []).map((n) => n.name)}
                  value={getEventSelected(state.eventId) || ""}
                  onChange={handleEditEventChange}
                  fullWidth
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      required
                      error={state.isEventNameChange}
                      helperText={
                        state.isEventNameChange ? "EventName is Required" : null
                      }
                      label={
                        <IntlMessages id="notificationtempalet.master.modal.edit.felid.Event" />
                      }
                      variant="outlined"
                    />
                  )}
                />
              </div>
              <div className="col-lg-4">
                <InputField
                  required
                  className="mb-3"
                  autoFocus
                  id="code"
                  label={
                    <IntlMessages id="notificationtempalet.master.modal.edit.felid.Code" />
                  }
                  name="code"
                  onChange={(e) => handleEditFormChange(e)}
                  value={state.code}
                  error={state.isCodeChange}
                  helperText={state.isCodeChange ? "Code is Required" : null}
                  fullWidth
                />
              </div>
              <div className="col-lg-4">
                <InputField
                  required
                  className="mb-3"
                  autoFocus
                  id="type"
                  label={
                    <IntlMessages id="notificationtempalet.master.modal.edit.felid.Type" />
                  }
                  name="type"
                  onChange={(e) => handleEditFormChange(e)}
                  value={state.type}
                  error={state.isTypeChange}
                  helperText={state.isTypeChange ? "Type is Required" : null}
                  fullWidth
                />
              </div>
            </div>
            <br />
            <div className="row">
              <div className="col-lg-12">
                <Box sx={{ bgcolor: "background.paper" }}>
                  <AppBar position="static">
                    <Tabs
                      value={state.tabValue}
                      onChange={handleTabChange}
                      indicatorColor="secondary"
                      textColor="inherit"
                      variant="fullWidth"
                      aria-label="full width tabs example"
                    >
                      {(state.templateData || []).map((n) => {
                        return (
                          <Tab
                            label={n.mode}
                            sx={{ width: `${state.dynamicWidth}%` }}
                          />
                        );
                      })}
                    </Tabs>
                  </AppBar>
                  {(state.templateData || []).map((n, index) => {
                    return (
                      <div
                        role="tabpanel"
                        hidden={state.tabValue !== index}
                        id={`full-width-tabpanel-${index}`}
                        aria-labelledby={`full-width-tab-${index}`}
                      >
                        {state.tabValue === index && (
                          <Box sx={{ p: 3 }}>
                            <br />
                            {getTabs(n.mode)}
                          </Box>
                        )}
                      </div>
                    );
                  })}
                </Box>
              </div>
            </div>
            <div className="row mt-5">
              <div className="col-lg-4"></div>
              <div className="col-lg-3">
                <InputCancelButton onClick={handleRequestClose} />
                <InputSubmitButton
                  onClick={(e) => handleEditFormDataSubmit(e)}
                  disabled={!state.isEditFormSubmitDisabled}
                />
              </div>
            </div>
          </div>
        </CardBox>
      </div>
    </>
  );
};

export default EditNotificationTemplate;
