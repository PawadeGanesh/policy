import React, { useEffect } from "react";
import { TextField, FormHelperText } from "@material-ui/core";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import { makeStyles } from "@material-ui/core/styles";
import localforage from "localforage";
import IntlMessages from "util/IntlMessages";
import RemoveCircleOutlineIcon from "@material-ui/icons/RemoveCircleOutline";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";

function SMS_TAB_Language_Content(props) {
  const [sms_rows, setSms_Rows] = React.useState([]);

  const { contentDetails } = props;

  useEffect(() => {
    if (contentDetails) {
      let modifyObj = (contentDetails || []).map((n) => {
        n.isLangChange = false;
        n.isContentChange = false;
        return n;
      });
      console.log("modifyObj", modifyObj);
      setSms_Rows(modifyObj);
    }
  }, [props]);

  useEffect(() => {
    localforage
      .setItem("sms_rows", { sms_rows, name: "contentDetails" })
      .then(function() {
        return localforage.getItem("sms_rows");
      })
      .then(function(value) {
        // we got our value
        console.log("sms_rows stored ", value);
      })
      .catch(function(err) {
        // we got an error
        console.log("Data store error on initial run = ", err);
      });
  }, [sms_rows]);

  const multiLineStyling_UseStyles = makeStyles((theme) => ({
    textarea: {
      resize: "both",
    },
  }));

  const multiLineStyling_Classes = multiLineStyling_UseStyles();

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    console.log("event", e.target.value);

    if (name === "language") {
      const list = [...sms_rows];
      if (value) {
        list[index][name] = value;
        list[index]["isLangChange"] = false;
        setSms_Rows(list);
      } else {
        list[index][name] = value;
        list[index]["isLangChange"] = true;
        setSms_Rows(list);
      }
    }
    if (name === "content") {
      const list = [...sms_rows];
      if (value) {
        list[index][name] = value;
        list[index]["isContentChange"] = false;
        setSms_Rows(list);
      } else if (!value) {
        list[index][name] = value;
        list[index]["isContentChange"] = true;
        setSms_Rows(list);
      }
    }
  };

  const handleAddLang = () => {
    setSms_Rows([
      ...sms_rows,
      { isContentChange: false, isLangChange: false, title: null },
    ]);
  };

  const handleRemoveLang = (index) => {
    const list = [...sms_rows];
    list.splice(index, 1);
    setSms_Rows(list);
  };

  return (
    <div>
      <div className="mt-2">
        <fieldset>
          <legend class="fieldLegend">Customize the Langauge Details</legend>
          <div className="row">
            {console.log("sms-checking", sms_rows)}
            {(sms_rows || []).map((x, i) => {
              return (
                <>
                  <div className="col-lg-3 mt-3 ml-5">
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
                          <IntlMessages id="notificationtempalet.master.modal.edit.felid.sms.AvailableLanguages" />
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

                  <div className="col-lg-5 mt-3 ml-5">
                    <TextField
                      variant="outlined"
                      multiline
                      className="mb-3 p-0"
                      autoFocus
                      id="content"
                      label={
                        <IntlMessages id="notificationtempalet.master.modal.edit.felid.sms.AddLanguageContent" />
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

                  <div className="col-lg-2 mt-3 ml-5">
                    {sms_rows.length - 1 === i && (
                      <AddCircleOutlineIcon
                        style={{
                          cursor: "pointer",
                          marginRight: "10px",
                        }}
                        onClick={handleAddLang}
                      />
                    )}
                    {sms_rows.length !== 1 && (
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
  );
}

SMS_TAB_Language_Content.propTypes = {};

export default SMS_TAB_Language_Content;
