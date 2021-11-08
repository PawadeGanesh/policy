import React from "react";
import InputAutocomplete from "../CommonComponents/Autocomplete";
import { TextField, Button } from "@material-ui/core";
import RemoveCircleOutlineIcon from "@material-ui/icons/RemoveCircleOutline";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import InputField from "../CommonComponents/TextField";
import "./root.component.css";
import IntlMessages from "util/IntlMessages";

const EditRuleCommissionManagement = ({
  handleRuleUserTypeChange,
  ruleUserTypeData,
  handleRulePercentageChange,
  handleRuleFixedRateChange,
  handleRuleThresholdPercentChange,
  handleRulePremiumThresholdChange,
  handleAddRule,
  handleRemoveRule,
  ruleBreakup,
  rulePayType,
}) => {
  const getUserTypeSelected = (userTypeId) => {
    const item = (ruleUserTypeData || []).find((n) => n.id === userTypeId);
    return (item || {}).name;
  };
  return (
    <>
      <div className="mt-5">
        <fieldset>
          <legend class="fieldLegend">
            <IntlMessages id="CommissionManagement.Edit.AddRuleBreakUp" />
          </legend>
          <div className="row">
            {(ruleBreakup || []).map((x, i) => {
              return (
                <>
                  <div className="col-lg-11">
                    <div className="row ml-auto">
                      <div className="col-lg-3 mt-3">
                        <InputAutocomplete
                          className="mb-4"
                          id="userTypeName"
                          name="userTypeName"
                          options={(ruleUserTypeData || []).map((n) => n.name)}
                          value={getUserTypeSelected(x.userType) || ""}
                          onChange={(e, value) =>
                            handleRuleUserTypeChange(e, value, i)
                          }
                          fullWidth
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              error={x.isRuleUserTypeData}
                              helperText={
                                x.isRuleUserTypeData
                                  ? "UserType is Required"
                                  : null
                              }
                              label={
                                <IntlMessages id="CommissionManagement.Edit.userType" />
                              }
                              variant="outlined"
                            />
                          )}
                        />
                      </div>

                      <div className="col-md-3 mt-3 ">
                        {rulePayType === 1007 ? (
                          <InputField
                            error={x.isRulePercentageData}
                            required
                            className="mb-3"
                            autoFocus
                            id="percentage"
                            label={
                              <IntlMessages id="CommissionManagement.Add.Percentage" />
                            }
                            name="percentage"
                            type="number"
                            helperText={
                              x.isRulePercentageData
                                ? "Percentage is Required"
                                : null
                            }
                            onChange={(e) => handleRulePercentageChange(e, i)}
                            value={x.percentage}
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
                        ) : rulePayType === 1006 ? (
                          <InputField
                            error={x.isRuleFixedRateData}
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
                              x.isRuleFixedRateData
                                ? "FixedRateData is Required"
                                : null
                            }
                            onChange={(e) => handleRuleFixedRateChange(e, i)}
                            value={x.fixedRate}
                            fullWidth
                          />
                        ) : null}
                      </div>

                      <div className="col-md-3 mt-3 ">
                        <InputField
                          error={x.isRuleThresholdPercentData}
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
                            x.isRuleThresholdPercentData
                              ? "ThresholdPercent is Required"
                              : null
                          }
                          onChange={(e) =>
                            handleRuleThresholdPercentChange(e, i)
                          }
                          value={x.thresholdPercent}
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
                      <div className="col-md-3 mt-3 ">
                        <InputField
                          error={x.isRulePremiumThresholdData}
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
                            x.isRulePremiumThresholdData
                              ? "ThresholdPercent is Required"
                              : null
                          }
                          onChange={(e) =>
                            handleRulePremiumThresholdChange(e, i)
                          }
                          value={x.premiumThreshold}
                          fullWidth
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-1">
                    <div className="col-lg-3 mt-3">
                      {ruleBreakup.length - 1 === i && (
                        <AddCircleOutlineIcon
                          style={{
                            cursor: "pointer",
                            marginRight: "10px",
                          }}
                          onClick={handleAddRule}
                        />
                      )}
                      {ruleBreakup.length !== 1 && (
                        <RemoveCircleOutlineIcon
                          style={{ cursor: "pointer" }}
                          onClick={() => handleRemoveRule(i, x.id)}
                        />
                      )}
                    </div>
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

export default EditRuleCommissionManagement;
