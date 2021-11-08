// /* eslint-disable no-undef */
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { TextField, Button } from "@material-ui/core";

// import Autocomplete from "@material-ui/lab/Autocomplete";
// import CardBox from "./../../../../../components/CardBox";
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

// const AddInsuranceProvider = () => {
//   const [state, setState] = useState({
//     allData: [],
//     page: 0,
//     pageCount: 1,
//     name: "",
//     logo: "",
//     kafkaTopic: "",
//     integrationDetails: "",
//     productDetail: [
//       {
//         productId: "",
//         customizedName: "",
//       },
//     ],
//     data: [],
//     isSuccessAlert: true,
//     successMsg: "Successfully updated",
//     isErrorAlert: true,
//     errorMsg: "Failed to Update",
//     isAddProductActive: false,
//     // productId: 0,
//     // file: "",
//   });

//   console.log("allData", state.pageCount);

//   let getPage = localStorage.getItem("page");
//   let getProductPageCount = localStorage.getItem("productPageCount");
//   console.log("getProductPageCount", getProductPageCount);

//   sessionStorage.setItem("isAddProductActive", state.isAddProductActive);

//   useEffect(() => {
//     api
//       .get(`insurance/products?page=${getPage}&limit=1300`, config)
//       .then((res) => {
//         console.log("res", res.data.dataList);
//         let response = res.data.dataList.map((n) => n);
//         setState((prevState) => ({
//           ...prevState,
//           allData: response,
//         }));
//       })
//       .catch((err) => console.log("err", err));
//   }, []);

//   let history = useHistory();

//   const handleAddDataRequestClose = () => {
//     history.push("/app/widgets/InsuranceProviders");
//   };

//   const handleAddFormDataSubmit = (e) => {
//     console.log("click", e.target.value);
//     const addObj = {
//       name: state.name,
//       logo: state.logo,
//       kafkaTopic: state.kafkaTopic,
//       integrationDetails: JSON.parse(state.integrationDetails),
//       products: state.productDetail,
//     };
//     console.log("AddObject", addObj);
//     api
//       .post(`/insurance/providers/`, addObj)
//       .then((res) => {
//         console.log("Response of Add Submit", res.data);
//         setState((prevState) => ({
//           ...prevState,
//           data: state.data,
//           // isAddProductActive: true,
//           // isSuccessAlert: true,
//           // successMsg: "Successfully updated",
//         }));
//         // localStorage.setItem("isSuccessAlert", state.isSuccessAlert);
//         // localStorage.setItem("successMsg", state.successMsg);

//         // callLocalBaseURL();
//       })
//       .catch((err) => {
//         setState((prevState) => ({
//           ...prevState,
//           data: state.data,
//           isErrorAlert: true,
//           errorMsg: "Failed to update",
//           // isAddProductActive: true,
//         }));
//         console.log("err", err);
//         // localStorage.setItem("isErrorAlert", state.isErrorAlert);
//         // localStorage.setItem("errorMsg", state.errorMsg);
//         // getErrorUpdate();
//       });

//     history.push("/app/widgets/InsuranceProviders");
//   };

//   const handleRemoveClick = (index) => {
//     const list = [...state.productDetail];
//     list.splice(index, 1);
//     setState((prevState) => ({
//       ...prevState,
//       productDetail: list,
//     }));
//   };

//   const handleAddClick = () => {
//     setState((prevState) => ({
//       ...prevState,
//       productDetail: [
//         ...state.productDetail,
//         { productId: "", customizedName: "" },
//       ],
//     }));
//   };

//   const handleChange = (e) => {
//     e.persist();
//     console.log("e", e.target.name);
//     setState((prevState) => ({
//       ...prevState,
//       [e.target.name]: e.target.value,
//       isAddProductActive: true,
//     }));
//   };

//   const handleProductName = (e, value, index) => {
//     const list = [...state.productDetail];
//     if (typeof list[index] === "undefined") {
//       list.push({ productId: "" });
//     }
//     if (value) {
//       list[index]["productId"] = value.id;
//     }
//     setState((prevState) => ({
//       ...prevState,
//       productId: list,
//     }));
//   };

//   const handleCustomName = (e, index) => {
//     const { name, value } = e.target;
//     console.log("i", e.target.value);
//     const list = [...state.productDetail];
//     list[index][name] = value;
//     console.log("list", list[index][name]);
//     setState((prevState) => ({
//       ...prevState,
//       customized_name: list,
//     }));
//   };

//   const [file, setFile] = React.useState("");

