import React from "react";
import { TextField } from "@material-ui/core";
import InputField from "../CommonComponents/TextField";
import InputAutocomplete from "../CommonComponents/Autocomplete";
import InputAddButton from "../CommonComponents/AddButton";
import InputCancelButton from "../CommonComponents/CancelButton";
import RemoveCircleOutlineIcon from "@material-ui/icons/RemoveCircleOutline";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import IntlMessages from "util/IntlMessages";
import "./root.component.css";

const EditSlabCommissionManagement = ({
  ruleSlabs,
  userTypeData,
  handleUserTypeChange,
  handlePercentageChange,
  handleFixedRateChange,
  handlePremiumThresholdChange,
  handleThresholdPercentChange,
  handleAddSubSlab,
  handleRemoveSubSlab,
  handleAddSlab,
  handleRemoveSlab,
  handlePrice,
  handleCount,
  slabType,
  payType,
}) => {
  const getUserTypeSelected = (userTypeId) => {
    const item = (userTypeData || []).find((n) => n.id === userTypeId);
    return (item || {}).name;
  };

  return (
    <>
      <div className="mt-5">
        <fieldset>
          <legend class="fieldLegend">
            <IntlMessages id="CommissionManagement.Edit.AddSlabBreakUp" />
          </legend>
          <div>
            {(ruleSlabs || []).map((x, i) => {
              return (
                <>
                  <div className="row mt-2 pl-3">
                    {slabType === 1004 ? (
                      <>
                        <div className="col-lg-4 mt-3 ml-2">
                          <InputField
                            error={x.isMinPriceData}
                            required
                            className="mb-3"
                            autoFocus
                            id="slabStart"
                            label={
                              <IntlMessages id="CommissionManagement.Add.MinRangein" />
                            }
                            name="slabStart"
                            type="number"
                            onChange={(e) => handlePrice(e, i)}
                            helperText={
                              x.isMinPriceData
                                ? "Minumum Range is Required"
                                : null
                            }
                            value={x.slabStart}
                            fullWidth
                          />
                        </div>

                        {x.isMaxPriceData ? (
                          <div className="col-lg-4 mt-3">
                            <InputField
                              error
                              required
                              className="mb-3"
                              autoFocus
                              id="slabEnd"
                              label={
                                <IntlMessages id="CommissionManagement.Add.MaxRangein" />
                              }
                              name="slabEnd"
                              type="number"
                              //   error={state.errors.name}
                              onChange={(e) => handlePrice(e, i)}
                              helperText="Max Range is Required"
                              value={x.slabEnd}
                              fullWidth
                            />
                          </div>
                        ) : x.isMaxPriceCondition ? (
                          <div className="col-lg-4 mt-3">
                            <InputField
                              error
                              required
                              className="mb-3"
                              autoFocus
                              id="slabEnd"
                              label={
                                <IntlMessages id="CommissionManagement.Add.MaxRangein" />
                              }
                              name="slabEnd"
                              type="number"
                              //   error={state.errors.name}
                              onChange={(e) => handlePrice(e, i)}
                              helperText="Max Range should be greter than Min Range"
                              value={x.slabEnd}
                              fullWidth
                            />
                          </div>
                        ) : x.isMinPriceNull ? (
                          <div className="col-lg-4 mt-3">
                            <InputField
                              error
                              required
                              className="mb-3"
                              autoFocus
                              id="slabEnd"
                              label={
                                <IntlMessages id="CommissionManagement.Add.MaxRangein" />
                              }
                              name="slabEnd"
                              type="number"
                              //   error={state.errors.name}
                              onChange={(e) => handlePrice(e, i)}
                              helperText="Min Range should not Empty, Please Enter Min Range"
                              value={x.slabEnd}
                              fullWidth
                            />
                          </div>
                        ) : (
                          <div className="col-lg-4 mt-3">
                            <InputField
                              required
                              className="mb-3"
                              autoFocus
                              id="slabEnd"
                              label={
                                <IntlMessages id="CommissionManagement.Add.MaxRangein" />
                              }
                              name="slabEnd"
                              type="number"
                              //   error={state.errors.name}
                              onChange={(e) => handlePrice(e, i)}
                              //   helperText={state.errors.name}
                              value={x.slabEnd}
                              fullWidth
                            />
                          </div>
                        )}
                      </>
                    ) : slabType === 1005 ? (
                      <>
                        <div className="col-lg-4 mt-3 ml-2">
                          <InputField
                            error={x.isMinCountData}
                            required
                            className="mb-3"
                            autoFocus
                            id="slabStartCount"
                            // label={
                            //   <IntlMessages id="CommissionManagement.Add.MinRangein" />
                            // }
                            label="Min Count"
                            name="slabStartCount"
                            type="number"
                            onChange={(e) => handleCount(e, i)}
                            helperText={
                              x.isMinPriceData
                                ? "Minumum Count is Required"
                                : null
                            }
                            value={x.slabStartCount}
                            fullWidth
                          />
                        </div>

                        {x.isMaxCountData ? (
                          <div className="col-lg-4 mt-3">
                            <InputField
                              error
                              required
                              className="mb-3"
                              autoFocus
                              id="slabEndCount"
                              // label={
                              //   <IntlMessages id="CommissionManagement.Add.MaxRangein" />
                              // }
                              label="Max Count"
                              name="slabEndCount"
                              type="number"
                              //   error={state.errors.name}
                              onChange={(e) => handleCount(e, i)}
                              helperText="Max Count is Required"
                              value={x.slabEndCount}
                              fullWidth
                            />
                          </div>
                        ) : x.isMaxCountCondition ? (
                          <div className="col-lg-4 mt-3">
                            <InputField
                              error
                              required
                              className="mb-3"
                              autoFocus
                              id="slabEndCount"
                              // label={
                              //   <IntlMessages id="CommissionManagement.Add.MaxRangein" />
                              // }
                              label="Max Count"
                              name="slabEndCount"
                              type="number"
                              //   error={state.errors.name}
                              onChange={(e) => handleCount(e, i)}
                              helperText="Max Count should be greter than Min Count"
                              value={x.slabEndCount}
                              fullWidth
                            />
                          </div>
                        ) : x.isMinCountNull ? (
                          <div className="col-lg-4 mt-3">
                            <InputField
                              error
                              required
                              className="mb-3"
                              autoFocus
                              id="slabEndCount"
                              // label={
                              //   <IntlMessages id="CommissionManagement.Add.MaxRangein" />
                              // }
                              label="Max Count"
                              name="slabEndCount"
                              type="number"
                              //   error={state.errors.name}
                              onChange={(e) => handleCount(e, i)}
                              helperText="Min Count should not Empty, Please Enter Min Count"
                              value={x.slabEndCount}
                              fullWidth
                            />
                          </div>
                        ) : (
                          <div className="col-lg-4 mt-3">
                            <InputField
                              required
                              className="mb-3"
                              autoFocus
                              id="slabEndCount"
                              // label={
                              //   <IntlMessages id="CommissionManagement.Add.MaxRangein" />
                              // }
                              label="Max Count"
                              name="slabEndCount"
                              type="number"
                              //   error={state.errors.name}
                              onChange={(e) => handleCount(e, i)}
                              //   helperText={state.errors.name}
                              value={x.slabEndCount}
                              fullWidth
                            />
                          </div>
                        )}
                      </>
                    ) : null}

                    <div className="col-lg-2 mt-3">
                      {ruleSlabs.length - 1 === i && (
                        <InputAddButton
                          onClick={() => handleAddSlab(i)}
                          size="small"
                          className="mb-2 mr-2"
                        />
                      )}
                      {ruleSlabs.length !== 1 && (
                        <InputCancelButton
                          onClick={() => handleRemoveSlab(i, x.id)}
                          size="small"
                        />
                      )}
                    </div>
                  </div>
                  <div className="row mb-3">
                    {(x.slabBreakup || []).map((n, j) => {
                      return (
                        <>
                          {n.isSubSlabActive ? (
                            <>
                              <div className="row ml-2 pl-3">
                                <div className="col-lg-3">
                                  <InputAutocomplete
                                    className="mb-4"
                                    id="userTypeId"
                                    name="userTypeId"
                                    options={(userTypeData || []).map(
                                      (n) => n.name
                                    )}
                                    onChange={(e, value) =>
                                      handleUserTypeChange(e, value, i, j)
                                    }
                                    value={
                                      getUserTypeSelected(n.userType) || ""
                                    }
                                    fullWidth
                                    renderInput={(params) => (
                                      <TextField
                                        {...params}
                                        error={n.isUserTypeData}
                                        helperText={
                                          n.isUserTypeData
                                            ? "UserType is Required"
                                            : null
                                        }
                                        label={
                                          <IntlMessages id="CommissionManagement.Add.usersType" />
                                        }
                                        variant="outlined"
                                      />
                                    )}
                                  />
                                </div>
                                <div className="col-lg-3">
                                  {payType === 1007 ? (
                                    <InputField
                                      error={n.isPercentageData}
                                      required
                                      className="mb-3"
                                      autoFocus
                                      id="percentage"
                                      label={
                                        <IntlMessages id="CommissionManagement.Add.Percentages" />
                                      }
                                      name="percentage"
                                      type="number"
                                      helperText={
                                        n.isPercentageData
                                          ? "Percentage is Required"
                                          : null
                                      }
                                      onChange={(e) =>
                                        handlePercentageChange(e, i, j)
                                      }
                                      value={n.percentage}
                                      onInput={(e) => {
                                        e.target.value = Math.max(
                                          0,
                                          parseInt(e.target.value)
                                        )
                                          .toString()
                                          .slice(0, 2);
                                      }}
                                      fullWidth
                                    />
                                  ) : payType === 1006 ? (
                                    <InputField
                                      error={n.isFixedRateData}
                                      required
                                      className="mb-3"
                                      autoFocus
                                      id="fixedRate"
                                      // label={
                                      //   <IntlMessages id="CommissionManagement.Add.Percentage" />
                                      // }
                                      label="FixedRate"
                                      name="fixedRate"
                                      type="number"
                                      helperText={
                                        n.isFixedRateData
                                          ? "FixedRateData is Required"
                                          : null
                                      }
                                      onChange={(e) =>
                                        handleFixedRateChange(e, i, j)
                                      }
                                      value={n.fixedRate}
                                      fullWidth
                                    />
                                  ) : null}
                                </div>
                                <div className="col-md-3">
                                  <InputField
                                    error={n.isPremiumThresholdData}
                                    required
                                    className="mb-3"
                                    autoFocus
                                    id="premiumThreshold"
                                    // label={
                                    //   <IntlMessages id="CommissionManagement.Add.Percentage" />
                                    // }
                                    label="PremiumThreshold"
                                    name="premiumThreshold"
                                    type="number"
                                    helperText={
                                      n.isPremiumThresholdData
                                        ? "ThresholdPercent is Required"
                                        : null
                                    }
                                    onChange={(e) =>
                                      handlePremiumThresholdChange(e, i, j)
                                    }
                                    value={n.premiumThreshold}
                                    fullWidth
                                  />
                                </div>
                                <div className="col-md-3">
                                  <InputField
                                    error={n.isThresholdPercentData}
                                    required
                                    className="mb-3"
                                    autoFocus
                                    id="thresholdPercent"
                                    // label={
                                    //   <IntlMessages id="CommissionManagement.Add.Percentage" />
                                    // }
                                    label="ThresholdPercent"
                                    name="thresholdPercent"
                                    type="number"
                                    helperText={
                                      n.isThresholdPercentData
                                        ? "ThresholdPercent is Required"
                                        : null
                                    }
                                    onChange={(e) =>
                                      handleThresholdPercentChange(e, i, j)
                                    }
                                    value={n.thresholdPercent}
                                    onInput={(e) => {
                                      e.target.value = Math.max(
                                        0,
                                        parseInt(e.target.value)
                                      )
                                        .toString()
                                        .slice(0, 2);
                                    }}
                                    fullWidth
                                  />
                                </div>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="row ml-2 pl-3">
                                <div className="col-lg-3">
                                  <InputAutocomplete
                                    className="mb-4"
                                    id="userTypeId"
                                    name="userTypeId"
                                    options={(userTypeData || []).map(
                                      (n) => n.name
                                    )}
                                    onChange={(e, value) =>
                                      handleUserTypeChange(e, value, i, j)
                                    }
                                    value={
                                      getUserTypeSelected(n.userType) || ""
                                    }
                                    fullWidth
                                    renderInput={(params) => (
                                      <TextField
                                        {...params}
                                        error={n.isUserTypeData}
                                        helperText={
                                          n.isUserTypeData
                                            ? "UserType is Required"
                                            : null
                                        }
                                        label={
                                          <IntlMessages id="CommissionManagement.Add.usersType" />
                                        }
                                        variant="outlined"
                                      />
                                    )}
                                  />
                                </div>
                                <div className="col-lg-3 ">
                                  {payType === 1007 ? (
                                    <InputField
                                      error={n.isPercentageData}
                                      required
                                      className="mb-3"
                                      autoFocus
                                      id="percentage"
                                      label={
                                        <IntlMessages id="CommissionManagement.Add.Percentages" />
                                      }
                                      name="percentage"
                                      type="number"
                                      helperText={
                                        n.isPercentageData
                                          ? "Percentage is Required"
                                          : null
                                      }
                                      onChange={(e) =>
                                        handlePercentageChange(e, i, j)
                                      }
                                      value={n.percentage}
                                      onInput={(e) => {
                                        e.target.value = Math.max(
                                          0,
                                          parseInt(e.target.value)
                                        )
                                          .toString()
                                          .slice(0, 2);
                                      }}
                                      fullWidth
                                    />
                                  ) : payType === 1006 ? (
                                    <InputField
                                      error={n.isFixedRateData}
                                      required
                                      className="mb-3"
                                      autoFocus
                                      id="fixedRate"
                                      // label={
                                      //   <IntlMessages id="CommissionManagement.Add.Percentage" />
                                      // }
                                      label="FixedRate"
                                      name="fixedRate"
                                      type="number"
                                      helperText={
                                        n.isFixedRateData
                                          ? "FixedRateData is Required"
                                          : null
                                      }
                                      onChange={(e) =>
                                        handleFixedRateChange(e, i, j)
                                      }
                                      value={n.fixedRate}
                                      fullWidth
                                    />
                                  ) : null}
                                </div>
                                <div className="col-md-3">
                                  <InputField
                                    error={n.isPremiumThresholdData}
                                    required
                                    className="mb-3"
                                    autoFocus
                                    id="premiumThreshold"
                                    // label={
                                    //   <IntlMessages id="CommissionManagement.Add.Percentage" />
                                    // }
                                    label="PremiumThreshold"
                                    name="premiumThreshold"
                                    type="number"
                                    helperText={
                                      n.isPremiumThresholdData
                                        ? "ThresholdPercent is Required"
                                        : null
                                    }
                                    onChange={(e) =>
                                      handlePremiumThresholdChange(e, i, j)
                                    }
                                    value={n.premiumThreshold}
                                    fullWidth
                                  />
                                </div>
                                <div className="col-md-3">
                                  <InputField
                                    error={n.isThresholdPercentData}
                                    required
                                    className="mb-3"
                                    autoFocus
                                    id="thresholdPercent"
                                    // label={
                                    //   <IntlMessages id="CommissionManagement.Add.Percentage" />
                                    // }
                                    label="ThresholdPercent"
                                    name="thresholdPercent"
                                    type="number"
                                    helperText={
                                      n.isThresholdPercentData
                                        ? "ThresholdPercent is Required"
                                        : null
                                    }
                                    onChange={(e) =>
                                      handleThresholdPercentChange(e, i, j)
                                    }
                                    value={n.thresholdPercent}
                                    onInput={(e) => {
                                      e.target.value = Math.max(
                                        0,
                                        parseInt(e.target.value)
                                      )
                                        .toString()
                                        .slice(0, 2);
                                    }}
                                    fullWidth
                                  />
                                </div>
                              </div>
                            </>
                          )}
                          <div className="col-lg-1">
                            {x.slabBreakup.length === j + 1 && (
                              <AddCircleOutlineIcon
                                style={{
                                  cursor: "pointer",
                                  marginRight: "10px",
                                }}
                                onClick={() => handleAddSubSlab(i)}
                              />
                            )}
                            {x.slabBreakup.length !== 1 && (
                              <RemoveCircleOutlineIcon
                                style={{ cursor: "pointer" }}
                                onClick={() => handleRemoveSubSlab(i, j, n.id)}
                              />
                            )}
                          </div>
                        </>
                      );
                    })}
                  </div>
                </>
              );
            })}
          </div>
        </fieldset>
      </div>
    </>
  );
};

export default EditSlabCommissionManagement;
