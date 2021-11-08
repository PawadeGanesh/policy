import React from "react";
import moment from "moment";
import Paper from "@material-ui/core/Paper";

const WithIconTimeLineItem = ({ styleName, color, timeLine, children }) => {
  const { when, who, description } = timeLine;
  return (
    <>
      <Paper elevation={3}>
        <div className={`timeline-item timeline-time-item ${styleName}`}>
          {styleName === "timeline-inverted" ? (
            <div className="timeline-time" style={{ marginRight: "-50px" }}>
              <b>{moment(when).format("Do MMMM, YYYY hh:mm:ss")}</b>
            </div>
          ) : (
            <div className="timeline-time" style={{ marginLeft: "-50px" }}>
              <b>{moment(when).format("Do MMMM, YYYY hh:mm:ss")}</b>
            </div>
          )}

          <div className={`timeline-badge bg-${color}`}>{children}</div>
          <div className="timeline-panel">
            <h4 className={`timeline-tile text-${color}`}>
              <b>{who}</b>
            </h4>
            <p>{description}</p>
          </div>
        </div>
      </Paper>
    </>
  );
};
export default WithIconTimeLineItem;
