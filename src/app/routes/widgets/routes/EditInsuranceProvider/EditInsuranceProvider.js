// import React, { useState, useEffect } from "react";
// import { useLocation } from "react-router-dom";
// import MaterialTable from "material-table";
// import axios from "axios";
// import { forwardRef } from "react";
// import { Modal, TextField, Button } from "@material-ui/core";
// import Grid from "@material-ui/core/Grid";
// import Checkbox from "@material-ui/core/Checkbox";

// import Autocomplete from "@material-ui/lab/Autocomplete";
// import CircularProgress from "@material-ui/core/CircularProgress";
// import InputLabel from "@material-ui/core/InputLabel";
// import MenuItem from "@material-ui/core/MenuItem";
// import FormControl from "@material-ui/core/FormControl";
// import Select from "@material-ui/core/Select";
// import FormHelperText from "@material-ui/core/FormHelperText";
// import CardBox from "./../../../../../components/CardBox";
// import { makeStyles, useTheme } from "@material-ui/core/styles";
// import Table from "@material-ui/core/Table";
// import TableBody from "@material-ui/core/TableBody";
// import TableCell from "@material-ui/core/TableCell";
// import TableContainer from "@material-ui/core/TableContainer";
// import TableFooter from "@material-ui/core/TableFooter";
// import TablePagination from "@material-ui/core/TablePagination";
// import TableRow from "@material-ui/core/TableRow";
// import Paper from "@material-ui/core/Paper";
// import IconButton from "@material-ui/core/IconButton";
// import FirstPageIcon from "@material-ui/icons/FirstPage";
// import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
// import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
// import LastPageIcon from "@material-ui/icons/LastPage";
// import { useAsyncDebounce } from "react-table";
// import AddIcon from "@material-ui/icons/Add";
// import { AndroidSharp } from "@material-ui/icons";
// import InfoModal from "../Modal/Info";
// import SuccessModal from "../Modal/Success";
// import ErrorModal from "../Modal/Error";
// import { useHistory } from "react-router-dom";
// import TextareaAutosize from "@material-ui/core/TextareaAutosize";
// import RemoveCircleOutlineIcon from "@material-ui/icons/RemoveCircleOutline";
// import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
// import "./style.css";

// const config = {
//   headers: {
//     accept: "application/json",
//   },
//   data: {},
// };

// const baseURL = `${process.env.REACT_APP_BASE_URL}`;
// const api = axios.create({
//   baseURL: baseURL,
// });

// const EditInsuranceProvider = () => {
//   const [state, setState] = useState({
//     selectedEditId: "",
//     name: "",
//     kafka_topic: "",
//     logo: "",
//     integrationDetails: "",
//     productDetail: [],
//     allData: [],
//   });

//   console.log("productDetails", state.allData);

//   let history = useHistory();

//   const location = useLocation();

//   useEffect(() => {
//     setState((prevState) => ({
//       ...prevState,
//       selectedEditId: location.state.selectedEditId,
//       name: location.state.name,
//       kafka_topic: location.state.kafka_topic,
//       integrationDetails: JSON.stringify(location.state.integrationDetails),
//       productDetail: location.state.productDetail,
//       logo: location.state.logo,
//     }));
//     getProductName();
//   }, [location]);

//   const getProductName = () => {
//     axios.get(baseURL + "/insurance/products?page=2&limit=1000").then((res) => {
//       setState((prevState) => ({
//         ...prevState,
//         allData: res.data.dataList,
//       }));
//     });
//   };

//   const handleEditDataRequestClose = () => {
//     history.push("/app/widgets/InsuranceProviders");
//   };

//   const handleEditFormDataSubmit = () => {};

//   const handleProductName = () => {};

//   const handleRemoveClick = (index) => {
//     const list = [...state.productDetail];
//     list.splice(index, 1);
//     setState((prevState) => ({
//       ...prevState,
//       productDetail: list,
//     }));
//     // setInputList(list);
//   };