//   const handleUpload = (event) => {
//     console.log("type", event.target.files[0].name);
//     setFile(event.target.files[0]);
//     let getType = event.target.files[0].type;
//     console.log("getType", getType);
//     let encodedData = window.btoa(getType);
//     console.log("encoded-dta", JSON.stringify(encodedData));
//     // const response = JSON.stringify(encodedData);
//     setState((prevState) => ({
//       ...prevState,
//       logo: encodedData,
//     }));
//   };

//   let value = file.type;
//   console.log(JSON.stringify(value));
//   let res = JSON.stringify(value);
//   var encodedData = window.btoa(res); // encode a string
//   console.log("encoded", encodedData);
//   var decodedData = window.atob(encodedData); // decode the string
//   console.log("encoded", decodedData);
//   // setState((prevState) => ({
//   //   ...prevState,
//   //   logo: encodedData,
//   // }));

//   return (
//     <div className="row">
//       <div className="col-lg-4">
//         <h3 className="audit-header">Add Insurance Provider</h3>
//       </div>
//       <CardBox styleName="col-md-12">
//         <div className="cardBox">
//           <div className="row">
//             <div className="col-lg-6">
//               <TextField
//                 required
//                 className="mb-4"
//                 autoFocus
//                 id="name"
//                 label="Name"
//                 name="name"
//                 value={state.name}
//                 onChange={(e) => handleChange(e)}
//                 variant="outlined"
//                 fullWidth
//               />
//             </div>

//             <div className="col-lg-6">
//               <TextField
//                 required
//                 className="mb-4"
//                 autoFocus
//                 id="kafkaTopic"
//                 label="Kaka Topic"
//                 name="kafkaTopic"
//                 value={state.kafkaTopic}
//                 onChange={(e) => handleChange(e)}
//                 variant="outlined"
//                 fullWidth
//               />
//             </div>
//           </div>
//           <div className="row mt-3">
//             <div className="col-lg-6 mb-2">
//               <TextareaAutosize
//                 className="text-area"
//                 // style={{ width: "100%" }}
//                 aria-label="minimum height"
//                 name="integrationDetails"
//                 value={state.integrationDetails}
//                 rowsMin={4}
//                 placeholder="Integration Details"
//                 onChange={(e) => handleChange(e)}
//                 fullWidth
//               />
//             </div>
//             <div className="col-lg-5 uploader">
//               <input className="file" type="file" onChange={handleUpload} />
//               <span>
//                 {file && (
//                   <img
//                     width="50px"
//                     height="50px"
//                     src={URL.createObjectURL(file)}
//                     alt={file.name}
//                   />
//                 )}
//               </span>
//               {/* <div className="col-lg-8 mt-2">
//                 <input className="file" type="file" onChange={handleUpload} />
//               </div>
//               <div className="col-lg-4 imgPreview">
//                 <span>
//                   {file && (
//                     <img
//                       width="50px"
//                       height="50px"
//                       src={URL.createObjectURL(file)}
//                       alt={file.name}
//                     />
//                   )}
//                 </span>
//               </div> */}

//               {/* <TextField
//                 required
//                 className="mb-4"
//                 autoFocus
//                 id="logo"
//                 label="Logo"
//                 name="logo"
//                 value={state.logo}
//                 onChange={(e) => handleChange(e)}
//                 fullWidth
//               /> */}
//             </div>
//           </div>
//           <div className="mt-4 product-list mx-1">
//             {state.productDetail.map((x, i) => {
//               return (
//                 <div className="row px-4 py-1 mb-1" key={i}>
//                   <div className="col-lg-4">
//                     <Autocomplete
//                       id="productId"
//                       name="productId"
//                       // value={categoryValue}
//                       options={state.allData}
//                       getOptionLabel={(option) => option.name}
//                       onChange={(e, value) => handleProductName(e, value, i)}
//                       renderInput={(params) => (
//                         <TextField {...params} label="ProductName" />
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
//                       id="customizedName"
//                       label="Customized Name"
//                       name="customizedName"
//                       value={x.customized_name}
//                       onChange={(e) => handleCustomName(e, i)}
//                       fullWidth
//                     />
//                   </div>
//                   <div className="col-lg-1"></div>
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
//             })}
//           </div>
//           <div className="float-right mt-4">
//             <Button
//               onClick={(e) => handleAddDataRequestClose(e)}
//               color="secondary"
//               className="mr-2"
//               variant="contained"
//             >
//               Cancel
//             </Button>
//             <Button
//               variant="contained"
//               onClick={(e) => handleAddFormDataSubmit(e)}
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

// export default AddInsuranceProvider;
