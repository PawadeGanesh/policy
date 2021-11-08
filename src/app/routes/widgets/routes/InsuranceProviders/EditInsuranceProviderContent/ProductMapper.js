import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
    Modal,
    TextField,
    Button,
    responsiveFontSizes,
    Checkbox
} from "@material-ui/core";
import IntlMessages from "util/IntlMessages";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { useHistory } from "react-router-dom";

import RemoveCircleOutlineIcon from "@material-ui/icons/RemoveCircleOutline";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import PublishOutlinedIcon from "@material-ui/icons/PublishOutlined";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import "../root.component.css";
import apiInstance from "../../../../../setup/index";
import Joi from "joi-browser";

let inputFileRef = useRef(null);

const ProductMapper = ({
    closeEditProduct,
    page,
    pageCount,
    getSuccessUpdate,
    getErrorUpdate,
    callLocalBaseURL,
    selectedId,
    allDatas,
    stateDataFromParent,
    handleChange,
    handleChangePhotoFileInput,
    handleChangePhotoButton,
    isChecked,
    handleProductName,
    getSelectedItem,
    handleCustomName,
    handleAddClick,
    handleRemoveClick,
    handleEditDataRequestClose,
    handleEditFormDataSubmit
}) => {
    return (
        <div className="cardBox">
            <div className="row">
                <div className="col-lg-6">
                    <TextField
                        required
                        className="mb-4"
                        autoFocus
                        id="name"
                        label={
                            <IntlMessages id="InsuranceProviders.master.modal.edit.felid.Name" />
                        }
                        name="name"
                        value={stateDataFromParent.validation.name}
                        onChange={(e) => handleChange(e)}
                        variant="outlined"
                        fullWidth
                        error={stateDataFromParent.errors.name}
                        helperText={stateDataFromParent.errors.name}
                    />
                </div>

                <div className="col-lg-6">
                    <TextField
                        required
                        className="mb-4"
                        autoFocus
                        id="kafkaTopic"
                        label={
                            <IntlMessages id="InsuranceProviders.master.modal.edit.felid.KakaTopic" />
                        }
                        name="kafkaTopic"
                        value={stateDataFromParent.validation.kafkaTopic}
                        onChange={(e) => handleChange(e)}
                        variant="outlined"
                        fullWidth
                        error={stateDataFromParent.errors.kafkaTopic}
                        helperText={stateDataFromParent.errors.kafkaTopic}
                    />
                </div>
            </div>
            <div className="row mt-3">
                <div className="col-lg-6 mb-2">
                    <TextField
                        autoFocus
                        id="outlined-multiline-static"
                        placeholder="Only JSON data is allowed"
                        label={
                            <IntlMessages id="InsuranceProviders.master.modal.edit.felid.IntegrationDetails" />
                        }
                        name="integrationDetails"
                        multiline
                        rows={5}
                        variant="outlined"
                        fullWidth
                        onChange={(e) => handleChange(e)}
                        value={stateDataFromParent.validation.integrationDetails}
                        error={stateDataFromParent.errors.integrationDetails}
                        helperText={stateDataFromParent.errors.integrationDetails}
                    />
                </div>
                <div className="col-lg-5 uploader">
                    <input
                        onChange={handleChangePhotoFileInput}
                        ref={(input) => (inputFileRef = input)}
                        style={{ display: "none" }}
                        type="file"
                    />

                    <Button
                        className="file"
                        variant="contained"
                        color="primary"
                        startIcon={<PublishOutlinedIcon />}
                        onClick={(e) => {handleChangePhotoButton(e, inputFileRef)}}
                    >
                        {
                            <IntlMessages id="InsuranceProviders.master.modal.edit.felid.UploadImage" />
                        }
                    </Button>

                    {stateDataFromParent.invalidImage === true ? (
                        <div className="imgMsg">{stateDataFromParent.imgMsg}</div>
                    ) : (
                            <span>
                                <img
                                    className="imgPreview"
                                    src={stateDataFromParent.base64 || stateDataFromParent.logo}
                                    // ref={(img) => (imgRef = img)}
                                    width="100px"
                                    height="100px"
                                />
                            </span>
                        )}
                </div>
            </div>
            <div className="mt-4 product-list mx-1 row">
                {
                    (allDatas || []).map((item, i) => {
                        return (
                            <div
                                className="col-4 col-lg-4"
                                key={i}
                            >
                                <FormControlLabel
                                    control={<Checkbox checked={isChecked(item.id)} onChange={(e) => handleCheckedProductList(e, item.id)} name={item.name} />}
                                    label={item.name}
                                />
                            </div>
                        )
                    })
                }
            </div>
            <div className="mt-4 product-list mx-1">
                {stateDataFromParent.productDetail.map((x, i) => {
                    return (
                        <div key={i} className="row px-4 py-1 mb-1">
                            {x.isProductName ? (
                                <div className="col-lg-4">
                                    <Autocomplete
                                        id="productId"
                                        name="productId"
                                        onChange={(e, value) =>
                                            handleProductName(e, value, i, x.productId)
                                        }
                                        options={stateDataFromParent.checkedProductList.map((n) => n.name) || ""}
                                        value={getSelectedItem(x.productId)}
                                        renderInput={(params) => (
                                            <TextField
                                                error
                                                required
                                                {...params}
                                                label={
                                                    <IntlMessages id="InsuranceProviders.master.modal.edit.felid.ProductName" />
                                                }
                                                helperText="ProductName is Required"
                                            />
                                        )}
                                        fullWidth
                                    />
                                </div>
                            ) : (
                                    <div className="col-lg-4">
                                        <Autocomplete
                                            id="productId"
                                            name="productId"
                                            onChange={(e, value) =>
                                                handleProductName(e, value, i, x.productId)
                                            }
                                            options={stateDataFromParent.checkedProductList.map((n) => n.name) || ""}
                                            value={getSelectedItem(x.productId)}
                                            renderInput={(params) => (
                                                <TextField
                                                    required
                                                    {...params}
                                                    label={
                                                        <IntlMessages id="InsuranceProviders.master.modal.edit.felid.ProductName" />
                                                    }
                                                />
                                            )}
                                            fullWidth
                                        />
                                    </div>
                                )}

                            <div className="col-lg-1"></div>
                            <div className="col-lg-4">
                                {x.isData ? (
                                    <TextField
                                        error
                                        required
                                        className="mb-3"
                                        autoFocus
                                        id="customizedName"
                                        label={
                                            <IntlMessages id="InsuranceProviders.master.modal.edit.felid.CustomizedName" />
                                        }
                                        name="customizedName"
                                        value={x.customizedName}
                                        onChange={(e) => handleCustomName(e, i)}
                                        helperText="Customized Name is required"
                                        fullWidth
                                    />
                                ) : (
                                        <TextField
                                            required
                                            className="mb-3"
                                            autoFocus
                                            id="customizedName"
                                            label={
                                                <IntlMessages id="InsuranceProviders.master.modal.edit.felid.CustomizedName" />
                                            }
                                            name="customizedName"
                                            value={x.customizedName}
                                            onChange={(e) => handleCustomName(e, i)}
                                            fullWidth
                                        />
                                    )}
                            </div>
                            <div className="col-lg-1"></div>
                            <div className="col-lg-2">
                                {stateDataFromParent.productDetail.length - 1 === i && (
                                    <AddCircleOutlineIcon
                                        style={{
                                            cursor: "pointer",
                                            marginTop: "20px",
                                            marginRight: "10px",
                                        }}
                                        onClick={handleAddClick}
                                    />
                                )}
                                {stateDataFromParent.productDetail.length !== 1 && (
                                    <RemoveCircleOutlineIcon
                                        style={{ cursor: "pointer", marginTop: "20px" }}
                                        onClick={() => handleRemoveClick(i)}
                                    />
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className="float-right mt-4">
                <Button
                    onClick={(e) => handleEditDataRequestClose(e)}
                    color="secondary"
                    className="mr-2"
                    variant="contained"
                >
                    Cancel
            </Button>
                <Button
                    variant="contained"
                    onClick={(e) => handleEditFormDataSubmit(e)}
                    disabled={!stateDataFromParent.isEditFormSubmitDisabled}
                    color="primary"
                >
                    Submit
            </Button>
            </div>
        </div>
    )
}

export default ProductMapper;