import React, { useState } from "react";
import { TextField, FormHelperText } from "@material-ui/core";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import { makeStyles } from "@material-ui/core/styles";
import IntlMessages from "util/IntlMessages";
import RemoveCircleOutlineIcon from "@material-ui/icons/RemoveCircleOutline";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import TablePagination from "@mui/material/TablePagination";
import InputField from "../CommonComponents/TextField";
import CKEditor from "react-ckeditor-component";
import Table from "@material-ui/core/Table";
import TableFooter from "@material-ui/core/TableFooter";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
// import ReactHtmlParser from "react-html-parser";
// import parse from "html-react-parser";
import EnhancedTableHead from "../CommonComponents/TableHeadComponent";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import InputAddButton from "../CommonComponents/AddButton";
import InputSubmitButton from "../CommonComponents/SubmitButton";
import InputCancelButton from "../CommonComponents/CancelButton";
import "./root.component.css";

const SMSTab = ({
  langData,
  smsLangData,
  smsData,
  smsNotifyLang,
  smsExp,
  handleSMSInputChange,
  isSMSNotifyLangChange,
  isSMSExpChange,
  handleSMSChange,
  // handleSMSEditorChange,
  formDialogOpen,
  handleFormDialogClose,
  onTableEditButtonClick,
  handleEditFormSubmit,
  isEditContentDetailDisbaled,
  language,
  title,
  content,
  isLangChange,
  onAddButtonClick,
  addFormDialogOpen,
  handleAddFormDialogClose,
  handleAddFormSubmit,
  onTableDeleteButtonClick,
}) => {
  const [state, setState] = useState({
    headCells: [
      {
        id: "language",
        isActive: false,
        label: "Language",
      },
      {
        id: "content",
        isActive: false,
        label: "Content",
      },
      {
        id: "actions",
        isActive: false,
        label: "notificationtempalet.master.tableheader.Actions.label",
      },
    ],
  });

  const multiLineStyling_UseStyles = makeStyles((theme) => ({
    textarea: {
      resize: "both",
      width: "570px",
    },
  }));

  const multiLineStyling_Classes = multiLineStyling_UseStyles();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <>
      <Dialog
        maxWidth="sm"
        open={addFormDialogOpen}
        onClose={handleAddFormDialogClose}
      >
        <DialogTitle>Add Language Detail</DialogTitle>

        <DialogContent>
          <div className="row">
            <div className="col-lg-12 mt-3">
              <FormControl variant="outlined" className="w-100 mb-3" required>
                <InputLabel id="availableLanguages">
                  Available Languages
                </InputLabel>
                <Select
                  error={isLangChange}
                  labelId="language"
                  id="language"
                  label={
                    <IntlMessages id="notificationtempalet.master.modal.edit.felid.push.AvailableLanguages" />
                  }
                  name="language"
                  value={language || ""}
                  onChange={(e) => handleSMSChange(e)}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {(langData || []).map((n) => {
                    return (
                      <MenuItem value={(n.additionalData || {}).key}>
                        {(n.additionalData || {}).display}
                      </MenuItem>
                    );
                  })}
                </Select>
                <FormHelperText style={{ color: "red" }}>
                  {isLangChange ? "Language is required" : null}
                </FormHelperText>
              </FormControl>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-12 mt-3">
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
                onChange={(e) => handleSMSChange(e)}
                value={content || ""}
                fullWidth
              />
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <InputCancelButton onClick={(e) => handleAddFormDialogClose(e)} />

          <InputSubmitButton
            onClick={(e) => handleAddFormSubmit(e, "sms")}
            disabled={!isEditContentDetailDisbaled}
          />
        </DialogActions>
      </Dialog>
      <Dialog
        maxWidth="sm"
        open={formDialogOpen}
        onClose={handleFormDialogClose}
      >
        <DialogTitle>Edit Language Detail</DialogTitle>

        <DialogContent>
          <div className="row">
            <div className="col-lg-12 mt-3">
              <FormControl variant="outlined" className="w-100 mb-3" required>
                <InputLabel id="availableLanguages">
                  Available Languages
                </InputLabel>
                <Select
                  error={isLangChange}
                  labelId="language"
                  id="language"
                  label={
                    <IntlMessages id="notificationtempalet.master.modal.edit.felid.push.AvailableLanguages" />
                  }
                  name="language"
                  value={language || ""}
                  onChange={(e) => handleSMSChange(e)}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {(smsLangData || []).map((n) => {
                    return (
                      <MenuItem value={(n.additionalData || {}).key}>
                        {(n.additionalData || {}).display}
                      </MenuItem>
                    );
                  })}
                </Select>
                <FormHelperText style={{ color: "red" }}>
                  {isLangChange ? "Language is required" : null}
                </FormHelperText>
              </FormControl>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-12 mt-3">
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
                onChange={(e) => handleSMSChange(e)}
                value={content || ""}
                fullWidth
              />
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <InputCancelButton onClick={(e) => handleFormDialogClose(e)} />

          <InputSubmitButton
            onClick={(e) => handleEditFormSubmit(e, "sms")}
            disabled={!isEditContentDetailDisbaled}
          />
        </DialogActions>
      </Dialog>
      <div className="row">
        <div className="col-lg-4">
          <InputField
            required
            className="mb-3"
            autoFocus
            id="notifyLanguage"
            label={
              <IntlMessages id="notificationtempalet.master.modal.edit.felid.sms.NotifyLanguage" />
            }
            name="notifyLanguage"
            onChange={(e) => handleSMSInputChange(e)}
            value={smsNotifyLang || ""}
            error={isSMSNotifyLangChange}
            helperText={
              isSMSNotifyLangChange ? "NotifyLanguage is Required" : null
            }
            fullWidth
          />
        </div>
        <div className="col-lg-4">
          <InputField
            required
            className="mb-3"
            autoFocus
            id="toExpression"
            label={
              <IntlMessages id="notificationtempalet.master.modal.edit.felid.sms.ToExpression" />
            }
            name="toExpression"
            onChange={(e) => handleSMSInputChange(e)}
            value={smsExp || ""}
            error={isSMSExpChange}
            helperText={isSMSExpChange ? "Expression is Required" : null}
            fullWidth
          />
        </div>
      </div>
      <div className="mt-2">
        <fieldset>
          <legend class="fieldLegend">Customize the Langauge Details</legend>{" "}
          <div className="row">
            <div className="col-lg-10"></div>
            <div className="col-lg-2">
              <InputAddButton
                // style={{ float: "right" }}
                onClick={onAddButtonClick}
              ></InputAddButton>
            </div>
          </div>
          <div className="flex-auto p-3">
            <div
              className="table-responsive-material"
              style={{ overflow: "hidden" }}
            >
              <Table>
                <EnhancedTableHead headCell={state.headCells} />
                <TableBody>
                  {console.log("sms-checking", smsData)}
                  {(smsData || [])
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((n) => {
                      return (
                        <>
                          <TableRow key={n.id}>
                            <TableCell>{n.language}</TableCell>
                            <TableCell>{n.content}</TableCell>
                            <TableCell padding="none">
                              <Tooltip
                                title={
                                  <IntlMessages id="NotificationTemplate.Tooltip.Edit" />
                                }
                              >
                                <IconButton
                                  id={n.id}
                                  onClick={(e) =>
                                    onTableEditButtonClick(e, n.id, "sms")
                                  }
                                >
                                  <EditIcon color="primary" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip
                                title={
                                  <IntlMessages id="NotificationTemplate.Tooltip.Delete" />
                                }
                              >
                                <IconButton
                                  style={{ marginLeft: "-10px" }}
                                  id={n.id}
                                  onClick={(e) =>
                                    onTableDeleteButtonClick(e, n.id, "sms")
                                  }
                                >
                                  <DeleteIcon color="secondary" />
                                </IconButton>
                              </Tooltip>
                            </TableCell>
                          </TableRow>
                        </>
                      );
                    })}
                </TableBody>
              </Table>
              <div className="row">
                <div className="col-lg-7"></div>
                <div className="col-lg-5">
                  <TableFooter>
                    <TableRow>
                      <TablePagination
                        rowsPerPageOptions={[1, 2, 5]}
                        component="div"
                        count={smsData.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                      />
                    </TableRow>
                  </TableFooter>
                </div>
              </div>
            </div>
          </div>
        </fieldset>
      </div>
    </>
  );
};

export default SMSTab;
