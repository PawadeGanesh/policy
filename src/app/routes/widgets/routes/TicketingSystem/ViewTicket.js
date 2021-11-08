import React, { useState, useEffect, useRef } from "react";
import IntlMessages from "util/IntlMessages";
import FormHelperText from "@material-ui/core/FormHelperText";
import CardBox from "./../../../../../components/CardBox";
import "./master.css";
import InputSubmitButton from "../CommonComponents/SubmitButton";
import InputCancelButton from "../CommonComponents/CancelButton";
import {
  IPPNotification,
  ippNotify,
} from "../CommonComponents/IPPNotification";
import { apigetUrl, apipostUrl } from "../../../../../setup/middleware";
import CKEditor from "react-ckeditor-component";
import { useSelector } from "react-redux";
import moment from "moment";

const ViewTicket = ({ closeViewTicket, callLocalBaseURL, selectedId }) => {
  const { authUser } = useSelector(({ auth }) => auth);
  let data = authUser.userDetails;
  let user = data;
  let FullName = user.fullName;
  let FirstName = user.firstName;
  let userString = user.username;

  //state
  const [state, setState] = useState({
    Ticketstatus: 0,
    Name: "",
    Department: "",
    Email: "",
    CreatedDate: "",
    Phonenumber: 0,
    Subject: "",
    Summary: "",
    TicketNo: "",
    TicketID: 0,
    DataMessage: [],
    isSubmitButtonDisabled: false,
  });

  const textContent = "";
  const [content, setContent] = useState(textContent);
  const [TicketMessage, setTicketMessage] = useState();

  //on change chat window
  const onChangeChatWindow = (evt) => {
    const newContent = evt.editor.getData();
    setContent(newContent);
  };

  const onBlur = (evt) => {};

  const afterPaste = (evt) => {};

  useEffect(() => {
    //healthTopic()
    getTicketData();
  }, []);

  //get ticketdata
  const getTicketData = async () => {
    const result = await apigetUrl(`/ots/helpdesk/ticket/${selectedId}`);
    if (result.data.responseCode === "200") {
      let mesesageData = result.data.messages;

      let MsgArray = [];
      for (var i = 0; i < mesesageData.length; i++) {
        if (
          mesesageData[i].userName.toLowerCase() === FullName.toLowerCase() ||
          mesesageData[i].userName.toLowerCase() === FirstName.toLowerCase() ||
          mesesageData[i].userName.toLowerCase() === userString.toLowerCase()
        ) {
          //let currentDate = new Date(mesesageData[i].created)
          const dateFormate = moment(mesesageData[i].created).format(
            "ddd MMM DD yyyy HH:mm"
          );
          let json = {
            body: mesesageData[i].message,
            created: dateFormate,
            poster: mesesageData[i].userName,
            userId: mesesageData[i].userId,
            Type: "Sender",
          };
          MsgArray.push(json);
        } else {
          //let currentDate = new Date(mesesageData[i].created)
          const dateFormate = moment(mesesageData[i].created).format(
            "ddd MMM DD yyyy HH:mm"
          );
          let json = {
            body: mesesageData[i].message,
            created: dateFormate,
            poster: mesesageData[i].userName,
            userId: mesesageData[i].userId,
            Type: "Receiver",
          };
          MsgArray.push(json);
        }
      }
      setState((prevState) => ({
        ...prevState,
        DataMessage: MsgArray,
        Ticketstatus: result.data.statusId,
        Name: result.data.name,
        Department: result.data.department,
        Email: result.data.email,
        CreatedDate: result.data.updated,
        Phonenumber: 0,
        Subject: result.data.subject,
        Summary: result.data.topic,
        TicketNo: result.data.number,
      }));

      setTicketMessage(MsgArray);
    } else {
      ippNotify.error(result.data.responseMessage);
    }
  };

  //status name
  const statusName = (status) => {
    switch (status) {
      case 1:
        return "Open";
      case 2:
        return "Resolved";
      case 3:
        return "Closed";
      case 4:
        return "Archived";
      case 5:
        return "Deleted";
    }
  };

  //status color
  const statusColor = (status) => {
    switch (status) {
      case 1:
        return "red";
      case 2:
        return "orange";
      case 3:
        return "green";
      case 4:
        return "grey";
      case 5:
        return "red";
    }
  };

  //submit comment in chat window
  const handleSubmit = async () => {
    let Payload = {
      ticketId: selectedId,
      title: state.Subject,
      message: content,
      created: new Date(),
    };

    const result = await apipostUrl(`/ots/helpdesk/comment`, Payload);
    if (result.data.responseCode === "200") {
      ippNotify.success("Successfully New Comment is Added");
      getTicketData();
      setContent("");
    } else {
      ippNotify.error(result.data.responseMessage);
    }
  };

  return (
    <div className="row">
      <CardBox styleName="col-md-12">
        <div className="cardBox">
          <div className="row">
            <div className="col-sm-12">
              <div className="row">
                <div className="col-sm-12">
                  <h1>
                    <b>
                      <IntlMessages id="MyTickets.ViewTicket.TicketNo" />
                      {state.TicketNo}
                    </b>
                  </h1>
                </div>
              </div>
              <br></br>
              <div className="step0">
                <div className="row">
                  <div className="col-sm-2">
                    <b>
                      <IntlMessages id="MyTickets.ViewTicket.Status" />
                    </b>
                  </div>
                  <div className="col-sm-2">
                    <span style={{ color: statusColor(state.Ticketstatus) }}>
                      {statusName(state.Ticketstatus)}
                    </span>
                  </div>
                  <div className="col-sm-2">
                    <b>
                      <IntlMessages id="MyTickets.ViewTicket.Name" />
                    </b>
                  </div>
                  <div className="col-sm-2">{state.Name}</div>
                  <div className="col-sm-2">
                    <b>
                      <IntlMessages id="MyTickets.ViewTicket.Department" />
                    </b>
                  </div>
                  <div className="col-sm-2">{state.Department}</div>
                </div>
                <br></br>

                <div className="row">
                  <div className="col-sm-2">
                    <b>
                      <IntlMessages id="MyTickets.ViewTicket.Email" />
                    </b>
                  </div>
                  <div className="col-sm-2">{state.Email}</div>
                  <div className="col-sm-2">
                    <b>
                      <IntlMessages id="MyTickets.ViewTicket.Date" />
                    </b>
                  </div>
                  <div className="col-sm-2">{state.CreatedDate}</div>
                  <div className="col-sm-2">
                    <b>
                      <IntlMessages id="MyTickets.ViewTicket.Phone" />
                    </b>
                  </div>
                  <div className="col-sm-2">{state.Phonenumber}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardBox>
      <br></br>

      <CardBox styleName="col-md-12">
        <div className="cardBox">
          <div className="row">
            <div className="col-sm-12">
              <div div className="row">
                <div className="col-sm-12">
                  <h1>
                    <b>
                      <IntlMessages id="MyTickets.ViewTicket.TicketSummary" />
                    </b>
                  </h1>
                </div>
              </div>
              <br></br>
              <div className="row">
                <div className="col-sm-1">
                  <b>
                    <IntlMessages id="MyTickets.ViewTicket.Subject" />
                  </b>
                </div>
                <div className="col-sm-11">{state.Subject}</div>
              </div>
              <br></br>
              <div className="row">
                <div className="col-sm-1">
                  <b>
                    <IntlMessages id="MyTickets.ViewTicket.Summary" />
                  </b>
                </div>
                <div className="col-sm-11">{state.Summary}</div>
              </div>
            </div>
          </div>
        </div>
      </CardBox>
      <br></br>

      <CardBox styleName="col-md-12">
        <div className="cardBox">
          <div div className="row">
            <div className="col-sm-12">
              <h1>
                <b>
                  <IntlMessages id="MyTickets.ViewTicket.TicketResponse" />
                </b>
              </h1>
            </div>
          </div>
          <br></br>
          <div className="row">
            <div className="col-sm-12">
              <div className="scrollBar">
                {state.DataMessage.map((n) => {
                  return (
                    <>
                      {n.Type === "Receiver" ? (
                        <>
                          <div className="d-flex flex-nowrap chat-item flex-row-reverse">
                            <img
                              className="rounded-circle avatar size-40 align-self-end"
                              src="https://via.placeholder.com/150x150"
                              alt="IT Support Team"
                            />
                            <div className="bubble jambo-card">
                              <span className="ReceiverName">{n.poster}</span>
                              <br></br>

                              <div
                                className="message"
                                dangerouslySetInnerHTML={{ __html: n.body }}
                              ></div>
                              <div className="time text-muted text-right mt-2">
                                {n.created}
                              </div>
                            </div>
                          </div>
                        </>
                      ) : n.Type === "Sender" ? (
                        <>
                          <div className="d-flex flex-nowrap chat-item">
                            <img
                              className="rounded-circle avatar size-40 align-self-end"
                              src="https://via.placeholder.com/150x150"
                              alt=""
                            />
                            <div className="bubble">
                              <span className="SenderName">{n.poster}</span>
                              <br></br>
                              <div
                                className="message"
                                dangerouslySetInnerHTML={{ __html: n.body }}
                              ></div>
                              <div className="time text-muted text-right mt-2">
                                {n.created}
                              </div>
                            </div>
                          </div>
                        </>
                      ) : null}
                    </>
                  );
                })}
              </div>
              <br></br>
              <br></br>
              <CKEditor
                activeClass="p10"
                content={content}
                events={{
                  blur: onBlur,
                  afterPaste: afterPaste,
                  change: onChangeChatWindow,
                }}
              />
            </div>
          </div>

          <div className="text-center">
            <div className="row">
              <br></br>
            </div>
            <InputCancelButton onClick={(e) => closeViewTicket(e)} />
            <InputSubmitButton
              onClick={(e) => handleSubmit(e)}
              disabled={state.isSubmitButtonDisabled}
            />
          </div>

          {state.err && (
            <FormHelperText error={Boolean(state.err)}>
              {state.err.responseMessage}
            </FormHelperText>
          )}
          <IPPNotification />
        </div>
      </CardBox>
    </div>
  );
};

export default ViewTicket;
