import React, { Component } from "react";
import PropTypes, { resetWarningCache } from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import { BiLeftArrowAlt } from "react-icons/bi";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import Divider from "@material-ui/core/Divider";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import { IoIosUmbrella } from "react-icons/io";
import { FaHospital } from "react-icons/fa";
import { Tooltip } from "@material-ui/core";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardSubtitle,
  CardText,
} from "reactstrap";
import { withRouter } from "react-router-dom";
import { data1, products } from "app/routes/dashboard/routes/ECommerce/data";
import axios from "axios";
import { data } from "./data";
import TitlebarGridList from "app/routes/components/routes/gridList/titlebars/TitlebarGridList";
import { array } from "@amcharts/amcharts4/core";
import apiInstance from "setup/index";
import { apigetUrl } from "setup/middleware";

const config = {
  headers: {
    accept: "application/json",
  },
  data: {},
};

const baseURL = `${process.env.REACT_APP_BASE_URL}`;

const api = axios.create({
  baseURL: baseURL,
});

const styles = (theme) => ({
  root: {
    width: "100%",
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: "33.33%",
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  intDisableMargin: {
    margin: 0,
  },
});

class ControlledExpansionPanels extends Component {
  state = {
    expanded: null,
    product1: "",
    product2: "",
    product3: "",
    products: [],
    data: [],
    filteredTitle: [],
    response3: [],
    isActive: false,
  };

  componentDidMount() {
    let selectedProducts = [];
    if (this.props.location.state.product1) {
      selectedProducts.push(this.props.location.state.product1);
      this.setState((prevState) => ({
        ...prevState,
        product1: this.props.location.state.product1.data.features,
      }));
    }
    if (this.props.location.state.product2) {
      selectedProducts.push(this.props.location.state.product2);
      this.setState((prevState) => ({
        ...prevState,
        product2: this.props.location.state.product2.data.features,
      }));
    }
    if (this.props.location.state.product3) {
      selectedProducts.push(this.props.location.state.product3);
      this.setState((prevState) => ({
        ...prevState,
        product3: JSON.parse(this.props.location.state.product3.data.features),
      }));
    }
    if (this.props.location.state.isActive) {
      this.setState((prevState) => ({
        ...prevState,
        isActive: this.props.location.state.isActive,
      }));
    }
    console.log("selectedProducts", selectedProducts);
    this.setState((prevState) => ({
      ...prevState,
      products: selectedProducts,
    }));

    this.getNames();
  }

  getNames() {
    // api
    //   .get(
    //     `insurance/products/${this.props.location.state.productId}`,
    //     apiInstance
    //   )
    apigetUrl(`/insurance/products/${this.props.location.state.productId}`)
      .then((res) => {
        console.log(
          "Response",
          res.data.features.map((n) => n.name)
        );
        // let response = res.data.fetaures;
        this.setState((prevState) => ({
          ...prevState,
          data: res.data.features,
        }));
      })
      .catch((err) => console.log("err", err));
  }

  handleChange = (panel) => (event, expanded) => {
    this.setState({
      expanded: expanded ? panel : false,
    });
  };

  handleCheckPremium = (data) => {
    console.log("Click-quoteId", data);
    this.props.history.push({
      pathname: "/app/wireframes/health/data/",
      state: {
        enquiryid: (this.props.location.state || {}).enquiryId,
        quoteId: data.id,
      },
    });
  };

  render() {
    const { classes } = this.props;
    const { expanded } = this.state;

    let key = this.state.products.map((n) => Object.keys(n.data.features));
    console.log("Key", key[0]);
    let value = this.state.products.map((n) => n.data.features);
    console.log("values", value[0]);

    let obj = JSON.parse(this.props.location.state.product1.data.features);
    console.log("obj", obj);

    const splitKeyValue1 = (obj) => {
      const res = [];
      const keys = Object.keys(obj);
      keys.forEach((key) => {
        res.push({
          key: key,
          value1: obj[key],
        });
      });
      return res;
    };
    let response1 = splitKeyValue1(
      JSON.parse(this.props.location.state.product1.data.features)
    );
    console.log("splitKeyValue1", response1);

    // remained array-object(non-compared, which is notequal)

    let filtersArray1 = response1.map((n) => n.key);
    let filtered1 = this.state.data.filter(function(element) {
      let titles = element.key.split(" ");
      return titles.find(function(title) {
        //console.log("filter123", filtersArray.indexOf(title) > -1);
        return filtersArray1.indexOf(title) < 0;
      });
    });

    console.log("filtered1", filtered1);

    // split the key and value

    let splitKeyValue2 = (obj) => {
      console.log("obj", obj);
      const keys = Object.keys(obj);
      const res = [];
      for (let i = 0; i < keys.length; i++) {
        res.push({
          key: keys[i],
          value2: obj[keys[i]],
        });
      }
      return res;
    };
    let response2 = splitKeyValue2(
      JSON.parse(this.props.location.state.product2.data.features)
    );
    console.log("splitKeyValue12", response2);

    let filtersArray2 = response2.map((n) => n.key);
    let filtered2 = this.state.data.filter(function(element) {
      let titles = element.key.split(" ");
      return titles.find(function(title) {
        //console.log("filter123", filtersArray.indexOf(title) > -1);
        return filtersArray2.indexOf(title) < 0;
      });
    });

    console.log("filtered2", filtered2);

    // split the key and value

    let splitKeyValue3 = (obj) => {
      console.log("obj", obj);
      const keys = Object.keys(obj);
      const res = [];

      for (let i = 0; i < keys.length; i++) {
        res.push({
          key: keys[i],
          value3: obj[keys[i]],
        });
      }
      return res;
    };

    let response3 = splitKeyValue3(this.state.product3);
    console.log("splitKeyValue123", response3);

    let filtersArray3 = response3.map((n) => n.key);
    let filtered3 = this.state.data.filter(function(element) {
      let titles = element.key.split(" ");
      return titles.find(function(title) {
        //console.log("filter123", filtersArray.indexOf(title) > -1);
        return filtersArray3.indexOf(title) < 0;
      });
    });
    console.log("filtered3", filtered3);

    let response = this.state.data.map((n) => n);
    console.log("name", response);

    let arr = response;
    let a1 = response1;
    let a2 = response2;
    let a3 = response3;
    // let a4 = total;
    // let a3 = completeTotal;

    const all1 = arr.map((t1) => ({
      ...t1,
      ...a1.find((t) => t.key === t1.key),
    }));
    console.log("arra1", all1);

    const all2 = a2.map((t2) => ({
      ...t2,
      ...arr.find((t) => t.key === t2.key),
    }));
    console.log("arra2", all2);

    const all3 = a3.map((t3) => ({
      ...t3,
      ...arr.find((t) => t.key === t3.key),
    }));
    console.log("arra3", all3);

    const all = all1.map((n) => ({ ...n, ...all2.find((k) => k.id === n.id) }));
    console.log("all", all);

    const result = all.map((n) => ({
      ...n,
      ...all3.find((k) => k.id === n.id),
    }));
    console.log("all-result", result);

    console.log("List", result);

    return (
      <>
        <div>
          <div className="row">
            <div className=" col-md-3">
              {this.props.location.state.isActive ? (
                <Link
                  to={{
                    pathname: "/app/wireframes/health/quotes",
                    state: {
                      id: this.props.location.state.enquiryId,
                      isActive: this.props.location.state.isActive,
                      checkedA: this.props.location.state.checkedA,
                      price: this.props.location.state.price,
                      minPrice: this.props.location.state.minPrice,
                      maxPrice: this.props.location.state.maxPrice,
                      ratio: this.props.location.state.ratio,
                      minRatio: this.props.location.state.minRatio,
                      maxRatio: this.props.location.state.maxRatio,
                      providers: this.props.location.state.providers,
                      providerId: this.props.location.state.providerId,
                      selectedProvider: this.props.location.state
                        .selectedProvider,
                    },
                  }}
                >
                  <Button color="primary">
                    <BiLeftArrowAlt />
                    &nbsp;&nbsp;View All Quotes
                  </Button>
                </Link>
              ) : (
                <Link
                  to={{
                    pathname: "/app/wireframes/health/quotes",
                    state: {
                      id: this.props.location.state.enquiryId,
                      isActive: this.props.location.state.isActive,
                    },
                  }}
                >
                  <Button color="primary">
                    <BiLeftArrowAlt />
                    &nbsp;&nbsp;View All Quotes
                  </Button>
                </Link>
              )}
            </div>

            {this.state.products &&
              this.state.products.map((n) => {
                return (
                  <>
                    {this.state.products.length === 2 ? (
                      <div className=" col-md-4">
                        <Card className={`shadow border-0 text-center`}>
                          {/* <CardHeader className="bg-primary text-white">{product.name}</CardHeader> */}
                          <CardBody>
                            <div className="row">
                              <div className="col-md-12">
                                <h3 className="card-title font-weight-bold  text-teal">
                                  {n.productName}
                                </h3>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-md-4">
                                <CardText className="int-content-center">
                                  <Avatar
                                    alt="..."
                                    src={n.logo}
                                    className="user-avatar size-80 int-content-center"
                                  />
                                </CardText>
                              </div>
                              <div className="col-md-8">
                                <CardSubtitle>
                                  <div className="row">
                                    <div className="col-md-6">
                                      <h6>
                                        <IoIosUmbrella />
                                        &nbsp;&nbsp;Cover
                                      </h6>
                                      <h4>&#8377; {n.data.cover}</h4>
                                    </div>
                                    <div className="col-md-6">
                                      <h6>
                                        <FaHospital />
                                        &nbsp;&nbsp;Hospitals
                                      </h6>
                                      <h4>{n.data.hospitals}</h4>
                                    </div>
                                  </div>
                                </CardSubtitle>
                              </div>
                            </div>
                          </CardBody>
                          <CardFooter>
                            <Tooltip title="Click to Purchase Policy">
                              <Button
                                variant="contained"
                                className="jr-btn bg-teal text-white"
                                onClick={() => this.handleCheckPremium(n)}
                              >
                                &#8377;{n.data.premium}
                              </Button>
                            </Tooltip>
                          </CardFooter>
                        </Card>
                      </div>
                    ) : (
                      <div className=" col-md-3">
                        <Card className={`shadow border-0 text-center`}>
                          {/* <CardHeader className="bg-primary text-white">{product.name}</CardHeader> */}
                          <CardBody>
                            <div className="row">
                              <div className="col-md-12">
                                <h3 className="card-title font-weight-bold  text-teal">
                                  {n.productName}
                                </h3>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-md-3">
                                <CardText className="int-content-center">
                                  <Avatar
                                    alt="..."
                                    src={n.logo}
                                    className="user-avatar size-80 int-content-center"
                                  />
                                </CardText>
                              </div>
                              <div className="col-md-9">
                                <CardSubtitle>
                                  <div className="row">
                                    <div className="col-md-6">
                                      <h6>
                                        <IoIosUmbrella />
                                        &nbsp;&nbsp;Cover
                                      </h6>
                                      <h4>&#8377; {n.data.cover}</h4>
                                    </div>
                                    <div className="col-md-6">
                                      <h6>
                                        <FaHospital />
                                        &nbsp;&nbsp;Hospitals
                                      </h6>
                                      <h4>{n.data.hospitals}</h4>
                                    </div>
                                  </div>
                                </CardSubtitle>
                              </div>
                            </div>
                          </CardBody>
                          <CardFooter>
                            <Tooltip title="Click to Purchase Policy">
                              <Button
                                variant="contained"
                                className="jr-btn bg-teal text-white"
                                onClick={() => this.handleCheckPremium(n)}
                              >
                                &#8377;{n.data.premium}
                              </Button>
                            </Tooltip>
                          </CardFooter>
                        </Card>
                      </div>
                    )}
                  </>
                );
              })}
          </div>
          <div className={classes.root}>
            {/* {data[0].features.map((feature, index) => ( */}
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography className={classes.heading}>
                  {/* {feature.featureGroup} */}
                  <h3>
                    <b>Premium Comparison</b>
                  </h3>
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                {/* <Typography>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Suspendisse malesuada lacus ex, sit amet blandit leo lobortis
                  eget.
                </Typography> */}
                {this.state.products.length === 2 ? (
                  <div className="row w-100">
                    <List className="w-100">
                      {result.map((n) => (
                        <dum>
                          <ListItem button>
                            <div className="row w-100">
                              <ListItemAvatar className=" col-md-4">
                                {n.name}
                              </ListItemAvatar>
                              {n.value1 ? (
                                <ListItemText
                                  className="col-md-4 text-center"
                                  primary=""
                                  secondary={n.value1}
                                />
                              ) : (
                                <ListItemText
                                  className="col-md-4 text-center"
                                  primary=""
                                  secondary="---"
                                />
                              )}
                              {n.value2 ? (
                                <ListItemText
                                  className="col-md-4 text-center"
                                  primary=""
                                  secondary={n.value2}
                                />
                              ) : (
                                <ListItemText
                                  className="col-md-4 text-center"
                                  primary=""
                                  secondary={"---"}
                                />
                              )}
                            </div>
                          </ListItem>

                          <Divider inset />
                        </dum>
                      ))}
                    </List>
                  </div>
                ) : (
                  <div className="row w-100">
                    <List className="w-100">
                      {result.map((n) => (
                        <dum>
                          <ListItem button>
                            <div className="row w-100">
                              <ListItemAvatar className=" col-md-3">
                                {n.name}
                              </ListItemAvatar>
                              {n.value1 ? (
                                <ListItemText
                                  className="col-md-3 text-center"
                                  primary=""
                                  secondary={n.value1}
                                />
                              ) : (
                                <ListItemText
                                  className="col-md-3 text-center"
                                  primary=""
                                  secondary="---"
                                />
                              )}
                              {n.value2 ? (
                                <ListItemText
                                  className="col-md-3 text-center"
                                  primary=""
                                  secondary={n.value2}
                                />
                              ) : (
                                <ListItemText
                                  className="col-md-3 text-center"
                                  primary=""
                                  secondary={"---"}
                                />
                              )}
                              {n.value3 ? (
                                <ListItemText
                                  className="col-md-3 text-center"
                                  primary=""
                                  secondary={n.value3}
                                />
                              ) : (
                                <ListItemText
                                  className="col-md-3 text-center"
                                  primary=""
                                  secondary={"---"}
                                />
                              )}
                            </div>
                          </ListItem>

                          <Divider inset />
                        </dum>
                      ))}
                    </List>
                  </div>
                )}
              </AccordionDetails>
            </Accordion>
            {/* )} */}
          </div>
        </div>
      </>
    );
  }
}

ControlledExpansionPanels.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles)(ControlledExpansionPanels));
