import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import AddToPhotosIcon from "@material-ui/icons/AddToPhotos";
import CollectionsIcon from "@material-ui/icons/Collections";
import NewTicket from "./NewTicket";
import CheckTicketStatus from "./CheckTicketStatus";
import Paper from "@material-ui/core/Paper";
import IntlMessages from "util/IntlMessages";

const TicketSystem = () => {
  //state
  const [state, setState] = useState({
    newTicket: false,
    checkStatus: false,
  });

  //create ticket
  const handleTicket = () => {
    setState((prevState) => ({
      ...prevState,
      newTicket: true,
    }));
  };

  //view ticket status
  const handleStatus = () => {
    setState((prevState) => ({
      ...prevState,
      checkStatus: true,
    }));
  };

  //cancel
  const handleCancel = () => {
    setState((prevState) => ({
      ...prevState,
      checkStatus: false,
      newTicket: false,
    }));
  };

  //go back
  const onGoBackClick = () => {
    setState((prevState) => ({
      ...prevState,
      checkStatus: false,
    }));
  };

  return (
    <>
      {state.newTicket ? (
        <NewTicket handleCancel={handleCancel} />
      ) : state.checkStatus ? (
        <CheckTicketStatus onGoBackClick={onGoBackClick} />
      ) : (
        <>
          <Paper elevation={3}>
            <div className="p-5">
              <div className="row">
                <div className="col-lg-12">
                  <h1>
                    <b>
                      <IntlMessages id="MyTickets.MainPage.Title" />{" "}
                    </b>
                  </h1>

                  <p>
                    <IntlMessages id="MyTickets.MainPage.Summary" />
                  </p>
                </div>
              </div>
              <br />
              <div className="row">
                <div className="col-lg-6">
                  <div className="row">
                    <div className="col-md-1 mt-3">
                      <AddToPhotosIcon color="primary" fontSize="large" />
                    </div>
                    <div className="col-md-11">
                      <h3>
                        <b>
                          {" "}
                          <IntlMessages id="MyTickets.MainPage.Openticket.Title" />
                        </b>
                      </h3>
                      <p>
                        <IntlMessages id="MyTickets.MainPage.Openticket.Summary" />
                      </p>
                      <div>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={handleTicket}
                        >
                          <IntlMessages id="MyTickets.MainPage.Openticket.Button" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="row">
                    <div className="col-md-1 mt-3">
                      <CollectionsIcon color="secondary" fontSize="large" />
                    </div>
                    <div className="col-md-11">
                      <h3>
                        <b>
                          <IntlMessages id="MyTickets.MainPage.TicketStatus.Title" />
                        </b>
                      </h3>
                      <p>
                        <IntlMessages id="MyTickets.MainPage.TicketStatus.Summary" />
                      </p>
                      <div>
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={handleStatus}
                        >
                          <IntlMessages id="MyTickets.MainPage.TicketStatus.Button" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Paper>
        </>
      )}
    </>
  );
};

export default TicketSystem;
