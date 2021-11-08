import React, { useEffect } from "react";
import IntlMessages from "util/IntlMessages";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import localforage from "localforage";
import { makeStyles } from "@material-ui/core/styles";
import { TextField, FormHelperText } from "@material-ui/core";
import RemoveCircleOutlineIcon from "@material-ui/icons/RemoveCircleOutline";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import InputField from "../CommonComponents/TextField";

function PUSH_TAB_LanguageContent(props) {
  const [push_rows, setPush_Rows] = React.useState([]);

  const { contentDetails } = props;

  useEffect(() => {
    //console.log("contentDetails = ", contentDetails);
    if (contentDetails) {
      let modifyObj = (contentDetails || []).map((n) => {
        n.isLangChange = false;
        n.isTitleChange = false;
        n.isContentChange = false;
        n.id = "";
        return n;
      });
      setPush_Rows(modifyObj);
    }
  }, [props]);

  useEffect(() => {
    localforage
      .setItem("push_rows", { push_rows, name: "contentDetails" })
      .then(function() {
        return localforage.getItem("push_rows");
      })
      .then(function(value) {
        // we got our value
        // console.log("push_rows stored ", value);
      })
      .catch(function(err) {
        // we got an error
        console.log("Data store error on initial run = ", err);
      });
  }, [push_rows]);

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

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    console.log("event", e.target.value);

    if (name === "language") {
      const list = [...push_rows];
      if (value) {
        list[index][name] = value;
        list[index]["isLangChange"] = false;
        setPush_Rows(list);
      } else if (!value) {
        list[index][name] = value;
        list[index]["isLangChange"] = true;
        setPush_Rows(list);
      }
    }
    if (name === "title") {
      const list = [...push_rows];
      if (value) {
        list[index][name] = value;
        list[index]["isTitleChange"] = false;
        setPush_Rows(list);
      } else if (!value) {
        list[index][name] = value;
        list[index]["isTitleChange"] = true;
        setPush_Rows(list);
      }
    }
    if (name === "content") {
      const list = [...push_rows];
      if (value) {
        list[index][name] = value;
        list[index]["isContentChange"] = false;
        setPush_Rows(list);
      } else if (!value) {
        list[index][name] = value;
        list[index]["isContentChange"] = true;
        setPush_Rows(list);
      }
    }
  };

  const handleAddLang = () => {
    setPush_Rows([
      ...push_rows,
      { isContentChange: false, isLangChange: false, title: null },
    ]);
  };

  const handleRemoveLang = (index) => {
    const list = [...push_rows];
    list.splice(index, 1);
    setPush_Rows(list);
  };

  return (
    <>
      <div>
        <div className="mt-2">
          <fieldset>
            <legend class="fieldLegend">Customize the Langauge Details</legend>
            <div className="row">
              {console.log("x", push_rows)}
              {(push_rows || []).map((x, i) => {
                return (
                  <>
                    <div className="col-lg-2 mt-3 ml-5">
                      <FormControl variant="outlined" className="w-100 mb-3">
                        <InputLabel id="availableLanguages">
                          Available Languages
                        </InputLabel>
                        <Select
                          error={x.isLangChange}
                          labelId="language"
                          id="language"
                          label={
                            <IntlMessages id="notificationtempalet.master.modal.edit.felid.push.AvailableLanguages" />
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

                    <div className="col-lg-3 mt-3 ml-5">
                      <InputField
                        required
                        className="mb-3"
                        autoFocus
                        id="title"
                        label={
                          <IntlMessages id="notificationtempalet.master.modal.edit.felid.push.AddLanguageTitle" />
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

                    <div className="col-lg-4 mt-3 ml-5">
                      <TextField
                        variant="outlined"
                        multiline
                        className="mb-3 p-0"
                        autoFocus
                        id="content"
                        label={
                          <IntlMessages id="notificationtempalet.master.modal.edit.felid.push.AddLanguageContent" />
                        }
                        inputProps={{
                          className: multiLineStyling_Classes.textarea,
                        }}
                        name="content"
                        onChange={(e) => handleChange(e, i)}
                        value={x.content || ""}
                        helperText={
                          x.isContentChange
                            ? "Language Content is Required"
                            : null
                        }
                        error={x.isContentChange}
                        fullWidth
                      />
                    </div>

                    <div className="col-lg-1 mt-3 ml-5">
                      {push_rows.length - 1 === i && (
                        <AddCircleOutlineIcon
                          style={{
                            cursor: "pointer",
                            marginRight: "10px",
                          }}
                          onClick={handleAddLang}
                        />
                      )}
                      {push_rows.length !== 1 && (
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

PUSH_TAB_LanguageContent.propTypes = {};

export default PUSH_TAB_LanguageContent;
