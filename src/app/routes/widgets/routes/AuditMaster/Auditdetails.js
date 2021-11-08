/* eslint-disable react/prop-types */
import React from "react";

function App(props) {
  return (
    <div className="App">
      <table className="audit-table">
        <tr>
          <th>Data Before</th>
          <th>Data After</th>
          <th>Additional Data</th>
        </tr>
        <tr>
          <td>{props.rowdata.additional_data}</td>
          <td>{props.rowdata.data_before}</td>
          <td>{props.rowdata.data_after}</td>
        </tr>
      </table>
    </div>
  );
}

export default App;
