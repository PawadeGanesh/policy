import React, { useState } from "react";
import { FormHelperText } from "@material-ui/core";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import { makeStyles } from "@material-ui/core/styles";
import IntlMessages from "util/IntlMessages";
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
import EnhancedTableHead from "../CommonComponents/TableHeadComponent";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import InputAddButton from "../CommonComponents/AddButton";
import InputSubmitButton from "../CommonComponents/SubmitButton";
import InputCancelButton from "../CommonComponents/CancelButton";
import "./root.component.css";

const EmailTab = ({
  langData,
  emailLangData,
  emailData,
  emailNotifyLang,
  emailExp,
  handleEmailInputChange,
  isEmailNotifyLangChange,
  isEmailExpChange,
  handleEmailChange,
  handleEmailEditorChange,
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
  console.log("langData", langData);
  console.log("emailLangData", emailLangData);
  const [state, setState] = useState({
    headCells: [
      {
        id: "language",
        isActive: false,
        label: "Language",
      },
      {
        id: "title",
        isActive: false,
        label: "Title",
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

  const options = {
    replace: (domNode) => {
      if (domNode.attribs && domNode.attribs.class === "remove") {
        return <></>;
      }
    },
  };

  const useStyles2 = makeStyles((theme) => ({
    button: {
      margin: theme.spacing(1),
    },
  }));

  const classes_AddButton = useStyles2();

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
            <div className="col-lg-6 mt-3">
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
                  onChange={(e) => handleEmailChange(e)}
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

            <div className="col-lg-6 mt-3">
              <InputField
                required
                className="mb-3"
                autoFocus
                id="title"
                label={
                  <IntlMessages id="notificationtempalet.master.modal.edit.felid.push.AddLanguageTitle" />
                }
                name="title"
                onChange={(e) => handleEmailChange(e)}
                value={title || ""}
                // error={x.isTitleChange}
                // helperText={
                //   x.isTitleChange ? "Language Title is Required" : null
                // }
                fullWidth
              />
            </div>

            <div className="col-lg-12 mt-3">
              <CKEditor
                content={content || ""}
                events={{
                  change: handleEmailEditorChange,
                }}
              />
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <InputCancelButton onClick={(e) => handleAddFormDialogClose(e)} />

          <InputSubmitButton
            onClick={(e) => handleAddFormSubmit(e, "email")}
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
            <div className="col-lg-6 mt-3">
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
                  onChange={(e) => handleEmailChange(e)}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {(emailLangData || []).map((n) => {
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

            <div className="col-lg-6 mt-3">
              <InputField
                required
                className="mb-3"
                autoFocus
                id="title"
                label={
                  <IntlMessages id="notificationtempalet.master.modal.edit.felid.push.AddLanguageTitle" />
                }
                name="title"
                onChange={(e) => handleEmailChange(e)}
                value={title || ""}
                fullWidth
              />
            </div>

            <div className="col-lg-12 mt-3">
              <CKEditor
                content={content || ""}
                events={{
                  change: handleEmailEditorChange,
                }}
              />
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <InputCancelButton onClick={(e) => handleFormDialogClose(e)} />

          <InputSubmitButton
            onClick={(e) => handleEditFormSubmit(e, "email")}
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
              <IntlMessages id="notificationtempalet.master.modal.edit.felid.email.NotifyLanguage" />
            }
            name="notifyLanguage"
            onChange={(e) => handleEmailInputChange(e)}
            value={emailNotifyLang || ""}
            error={isEmailNotifyLangChange}
            helperText={
              isEmailNotifyLangChange ? "NotifyLanguage is Required" : null
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
              <IntlMessages id="notificationtempalet.master.modal.edit.felid.email.ToExpression" />
            }
            name="toExpression"
            onChange={(e) => handleEmailInputChange(e)}
            value={emailExp || ""}
            error={isEmailExpChange}
            helperText={isEmailExpChange ? "Expression is Required" : null}
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
                  {console.log("email-checking", emailData)}
                  {(emailData || [])
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((n) => {
                      return (
                        <>
                          <TableRow key={n.id}>
                            <TableCell>{n.language}</TableCell>
                            <TableCell>{n.title}</TableCell>
                            {/* <TableCell>{n.content}</TableCell> */}
                            <TableCell
                              dangerouslySetInnerHTML={{ __html: n.content }}
                            />
                            <TableCell padding="none">
                              <Tooltip
                                title={
                                  <IntlMessages id="NotificationTemplate.Tooltip.Edit" />
                                }
                              >
                                <IconButton
                                  id={n.id}
                                  onClick={(e) =>
                                    onTableEditButtonClick(e, n.id, "email")
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
                                    onTableDeleteButtonClick(e, n.id, "email")
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
                        count={emailData.length}
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

export default EmailTab;
