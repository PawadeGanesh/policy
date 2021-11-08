import React, { useState, useEffect } from "react";
import Checkbox from "@material-ui/core/Checkbox";
import IntlMessages from "util/IntlMessages";
import FormHelperText from "@material-ui/core/FormHelperText";
import CardBox from "./../../../../../components/CardBox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import "./master.css";
import InputSubmitButton from "../CommonComponents/SubmitButton";
import InputCancelButton from "../CommonComponents/CancelButton";
import InputField from "../CommonComponents/TextField";
import {
  IPPNotification,
  ippNotify,
} from "../CommonComponents/IPPNotification";
import { apigetUrl, apipostUrl } from "../../../../../setup/middleware";
import TreeView from "@material-ui/lab/TreeView";
import TreeItem from "@material-ui/lab/TreeItem";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import { useDispatch, useSelector } from "react-redux";
import { verifyToken } from "../../../../../actions/Auth";

const AddRoleManagement = ({
  getSuccessUpdate,
  getErrorUpdate,
  closeAddRoleManagement,
  callLocalBaseURL,
}) => {
  const [state, setState] = useState({
    roleName: "",
    description: "",
    error: "",
    errors: {},
    isactive: false,
    checkedBoxes: [],
    menuStructure: [],
    treeViewStructure: [],
  });

  const [checked, setChecked] = React.useState(false);
  const [expanded, setExpanded] = React.useState([]);
  const [selected, setSelected] = React.useState([]);
  const dispatch = useDispatch();

  //handle submit
  const handleSubmit = (e) => {
    addBackenddata();
  };

  //add data to backend
  const addBackenddata = async () => {
    let addDataObj = {
      name: state.roleName,
      description: state.description,
      roles: state.checkedBoxes,
    };
    const result = await apipostUrl(`/auth/login/roles`, addDataObj);
    if (
      result.data.responseCode === "200" ||
      result.data.responseCode === "201"
    ) {
      closeAddRoleManagement();
      getSuccessUpdate();
      callLocalBaseURL();
    } else {
      if (result.status === 401 || result.status === 402) {
        dispatch(verifyToken());
      } else {
        getErrorUpdate(result);
      }
    }
  };

  //handle role name
  const handleChangeRoleName = (e) => {
    let value = e.target.value;
    setState((prevState) => ({
      ...prevState,
      roleName: value,
    }));
  };

  //handle description
  const handleChangeDescription = (e) => {
    let value = e.target.value;
    setState((prevState) => ({
      ...prevState,
      description: value,
    }));
  };

  //on load function
  useEffect(() => {
    getMenuDetails();
  }, []);

  //display menu list
  const getMenuDetails = async () => {
    const result = await apigetUrl(`/auth/menus`);
    if (result.data.responseCode === "200") {
      setState((prevState) => ({
        ...prevState,
        menuStructure: result.data.dataList,
      }));
    }
  };

  //update checkbox state
  const updateCheckBoxState = (data) => {
    let checkBoxData = state.checkedBoxes;
    let arrayData = state.checkedBoxes;
    for (var i = 0; i < data.length; i++) {
      var unique = "Yes";
      for (var j = 0; j < checkBoxData.length; j++) {
        if (checkBoxData[j].id === data[i].id) {
          unique = "No";
        }
      }
      if (unique == "Yes") {
        arrayData.push(data[i]);
      }
    }
    setState((prevState) => ({
      ...prevState,
      checkedBoxes: arrayData,
    }));
  };

  //children filter
  const childrenDataFilter = (data, parentName) => {
    const checkedBoxesArray = [];
    data.map((item) => {
      let children = undefined;
      if (item.children && item.children.length > 0) {
        checkedBoxesArray.push({
          id: item.id,
          name: item.name,
          parent: parentName,
        });
        updateCheckBoxState(checkedBoxesArray);
        children = childrenDataFilter(item.children, item.name);
      } else {
        checkedBoxesArray.push({
          id: item.id,
          name: item.name,
          parent: parentName,
        });
        updateCheckBoxState(checkedBoxesArray);
      }
    });
  };

  //parent filter
  const parentDataFilter = (id, data) => {
    const checkedBoxesArray = [];
    const menuData = state.menuStructure;
    let parentFilter = data.filter((a) => a.name === id);
    if (parentFilter.length > 0) {
      if (parentFilter[0].parent === "") {
        checkedBoxesArray.push({
          id: parentFilter[0].id,
          name: parentFilter[0].name,
          parent: "",
        });
      } else {
        checkedBoxesArray.push({
          id: parentFilter[0].id,
          name: parentFilter[0].name,
          parent: parentFilter[0].parent,
        });
      }
      updateCheckBoxState(checkedBoxesArray);
      if ("parent" in parentFilter[0]) {
        if (parentFilter[0].parent != "") {
          parentDataFilter(parentFilter[0].parent, menuData);
        }
      }
    } else {
      data.map((item) => {
        let parentItem = undefined;
        if (item.children && item.children.length > 0) {
          parentItem = parentDataFilter(id, item.children);
        }
      });
    }
  };

  //unchecked the role
  const unCheckedRole = (id, parent) => {
    const checkedBoxes = state.checkedBoxes;
    let arrayData = [];
    if (parent != "") {
      const parentFilter = checkedBoxes.filter((a) => a.parent === parent);
      if (parentFilter.length > 0) {
        unCheckedParent(id, parentFilter, parentFilter[0].parent);
      }
    } else {
      const children = checkedBoxes.filter((a) => a.id === id);
      if (children.length > 0) {
        unCheckedChildren(children[0].name);
      }
    }
  };

  //uncheck for children
  const unCheckedChildren = (name) => {
    const checkedBoxes = state.checkedBoxes;
    let filter = checkedBoxes.filter((a) => a.parent === name);
    if (filter.length > 0) {
      for (var i = 0; i < filter.length; i++) {
        let nameData = filter[i].name;
        let childitem = checkedBoxes.filter((a) => a.parent === nameData);
        if (childitem.length > 0) {
          unCheckedChildren(nameData);
        } else {
          const index = checkedBoxes.findIndex((ch) => ch.id === filter[i].id);
          checkedBoxes.splice(index, 1);
          updateCheckBoxState(checkedBoxes);
        }
      }
      const index = checkedBoxes.findIndex((ch) => ch.name === name);
      checkedBoxes.splice(index, 1);
      updateCheckBoxState(checkedBoxes);
    } else {
      const index = checkedBoxes.findIndex((ch) => ch.name === name);
      checkedBoxes.splice(index, 1);
      updateCheckBoxState(checkedBoxes);
    }
    if (checkedBoxes.length == 1) {
      if (checkedBoxes[0].name === name) {
        checkedBoxes.splice(0, 1);
        updateCheckBoxState(checkedBoxes);
      }
    }
  };

  //uncheck for parent
  const unCheckedParent = (id, parent, parentName) => {
    const checkedBoxes = state.checkedBoxes;
    if (parent.length > 1) {
      checkforchilden(id);
      const index = checkedBoxes.findIndex((ch) => ch.id === id);
      checkedBoxes.splice(index, 1);
      updateCheckBoxState(checkedBoxes);
    } else if (parent.length == 1) {
      checkforchildloop(parentName);
      const index = checkedBoxes.findIndex((ch) => ch.id === id);
      checkedBoxes.splice(index, 1);
      updateCheckBoxState(checkedBoxes);
      let itsParent = checkforloop(parentName);
      if (itsParent != "") {
        const index = checkedBoxes.findIndex((ch) => ch.parent === itsParent);
        checkedBoxes.splice(index, 1);
        updateCheckBoxState(checkedBoxes);
      } else {
        const index = checkedBoxes.findIndex((ch) => ch.name === parentName);
        checkedBoxes.splice(index, 1);
        updateCheckBoxState(checkedBoxes);
      }
      if (checkedBoxes.length == 1) {
        const index = checkedBoxes.findIndex((ch) => ch.name === itsParent);
        checkedBoxes.splice(index, 1);
        updateCheckBoxState(checkedBoxes);
      }
    }
  };

  //check for parent loop
  const checkforloop = (parentName) => {
    const checkedBoxes = state.checkedBoxes;
    let parentData = checkedBoxes.filter((a) => a.name === parentName);
    if (parentData[0].parent != "") {
      let checkChildren = checkedBoxes.filter(
        (a) => a.parent === parentData[0].parent
      );
      if (checkChildren.length > 1) {
        return "";
      } else {
        return parentData[0].parent;
      }
    } else {
      return "";
    }
  };

  const checkforchildloop = (parentName) => {
    const checkedBoxes = state.checkedBoxes;
    let childrenitem = checkedBoxes.filter((a) => a.parent === parentName);
    if (childrenitem.length > 0) {
      let childrenData = checkedBoxes.filter(
        (a) => a.parent === childrenitem[0].name
      );
      if (childrenData.length > 0) {
        for (var i = 0; i < childrenData.length; i++) {
          let childItem = undefined;
          const index = checkedBoxes.findIndex(
            (ch) => ch.id === childrenData[i].id
          );
          checkedBoxes.splice(index, 1);
          updateCheckBoxState(checkedBoxes);
          if (i + 1 > checkedBoxes.length) {
            childItem = checkforchildloop(parentName);
          }
        }
      }
    }
  };

  const checkforchilden = (id) => {
    const checkedBoxes = state.checkedBoxes;
    let childrenitem = checkedBoxes.filter((a) => a.id === id);
    if (childrenitem.length > 0) {
      let childrenData = checkedBoxes.filter(
        (a) => a.parent === childrenitem[0].name
      );
      if (childrenData.length > 0) {
        for (var i = 0; i < childrenData.length; i++) {
          let childItem = undefined;
          const index = checkedBoxes.findIndex(
            (ch) => ch.id === childrenData[i].id
          );
          checkedBoxes.splice(index, 1);
          updateCheckBoxState(checkedBoxes);
          if (i + 1 > checkedBoxes.length) {
            childItem = checkforchildloop(id);
          }
        }
      }
    }
  };
  //handle check box
  const handleCheckbox = (e, s) => {
    const checkedBoxes = state.checkedBoxes;
    if (e.target.checked) {
      if ("children" in s) {
        if ("parent" in s) {
          let menudata = state.menuStructure;
          let parentitem = menudata.filter((a) => a.name === s.parent);
          if (parentitem.length > 0) {
            checkedBoxes.push({
              id: parentitem[0].id,
              name: parentitem[0].name,
              parent: parentitem[0].parent,
            });
            updateCheckBoxState(checkedBoxes);
          }
        }
        let children = undefined;
        if (s.children && s.children.length > 0) {
          checkedBoxes.push({ id: s.id, name: s.name, parent: s.parent });
          updateCheckBoxState(checkedBoxes);
          children = childrenDataFilter(s.children, s.name);
        } else {
          checkedBoxes.push({ id: s.id, name: s.name, parent: "" });
          updateCheckBoxState(checkedBoxes);
        }
      } else if ("parent" in s) {
        let parentId = s.parent;
        if (parentId != "") {
          checkedBoxes.push({ id: s.id, name: s.name, parent: parentId });
          updateCheckBoxState(checkedBoxes);
          parentDataFilter(parentId, state.menuStructure);
        } else {
          checkedBoxes.push({ id: s.id, name: s.name, parent: "" });
          updateCheckBoxState(checkedBoxes);
        }
      }
    } else {
      unCheckedRole(s.id, s.parent);
    }
  };

  //on label click collapes
  const preventLabelExpand = (event) => {
    event.preventDefault();
  };

  //handle toggle
  const handleToggle = (event, nodeIds) => {
    setExpanded(nodeIds);
  };

  //handle toggle
  const handleSelect = (event, nodeIds) => {
    setSelected(nodeIds);
  };

  //tree item
  const getTreeItemsFromData = (treeItems) => {
    return treeItems.map((treeItemData) => {
      let children = undefined;
      if (treeItemData.children && treeItemData.children.length > 0) {
        children = getTreeItemsFromData(treeItemData.children);
      }
      return (
        <>
          <TreeItem
            onLabelClick={(event) => preventLabelExpand(event)}
            key={treeItemData.id}
            nodeId={treeItemData.id}
            children={children}
            label={
              <div>
                <FormControlLabel
                  label={<IntlMessages id={treeItemData.displayKey} />}
                  control={
                    <Checkbox
                      onChange={(event) => handleCheckbox(event, treeItemData)}
                      checked={state.checkedBoxes.find(
                        (ch) => ch.id === treeItemData.id
                      )}
                      value={treeItemData.id}
                    />
                  }
                />
              </div>
            }
          ></TreeItem>
        </>
      );
    });
  };

  //tree view
  const DataTreeView = ({ treeItems }) => {
    return (
      <TreeView
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
        expanded={expanded}
        selected={selected}
        onNodeToggle={handleToggle}
        onNodeSelect={handleSelect}
      >
        {getTreeItemsFromData(treeItems)}
      </TreeView>
    );
  };

  return (
    <div className="row">
      <CardBox styleName="col-md-12">
        <div className="cardBox">
          <div className="row">
            <div className="col-lg-6">
              <InputField
                required
                className="mb-4"
                autoFocus
                id="roleName"
                label={<IntlMessages id="RoleManagement.master.add.role" />}
                name="roleName"
                onChange={(e) => handleChangeRoleName(e)}
                value={state.roleName}
                fullWidth
                error={state.errors.name}
                helperText={state.errors.name}
              />
            </div>
            <div className="col-lg-6">
              <InputField
                required
                className="mb-4"
                id="description"
                label={
                  <IntlMessages id="RoleManagement.master.add.description" />
                }
                name="description"
                value={state.description}
                fullWidth
                onChange={(e) => handleChangeDescription(e)}
                error={state.errors.name}
                helperText={state.errors.name}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12">
              <h3>
                <IntlMessages id="RoleManagement.master.add.menu" />
              </h3>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12">
              <DataTreeView treeItems={state.menuStructure} />
            </div>
          </div>
          <div className="text-center">
            <div className="row">
              <br></br>
            </div>
            <InputCancelButton onClick={(e) => closeAddRoleManagement(e)} />
            <InputSubmitButton onClick={(e) => handleSubmit(e)} />
          </div>

          {state.err && (
            <FormHelperText error={Boolean(state.err)}>
              {state.err.responseMessage}
            </FormHelperText>
          )}
          <IPPNotification />
        </div>
      </CardBox>
    </div>
  );
};

export default AddRoleManagement;
