import Events from "components/wall/Events";
import React, { useState } from "react";
import CKEditor from "react-ckeditor-component";

const Editor = ({ content, events }) => {
  // const [state, setState] = useState({
  //   content: "",
  // });

  // const onChange = (evt) => {
  //   const newContent = evt.editor.getData();
  //   setState((prevState) => ({
  //     ...prevState,
  //     content: newContent,
  //   }));
  // };

  // const onBlur = (evt) => {
  //   console.log("onBlur event called with event info: ", evt);
  // };

  // const afterPaste = (evt) => {
  //   console.log("afterPaste event called with event info: ", evt);
  // };

  return (
    <>
      <div className="pr-5 pb-4 pt-3" style={{ width: "90%" }}>
        <CKEditor
          className="mr-5"
          activeClass="p10"
          content={content}
          // events={{
          //   blur: onBlur,
          //   afterPaste: afterPaste,
          //   change: onChange,
          // }}
          events={events}
        />
      </div>
    </>
  );
};

export default Editor;