//   const handleAddClick = () => {
//     setState((prevState) => ({
//       ...prevState,
//       productDetail: [
//         ...state.productDetail,
//         { productName: "", customized_name: "" },
//       ],
//     }));
//   };

//   return (
//     <div className="row">
//       <div className="col-lg-4">
//         <h3 className="audit-header">Edit Insurance Provider</h3>
//       </div>
//       <CardBox styleName="col-md-12">
//         <div className="cardBox">
//           <div className="row">
//             <div className="col-lg-4">
//               <TextField
//                 required
//                 className="mb-4"
//                 autoFocus
//                 id="name"
//                 label="Name"
//                 name="name"
//                 value={state.name}
//                 fullWidth
//               />
//             </div>

//             <div className="col-lg-4">
//               <TextField
//                 required
//                 className="mb-4"
//                 autoFocus
//                 id="kafka_topic"
//                 label="Kafka Topic"
//                 name="kafka_topic"
//                 value={state.kafka_topic}
//                 fullWidth
//               />
//             </div>
//             <div className="col-lg-4">
//               <div className="row">
//                 <div className="col-lg-3"></div>
//                 <div className="col-lg-3">
//                   <h3>Logo</h3>
//                 </div>
//                 <div className="col-lg-6">
//                   <img
//                     placeholder="Logo"
//                     width="40px"
//                     height="40px"
//                     src={state.logo}
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>
//           <div className="row mt-3">
//             <div className="col-lg-12 mb-2">
//               <TextareaAutosize
//                 style={{ width: "100%" }}
//                 value={state.integrationDetails}
//                 aria-label="minimum height"
//                 rowsMin={4}
//                 placeholder="Integration Details"
//                 fullWidth
//               />
//             </div>
//           </div>
//           <div className="mt-4 product-list mx-1">
//             {/* {state.productDetail.map((i) => {
//               return (
//                 <div className="row px-4 py-1 mb-1">
//                   <div className="col-lg-1"></div>
//                   <div className="col-lg-4">
//                     <Autocomplete
//                       id="productName"
//                       name="productName"
//                       value={i.productName}
//                       options={state.allData}
//                       getOptionLabel={(option) => option.name}
//                       onChange={handleProductName}
//                       renderInput={(params) => (
//                         <TextField {...params} label="Products" />
//                       )}
//                       fullWidth
//                     />
//                   </div>
//                   <div className="col-lg-1"></div>
//                   <div className="col-lg-4">
//                     <TextField
//                       required
//                       className="mb-3"
//                       autoFocus
//                       id="customized_name"
//                       label="Customized Name"
//                       name="customized_name"
//                       value={i.customized_name}
//                       fullWidth
//                     />
//                   </div>
//                   <div className="col-lg-2"></div>
//                   <div className="col-lg-2">
//                     {state.productDetail.length - 1 === i && (
//                       <AddCircleOutlineIcon
//                         style={{
//                           cursor: "pointer",
//                           marginTop: "20px",
//                           marginRight: "10px",
//                         }}
//                         onClick={handleAddClick}
//                       />
//                     )}
//                     {state.productDetail.length !== 1 && (
//                       <RemoveCircleOutlineIcon
//                         style={{ cursor: "pointer", marginTop: "20px" }}
//                         onClick={() => handleRemoveClick(i)}
//                       />
//                     )}
//                   </div>
//                 </div>
//               );
//             })} */}
//           </div>
//           <div className="float-right mt-4">
//             <Button
//               onClick={(e) => handleEditDataRequestClose(e)}
//               color="secondary"
//               className="mr-2"
//               variant="contained"
//             >
//               Cancel
//             </Button>
//             <Button
//               variant="contained"
//               onClick={(e) => handleEditFormDataSubmit(e)}
//               color="primary"
//             >
//               Submit
//             </Button>
//           </div>
//         </div>
//       </CardBox>
//     </div>
//   );
// };

// export default EditInsuranceProvider;
