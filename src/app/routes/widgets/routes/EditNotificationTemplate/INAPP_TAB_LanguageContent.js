import React, { useEffect } from "react";
import IntlMessages from "util/IntlMessages";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import localforage from "localforage";
import { TextField, FormHelperText } from "@material-ui/core";
import RemoveCircleOutlineIcon from "@material-ui/icons/RemoveCircleOutline";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import InputField from "../CommonComponents/TextField";
import { makeStyles } from "@material-ui/core/styles";
// import CKEditor from "react-ckeditor-component";

function INAPP_TAB_LanguageContent(props) {
  const [inapp_rows, setInapp_Rows] = React.useState([]);

  const { contentDetails } = props;

  useEffect(() => {
    if (contentDetails) {
      let modifyObj = (contentDetails || []).map((n) => {
        n.isLangChange = false;
        n.isTitleChange = false;
        n.isContentChange = false;
        n.id = "";
        return n;
      });
      setInapp_Rows(modifyObj);
    }
  }, [props]);

  useEffect(() => {
    localforage
      .setItem("inapp_rows", { inapp_rows, name: "contentDetails" })
      .then(function() {
        return localforage.getItem("inapp_rows");
      })
      .then(function(value) {
        // we got our value
        console.log("inapp_rows stored ", value);
      })
      .catch(function(err) {
        // we got an error
        console.log("Data store error on initial run = ", err);
      });
  }, [inapp_rows]);

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    console.log("event", e.target.value);

    if (name === "language") {
      const list = [...inapp_rows];
      if (value) {
        list[index][name] = value;
        list[index]["isLangChange"] = false;
        setInapp_Rows(list);
      } else if (!value) {
        list[index][name] = value;
        list[index]["isLangChange"] = true;
        setInapp_Rows(list);
      }
    }
    if (name === "title") {
      const list = [...inapp_rows];
      if (value) {
        list[index][name] = value;
        list[index]["isTitleChange"] = false;
        setInapp_Rows(list);
      } else if (!value) {
        list[index][name] = value;
        list[index]["isTitleChange"] = true;
        setInapp_Rows(list);
      }
    }

    if (name === "content") {
      const list = [...inapp_rows];
      if (value) {
        list[index][name] = value;
        list[index]["isContentChange"] = false;
        setInapp_Rows(list);
      } else if (!value) {
        list[index][name] = value;
        list[index]["isContentChange"] = true;
        setInapp_Rows(list);
      }
    }
  };

  // const onChange = (e, index) => {
  //   const list = [...inapp_rows];
  //   list[index]["content"] = e.editor.getData();
  //   list[index]["isContentChange"] = false;
  //   setInapp_Rows(list);
  // };

  // const onBlur = (evt) => {
  //   console.log("onBlur event called with event info: ", evt);
  // };

  // const afterPaste = (evt) => {
  //   console.log("afterPaste event called with event info: ", evt);
  // };

  const handleAddLang = () => {
    setInapp_Rows([
      ...inapp_rows,
      { isContentChange: false, isLangChange: false, isTitleChange: false },
    ]);
  };

  const handleRemoveLang = (index) => {
    const list = [...inapp_rows];
    list.splice(index, 1);
    setInapp_Rows(list);
  };

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

  return (
    <>
      <div>
        <div className="mt-2">
          <fieldset>
            <legend class="fieldLegend">Customize the Langauge Details</legend>
            <div className="row">
              {console.log("x", inapp_rows)}
              {(inapp_rows || []).map((x, i) => {
                return (
                  <>
                    <div className="col-lg-4 mt-4 ml-5">
                      <FormControl variant="outlined" className="w-100 mb-3">
                        <InputLabel id="availableLanguages">
                          Available Languages
                        </InputLabel>
                        <Select
                          error={x.isLangChange}
                          labelId="language"
                          id="language"
                          label={
                            <IntlMessages id="notificationtempalet.master.modal.edit.felid.inapp.AvailableLanguages" />
                          }
                          name="language"
                          value={x.language || ""}
                          onChange={(e) => handleChange(e, i)}
                        >
                          <MenuItem value="">
                            <em>None</em>
                          </MenuItem>
                          {(props.langData || []).map((n) => {
                            return (
                              <MenuItem value={(n.additionalData || {}).key}>
                                {(n.additionalData || {}).display}
                              </MenuItem>
                            );
                          })}
                        </Select>
                        <FormHelperText style={{ color: "red" }}>
                          {x.isLangChange ? "Language is required" : null}
                        </FormHelperText>
                      </FormControl>
                    </div>

                    <div className="col-lg-4 mt-4">
                      <InputField
                        required
                        className="mb-3"
                        autoFocus
                        id="title"
                        label={
                          <IntlMessages id="notificationtempalet.master.modal.edit.felid.inapp.AddLanguageTitle" />
                        }
                        name="title"
                        onChange={(e) => handleChange(e, i)}
                        value={x.title || ""}
                        error={x.isTitleChange}
                        helperText={
                          x.isTitleChange ? "Language Title is Required" : null
                        }
                        fullWidth
                      />
                    </div>

                    <div className="col-lg-8 mb-5 mt-0 ml-5">
                      {/* <CKEditor
                        activeClass="p10"
                        content={x.content || ""}
                        events={{
                          blur: onBlur,
                          afterPaste: afterPaste,
                          change: (e) => onChange(e, i),
                        }}
                      /> */}
                      <TextField
                        variant="outlined"
                        multiline
                        className="mb-3 p-0"
                        autoFocus
                        id="content"
                        label={
                          <IntlMessages id="notificationtempalet.master.modal.edit.felid.inapp.AddLanguageContent" />
                        }
                        inputProps={{
                          className: multiLineStyling_Classes.textarea,
                        }}
                        name="content"
                        onChange={(e) => handleChange(e, i)}
                        value={x.content || ""}
                        // helperText={
                        //   x.isContentChange
                        //     ? "Language Content is Required"
                        //     : null
                        // }
                        // error={x.isContent}
                        fullWidth
                      />
                    </div>

                    <div className="col-lg-1 mt-0 ml-5">
                      {inapp_rows.length - 1 === i && (
                        <AddCircleOutlineIcon
                          style={{
                            cursor: "pointer",
                            marginRight: "10px",
                          }}
                          onClick={handleAddLang}
                        />
                      )}
                      {inapp_rows.length !== 1 && (
                        <RemoveCircleOutlineIcon
                          style={{ cursor: "pointer" }}
                          onClick={() => handleRemoveLang(i)}
                        />
                      )}
                    </div>
                  </>
                );
              })}
            </div>
          </fieldset>
        </div>
      </div>
    </>
  );
}

INAPP_TAB_LanguageContent.propTypes = {};

export default INAPP_TAB_LanguageContent;
