import React, { useState, useEffect } from "react";
import { TextField } from "@material-ui/core";
import IntlMessages from "util/IntlMessages";
import InputLabel from "@material-ui/core/InputLabel";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import CardBox from "./../../../../../components/CardBox";
import "./root.component.css";
import InputSubmitButton from "../CommonComponents/SubmitButton";
import InputCancelButton from "../CommonComponents/CancelButton";
import InputField from "../CommonComponents/TextField";
import InputAutocomplete from "../CommonComponents/Autocomplete";
import FormHelperText from "@material-ui/core/FormHelperText";
import InputSelect from "../CommonComponents/Select";
import "../CommonComponents/tableStyle.css";
import { apigetUrl, apipostUrl } from "../../../../../setup/middleware";
import LocationFilter from "../CommonComponents/LocationFilter";
import InputDatePicker from "../CommonComponents/DatePicker";
import SlabCommissionManagement from "./SlabCommissionMangement";
import RuleCommissionManagement from "./RuleCommissionManagement";
import {
  IPPNotification,
  ippNotify,
} from "../CommonComponents/IPPNotification";

const AddCommissionManagement = ({
  handleRequestClose,
  callLocalBaseURL,
  getSuccessUpdate,
  closeAddCommission,
}) => {
  const [state, setState] = useState({
    name: "",
    isNameData: false,
    description: "",
    providerData: [],
    productData: [],
    userTypeData: [],
    userType: "",
    providerId: "",
    productId: "",
    breakupType: "",
    isBreakUpData: false,
    startDate: null,
    endDate: null,
    currentDate: new Date(),
    isEndDateDisabled: true,
    percentage: "",
    level1: "",
    level2: "",
    level3: "",
    level4: "",
    level5: "",
    level6: "",
    ruleSlabs: [
      {
        slabStart: "",
        slabEnd: "",
        isMinPriceValidate: false,
        isMaxPriceValidate: false,
        slabStartCount: "",
        slabEndCount: "",
        isMinCountValidate: false,
        isMaxCountValidate: false,
        slabBreakup: [
          {
            userType: "",
            percentage: "",
            fixedRate: "",
            premiumThreshold: "",
            thresholdPercent: "",
            isSubSlabActive: false,
            isPercentageValidate: false,
            isUserTypeValidate: false,
            isFixedRateValidate: false,
            isPremiumThresholdValidate: false,
            isThresholdPercentValidate: false,
          },
        ],
      },
    ],
    ruleBreakup: [
      {
        userType: "",
        percentage: "",
        fixedRate: "",
        thresholdPercent: "",
        premiumThreshold: "",
        isRuleUserTypeValidate: false,
        isRulePercentageValidate: false,
        isRuleFixedRateValidate: false,
        isRuleThresholdPercentValidate: false,
        isRulePremiumThresholdVaidate: false,
      },
    ],
    ruleUserTypeData: [],
    ruleUserTypeId: "",
    previousMaxPrice: "",
    isSlabActive: false,
    isRuleActive: false,
    isAddFormSubmitDisabled: false,
    isSlabTypeActive: false,
    isPayTypeActive: false,
    isRulePayTypeActive: false,
    slabType: "",
    payType: "",
    rulePayType: "",
    rulePayData: false,
    slabTypeData: false,
    payTypeData: false,
    isRulePercentageActive: false,
    isRuleFixedRateActive: false,
    isPercentageActive: false,
    isFixedRateActive: false,
    isPriceActive: false,
    isCountActive: false,
    paymentTypeData: [],
    payTypeValue: "",
    rulePaymentTypeData: [],
    slabData: [],
    slabTypeValue: "",
    providerValidate: false,
    productValidate: false,
  });

  useEffect(() => {
    // validating slab section and name , breakup elements
    if (
      state.name === "" ||
      state.breakupType === "" ||
      state.providerId === undefined ||
      state.productId === undefined
    ) {
      setState((prevState) => ({
        ...prevState,
        isAddFormSubmitDisabled: false,
      }));
    } else {
      setState((prevState) => ({
        ...prevState,
        isAddFormSubmitDisabled: true,
      }));
    }

    if (state.breakupType === 1) {
      if (state.slabType === "" || state.payType === "") {
        setState((prevState) => ({
          ...prevState,
          isAddFormSubmitDisabled: false,
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
                  isAddFormSubmitDisabled: false,
                }));
              } else {
                setState((prevState) => ({
                  ...prevState,
                  isAddFormSubmitDisabled: true,
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
                  isAddFormSubmitDisabled: false,
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
                isAddFormSubmitDisabled: false,
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
                isAddFormSubmitDisabled: false,
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
          isAddFormSubmitDisabled: false,
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
                isAddFormSubmitDisabled: false,
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
                isAddFormSubmitDisabled: false,
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
    getAllProvider();
    getAllProducts();
    getAllUserType();
    getSlabType();
    getPaymentType();
  }, []);

  const getAllProvider = () => {
    apigetUrl(`/insurance/providers?page=1&limit=1000`)
      .then((res) => {
        let response = res.data.dataList;
        setState((prevState) => ({
          ...prevState,
          providerData: response,
        }));
      })
      .catch((err) => console.log("err", err));
  };

  const getAllProducts = () => {
    apigetUrl(`/insurance/products?page=1&limit=1000`)
      .then((res) => {
        let response = res.data.dataList;
        setState((prevState) => ({
          ...prevState,
          productData: response,
        }));
      })
      .catch((err) => console.log("err", err));
  };

  const getAllUserType = () => {
    apigetUrl(`/insurance/commission/core-data?page=1&limit=1000&typeId=10`)
      .then((res) => {
        let response = res.data.dataList;
        setState((prevState) => ({
          ...prevState,
          userTypeData: response,
          ruleUserTypeData: response,
        }));
      })
      .catch((err) => console.log("err", err));
  };

  const getSlabType = () => {
    apigetUrl(`/insurance/commission/core-data?page=1&limit=1000&typeId=20`)
      .then((res) => {
        let response = res.data.dataList;
        setState((prevState) => ({
          ...prevState,
          slabData: response,
          slabTypeValue: 20,
        }));
      })
      .catch((err) => console.log("err", err));
  };

  const getPaymentType = () => {
    apigetUrl(`/insurance/commission/core-data?page=1&limit=1000&typeId=30`)
      .then((res) => {
        let response = res.data.dataList;
        setState((prevState) => ({
          ...prevState,
          paymentTypeData: response,
          rulePaymentTypeData: response,
          payTypeValue: 30,
        }));
      })
      .catch((err) => console.log("err", err));
  };

  const handleProviderChange = (event, value) => {
    let providerInfo = (state.providerData || []).filter(
      (n) => n.name === value
    )[0];

    if (value) {
      setState((prevState) => ({
        ...prevState,
        providerId: (providerInfo || {}).id,
        providerValidate: false,
      }));
    }
    if (value === null) {
      setState((prevState) => ({
        ...prevState,
        providerId: (providerInfo || {}).id,
        providerValidate: true,
      }));
    }
  };

  const handleProductChange = (event, value) => {
    let productInfo = (state.productData || []).filter(
      (n) => n.name === value
    )[0];
    if (value) {
      setState((prevState) => ({
        ...prevState,
        productId: (productInfo || {}).id,
        productValidate: false,
      }));
    }
    if (value === null) {
      setState((prevState) => ({
        ...prevState,
        productId: (productInfo || {}).id,
        productValidate: true,
      }));
    }
  };

  //handling Location Names dynamically

  const handler = (id, value) => {
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

  const useStyles = makeStyles((theme) => ({
    formControl: {
      margin: theme.spacing(0),
      minWidth: 300,
      marginTop: 0,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  }));

  const classes = useStyles();

  const handleAddSlab = (e, parentIndex) => {
    setState((prevState) => ({
      ...prevState,

      ruleSlabs: [
        ...state.ruleSlabs,
        {
          // ruleId:
          //   prevState.ruleSlabs[prevState.ruleSlabs.length - 1].ruleId + 1,
          slabStart: String(
            parseInt(
              prevState.ruleSlabs[prevState.ruleSlabs.length - 1].slabEnd
            ) + 1
          ),
          slabEnd: "",
          isMinPriceData: false,
          isMaxPriceData: false,
          isMaxPriceCondition: false,
          isMinPriceNull: false,
          isMinPriceValidate: false,
          isMaxPriceValidate: true,
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
          slabBreakup: [
            {
              // slabId: 1,
              userType: "",
              percentage: "",
              fixedRate: "",
              premiumThreshold: "",
              thresholdPercent: "",
              isUserTypeData: false,
              isUserTypeValidate: true,
              isPercentageData: false,
              isPercentageValidate: true,
              isFixedRateData: false,
              isFixedRateValidate: true,
              isPremiumThresholdData: false,
              isPremiumThresholdValidate: true,
              isThresholdPercentdData: false,
              isThresholdPercentValidate: true,
            },
          ],
        },
      ],
    }));
  };

  const handleRemoveSlab = (index) => {
    const list = [...state.ruleSlabs];
    list.splice(index, 1);
    setState((prevState) => ({
      ...prevState,
      isAddFormSubmitDisabled: true,
      ruleSlabs: list,
    }));
  };

  const handlePrice = (e, index) => {
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
          isAddFormSubmitDisabled: true,
        }));
      } else if (!value || value === NaN) {
        list[index][name] = value;
        list[index]["isMinPriceData"] = true;
        list[index]["isMinPriceValidate"] = true;
        setState((prevState) => ({
          ...prevState,
          ruleSlabs: list,
          isAddFormSubmitDisabled: false,
        }));
      }
    }
    if (name === "slabEnd") {
      if (value) {
        list[index][name] = value;
        list[index]["isMaxPriceData"] = false;
        list[index]["isMaxPriceValidate"] = false;
        setState((prevState) => ({
          ...prevState,
          ruleSlabs: list,
          isAddFormSubmitDisabled: true,
        }));
      } else if (!value) {
        list[index][name] = value;
        list[index]["isMaxPriceData"] = true;
        // list[index]["isMaxPriceCondition"] = true;
        setState((prevState) => ({
          ...prevState,
          ruleSlabs: list,
          // isAddFormSubmitDisabled: false,
        }));
      }
      if (value <= list[index]["slabStart"]) {
        list[index][name] = value;
        list[index]["isMaxPriceCondition"] = true;
        list[index]["isMaxPriceValidate"] = true;
        setState((prevState) => ({
          ...prevState,
          ruleSlabs: list,
          isAddFormSubmitDisabled: false,
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
          isAddFormSubmitDisabled: true,
        }));
      } else if (!value || value === NaN) {
        list[index][name] = value;
        list[index]["isMinCountData"] = true;
        list[index]["isMinCountValidate"] = true;
        setState((prevState) => ({
          ...prevState,
          ruleSlabs: list,
          isAddFormSubmitDisabled: false,
        }));
      }
    }
    if (name === "slabEndCount") {
      if (value) {
        list[index][name] = value;
        list[index]["isMaxCountData"] = false;
        list[index]["isMaxCountValidate"] = false;
        setState((prevState) => ({
          ...prevState,
          ruleSlabs: list,
          isAddFormSubmitDisabled: true,
        }));
      } else if (!value) {
        list[index][name] = value;
        list[index]["isMaxCountData"] = true;
        // list[index]["isMaxPriceCondition"] = true;
        setState((prevState) => ({
          ...prevState,
          ruleSlabs: list,
          // isAddFormSubmitDisabled: false,
        }));
      }
      if (value <= list[index]["slabStartCount"]) {
        list[index][name] = value;
        list[index]["isMaxCountCondition"] = true;
        list[index]["isMaxCountValidate"] = true;
        setState((prevState) => ({
          ...prevState,
          ruleSlabs: list,
          isAddFormSubmitDisabled: false,
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

  const handleUserTypeChange = (e, value, parentIndex, childIndex) => {
    const list = [...state.ruleSlabs];
    if (value) {
      const userTypeInfo = (state.userTypeData || []).filter(
        (n) => n.name === value
      )[0];
      list[parentIndex].slabBreakup[childIndex]["userType"] = (
        userTypeInfo || {}
      ).id;
      list[parentIndex].slabBreakup[childIndex]["isUserTypeData"] = false;
      list[parentIndex].slabBreakup[childIndex]["isUserTypeValidate"] = false;
      setState((prevState) => ({
        ...prevState,
        isAddFormSubmitDisabled: true,
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
        isAddFormSubmitDisabled: true,
      }));
    } else if (!value) {
      list[parentIndex].slabBreakup[childIndex]["percentage"] = value;
      list[parentIndex].slabBreakup[childIndex]["isPercentageData"] = true;
      // list[parentIndex].slabBreakup[childIndex]["ispercentageValidate"] = false;
      setState((prevState) => ({
        ...prevState,
        ruleSlabs: list,
        // isAddFormSubmitDisabled: true,
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
        isAddFormSubmitDisabled: true,
      }));
    } else if (!value) {
      list[parentIndex].slabBreakup[childIndex]["fixedRate"] = value;
      list[parentIndex].slabBreakup[childIndex]["isFixedRateData"] = true;
      // list[parentIndex].slabBreakup[childIndex]["ispercentageValidate"] = false;
      setState((prevState) => ({
        ...prevState,
        ruleSlabs: list,
        // isAddFormSubmitDisabled: true,
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
        isAddFormSubmitDisabled: true,
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
        // isAddFormSubmitDisabled: true,
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
        isAddFormSubmitDisabled: true,
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
        // isAddFormSubmitDisabled: true,
      }));
    }
  };

  const handleAddSubSlab = (parentIndex) => {
    const list = [...state.ruleSlabs];
    let child = list.map((n) => n.slabBreakup);
    // console.log("parent", child[0][child[0].length - 1].slabId + 1);
    list[parentIndex].slabBreakup.push({
      // slabId: child[0][child[0].length - 1].slabId + 1,
      userType: "",
      percentage: "",
      fixedRate: "",
      premiumThreshold: "",
      thresholdPercent: "",
      isSubSlabActive: true,
      isUserTypeData: false,
      isUserTypeValidate: true,
      isPercentageData: false,
      isPercentageValidate: true,
      isFixedRateData: false,
      isFixedRateValidate: true,
      isPremiumThresholdData: false,
      isPremiumThresholdValidate: true,
      isThresholdPercentValidate: false,
      isThresholdPercentValidate: true,
    });
    setState((prevState) => ({
      ...prevState,
      ruleSlabs: list,
    }));
  };

  const handleRemoveSubSlab = (parentIndex, childIndex) => {
    if (childIndex === 0) {
      const list = [...state.ruleSlabs];
      list[parentIndex].slabBreakup.splice(childIndex, 1);
      setState((prevState) => ({
        ...prevState,
        ruleSlabs: list,
        isAddFormSubmitDisabled: true,
      }));
      handleSubSlab();
    } else {
      const list = [...state.ruleSlabs];
      list[parentIndex].slabBreakup.splice(childIndex, 1);
      setState((prevState) => ({
        ...prevState,
        ruleSlabs: list,
        isAddFormSubmitDisabled: true,
      }));
    }
  };

  const handleSubSlab = () => {
    const list = state.ruleSlabs.map((n) => n.slabBreakup);
    list.map((m) => (m[0].isSubSlabActive = false));
  };

  const handleRuleUserTypeChange = (e, value, index) => {
    const list = [...state.ruleBreakup];
    if (value) {
      const userTypeInfo = (state.ruleUserTypeData || []).filter(
        (n) => n.name === value
      )[0];
      list[index]["userType"] = (userTypeInfo || {}).id;
      list[index]["isRuleUserTypeData"] = false;
      list[index]["isRuleUserTypeValidate"] = false;
      setState((prevState) => ({
        ...prevState,
        ruleBreakup: list,
        isAddFormSubmitDisabled: true,
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
        isAddFormSubmitDisabled: true,
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
        isAddFormSubmitDisabled: true,
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
        isAddFormSubmitDisabled: true,
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
        isAddFormSubmitDisabled: true,
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
    setState((prevState) => ({
      ...prevState,
      ruleBreakup: [
        ...state.ruleBreakup,
        {
          // ruleId:
          //   prevState.ruleBreakup[prevState.ruleBreakup.length - 1].ruleId + 1,
          userType: "",
          percentage: "",
          fixedRate: "",
          thresholdPercent: "",
          premiumThreshold: "",
          isRuleUserTypeData: false,
          isRulePercentageData: false,
          isRuleFixedRateData: false,
          isRuleThresholdPercentData: false,
          isRulePremiumThresholdData: false,
          isRuleUserTypeValidate: true,
          isRulePercentageValidate: true,
          isRuleFixedRateValidate: true,
          isRuleThresholdPercentValidate: true,
          isRulePremiumThresholdVaidate: true,
        },
      ],
    }));
  };

  const handleRemoveRule = (index) => {
    const list = [...state.ruleBreakup];
    list.splice(index, 1);
    setState((prevState) => ({
      ...prevState,
      ruleBreakup: list,
      isAddFormSubmitDisabled: true,
    }));
  };

  const handleAddFormChange = (e) => {
    const { name, value } = e.target;
    if (name === "name") {
      if (value) {
        setState((prevState) => ({
          ...prevState,
          [name]: value,
          isNameData: false,
          isAddFormSubmitDisabled: true,
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

  const handleSelectChange = (event) => {
    setState((prevState) => ({
      ...prevState,
      breakupType: event.target.value,
    }));

    if (event.target.value === 1) {
      setState((prevState) => ({
        ...prevState,
        // isSlabActive: true,
        isSlabTypeActive: true,
        isRuleActive: false,
        isBreakUpData: false,
        isRulePayTypeActive: false,
      }));
    }

    if (event.target.value === 2) {
      setState((prevState) => ({
        ...prevState,
        // isRuleActive: true,
        isRulePayTypeActive: true,
        isSlabActive: false,
        isBreakUpData: false,
        isSlabTypeActive: false,
        isPayTypeActive: false,
      }));
    }

    if (event.target.value === "") {
      setState((prevState) => ({
        ...prevState,
        isRuleActive: false,
        isSlabActive: false,
        isBreakUpData: true,
        isAddFormSubmitDisabled: false,
        isSlabTypeActive: false,
        isPayTypeActive: false,
        isRulePayTypeActive: false,
        slabType: "",
        payType: "",
        rulePayType: "",
      }));
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
        isAddFormSubmitDisabled: false,
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
        isAddFormSubmitDisabled: false,
        rulePayData: true,
      }));
    }
  };

  let history = useHistory();

  const handleAddFormDataSubmit = () => {
    let ruleSlabFiltered = state.ruleSlabs.map((n) => {
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

    let ruleFiltered = state.ruleBreakup.map((n) => {
      delete n.isRuleUserTypeData;
      delete n.isRulePercentageData;
      delete n.isRuleFixedRateData;
      delete n.isRuleThresholdPercentData;
      delete n.isRulePremiumThresholdData;
      delete n.isRuleUserTypeValidate;
      delete n.isRulePercentageValidate;
      delete n.isRuleFixedRateValidate;
      delete n.isRuleThresholdPercentValidate;
      delete n.isRulePremiumThresholdVaidate;
      return n;
    });

    if (state.breakupType === 1) {
      const postObj = {
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

      apipostUrl(`/insurance/commission/rules`, postObj)
        .then((res) => {
          if (`${res.data.responseCode}` === "200") {
            getSuccessUpdate("add");
            callLocalBaseURL();
            closeAddCommission();
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
          // getErrorUpdate(err.data.responseMessage);
          ippNotify.error(err.data.responseMessage);
        });
    } else if (state.breakupType === 2) {
      const postObj = {
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
        slabType: state.slabTypeValue,
        payOfType: state.rulePayType,
      };

      apipostUrl(`/insurance/commission/rules`, postObj)
        .then((res) => {
          if (`${res.data.responseCode}` === "200") {
            getSuccessUpdate("add");
            callLocalBaseURL();
            closeAddCommission();
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
          // getErrorUpdate(err.data.responseMessage);
          ippNotify.error(err.data.responseMessage);
        });
    }
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
                  label={<IntlMessages id="CommissionManagement.Add.Name" />}
                  name="name"
                  onChange={(e) => handleAddFormChange(e)}
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
                    <IntlMessages id="CommissionManagement.Add.Description" />
                  }
                  name="description"
                  onChange={(e) => handleAddFormChange(e)}
                  value={state.description}
                  fullWidth
                />
              </div>
              <div className="col-lg-3">
                <InputAutocomplete
                  className="mb-4"
                  id="providerName"
                  name="providerName"
                  options={(state.providerData || []).map((n) => n.name)}
                  onChange={handleProviderChange}
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
                        <IntlMessages id="CommissionManagement.Add.Provider" />
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
                  options={(state.productData || []).map((n) => n.name)}
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
                        <IntlMessages id="CommissionManagement.Add.Product" />
                      }
                      variant="outlined"
                    />
                  )}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-lg-12 col-sm-12 col-12 mb-3 ml-2">
                <LocationFilter handler={handler} />
              </div>
            </div>
            <div className="row mr-auto">
              <div className="col-md-3 mb-3">
                <InputDatePicker
                  filterDate={(d) => {
                    return new Date() < d;
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
                        <IntlMessages id="CommissionManagement.Add.StartDate" />
                      }
                      variant="outlined"
                    />
                  }
                />
              </div>

              <div className="col-md-3 mb-3">
                <InputDatePicker
                  filterDate={(d) => {
                    return new Date() < d;
                  }}
                  name="endDate"
                  selected={state.endDate}
                  selectsEnd
                  startDate={state.startDate}
                  endDate={state.endDate}
                  minDate={state.startDate}
                  onChange={handleEndDate}
                  disabled={state.isEndDateDisabled}
                  customInput={
                    <TextField
                      style={{ width: "100%" }}
                      label={
                        <IntlMessages id="CommissionManagement.Add.EndDate" />
                      }
                      variant="outlined"
                    />
                  }
                />
              </div>

              <div className="col-md-3">
                <FormControl
                  variant="outlined"
                  className={classes.formControl}
                  required
                  error={state.isBreakUpData}
                >
                  <InputLabel id="demo-simple-select-outlined-label">
                    <IntlMessages id="CommissionManagement.Add.BreakupType" />
                  </InputLabel>
                  <InputSelect
                    labelId="demo-simple-select-outlined-label"
                    id="demo-simple-select-outlined"
                    value={state.breakupType}
                    renderValue={(value) => `${value}`}
                    onChange={handleSelectChange}
                    label={
                      <IntlMessages id="CommissionManagement.Add.BreakupType" />
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

              {state.isSlabTypeActive ? (
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
                    <InputSelect
                      labelId="demo-simple-select-outlined-label"
                      id="demo-simple-select-outlined"
                      value={state.slabType}
                      renderValue={(value) => `${value}`}
                      onChange={handleSelectSlabTypeChange}
                      // label={
                      //   <IntlMessages id="CommissionManagement.Add.BreakupType" />
                      // }
                      label="Slab Type"
                    >
                      <MenuItem value="">
                        <em>Select</em>
                      </MenuItem>
                      {state.slabData.map((n) => {
                        return <MenuItem value={n.id}>{n.name}</MenuItem>;
                      })}
                      {/* <MenuItem value={3}>Premium Amount</MenuItem>
                      <MenuItem value={4}>Premium Count</MenuItem> */}
                    </InputSelect>
                    {state.slabTypeData ? (
                      <FormHelperText style={{ color: "red" }}>
                        Slab Type is Required
                      </FormHelperText>
                    ) : null}
                  </FormControl>
                </div>
              ) : state.isRulePayTypeActive ? (
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
                      {state.rulePaymentTypeData.map((n) => {
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
            <div className="row mt-4">
              {state.isPayTypeActive ? (
                <div className="col-lg-3">
                  <FormControl
                    variant="outlined"
                    className={classes.formControl}
                    required
                    error={state.payTypeData}
                  >
                    <InputLabel id="demo-simple-select-outlined-label">
                      Payment Type
                    </InputLabel>
                    <InputSelect
                      labelId="demo-simple-select-outlined-label"
                      id="demo-simple-select-outlined"
                      value={state.payType}
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
                      {state.paymentTypeData.map((n) => {
                        return <MenuItem value={n.id}>{n.name}</MenuItem>;
                      })}
                      {/* <MenuItem value={5}>Percentage</MenuItem>
                      <MenuItem value={6}>Fixed Rate</MenuItem> */}
                    </InputSelect>
                    {state.payTypeData ? (
                      <FormHelperText style={{ color: "red" }}>
                        Payment Type is Required
                      </FormHelperText>
                    ) : null}
                  </FormControl>
                </div>
              ) : null}
            </div>

            {/* <div className="row mt-3"> */}
            {state.isSlabActive ? (
              <>
                <SlabCommissionManagement
                  ruleSlabs={state.ruleSlabs}
                  userTypeData={state.userTypeData}
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
            ) : state.isRuleActive ? (
              <div>
                <RuleCommissionManagement
                  handleRemoveRule={handleRemoveRule}
                  ruleUserTypeData={state.ruleUserTypeData}
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
              </div>
            ) : null}

            <div className="row mt-5">
              <div className="col-lg-4"></div>
              <div className="col-lg-3">
                <InputCancelButton onClick={handleRequestClose} />
                <InputSubmitButton
                  onClick={(e) => handleAddFormDataSubmit(e)}
                  disabled={!state.isAddFormSubmitDisabled}
                />
              </div>
            </div>
          </div>
        </CardBox>
      </div>
    </>
  );
};

export default AddCommissionManagement;
