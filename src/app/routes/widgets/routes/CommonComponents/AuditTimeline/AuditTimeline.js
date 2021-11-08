import React, { useState, useEffect } from "react";
import WithIconTimeLineItem from "./WithIconTimeLineItem";
import { apigetUrl } from "setup/middleware";
import { Add, Edit, Visibility, Delete } from "@material-ui/icons";
import Button from "@material-ui/core/Button";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import InfoModal from "../../Modal/Info";
import "./style.css";

const AuditTimeline = ({ closeAuditTimeline, eventId, referenceId }) => {
  console.log("eventId", eventId, referenceId);
  const [state, setState] = useState({
    data: [],
    referenceId: "",
    eventId: "",
  });

  useEffect(() => {
    apigetUrl(
      `/audit/details?page=1&limit=100&sortBy=when&sortType=desc&eventId=${eventId}&referenceId=${referenceId}`
    )
      .then((res) => {
        setState((prevState) => ({
          ...prevState,
          data: res.data.dataList,
        }));
      })
      .catch((err) => console.log("Err", err));
  }, []);

  const getIcons = (actionType) => {
    switch (actionType) {
      case 0:
        return <Add />;
      case 1:
        return <Edit />;
      case 2:
        return <Visibility />;
      case 3:
        return <Delete />;
    }
  };

  const getColors = (actionType) => {
    switch (actionType) {
      case 0:
        return "darkblue";
      case 1:
        return "purple";
      case 2:
        return "green";
      case 3:
        return "pink";
    }
  };

  return (
    <>
      <div>
        <Button
          variant="contained"
          color="secondary"
          startIcon={<ChevronLeftIcon fontSize="default" />}
          size="large"
          onClick={closeAuditTimeline}
        >
          go back
        </Button>
        {state.data.length === 0 ? (
          <div className="timeline">
            <InfoModal message="Your Query did not match any result" />
          </div>
        ) : (
          <div className="timeline-section timeline-center clearfix animated slideInUpTiny animation-duration-3">
            {(state.data || []).map((n, index) => {
              return (
                <>
                  <WithIconTimeLineItem
                    key={n.id}
                    timeLine={n}
                    color={getColors(n.actionType)}
                    styleName={index % 2 === 0 ? "" : "timeline-inverted"}
                  >
                    {getIcons(n.actionType)}
                  </WithIconTimeLineItem>
                </>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default AuditTimeline;
