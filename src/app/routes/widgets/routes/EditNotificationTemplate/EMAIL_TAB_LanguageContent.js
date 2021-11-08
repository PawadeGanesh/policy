import React, { useEffect } from "react";
import IntlMessages from "util/IntlMessages";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import { TextField, FormHelperText } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import localforage from "localforage";
import RemoveCircleOutlineIcon from "@material-ui/icons/RemoveCircleOutline";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import InputField from "../CommonComponents/TextField";
// import CKEditor from "react-ckeditor-component";

function EMAIL_TAB_LanguageContent(props) {
  const [email_rows, setEmail_Rows] = React.useState([]);

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
      setEmail_Rows(modifyObj);
    }
  }, [props]);

  useEffect(() => {
    console.log("email-checking-123", email_rows);
    console.log("email-checking-345", props.langData);
  }, [email_rows]);

  useEffect(() => {
    localforage
      .setItem("email_rows", {
        email_rows,
        name: "contentDetails",
      })
      .then(function() {
        return localforage.getItem("email_rows");
      })
      .then(function(value) {
        // we got our value
        console.log("email_rows stored ", value);
      })
      .catch(function(err) {
        // we got an error
        console.log("Data store error on initial run = ", err);
      });
  }, [email_rows]);

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    console.log("event", e.target.value);

    if (name === "language") {
      const list = [...email_rows];
      if (value) {
        list[index][name] = value;
        list[index]["isLangChange"] = false;
        setEmail_Rows(list);
      } else {
        list[index][name] = value;
        list[index]["isLangChange"] = true;
        setEmail_Rows(list);
      }
    }
    if (name === "title") {
      const list = [...email_rows];
      if (value) {
        list[index][name] = value;
        list[index]["isTitleChange"] = false;
        setEmail_Rows(list);
      } else {
        list[index][name] = value;
        list[index]["isTitleChange"] = true;
        setEmail_Rows(list);
      }
    }
    if (name === "content") {
      const list = [...email_rows];
      if (value) {
        list[index][name] = value;
        list[index]["isContentChange"] = false;
        setEmail_Rows(list);
      } else if (!value) {
        list[index][name] = value;
        list[index]["isContentChange"] = true;
        setEmail_Rows(list);
      }
    }
  };

  // const handleEditorChange = (e, index) => {
  //   const list = [...email_rows];
  //   list[index]["content"] = (e.editor || {}).getData();
  //   list[index]["isContentChange"] = false;
  //   setEmail_Rows(list);
  // };

  const handleAddLang = () => {
    setEmail_Rows([
      ...email_rows,
      { isContentChange: false, isLangChange: false, isTitleChange: false },
    ]);
  };

  const handleRemoveLang = (index) => {
    const list = [...email_rows];
    list.splice(index, 1);
    console.log("email-checking-list", list);
    setEmail_Rows(list);
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
              {console.log("email-checking", email_rows)}
              {(email_rows || []).map((x, i) => {
                return (
                  <>
                    <div className="col-lg-4 mt-4 ml-5">
                      <FormControl
                        variant="outlined"
                        className="w-100 mb-3"
                        required
                      >
                        <InputLabel id="availableLanguages">
                          Available Languages
                        </InputLabel>
                        <Select
                          error={x.isLangChange}
                          labelId="language"
                          id="language"
                          label={
                            <IntlMessages id="notificationtempalet.master.modal.edit.felid.email.AvailableLanguages" />
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
                        className="mb-3"
                        autoFocus
                        id="title"
                        label={
                          <IntlMessages id="notificationtempalet.master.modal.edit.felid.email.AddLanguageTitle" />
                        }
                        name="title"
                        onChange={(e) => handleChange(e, i)}
                        value={x.title || ""}
                        // error={x.isTitleChange}
                        // helperText={
                        //   x.isTitleChange ? "Language Title is Required" : null
                        // }
                        fullWidth
                      />
                    </div>

                    <div className="col-lg-8 mb-5 mt-0 ml-5">
                      {/* <CKEditor
                        content={(x || {}).title || ""}
                        events={{
                          change: (e) => handleEditorChange(e, i),
                        }}
                      /> */}
                      <TextField
                        variant="outlined"
                        multiline
                        className="mb-3 p-0"
                        autoFocus
                        id="content"
                        label={
                          <IntlMessages id="notificationtempalet.master.modal.edit.felid.email.AddLanguageContent" />
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
                      {email_rows.length - 1 === i && (
                        <AddCircleOutlineIcon
                          style={{
                            cursor: "pointer",
                            marginRight: "10px",
                          }}
                          onClick={handleAddLang}
                        />
                      )}
                      {email_rows.length !== 1 && (
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

EMAIL_TAB_LanguageContent.propTypes = {};

export default EMAIL_TAB_LanguageContent;
