import React, { useState, useEffect } from "react";
import InputCancelButton from "../CommonComponents/CancelButton";
import {
  TextField,
  Paper,
  Select,
  FormControl,
  MenuItem,
  InputLabel,
  Divider,
} from "@material-ui/core";
import CKEditor from "react-ckeditor-component";
import InputSubmitButton from "../CommonComponents/SubmitButton";
import InputResetButton from "../CommonComponents/ResetButton";
import "./root.component.css";
import localforage from "localforage";
import InputField from "../CommonComponents/TextField";
import { apigetUrl, apipostUrl } from "setup/middleware";
import { getRecordsPerPage } from "../../../../../setup/ApplicatoinConfigurations.js";
import { useDispatch } from "react-redux";
import { verifyToken } from "../../../../../actions/Auth";
import {
  IPPNotification,
  ippNotify,
} from "../CommonComponents/IPPNotification";
import IntlMessages from "util/IntlMessages";

const NewTicket = ({ handleCancel }) => {
  const [state, setState] = useState({
    name: "",
    email: "",
    mobile: "",
    topicId: "",
    content: "",
    issue: "",
    page: 1,
    limit: getRecordsPerPage(),
    isLoading: false,
    topicList: [],
    topic: "",
    dummyTopicList: [
      { id: 1, name: "FeedBack", field1: "field-1", field2: "field-2" },
      { id: 2, name: "General Enquiry", field: "field-2" },
    ],
    selectedName: "",
    selectedData: [],
  });

  useEffect(() => {
    callHelpTopic();
    callProdfileDetail();
  }, []);

  const callHelpTopic = () => {
    apigetUrl(`/ots/helpdesk/topics?limit=${state.limit}&page=${state.page}`)
      .then((res) => {
        if (res.data.responseStatus === "success") {
          setState((prevState) => ({
            ...prevState,
            topicList: res.data.dataList,
            isLoading: false,
          }));
        } else if (res.data.responseStatus === "failure") {
          ippNotify.error(res.data.responseMessage);
        } else if (res.status === 401 || res.status === 402) {
          dispatch(verifyToken());
        }
      })
      .catch((err) => {
        ippNotify.error(err.data.responseMessage);
      });
  };

  const callProdfileDetail = () => {
    apigetUrl(`/auth/login/my/profile`)
      .then((res) => {
        if (res.status === 200) {
          setState((prevState) => ({
            ...prevState,
            name: `${res.data.firstName} ${res.data.lastName}`,
            email: res.data.email,
            mobile: res.data.mobileNumber,
          }));
        }
      })
      .catch((err) => {
        ippNotify.error(err.data.responseMessage);
      });
  };

  const dispatch = useDispatch();

  const showLoader = () => {
    setTimeout(() => {
      setState((prevState) => ({
        ...prevState,
        isLoading: false,
      }));
    }, 5000);
  };

  const handleChange = (e) => {
    console.log("e", e.target.value);
    let selectedItem = [];
    const item = state.topicList.find((n) => n.topicId === e.target.value);
    selectedItem.push(item);
    console.log("e-123", selectedItem);
    const res = (selectedItem[0] || {}).formDtoList[1];
    console.log("selectedData-res", res);

    setState((prevState) => ({
      ...prevState,
      topic: e.target.value,
      topicId: e.target.value,
      // selectedName: e.target.value,
      selectedData: (res || {}).formField,
    }));
  };

  const onChange = (evt) => {
    const newContent = evt.editor.getData();
    setState((prevState) => ({
      ...prevState,
      content: newContent,
    }));
  };

  const handleIssue = (e) => {
    const { value } = e.target;
    if (value) {
      setState((prevState) => ({
        ...prevState,
        issue: value,
      }));
    } else if (!value) {
      setState((prevState) => ({
        ...prevState,
        issue: value,
      }));
    }
  };

  const handleField = (e, index) => {
    const { name, value } = e.target;
    const list = [...state.selectedData];
    list[index][name] = value;
    setState((prevState) => ({
      ...prevState,
      selectedData: list,
    }));
  };

  const handleSubmit = () => {
    // const filterItem = (state.selectedData || []).map((n) => {
    //   delete n.id;
    //   delete n.label;
    //   delete n.name;
    //   delete n.type;
    //   return n;
    // });

    const data = {
      name: state.name,
      email: state.email,
      phone: state.mobile,
      topicId: state.topicId,
      subject: state.issue,
      message: state.content,
      forms: (state.selectedData || []).map((n) => {
        delete n.id;
        delete n.label;
        delete n.name;
        delete n.type;
        return n;
      }),
    };

    console.log("data", data);
    apipostUrl(`/ots/helpdesk/ticket`, data)
      .then((res) => {
        if (res.data.responseStatus === "success") {
          ippNotify.success("Ticket is Created");
          setState((prevState) => ({
            ...prevState,
            topicId: "",
            content: "",
            issue: "",
            topic: "",
            selectedData: [],
          }));
        }
        if (res.data.responseStatus === "failure") {
          ippNotify.error(res.data.responseMessage);
        }
      })
      .catch((err) => ippNotify.error(err.data.responseMessage));
    // handleCancel();
  };

  const handleReset = () => {
    setState((prevState) => ({
      ...prevState,
      topicId: "",
      content: "",
      issue: "",
      topic: "",
      selectedData: [],
    }));
  };

  return (
    <>
      <div className="row">
        <div className="col-lg-4"></div>
        <div className="col-lg-4"></div>
        <div className="col-lg-4">
          <IPPNotification />
        </div>
      </div>
      <Paper elevation={3}>
        <div className="p-5">
          <div className="row">
            <div className="col-lg-12">
              <h1>
                <b>
                  <IntlMessages id="MyTickets.CreateTicket.Openticket" />
                </b>
              </h1>
              <p>
                <IntlMessages id="MyTickets.CreateTicket.Summary" />
              </p>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-12">
              <h3>
                <b>
                  <IntlMessages id="MyTickets.CreateTicket.Contactinformation" />
                </b>
              </h3>
              <div className="row mt-3">
                <div className="col-md-1">
                  <span>
                    <IntlMessages id="MyTickets.CreateTicket.Email" />
                  </span>
                </div>
                <div className="col-md-3">
                  <TextField
                    id="outlined-basic"
                    label="Email"
                    variant="outlined"
                    value={state.email}
                    fullWidth
                  />
                </div>
              </div>
              <br />
              <div className="row">
                <div className="col-md-1">
                  <span>
                    <IntlMessages id="MyTickets.CreateTicket.Client" />
                  </span>
                </div>
                <div className="col-md-3">
                  <TextField
                    id="outlined-basic"
                    label="Client"
                    variant="outlined"
                    value={state.name}
                    fullWidth
                  />
                </div>
              </div>
              <br />
              <div className="row">
                <div className="col-md-1">
                  <span>
                    <IntlMessages id="MyTickets.CreateTicket.MobileNo" />
                  </span>
                </div>
                <div className="col-md-3">
                  <TextField
                    id="outlined-basic"
                    label="Mobile No"
                    variant="outlined"
                    value={state.mobile}
                    fullWidth
                  />
                </div>
              </div>
            </div>
          </div>
          <Divider variant="middle" className="my-5" />
          <div className="row">
            <div className="col-md-1">
              <span>
                <IntlMessages id="MyTickets.CreateTicket.Helptopic" />
              </span>
            </div>
            <div className="col-md-3">
              <FormControl required className="w-100" variant="outlined">
                <InputLabel id="demo-simple-select-outlined-label">
                  <IntlMessages id="MyTickets.CreateTicket.Helptopic.Summary" />
                </InputLabel>
                <Select
                  labelId="demo-simple-select-outlined-label"
                  id="demo-simple-select-outlined"
                  value={state.topic}
                  // value={state.selectedName}
                  onChange={handleChange}
                  label={
                    <IntlMessages id="MyTickets.CreateTicket.Helptopic.Summary" />
                  }
                >
                  <MenuItem value="" disabled>
                    <em>
                      <IntlMessages id="MyTickets.CreateTicket.SelectHelpTopic" />
                    </em>
                  </MenuItem>
                  {state.topicList &&
                    state.topicList.map((n, i) => (
                      <MenuItem value={n.topicId} key={i}>
                        {n.topic}
                      </MenuItem>
                    ))}
                  {/* {state.dummyTopicList.map((n, i) => (
                    <MenuItem value={n.id} key={i}>
                      {n.name}
                    </MenuItem>
                  ))} */}
                </Select>
              </FormControl>
            </div>
          </div>
          <Divider variant="middle" className="my-5" />
          {/* {state.topic !== "" ? (
            <> */}
          <div>
            <div className="row">
              <div className="col-lg-12">
                <h2>
                  <b>
                    <IntlMessages id="MyTickets.CreateTicket.TicketDetails" />
                  </b>
                </h2>
                <p>
                  <IntlMessages id="MyTickets.CreateTicket.Describe" />
                </p>
              </div>
            </div>

            <div className="row">
              <div className="col-md-2">
                <span>
                  <b>
                    <IntlMessages id="MyTickets.CreateTicket.IssueSummary" />
                  </b>
                </span>
              </div>
              <div className="col-md-3">
                <InputField
                  id="issue"
                  label="Issue"
                  name="issue"
                  placeholder="Issue"
                  onChange={(e) => handleIssue(e)}
                  value={state.issue}
                  fullWidth
                />
              </div>
            </div>
            <br />
            <div className="row">
              <div className="col-md-2">
                <span>
                  <b>
                    <IntlMessages id="MyTickets.CreateTicket.IssueDetails" />
                  </b>
                </span>
              </div>
              <div className="col-md-6">
                <CKEditor
                  activeClass="p10"
                  content={state.content}
                  events={{
                    change: onChange,
                  }}
                />
              </div>
            </div>
            <br />
            {}
            {(state.selectedData || []).map((n, i) => {
              return (
                <>
                  <div className="row" key={i}>
                    <div className="col-md-2">
                      <span>
                        <b>{n.label} :</b>
                      </span>
                    </div>
                    <div className="col-md-3">
                      <InputField
                        id={n.label}
                        label={n.label}
                        name={n.name}
                        placeholder={n.label}
                        type={n.type}
                        onChange={(e) => handleField(e, i)}
                        // value={state.issue}
                        fullWidth
                      />
                    </div>
                  </div>
                  <br />
                </>
              );
            })}
          </div>
          {/* </>
          ) : null} */}

          <br />
          <div className="row mt-3">
            <div className="col-lg-4"></div>
            <InputResetButton onClick={handleReset} />
            <InputSubmitButton onClick={handleSubmit} />
            <InputCancelButton onClick={handleCancel} />
          </div>
        </div>
      </Paper>
    </>
  );
};

export default NewTicket;
