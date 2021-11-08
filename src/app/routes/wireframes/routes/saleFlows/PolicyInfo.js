import React, { useState, useEffect } from "react";
import ContainerHeader from "components/ContainerHeader";
import IntlMessages from "util/IntlMessages";
import axios from "axios";
import "./master.css";
import {
    // Button,
    Grid,
} from "@material-ui/core";
import URLSearchParams from "url-search-params";
import apiInstance from "setup";
import TextsmsIcon from '@material-ui/icons/Textsms';
import { Button } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { useHistory } from "react-router-dom";
import { apigetUrl, apiputUrl,apipostUrl } from "../../../../../setup/middleware";
import { IPPNotification, ippNotify, } from "../../../widgets/routes/CommonComponents/IPPNotification";

const baseURL = `${process.env.REACT_APP_BASE_URL}`;
const api = axios.create({
    baseURL: baseURL,
});



const PolicyInfo = (props) => {
    const [state, setState] = useState({
        policyNumber: '',
        linkToDownloadPolicy: '',
        policyInfo: {},
        feedback_DialogOpen: false,
    });

    let history = useHistory();

    useEffect(() => {
        const params = new URLSearchParams(props.location.search);
        let policyNum = params.get("policyNum");
        let paymentTxnId = params.get("paymentTxnId");
        // get quoteId, enquiryid form 'localStorage', which were set in "salesFlows/index.js" file
        let quoteId = localStorage.getItem('quoteId');
        let enquiryid = localStorage.getItem('enquiryid');
        let policyId = localStorage.getItem('policyId');

        setState((prevState) => ({
            ...prevState,
            policyNumber: policyNum,
            paymentTxnId,
            quoteId,
            enquiryid,
            policyId
        }));

        let url = `/insurance/enquiry/${enquiryid}/quotes/${quoteId}/payment`
        let data = { policyNum, paymentTxnId };
        api.post(
            baseURL + url,
            data,
            apiInstance
        ).then(async (response) => {
            console.log("##payment record API response", response);
            if(response.status === 200 & response.data.status === 4){
                setState((prevState) => ({
                    ...prevState,
                    policyInfo: response.data
                }));
            } else {
                let res = await getPolicyInfo(policyId);
                if(res.status === 200 && res.data){
                    let { status } = res.data;    

                    if (status === 4) {
                        setState((prevState) => ({
                            ...prevState,
                            policyInfo: response.data
                        }));
                    } else if (status === 0) {
                        setState((prevState) => ({
                            ...prevState,
                            isErrorAlert: true,
                            errorMsg: (res.data || {}).remarks || "Policy status is '0'"
                        }));
                    }
                  }
            }
        }).catch((err) => {
            setState((prevState) => ({
                ...prevState,
                err: err.response.data,
            }));
        });
    }, []);

    const getPolicyInfo = async (policyId) => {
        let url = `/insurance/policy/${policyId}`;
        let res = await api.get(url, apiInstance);
        if (res.status === 200 && res.data && [0, 2].includes(res.data.status)) {
            return res;
        } else {
            // this same API after 5 sec
            setTimeout(() => {
                this.getPolicyInfo(policyId);
            }, 5000);
        }
    }
    // handling download
    const handleDownload = () => {
        return true;
    }


    const onFeedBackButtonClick = () => {

        setState((prevState) => ({
            ...prevState,
            feedback_DialogOpen: true,
        }));
    };


    const feedback_ByCustomer = async () => {
        let policyid=localStorage.getItem('policyId')
        const result = await apigetUrl(`/insurance/feedback/self/trigger/${policyid}` );
        if (result.status === 200) {
            ippNotify.success(result.data.responseMessage)
            setState((prevState) => ({
                ...prevState,
                feedback_DialogOpen: false,
            }));
        }
        else{
            ippNotify.error(result.data.responseMessage)
        }
    };


    const feedback_ByAgent = () => {
        let policyid=localStorage.getItem('policyId')
        history.push({
            pathname: "/app/widgets/AgentFeedback",
            state: {
              policyName: "Health Insurance",
              policyId: policyid,
            },
          });
    };

    const feedback_content = (
        <>
        <DialogTitle>
            Feedback
        </DialogTitle>
        <DialogContent>
            <p>
                <b>
                Feedback will be provided by?
                </b>
            </p>
        </DialogContent>
        <DialogActions>
            <Button onClick={(e) => feedback_ByCustomer(e)} color="secondary">
                Customer
            </Button>
            <Button onClick={(e) => feedback_ByAgent(e)} color="primary">
               Agent
            </Button>
        </DialogActions>
        </>
    );


    return (
        <div className="animated slideInUpTiny animation-duration-3">
            <ContainerHeader match={props.match} title={<IntlMessages id="Policy.successfull.info" />} />
            <IPPNotification/>
            <div className="App">
                <Grid container spacing={1}>
                    <Grid item xs={12} style={{ textAlign: 'center' }}>
                        <div className="policy-info-box" style={{ padding: '20px' }}>
                                        <div className="col-xl-12 col-sm-12 order-xl-1">
                                            <h1> Successfully issued policy </h1>
                                        </div>
                                        <div className="col-xl-12 col-sm-12 order-xl-1">
                                            Policy number/Id : <b> {state.policyNumber} </b>
                                        </div>
                                        {
                                            !state.linkToDownloadPolicy ? '' : (
                                                <div className="col-xl-12 col-sm-12 order-xl-1">
                                                    <button onClick={handleDownload}>Plesae click here to download your Policy (pdf file)</button>
                                                </div>
                                            )
                                        }
                                        <br />
                                        <div className="col-xl-12 col-sm-12 order-xl-1">

                                            <Button
                                                variant="contained"
                                                color="primary"
                                                endIcon={<TextsmsIcon />}
                                                onClick={onFeedBackButtonClick}
                                            >
                                                Please Share Your Feedback
                                 </Button>
                                        </div>
                                    </div>

                                    {
                            (state.isErrorAlert && state.errorMsg) ? (
							<div className="col-xl-12 col-sm-12 order-xl-1">
                                <br></br>
                                    <h3 style={{ color: 'red' }}> ${state.errorMsg} </h3>
                                </div>
							):null
                        }
                        <Dialog
                            maxWidth="sm"
                            open={state.feedback_DialogOpen}
                        >
                            {feedback_content}
                        </Dialog>
                    </Grid>
                </Grid>
            </div>
        </div>
    );
};

export default PolicyInfo;
