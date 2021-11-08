import React, { useState, useEffect } from "react";
import { TextField } from "@material-ui/core";
import IntlMessages from "util/IntlMessages";
import InputLabel from "@material-ui/core/InputLabel";
import { makeStyles } from "@material-ui/core/styles";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import CardBox from "./../../../../../components/CardBox";
import "./root.component.css";
import InputSubmitButton from "../CommonComponents/SubmitButton";
import InputCancelButton from "../CommonComponents/CancelButton";
import InputField from "../CommonComponents/TextField";
import InputAutocomplete from "../CommonComponents/Autocomplete";
import InputSelect from "../CommonComponents/Select";
import Select from "@material-ui/core/Select";
import FormHelperText from "@material-ui/core/FormHelperText";
import "../CommonComponents/tableStyle.css";
import { apigetUrl, apiputUrl } from "../../../../../setup/middleware";
import LocationFilter from "../CommonComponents/LocationFilter";
import InputDatePicker from "../CommonComponents/DatePicker";
import EditSlabCommissionManagement from "./EditSlabCommissionManagement";
import EditRuleCommissionManagement from "./EditRuleCommissionManagement";
import moment from "moment";
import {
  IPPNotification,
  ippNotify,
} from "../CommonComponents/IPPNotification";

const EditCommissionManagement = ({
  selectedId,
  providerData,
  productData,
  handleRequestClose,
  userTypeData,
  ruleUserTypeData,
  getSuccessUpdate,
  callLocalBaseURL,
  closeEditCommission,
  paymentTypeData,
  slabData,
  rulePaymentTypeData,
}) => {
  const [state, setState] = useState({
    data: [],
    name: "",
    description: "",
    providerId: 1,
    productId: 1,
    level0: 1,
    level1: "",
    level2: "",
    level3: "",
    level4: "",
    level5: "",
    level6: "",
    endDate: null,
    startDate: null,
    isEndDateDisabled: true,
    breakupType: "",
    slabType: "",
    payType: "",
    rulePayType: "",
    isBreakUpData: false,
    ruleSlabs: [],
    ruleBreakup: [],
    dataOfLocation: [],
    isSlabActive: false,
    isRuleActive: false,
    isEditFormSubmitDisabled: false,
    providerValidate: false,
    productValidate: false,
    rulePayData: false,
    slabTypeData: false,
    payTypeData: false,
    isRulePercentageActive: false,
    isRuleFixedRateActive: false,
    isPercentageActive: false,
    isFixedRateActive: false,
    isPriceActive: false,
    isCountActive: false,
    duplicateRuleSlab: [],
    duplicateRuleSubSlab: [],
    duplicateBreakUp: [],
    isDuplicateBreakUpActive: false,
    isDuplicateRuleActive: false,
    isDuplicateRuleSubActive: false,
  });

  useEffect(() => {
    console.log("isDuplicateBreakUpActive", state.isDuplicateBreakUpActive);
  }, [state.isDuplicateBreakUpActive]);

  useEffect(() => {
    // validating slab section and name , breakup elements
    console.log("proId", state.providerValidate);
    if (state.name === "" || state.breakupType === "") {
      setState((prevState) => ({
        ...prevState,
        isEditFormSubmitDisabled: false,
      }));
    }

    if (state.breakupType === 1) {
      if (state.slabType === "" || state.payType === "") {
        setState((prevState) => ({
          ...prevState,
          isEditFormSubmitDisabled: false,
        }));
      }
      if (
        state.ruleSlabs.map((n) => {
          n.slabBreakup.map((m) => {
            if (state.isPercentageActive) {
              if (
                m.isPercentageValidate ||
                m.percentage === "" ||
                m.isUserTypeValidate ||
                m.userType === null ||
                m.isPremiumThresholdValidate ||
                m.premiumThreshold === "" ||
                m.isThresholdPercentValidate ||
                m.thresholdPercent === ""
              ) {
                setState((prevState) => ({
                  ...prevState,
                  isEditFormSubmitDisabled: false,
                }));
              }
            }
            if (state.isFixedRateActive) {
              if (
                m.isFixedRateValidate ||
                m.fixedRate === "" ||
                m.isUserTypeValidate ||
                m.userType === null ||
                m.isPremiumThresholdValidate ||
                m.premiumThreshold === "" ||
                m.isThresholdPercentValidate ||
                m.thresholdPercent === ""
              ) {
                setState((prevState) => ({
                  ...prevState,
                  isEditFormSubmitDisabled: false,
                }));
              }
            }
          });
          if (state.isPriceActive) {
            if (
              n.isMinPriceValidate ||
              n.slabStart === "" ||
              n.isMaxPriceValidate ||
              n.isMinPriceData ||
              n.slabEnd === ""
            ) {
              setState((prevState) => ({
                ...prevState,
                isEditFormSubmitDisabled: false,
              }));
            }
          }
          if (state.isCountActive) {
            if (
              n.isMinCountValidate ||
              n.slabStartCount === "" ||
              n.isMaxCountValidate ||
              n.isMinCountData ||
              n.slabEndCount === ""
            ) {
              setState((prevState) => ({
                ...prevState,
                isEditFormSubmitDisabled: false,
              }));
            }
          }
        })
      ) {
      }
    }

    if (state.breakupType === 2) {
      if (state.rulePayType === "") {
        setState((prevState) => ({
          ...prevState,
          isEditFormSubmitDisabled: false,
        }));
      }

      if (
        state.ruleBreakup.map((m) => {
          if (state.isRulePercentageActive) {
            if (
              m.isRulePercentageValidate ||
              m.percentage === "" ||
              m.isRuleUserTypeValidate ||
              m.userType === null ||
              m.isRuleThresholdPercentValidate ||
              m.thresholdPercent === "" ||
              m.isRulePremiumThresholdVaidate ||
              m.premiumThreshold === ""
            ) {
              setState((prevState) => ({
                ...prevState,
                isEditFormSubmitDisabled: false,
              }));
            }
          }
          if (state.isRuleFixedRateActive) {
            if (
              m.isRuleFixedRateValidate ||
              m.fixedRate === "" ||
              m.isRuleUserTypeValidate ||
              m.userType === null ||
              m.isRuleThresholdPercentValidate ||
              m.thresholdPercent === "" ||
              m.isRulePremiumThresholdVaidate ||
              m.premiumThreshold === ""
            ) {
              setState((prevState) => ({
                ...prevState,
                isEditFormSubmitDisabled: false,
              }));
            }
          }
        })
      ) {
      }
    }
  }, [
    state.ruleSlabs,
    state.name,
    state.breakupType,
    state.slabType,
    state.payType,
    state.isPercentageActive,
    state.isFixedRateActive,
    state.isPriceActive,
    state.isCountActive,
    state.productId,
    state.providerId,
    state.ruleBreakup,
    state.isRulePercentageActive,
    state.isRuleFixedRateActive,
    state.rulePayType,
  ]);

  useEffect(() => {
    apigetUrl(`/insurance/commission/rules/${selectedId}`).then((res) => {
      console.log("Edited-Response", res.data);
      let endateformate = moment(res.data.endDate).format(
        "ddd MMM DD yyyy HH:mm:ss"
      );
      let startdateformate = moment(res.data.startDate).format(
        "ddd MMM DD yyyy HH:mm:ss"
      );
      let enddate = new Date(endateformate);

      let startdate = new Date(startdateformate);
      const { locationHierarchy } = res.data;
      // console.log("Edited-location", parseInt(locationHierarchy.));

      //Modifing the rule-slabs
      let obj = (res.data.ruleSlabs || []).map((n) => {
        n.slabBreakup.map((m) => {
          m.isSubSlabActive = true;
          m.isPercentageValidate = false;
          m.isUserTypeValidate = false;
          m.isFixedRateValidate = false;
          m.isThresholdPercentValidate = false;
          m.isPremiumThresholdValidate = false;
          m.status = "M";
          return m;
        });
        n.isMinPriceValidate = false;
        n.isMaxPriceValidate = false;
        n.isMinCountValidate = false;
        n.isMaxCountValidate = false;
        n.status = "M";
        return n;
      });

      let modifyObj = (obj || []).map((n) => {
        (n.slabBreakup[0] || {}).isSubSlabActive = false;
        return n;
      });

      //modify the rulebreakup
      let modifyRuleObj = (res.data.ruleBreakup || []).map((n) => {
        n.isRuleUserTypeValidate = false;
        n.isRulePercentageValidate = false;
        n.isRuleFixedRateValidate = false;
        n.isRulePremiumThresholdVaidate = false;
        n.isRuleThresholdPercentValidate = false;
        n.status = "M";
        return n;
      });

      setState((prevState) => ({
        ...prevState,
        data: res.data,
        name: res.data.name,
        description: res.data.description,
        providerId: res.data.providerId,
        productId: res.data.productId,
        dataOfLocation: [
          1,
          parseInt(locationHierarchy.level1Id),
          parseInt(locationHierarchy.level2Id),
          parseInt(locationHierarchy.level3Id),
          parseInt(locationHierarchy.level4Id),
        ],
        level1: locationHierarchy.level1Id,
        level2: locationHierarchy.level2Id,
        level3: locationHierarchy.level3Id,
        level4: locationHierarchy.level4Id,
        startDate: startdate,
        endDate: enddate,
        breakupType: res.data.breakupType,
        isEditFormSubmitDisabled: false,
        ruleSlabs: modifyObj,
        ruleBreakup: modifyRuleObj,
        slabType: res.data.slabType,
        payType: res.data.payOfType,
        rulePayType: res.data.payOfType,
        isPriceActive: res.data.slabType === 1004 ? true : false,
        isCountActive: res.data.slabType === 1005 ? true : false,
        isFixedRateActive: res.data.payOfType === 1006 ? true : false,
        isPercentageActive: res.data.payOfType === 1007 ? true : false,
        isRuleFixedRateActive: res.data.payOfType === 1006 ? true : false,
        isRulePercentageActive: res.data.payOfType === 1007 ? true : false,
        duplicateRuleSlab: modifyObj,
        duplicateRuleSubSlab: modifyObj,
        duplicateBreakUp: modifyRuleObj,
      }));
    });
  }, []);

  console.log("Edited-Data", selectedId);

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    if (name === "name") {
      if (value) {
        setState((prevState) => ({
          ...prevState,
          [name]: value,
          isNameData: false,
          isEditFormSubmitDisabled: true,
        }));
      } else if (!value) {
        setState((prevState) => ({
          ...prevState,
          [name]: value,
          isNameData: true,
        }));
      }
    }
    if (name === "description") {
      if (value) {
        setState((prevState) => ({
          ...prevState,
          [name]: value,
        }));
      } else if (!value) {
        setState((prevState) => ({
          ...prevState,
          [name]: value,
        }));
      }
    }
  };

  const useStyles = makeStyles((theme) => ({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 262,
      marginTop: 0,
      marginLeft: "inherit",
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  }));

  const classes = useStyles();

  const getProviderSelected = (providerId) => {
    const item = (providerData || []).find((n) => n.id === providerId);
    return (item || {}).name;
  };

  const getProductSelected = (productId) => {
    const item = (productData || []).find((n) => n.id === productId);
    return (item || {}).name;
  };

  const handleEditProviderChange = (e, value) => {
    let findProviderId = (providerData || []).find((n) => n.name === value);
    if (value === null) {
      setState((prevState) => ({
        ...prevState,
        providerId: (findProviderId || {}).id,
        providerValidate: true,
        // isEditFormSubmitDisabled: true,
      }));
    } else {
      setState((prevState) => ({
        ...prevState,
        providerId: (findProviderId || {}).id,
        providerValidate: false,
        // isEditFormSubmitDisabled: true,
      }));
    }
  };

  const handleProductChange = (e, value) => {
    let findProductId = (productData || []).find((n) => n.name === value);
    if (value === null) {
      setState((prevState) => ({
        ...prevState,
        productId: (findProductId || {}).id,
        productValidate: true,
      }));
    } else {
      setState((prevState) => ({
        ...prevState,
        productId: (findProductId || {}).id,
        productValidate: false,
      }));
    }
  };

  const handler = (id, value) => {
    console.log("level", id, value);
    if (value === "Zone") {
      setState((prevState) => ({
        ...prevState,
        level1: id,
      }));
    }
    if (value === "State") {
      setState((prevState) => ({
        ...prevState,
        level2: id,
      }));
    }
    if (value === "Cluster") {
      setState((prevState) => ({
        ...prevState,
        level3: id,
      }));
    }
    if (value === "District") {
      setState((prevState) => ({
        ...prevState,
        level4: id,
      }));
    }
    if (value === "City") {
      setState((prevState) => ({
        ...prevState,
        level5: id,
      }));
    }
    if (value === "Area") {
      setState((prevState) => ({
        ...prevState,
        level6: id,
      }));
    }
  };

  const handlingDefaultValue = () => {};

  const handleStartDate = (date) => {
    setState((prevState) => ({
      ...prevState,
      startDate: date,
      isStartDateActive: true,
      isEndDateDisabled: false,
    }));
  };

  const handleEndDate = (date) => {
    setState((prevState) => ({
      ...prevState,

      endDate: date,
    }));
  };

  const handleSelectChange = (event) => {
    setState((prevState) => ({
      ...prevState,
      breakupType: event.target.value,
    }));

    if (event.target.value === 1) {
      setState((prevState) => ({
        ...prevState,
        isSlabActive: true,
        isRuleActive: false,
        isBreakUpData: false,
      }));
    }

    if (event.target.value === 2) {
      setState((prevState) => ({
        ...prevState,
        isRuleActive: true,
        isSlabActive: false,
        isBreakUpData: false,
      }));
    }

    if (event.target.value === "") {
      setState((prevState) => ({
        ...prevState,
        isRuleActive: false,
        isSlabActive: false,
        isBreakUpData: true,
        isEditFormSubmitDisabled: false,
      }));
    }
  };

  const handleUserTypeChange = (e, value, parentIndex, childIndex) => {
    console.log("value", e.currentTarget.name);
    const list = [...state.ruleSlabs];
    if (value) {
      const userTypeInfo = (userTypeData || []).filter(
        (n) => n.name === value
      )[0];
      list[parentIndex].slabBreakup[childIndex]["userType"] = (
        userTypeInfo || {}
      ).id;
      list[parentIndex].slabBreakup[childIndex]["isUserTypeData"] = false;
      list[parentIndex].slabBreakup[childIndex]["isUserTypeValidate"] = false;
      setState((prevState) => ({
        ...prevState,
        isEditFormSubmitDisabled: true,
        ruleSlabs: list,
      }));
    } else if (value === null) {
      list[parentIndex].slabBreakup[childIndex]["userType"] = value;
      list[parentIndex].slabBreakup[childIndex]["isUserTypeData"] = true;
      setState((prevState) => ({
        ...prevState,
        ruleSlabs: list,
      }));
    }
  };

  const handlePercentageChange = (e, parentIndex, childIndex) => {
    const { name, value } = e.target;
    const list = [...state.ruleSlabs];
    if (value) {
      list[parentIndex].slabBreakup[childIndex]["percentage"] = value;
      list[parentIndex].slabBreakup[childIndex]["isPercentageData"] = false;
      list[parentIndex].slabBreakup[childIndex]["isPercentageValidate"] = false;
      setState((prevState) => ({
        ...prevState,
        ruleSlabs: list,
        isEditFormSubmitDisabled: true,
      }));
    } else if (!value) {
      list[parentIndex].slabBreakup[childIndex]["percentage"] = value;
      list[parentIndex].slabBreakup[childIndex]["isPercentageData"] = true;
      // list[parentIndex].slabBreakup[childIndex]["ispercentageValidate"] = false;
      setState((prevState) => ({
        ...prevState,
        ruleSlabs: list,
        // isEditFormSubmitDisabled: true,
      }));
    }
  };

  const handleFixedRateChange = (e, parentIndex, childIndex) => {
    const { name, value } = e.target;
    const list = [...state.ruleSlabs];
    if (value) {
      list[parentIndex].slabBreakup[childIndex]["fixedRate"] = value;
      list[parentIndex].slabBreakup[childIndex]["isFixedRateData"] = false;
      list[parentIndex].slabBreakup[childIndex]["isFixedRateValidate"] = false;
      setState((prevState) => ({
        ...prevState,
        ruleSlabs: list,
        isEditFormSubmitDisabled: true,
      }));
    } else if (!value) {
      list[parentIndex].slabBreakup[childIndex]["fixedRate"] = value;
      list[parentIndex].slabBreakup[childIndex]["isFixedRateData"] = true;
      // list[parentIndex].slabBreakup[childIndex]["ispercentageValidate"] = false;
      setState((prevState) => ({
        ...prevState,
        ruleSlabs: list,
        // isEditFormSubmitDisabled: true,
      }));
    }
  };

  const handlePremiumThresholdChange = (e, parentIndex, childIndex) => {
    const { name, value } = e.target;
    const list = [...state.ruleSlabs];
    if (value) {
      list[parentIndex].slabBreakup[childIndex]["premiumThreshold"] = value;
      list[parentIndex].slabBreakup[childIndex][
        "isPremiumThresholdData"
      ] = false;
      list[parentIndex].slabBreakup[childIndex][
        "isPremiumThresholdValidate"
      ] = false;
      setState((prevState) => ({
        ...prevState,
        ruleSlabs: list,
        isEditFormSubmitDisabled: true,
      }));
    } else if (!value) {
      list[parentIndex].slabBreakup[childIndex]["premiumThreshold"] = value;
      list[parentIndex].slabBreakup[childIndex][
        "isPremiumThresholdData"
      ] = true;
      // list[parentIndex].slabBreakup[childIndex]["ispercentageValidate"] = false;
      setState((prevState) => ({
        ...prevState,
        ruleSlabs: list,
        // isEditFormSubmitDisabled: true,
      }));
    }
  };

  const handleThresholdPercentChange = (e, parentIndex, childIndex) => {
    const { name, value } = e.target;
    const list = [...state.ruleSlabs];
    if (value) {
      list[parentIndex].slabBreakup[childIndex]["thresholdPercent"] = value;
      list[parentIndex].slabBreakup[childIndex][
        "isThresholdPercentData"
      ] = false;
      list[parentIndex].slabBreakup[childIndex][
        "isThresholdPercentValidate"
      ] = false;
      setState((prevState) => ({
        ...prevState,
        ruleSlabs: list,
        isEditFormSubmitDisabled: true,
      }));
    } else if (!value) {
      list[parentIndex].slabBreakup[childIndex]["thresholdPercent"] = value;
      list[parentIndex].slabBreakup[childIndex][
        "isThresholdPercentData"
      ] = true;
      // list[parentIndex].slabBreakup[childIndex]["ispercentageValidate"] = false;
      setState((prevState) => ({
        ...prevState,
        ruleSlabs: list,
        // isEditFormSubmitDisabled: true,
      }));
    }
  };

  const handleAddSubSlab = (parentIndex) => {
    // let child = list.map((n) => n.slabBreakup);
    // console.log("parent", child[0][child[0].length - 1].slabId + 1);
    if (state.isPercentageActive) {
      const list = [...state.ruleSlabs];
      list[parentIndex].slabBreakup.push({
        // slabId: child[0][child[0].length - 1].slabId + 1,
        userType: "",
        percentage: "",
        // fixedRate: "",
        premiumThreshold: "",
        thresholdPercent: "",
        isSubSlabActive: true,
        isUserTypeData: false,
        isPercentageData: false,
        isPercentageValidate: true,
        isUserTypeValidate: true,
        // isFixedRateData: false,
        // isFixedRateValidate: true,
        isPremiumThresholdData: false,
        isPremiumThresholdValidate: true,
        isThresholdPercentValidate: false,
        isThresholdPercentValidate: true,
        status: "A",
      });
      setState((prevState) => ({
        ...prevState,
        ruleSlabs: list,
      }));
    }
    if (state.isFixedRateActive) {
      const list = [...state.ruleSlabs];
      list[parentIndex].slabBreakup.push({
        // slabId: child[0][child[0].length - 1].slabId + 1,
        userType: "",
        // percentage: "",
        fixedRate: "",
        premiumThreshold: "",
        thresholdPercent: "",
        isSubSlabActive: true,
        isUserTypeData: false,
        //  isPercentageData: false,
        //  isPercentageValidate: true,
        isUserTypeValidate: true,
        isFixedRateData: false,
        isFixedRateValidate: true,
        isPremiumThresholdData: false,
        isPremiumThresholdValidate: true,
        isThresholdPercentValidate: false,
        isThresholdPercentValidate: true,
        status: "A",
      });
      setState((prevState) => ({
        ...prevState,
        ruleSlabs: list,
      }));
    }
  };

  const handleRemoveSubSlab = (parentIndex, childIndex, id) => {
    console.log("slabBreakup", id);
    // const list = [...state.ruleSlabs];
    // list[parentIndex].slabBreakup.splice(id, 1);

    const list = (state.ruleSlabs || []).map((n) => {
      return {
        ...n,
        slabBreakup: n.slabBreakup.filter((m) => {
          return m.id !== id;
        }),
      };
    });
    console.log("slabBreakup-123456", list);
    const res = [...state.ruleSlabs];
    res[parentIndex].slabBreakup[childIndex]["status"] = "D";
    console.log("slabBreakup-1234567", res);
    setState((prevState) => ({
      ...prevState,
      isEditFormSubmitDisabled: true,
      ruleSlabs: list,
      isDuplicateRuleSubActive: true,
      duplicateRuleSlab: res,
    }));
    // if (childIndex === 0) {
    //   const list = [...state.ruleSlabs];
    //   list[parentIndex].slabBreakup.splice(childIndex, 1);
    //   setState((prevState) => ({
    //     ...prevState,
    //     ruleSlabs: list,
    //     isEditFormSubmitDisabled: true,
    //   }));
    //   handleSubSlab();
    // } else {
    //   const list = [...state.ruleSlabs];
    //   list[parentIndex].slabBreakup.splice(childIndex, 1);
    //   setState((prevState) => ({
    //     ...prevState,
    //     isEditFormSubmitDisabled: true,
    //     ruleSlabs: list,
    //   }));
    // }
  };

  // const handleSubSlab = () => {
  //   const list = state.ruleSlabs.map((n) => n.slabBreakup);
  //   list.map((m) => (m[0].isSubSlabActive = false));
  // };

  const handleAddSlab = (e, parentIndex) => {
    if (state.isPriceActive && state.isPercentageActive) {
      setState((prevState) => ({
        ...prevState,
        ruleSlabs: [
          ...state.ruleSlabs,
          {
            // ruleId:
            //   prevState.ruleSlabs[prevState.ruleSlabs.length - 1].ruleId + 1,
            slabStart:
              parseInt(
                prevState.ruleSlabs[prevState.ruleSlabs.length - 1].slabEnd
              ) + 1,
            slabEnd: "",
            // ruleId: selectedId,
            isMinPriceData: false,
            isMaxPriceData: false,
            isMaxPriceCondition: false,
            isMinPriceNull: false,
            isMinPriceValidate: false,
            isMaxPriceValidate: true,

            status: "A",
            slabBreakup: [
              {
                // slabId: 1,
                userType: "",
                percentage: "",
                //  fixedRate: "",
                premiumThreshold: "",
                thresholdPercent: "",
                isUserTypeData: false,
                isPercentageData: false,
                isPercentageValidate: true,
                isUserTypeValidate: true,
                //  isFixedRateData: false,
                //  isFixedRateValidate: true,
                isPremiumThresholdData: false,
                isPremiumThresholdValidate: true,
                isThresholdPercentdData: false,
                isThresholdPercentValidate: true,
                status: "A",
              },
            ],
          },
        ],
      }));
    }
    if (state.isPriceActive && state.isFixedRateActive) {
      setState((prevState) => ({
        ...prevState,
        ruleSlabs: [
          ...state.ruleSlabs,
          {
            slabStart:
              parseInt(
                prevState.ruleSlabs[prevState.ruleSlabs.length - 1].slabEnd
              ) + 1,
            slabEnd: "",
            // ruleId: selectedId,
            isMinPriceData: false,
            isMaxPriceData: false,
            isMaxPriceCondition: false,
            isMinPriceNull: false,
            isMinPriceValidate: false,
            isMaxPriceValidate: true,

            status: "A",
            slabBreakup: [
              {
                // slabId: 1,
                userType: "",
                // percentage: "",
                fixedRate: "",
                premiumThreshold: "",
                thresholdPercent: "",
                isUserTypeData: false,
                // isPercentageData: false,
                // isPercentageValidate: true,
                isUserTypeValidate: true,
                isFixedRateData: false,
                isFixedRateValidate: true,
                isPremiumThresholdData: false,
                isPremiumThresholdValidate: true,
                isThresholdPercentdData: false,
                isThresholdPercentValidate: true,
                status: "A",
              },
            ],
          },
        ],
      }));
    }
    if (state.isCountActive && state.isPercentageActive) {
      setState((prevState) => ({
        ...prevState,
        ruleSlabs: [
          ...state.ruleSlabs,
          {
            slabStartCount: String(
              parseInt(
                prevState.ruleSlabs[prevState.ruleSlabs.length - 1].slabEndCount
              ) + 1
            ),
            slabEndCount: "",
            isMinCountData: false,
            isMaxCountData: false,
            isMaxCountCondition: false,
            isMinCountNull: false,
            isMinCountValidate: false,
            isMaxCountValidate: true,
            status: "A",
            slabBreakup: [
              {
                // slabId: 1,
                userType: "",
                percentage: "",
                // fixedRate: "",
                premiumThreshold: "",
                thresholdPercent: "",
                isUserTypeData: false,
                isPercentageData: false,
                isPercentageValidate: true,
                isUserTypeValidate: true,
                // isFixedRateData: false,
                // isFixedRateValidate: true,
                isPremiumThresholdData: false,
                isPremiumThresholdValidate: true,
                isThresholdPercentdData: false,
                isThresholdPercentValidate: true,
                status: "A",
              },
            ],
          },
        ],
      }));
    }
    if (state.isCountActive && state.isFixedRateActive) {
      setState((prevState) => ({
        ...prevState,
        ruleSlabs: [
          ...state.ruleSlabs,
          {
            slabStartCount: String(
              parseInt(
                prevState.ruleSlabs[prevState.ruleSlabs.length - 1].slabEndCount
              ) + 1
            ),
            slabEndCount: "",
            isMinCountData: false,
            isMaxCountData: false,
            isMaxCountCondition: false,
            isMinCountNull: false,
            isMinCountValidate: false,
            isMaxCountValidate: true,
            status: "A",
            slabBreakup: [
              {
                // slabId: 1,
                userType: "",
                // percentage: "",
                fixedRate: "",
                premiumThreshold: "",
                thresholdPercent: "",
                isUserTypeData: false,
                //  isPercentageData: false,
                //  isPercentageValidate: true,
                isUserTypeValidate: true,
                isFixedRateData: false,
                isFixedRateValidate: true,
                isPremiumThresholdData: false,
                isPremiumThresholdValidate: true,
                isThresholdPercentdData: false,
                isThresholdPercentValidate: true,
                status: "A",
              },
            ],
          },
        ],
      }));
    }
  };

  const handleRemoveSlab = (index, id) => {
    console.log("duplicateRuleSlab-123", id);
    // const list = [...state.ruleSlabs];
    // list.splice(index, 1);
    // const duplicateSlabArr = [...state.duplicateRuleSlab];
    // duplicateSlabArr[index]["status"] = "D";
    const list = (state.ruleSlabs || []).filter((n) => n.id !== id);
    console.log("duplicateRuleSlab-123456", list);
    const find = (state.ruleSlabs || []).find((n) => n.id === id);
    const obj = Object.assign(find, { status: "D" });
    const res = [...list, obj];
    console.log("duplicateRuleSlab-1234567", res);
    setState((prevState) => ({
      ...prevState,
      isEditFormSubmitDisabled: true,
      ruleSlabs: list,
      isDuplicateRuleActive: true,
      duplicateRuleSlab: res,
    }));
  };

  const handleRemoveRule = (index, id) => {
    console.log("ID-123", id);
    // const list = [...state.ruleBreakup];
    // list.splice(index, 1);
    // const duplicateArr = [...state.duplicateBreakUp];
    // duplicateArr[index]["status"] = "D";
    // console.log("duplicateArr", duplicateArr);

    const list = (state.ruleBreakup || []).filter((n) => n.id !== id);
    console.log("ID-123456", list);
    const find = (state.ruleBreakup || []).find((n) => n.id === id);
    const obj = Object.assign(find, { status: "D" });
    const res = [...list, obj];
    console.log("isDuplicateBreakUpActive-1234567", res);

    setState((prevState) => ({
      ...prevState,
      isEditFormSubmitDisabled: true,
      ruleBreakup: list,
      isDuplicateBreakUpActive: true,
      duplicateBreakUp: res,
    }));
  };

  const handleRuleUserTypeChange = (e, value, index) => {
    const list = [...state.ruleBreakup];
    if (value) {
      const userTypeInfo = (ruleUserTypeData || []).filter(
        (n) => n.name === value
      )[0];
      list[index]["userType"] = (userTypeInfo || {}).id;
      list[index]["isRuleUserTypeData"] = false;
      list[index]["isRuleUserTypeValidate"] = false;
      setState((prevState) => ({
        ...prevState,
        ruleBreakup: list,
        isEditFormSubmitDisabled: true,
      }));
    } else if (!value) {
      list[index]["userType"] = value;
      list[index]["isRuleUserTypeData"] = true;
      setState((prevState) => ({
        ...prevState,
        ruleBreakup: list,
      }));
    }
  };

  const handleRulePercentageChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...state.ruleBreakup];
    if (value) {
      list[index]["percentage"] = value;
      list[index]["isRulePercentageData"] = false;
      list[index]["isRulePercentageValidate"] = false;
      setState((prevState) => ({
        ...prevState,
        // percentage: value,
        ruleBreakup: list,
        isEditFormSubmitDisabled: true,
      }));
    } else if (!value) {
      list[index]["percentage"] = value;
      list[index]["isRulePercentageData"] = true;
      setState((prevState) => ({
        ...prevState,
        ruleBreakup: list,
      }));
    }
  };

  const handleRuleFixedRateChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...state.ruleBreakup];
    if (value) {
      list[index]["fixedRate"] = value;
      list[index]["isRuleFixedRateData"] = false;
      list[index]["isRuleFixedRateValidate"] = false;
      setState((prevState) => ({
        ...prevState,
        // percentage: value,
        ruleBreakup: list,
        isEditFormSubmitDisabled: true,
      }));
    } else if (!value) {
      list[index]["fixedRate"] = value;
      list[index]["isRuleFixedRateData"] = true;
      setState((prevState) => ({
        ...prevState,
        ruleBreakup: list,
      }));
    }
  };

  const handleRuleThresholdPercentChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...state.ruleBreakup];
    if (value) {
      list[index]["thresholdPercent"] = value;
      list[index]["isRuleThresholdPercentData"] = false;
      list[index]["isRuleThresholdPercentValidate"] = false;
      setState((prevState) => ({
        ...prevState,
        // percentage: value,
        ruleBreakup: list,
        isEditFormSubmitDisabled: true,
      }));
    } else if (!value) {
      list[index]["thresholdPercent"] = value;
      list[index]["isRuleThresholdPercentData"] = true;
      setState((prevState) => ({
        ...prevState,
        ruleBreakup: list,
      }));
    }
  };

  const handleRulePremiumThresholdChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...state.ruleBreakup];
    if (value) {
      list[index]["premiumThreshold"] = value;
      list[index]["isRulePremiumThresholdData"] = false;
      list[index]["isRulePremiumThresholdVaidate"] = false;
      setState((prevState) => ({
        ...prevState,
        // percentage: value,
        ruleBreakup: list,
        isEditFormSubmitDisabled: true,
      }));
    } else if (!value) {
      list[index]["premiumThreshold"] = value;
      list[index]["isRulePremiumThresholdData"] = true;
      setState((prevState) => ({
        ...prevState,
        ruleBreakup: list,
      }));
    }
  };

  const handleAddRule = () => {
    if (state.isRulePercentageActive) {
      setState((prevState) => ({
        ...prevState,
        ruleBreakup: [
          ...state.ruleBreakup,
          {
            // ruleId:
            //   prevState.ruleBreakup[prevState.ruleBreakup.length - 1].ruleId + 1,
            userType: "",
            percentage: "",
            //  fixedRate: "",
            thresholdPercent: "",
            premiumThreshold: "",
            isRuleUserTypeData: false,
            isRulePercentageData: false,
            //  isRuleFixedRateData: false,
            isRuleThresholdPercentData: false,
            isRulePremiumThresholdData: false,
            isRuleUserTypeValidate: true,
            isRulePercentageValidate: true,
            //  isRuleFixedRateValidate: true,
            isRuleThresholdPercentValidate: true,
            isRulePremiumThresholdVaidate: true,
            status: "A",
          },
        ],
      }));
    }
    if (state.isRuleFixedRateActive) {
      setState((prevState) => ({
        ...prevState,
        ruleBreakup: [
          ...state.ruleBreakup,
          {
            userType: "",
            //  percentage: "",
            fixedRate: "",
            thresholdPercent: "",
            premiumThreshold: "",
            isRuleUserTypeData: false,
            // isRulePercentageData: false,
            isRuleFixedRateData: false,
            isRuleThresholdPercentData: false,
            isRulePremiumThresholdData: false,
            isRuleUserTypeValidate: true,
            // isRulePercentageValidate: true,
            isRuleFixedRateValidate: true,
            isRuleThresholdPercentValidate: true,
            isRulePremiumThresholdVaidate: true,
            status: "A",
          },
        ],
      }));
    }
  };

  const handlePrice = (e, index) => {
    console.log("event", e.target.value);
    const { name, value } = e.target;
    const list = [...state.ruleSlabs];
    if (name === "slabStart") {
      if (value) {
        list[index][name] = value;
        list[index]["isMinPriceData"] = false;
        list[index]["isMinPriceValidate"] = false;
        setState((prevState) => ({
          ...prevState,
          ruleSlabs: list,
          isEditFormSubmitDisabled: true,
        }));
      } else if (!value || value === NaN) {
        list[index][name] = value;
        list[index]["isMinPriceData"] = true;
        // list[index]["isMinPriceValidate"] = true;
        setState((prevState) => ({
          ...prevState,
          ruleSlabs: list,
          // isEditFormSubmitDisabled: false,
        }));
      }
    }
    if (name === "slabEnd") {
      console.log("event-345", value);
      if (value) {
        list[index][name] = value;
        list[index]["isMaxPriceData"] = false;
        list[index]["isMaxPriceValidate"] = false;
        setState((prevState) => ({
          ...prevState,
          ruleSlabs: list,
          isEditFormSubmitDisabled: true,
        }));
      } else if (!value) {
        list[index][name] = value;
        list[index]["isMaxPriceData"] = true;
        // list[index]["isMaxPriceCondition"] = true;
        setState((prevState) => ({
          ...prevState,
          ruleSlabs: list,
          // isEditFormSubmitDisabled: false,
        }));
      }
      if (value <= list[index]["slabStart"]) {
        list[index][name] = value;
        list[index]["isMaxPriceCondition"] = true;
        list[index]["isMaxPriceValidate"] = true;
        setState((prevState) => ({
          ...prevState,
          ruleSlabs: list,
          isEditFormSubmitDisabled: false,
        }));
      } else if (value > list[index]["slabStart"]) {
        list[index][name] = value;
        list[index]["isMaxPriceCondition"] = false;
        setState((prevState) => ({
          ...prevState,
          ruleSlabs: list,
        }));
      }
      if (list[index]["slabStart"] === "") {
        list[index][name] = value;
        list[index]["isMinPriceNull"] = true;
        setState((prevState) => ({
          ...prevState,
          ruleSlabs: list,
        }));
      } else if (list[index]["slabStart"] !== "") {
        list[index][name] = value;
        list[index]["isMinPriceNull"] = false;
        setState((prevState) => ({
          ...prevState,
          ruleSlabs: list,
        }));
      }
    }
  };

  const handleCount = (e, index) => {
    console.log("event", e.target.value);
    const { name, value } = e.target;
    const list = [...state.ruleSlabs];
    if (name === "slabStartCount") {
      if (value) {
        list[index][name] = value;
        list[index]["isMinCountData"] = false;
        list[index]["isMinCountValidate"] = false;
        setState((prevState) => ({
          ...prevState,
          ruleSlabs: list,
          isEditFormSubmitDisabled: true,
        }));
      } else if (!value || value === NaN) {
        list[index][name] = value;
        list[index]["isMinCountData"] = true;
        list[index]["isMinCountValidate"] = true;
        setState((prevState) => ({
          ...prevState,
          ruleSlabs: list,
          isEditFormSubmitDisabled: false,
        }));
      }
    }
    if (name === "slabEndCount") {
      console.log("event-345", value);
      if (value) {
        list[index][name] = value;
        list[index]["isMaxCountData"] = false;
        list[index]["isMaxCountValidate"] = false;
        setState((prevState) => ({
          ...prevState,
          ruleSlabs: list,
          isEditFormSubmitDisabled: true,
        }));
      } else if (!value) {
        list[index][name] = value;
        list[index]["isMaxCountData"] = true;
        // list[index]["isMaxPriceCondition"] = true;
        setState((prevState) => ({
          ...prevState,
          ruleSlabs: list,
          // isEditFormSubmitDisabled: false,
        }));
      }
      if (value <= list[index]["slabStartCount"]) {
        list[index][name] = value;
        list[index]["isMaxCountCondition"] = true;
        list[index]["isMaxCountValidate"] = true;
        setState((prevState) => ({
          ...prevState,
          ruleSlabs: list,
          isEditFormSubmitDisabled: false,
        }));
      } else if (value > list[index]["slabStartCount"]) {
        list[index][name] = value;
        list[index]["isMaxCountCondition"] = false;
        setState((prevState) => ({
          ...prevState,
          ruleSlabs: list,
        }));
      }
      if (list[index]["slabStartCount"] === "") {
        list[index][name] = value;
        list[index]["isMinCountNull"] = true;
        setState((prevState) => ({
          ...prevState,
          ruleSlabs: list,
        }));
      } else if (list[index]["slabStartCount"] !== "") {
        list[index][name] = value;
        list[index]["isMinCountNull"] = false;
        setState((prevState) => ({
          ...prevState,
          ruleSlabs: list,
        }));
      }
    }
  };

  const handleEditFormDataSubmit = () => {
    const slabData = state.isDuplicateRuleActive
      ? state.duplicateRuleSlab
      : state.isDuplicateRuleSubActive
      ? state.duplicateRuleSlab
      : state.ruleSlabs;
    console.log("slabBreakup-slabData", slabData);

    const breakUpData = state.isDuplicateBreakUpActive
      ? state.duplicateBreakUp
      : state.ruleBreakup;
    console.log("isDuplicateBreakUpActive-123", breakUpData);

    let ruleSlabFiltered = (slabData || []).map((n) => {
      n.slabBreakup.map((m) => {
        delete m.isSubSlabActive;
        delete m.isUserTypeData;
        delete m.isPercentageData;
        delete m.isPercentageValidate;
        delete m.isUserTypeValidate;
        delete m.isFixedRateValidate;
        delete m.isFixedRateData;
        delete m.isPremiumThresholdValidate;
        delete m.isPremiumThresholdData;
        delete m.isThresholdPercentValidate;
        delete m.isThresholdPercentData;
        return m;
      });
      delete n.isMinPriceData;
      delete n.isMaxPriceData;
      delete n.isMaxPriceCondition;
      delete n.isMinPriceNull;
      delete n.isMinPriceValidate;
      delete n.isMaxPriceValidate;
      delete n.isMinCountData;
      delete n.isMaxCountData;
      delete n.isMaxCountCondition;
      delete n.isMinCountNull;
      delete n.isMinCountValidate;
      delete n.isMaxCountValidate;
      return n;
    });
    console.log("obj-123", ruleSlabFiltered);

    let ruleFiltered = (breakUpData || []).map((n) => {
      delete n.isRuleUserTypeData;
      delete n.isRulePercentageData;
      delete n.isRuleFixedRateData;
      delete n.isRuleUserTypeValidate;
      delete n.isRulePercentageValidate;
      delete n.isRuleFixedRateValidate;
      delete n.isRuleThresholdPercentValidate;
      delete n.isRulePremiumThresholdVaidate;
      delete n.isRuleThresholdPercentData;
      delete n.isRulePremiumThresholdData;
      return n;
    });

    console.log("obj-345", ruleFiltered);

    if (state.breakupType === 1) {
      const addObj = {
        name: state.name,
        description: state.description,
        productId: state.productId,
        providerId: state.providerId,
        breakupType: state.breakupType,
        locationHierarchy: {
          level1Id: `${state.level1}`,
          level2Id: `${state.level2}`,
          level3Id: `${state.level3}`,
          level4Id: `${state.level4}`,
        },
        startDate: state.startDate,
        endDate: state.endDate,
        ruleSlabs:
          state.slabType === 1004 && state.payType === 1007
            ? ruleSlabFiltered.map((n) => {
                n.slabBreakup.map((m) => {
                  delete m.fixedRate;
                  return m;
                });
                delete n.slabStartCount;
                delete n.slabEndCount;
                return n;
              })
            : state.slabType === 1005 && state.payType === 1006
            ? ruleSlabFiltered.map((n) => {
                n.slabBreakup.map((m) => {
                  delete m.percentage;
                  return m;
                });
                delete n.slabStart;
                delete n.slabEnd;
                return n;
              })
            : state.slabType === 1004 && state.payType === 1006
            ? ruleSlabFiltered.map((n) => {
                n.slabBreakup.map((m) => {
                  delete m.percentage;
                  return m;
                });
                delete n.slabStartCount;
                delete n.slabEndCount;
                return n;
              })
            : state.slabType === 1005 && state.payType === 1007
            ? ruleSlabFiltered.map((n) => {
                n.slabBreakup.map((m) => {
                  delete m.fixedRate;
                  return m;
                });
                delete n.slabStart;
                delete n.slabEnd;
                return n;
              })
            : null,
        slabType: state.slabType,
        payOfType: state.payType,
      };

      console.log("obj-456", addObj);

      apiputUrl(`/insurance/commission/rules/${selectedId}`, addObj)
        .then((res) => {
          console.log("Result", res);

          if (`${res.data.responseCode}` === "200") {
            getSuccessUpdate("edit");
            callLocalBaseURL();
            closeEditCommission();
          }
          if (`${res.data.status}` === "500") {
            // getErrorUpdate(res.data.error);
            ippNotify.error(res.data.error);
          }
          if (`${res.data.responseStatus}` === "failure") {
            ippNotify.error(res.data.responseMessage);
          }
        })
        .catch((err) => {
          console.log("Error", err);
          // getErrorUpdate(err.data.responseMessage);
          ippNotify.error(err.data.responseMessage);
        });
    } else if (state.breakupType === 2) {
      const addObj = {
        name: state.name,
        description: state.description,
        productId: state.productId,
        providerId: state.providerId,
        breakupType: state.breakupType,
        locationHierarchy: {
          level1Id: `${state.level1}`,
          level2Id: `${state.level2}`,
          level3Id: `${state.level3}`,
          level4Id: `${state.level4}`,
        },
        startDate: state.startDate,
        endDate: state.endDate,
        ruleBreakup:
          state.rulePayType === 1007
            ? ruleFiltered.map((n) => {
                delete n.fixedRate;
                return n;
              })
            : state.rulePayType === 1006
            ? ruleFiltered.map((n) => {
                delete n.percentage;
                return n;
              })
            : null,
        // slabType: state.slabTypeValue,
        payOfType: state.rulePayType,
      };

      console.log("obj-456", addObj);

      apiputUrl(`/insurance/commission/rules/${selectedId}`, addObj)
        .then((res) => {
          console.log("Result", res);

          if (`${res.data.responseCode}` === "200") {
            getSuccessUpdate("edit");
            callLocalBaseURL();
            closeEditCommission();
          }
          if (`${res.data.status}` === "500") {
            // getErrorUpdate(res.data.error);
            ippNotify.error(res.data.error);
          }
          if (`${res.data.responseStatus}` === "failure") {
            ippNotify.error(res.data.responseMessage);
          }
        })
        .catch((err) => {
          console.log("Error", err);
          // getErrorUpdate(err.data.responseMessage);
          ippNotify.error(err.data.responseMessage);
        });
    }
  };

  const handleSelectSlabTypeChange = (event) => {
    setState((prevState) => ({
      ...prevState,
      slabType: event.target.value,
    }));

    if (event.target.value === 1004) {
      setState((prevState) => ({
        ...prevState,
        isPayTypeActive: true,
        slabTypeData: false,
        isPriceActive: true,
        isCountActive: false,
      }));
    }

    if (event.target.value === 1005) {
      setState((prevState) => ({
        ...prevState,
        isPayTypeActive: true,
        slabTypeData: false,
        isPriceActive: false,
        isCountActive: true,
      }));
    }

    if (event.target.value === "") {
      setState((prevState) => ({
        ...prevState,
        isPayTypeActive: false,
        slabTypeData: true,
        isSlabActive: false,
        isPriceActive: false,
        isCountActive: false,
      }));
    }
  };

  const handleSelectPayTypeChange = (event) => {
    console.log("event", event.target.value);
    console.log("event-123", event.target);
    setState((prevState) => ({
      ...prevState,
      payType: event.target.value,
    }));

    if (event.target.value === 1007) {
      setState((prevState) => ({
        ...prevState,
        isSlabActive: true,
        payTypeData: false,
        isPercentageActive: true,
        isFixedRateActive: false,
      }));
    }

    if (event.target.value === 1006) {
      setState((prevState) => ({
        ...prevState,
        isSlabActive: true,
        payTypeData: false,
        isRulePercentageActive: false,
        isRuleFixedRateActive: true,
        isPercentageActive: false,
        isFixedRateActive: true,
      }));
    }

    if (event.target.value === "") {
      setState((prevState) => ({
        ...prevState,
        isSlabActive: false,
        payTypeData: true,
        isRulePercentageActive: false,
        isRuleFixedRateActive: false,
        isEditFormSubmitDisabled: false,
        isPercentageActive: false,
        isFixedRateActive: false,
      }));
    }
  };

  const handleSelectRulePayTypeChange = (event) => {
    setState((prevState) => ({
      ...prevState,
      rulePayType: event.target.value,
    }));

    if (event.target.value === 1007) {
      setState((prevState) => ({
        ...prevState,
        isRuleActive: true,
        isRulePercentageActive: true,
        isRuleFixedRateActive: false,
        rulePayData: false,
      }));
    }

    if (event.target.value === 1006) {
      setState((prevState) => ({
        ...prevState,
        isRuleActive: true,
        isRuleFixedRateActive: true,
        isRulePercentageActive: false,
        rulePayData: false,
      }));
    }

    if (event.target.value === "") {
      setState((prevState) => ({
        ...prevState,
        isRuleActive: false,
        isEditFormSubmitDisabled: false,
        rulePayData: true,
      }));
    }
  };

  const getSlabTypeName = (id) => {
    const item = (slabData || []).find((n) => n.id === id);
    return (item || {}).name;
  };

  const getPayTypeName = (id) => {
    console.log("getPayTypeName", id);
    const item = (paymentTypeData || []).find((n) => n.id === id);
    return (item || {}).name;
  };

  return (
    <>
      <div className="row">
        <div className="row">
          <div className="col-lg-4"></div>
          <div className="col-lg-4"></div>
          <div className="col-lg-4">
            <IPPNotification />
          </div>
        </div>
        <CardBox styleName="col-md-12">
          <div className="cardBox">
            <div className="row">
              <div className="col-lg-3">
                <InputField
                  error={state.isNameData}
                  required
                  className="mb-3"
                  autoFocus
                  id="name"
                  helperText={state.isNameData ? "Name is Required" : null}
                  label={<IntlMessages id="CommissionManagement.Edit.Name" />}
                  name="name"
                  onChange={(e) => handleEditFormChange(e)}
                  value={state.name}
                  fullWidth
                />
              </div>

              <div className="col-lg-3">
                <InputField
                  autoFocus
                  className="mb-3"
                  id="description"
                  label={
                    <IntlMessages id="CommissionManagement.Edit.Description" />
                  }
                  name="description"
                  //   error={state.errors.description}
                  onChange={(e) => handleEditFormChange(e)}
                  //   helperText={state.errors.description}
                  value={state.description}
                  fullWidth
                />
              </div>
              <div className="col-lg-3">
                <InputAutocomplete
                  className="mb-4"
                  id="providerName"
                  name="providerName"
                  onChange={handleEditProviderChange}
                  options={(providerData || []).map((n) => n.name)}
                  value={getProviderSelected(state.providerId)}
                  fullWidth
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      required
                      error={state.providerValidate}
                      helperText={
                        state.providerValidate ? "Provider is Required" : null
                      }
                      label={
                        <IntlMessages id="CommissionManagement.Edit.Provider" />
                      }
                      variant="outlined"
                    />
                  )}
                />
              </div>
              <div className="col-lg-3">
                <InputAutocomplete
                  className="mb-4"
                  id="productName"
                  name="productName"
                  options={(productData || []).map((n) => n.name)}
                  value={getProductSelected(state.productId)}
                  onChange={handleProductChange}
                  fullWidth
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      required
                      error={state.productValidate}
                      helperText={
                        state.productValidate ? "Product is Required" : null
                      }
                      label={
                        <IntlMessages id="CommissionManagement.Edit.Product" />
                      }
                      variant="outlined"
                    />
                  )}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-lg-12 col-sm-12 col-12 mb-3 ml-2">
                <LocationFilter
                  inputId={state.dataOfLocation}
                  handlingDefaultValue={handlingDefaultValue}
                  handler={handler}
                />
              </div>
            </div>
            <div className="row">
              <div
                className="col-md-3 mb-3"
                style={{ position: "relative", zIndex: "999" }}
              >
                <InputDatePicker
                  filterDate={(d) => {
                    return new Date() > d;
                  }}
                  name="startDate"
                  selected={state.startDate}
                  selectsStart
                  startDate={state.startDate}
                  endDate={state.endDate}
                  onChange={handleStartDate}
                  customInput={
                    <TextField
                      style={{ width: "100%" }}
                      label={
                        <IntlMessages id="CommissionManagement.Edit.StartDate" />
                      }
                      variant="outlined"
                    />
                  }
                />
              </div>

              <div
                className="col-md-3 mb-3"
                style={{ position: "relative", zIndex: "999" }}
              >
                <InputDatePicker
                  filterDate={(d) => {
                    return new Date() > d;
                  }}
                  name="endDate"
                  selected={state.endDate}
                  selectsEnd
                  startDate={state.startDate}
                  endDate={state.endDate}
                  minDate={state.startDate}
                  onChange={handleEndDate}
                  // disabled={state.isEndDateDisabled}
                  customInput={
                    <TextField
                      style={{ width: "100%" }}
                      label={
                        <IntlMessages id="CommissionManagement.Edit.EndDate" />
                      }
                      variant="outlined"
                    />
                  }
                />
              </div>

              <div className="col-lg-3">
                <FormControl
                  variant="outlined"
                  className={classes.formControl}
                  required
                  error={state.isBreakUpData}
                >
                  <InputLabel id="demo-simple-select-outlined-label">
                    <IntlMessages id="CommissionManagement.Edit.BreakupType" />
                  </InputLabel>
                  <InputSelect
                    labelId="demo-simple-select-outlined-label"
                    id="demo-simple-select-outlined"
                    value={state.breakupType}
                    renderValue={(value) => `${value}`}
                    onChange={handleSelectChange}
                    label={
                      <IntlMessages id="CommissionManagement.Edit.BreakupType" />
                    }
                  >
                    <MenuItem value="">
                      <em>Select</em>
                    </MenuItem>
                    <MenuItem value={1}>Slab-Breakup</MenuItem>
                    <MenuItem value={2}>Rule-breakup</MenuItem>
                  </InputSelect>
                  {state.isBreakUpData ? (
                    <FormHelperText style={{ color: "red" }}>
                      Breakup Type is Required
                    </FormHelperText>
                  ) : null}
                </FormControl>
              </div>
              {state.breakupType === 1 ? (
                <>
                  <div className="col-md-3">
                    <FormControl
                      variant="outlined"
                      className={classes.formControl}
                      required
                      error={state.slabTypeData}
                    >
                      <InputLabel id="demo-simple-select-outlined-label">
                        Slab Type
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-outlined-label"
                        id="demo-simple-select-outlined"
                        value={getSlabTypeName(state.slabType)}
                        renderValue={(value) => `${value}`}
                        onChange={handleSelectSlabTypeChange}
                        // label={
                        //   <IntlMessages id="CommissionManagement.Add.BreakupType" />
                        // }
                        label="Slab Type"
                        fullWidth
                      >
                        <MenuItem value="">
                          <em>Select</em>
                        </MenuItem>
                        {slabData.map((n) => {
                          return <MenuItem value={n.id}>{n.name}</MenuItem>;
                        })}
                      </Select>
                      {state.slabTypeData ? (
                        <FormHelperText style={{ color: "red" }}>
                          Slab Type is Required
                        </FormHelperText>
                      ) : null}
                    </FormControl>
                  </div>
                  <div className="col-md-3 mt-3">
                    <FormControl
                      variant="outlined"
                      className={classes.formControl}
                      required
                      error={state.payTypeData}
                    >
                      <InputLabel id="demo-simple-select-outlined-label">
                        Payment Type
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-outlined-label"
                        id="demo-simple-select-outlined"
                        value={getPayTypeName(state.payType)}
                        renderValue={(value) => `${value}`}
                        onChange={handleSelectPayTypeChange}
                        // label={
                        //   <IntlMessages id="CommissionManagement.Add.BreakupType" />
                        // }
                        label="Payment Type"
                      >
                        <MenuItem value="">
                          <em>Select</em>
                        </MenuItem>
                        {paymentTypeData.map((n) => {
                          return <MenuItem value={n.id}>{n.name}</MenuItem>;
                        })}
                      </Select>
                      {state.payTypeData ? (
                        <FormHelperText style={{ color: "red" }}>
                          Payment Type is Required
                        </FormHelperText>
                      ) : null}
                    </FormControl>
                  </div>
                </>
              ) : state.breakupType === 2 ? (
                <div className="col-md-3">
                  <FormControl
                    variant="outlined"
                    className={classes.formControl}
                    required
                    error={state.rulePayData}
                  >
                    <InputLabel id="demo-simple-select-outlined-label">
                      Payment Type
                    </InputLabel>
                    <InputSelect
                      labelId="demo-simple-select-outlined-label"
                      id="demo-simple-select-outlined"
                      // value={getRulePayTypeName(state.rulePayType)}
                      value={state.rulePayType}
                      renderValue={(value) => `${value}`}
                      onChange={handleSelectRulePayTypeChange}
                      // label={
                      //   <IntlMessages id="CommissionManagement.Add.BreakupType" />
                      // }
                      label="Payment Type"
                    >
                      <MenuItem value="">
                        <em>Select</em>
                      </MenuItem>
                      {rulePaymentTypeData.map((n) => {
                        return <MenuItem value={n.id}>{n.name}</MenuItem>;
                      })}
                    </InputSelect>
                    {state.rulePayData ? (
                      <FormHelperText style={{ color: "red" }}>
                        Payment Type is Required
                      </FormHelperText>
                    ) : null}
                  </FormControl>
                </div>
              ) : null}
            </div>
            {state.breakupType === 1 || state.isSlabActive ? (
              <>
                <EditSlabCommissionManagement
                  ruleSlabs={state.ruleSlabs}
                  userTypeData={userTypeData}
                  handleUserTypeChange={handleUserTypeChange}
                  handlePercentageChange={handlePercentageChange}
                  handleFixedRateChange={handleFixedRateChange}
                  handlePremiumThresholdChange={handlePremiumThresholdChange}
                  handleThresholdPercentChange={handleThresholdPercentChange}
                  handleAddSubSlab={handleAddSubSlab}
                  handleRemoveSubSlab={handleRemoveSubSlab}
                  handleAddSlab={handleAddSlab}
                  handleRemoveSlab={handleRemoveSlab}
                  handlePrice={handlePrice}
                  handleCount={handleCount}
                  slabType={state.slabType}
                  payType={state.payType}
                />
              </>
            ) : state.breakupType === 2 || state.isRuleActive ? (
              <>
                <EditRuleCommissionManagement
                  handleRemoveRule={handleRemoveRule}
                  ruleUserTypeData={ruleUserTypeData}
                  handleRuleUserTypeChange={handleRuleUserTypeChange}
                  handleRulePercentageChange={handleRulePercentageChange}
                  handleRuleFixedRateChange={handleRuleFixedRateChange}
                  handleRuleThresholdPercentChange={
                    handleRuleThresholdPercentChange
                  }
                  handleRulePremiumThresholdChange={
                    handleRulePremiumThresholdChange
                  }
                  handleAddRule={handleAddRule}
                  ruleBreakup={state.ruleBreakup}
                  rulePayType={state.rulePayType}
                />
              </>
            ) : null}

            <div className="row mt-5">
              <div className="col-lg-4"></div>
              <div className="col-lg-3">
                <InputCancelButton onClick={handleRequestClose} />
                <InputSubmitButton
                  onClick={(e) => handleEditFormDataSubmit(e)}
                  disabled={!state.isEditFormSubmitDisabled}
                />
              </div>
            </div>
          </div>
        </CardBox>
      </div>
    </>
  );
};

export default EditCommissionManagement;
