import React from "react";
import ContainerHeader from "components/ContainerHeader/index";
import BasicCard from "./basicCards/BasicCard";
import NormalCard from "./normalCard/NormalCard";
import TitleCards from "./titleCards/TitleCards";
import DescriptionWithImageCards from "./descriptionWithImageCards/DescriptionWithImageCards";
import HeaderCard from "./headerCard/HeaderCard";
import BlockquoteCard from "./blockquoteCard/BlockquoteCard";
import ContentTypes from "./contentTypesCards/ContentTypes";
import HeaderFooterCards from "./HeaderFooterCards/HeaderFooterCards";
import ImageTopCards from "./imageTopCards/ImageTopCards";
import ImageCenterCards from "./imageCenterCards/ImageCenterCards";
import ImageBottomCards from "./imageBottomCards/ImageBottomCards";
import SolidCards from "app/routes/components/routes/cards/solidCards/SolidCards";
import NavTabCards from "./navTabCards/NavTabCards";
import PillsTabCards from "./pillsTabCards/PillsTabCards";
import TabCards from "./tabCards/TabCards";
import IntlMessages from "util/IntlMessages";
import scooterImage from "../../../../../../src/assets/images/motor_insurance/bike_insurance/scooter.png";
import carImage from "../../../../../../src/assets/images/motor_insurance/car_insurance/car.png";
import healthCareImage from "../../../../../../src/assets/images/health_insurance/healthcare.png";
import { Link } from "react-router-dom";

const Cards = ({ match }) => {
  return (
    <div className="animated slideInUpTiny animation-duration-3">
      <ContainerHeader
        title={<IntlMessages id="sidebar.components.cards" />}
        match={match}
      />

      {/* <div className="jr-entry-header">
        <h3 className="entry-heading">
          <IntlMessages id="component.cards.basic" />
        </h3>
      </div> */}

      {/* <div className="row">
        <div className="col-lg-4 col-sm-6 col-12">
          <BasicCard
            image="https://via.placeholder.com/500x330"
            title="Card Title"
            subTitle="Mixed Content With Fixed Width"
            description="Small plates, salads & sandwiches in an intimate setting with 12 indoor seats plus patio seating"
            btnText="Go Somewhere"
          />
        </div>

        <div className="col-lg-4 col-sm-6 col-12 order-lg-3">
          <DescriptionWithImageCards />
        </div>

        <div className="col-lg-4 col-md-12 col-12">
          <div className="row">
            <div className="col-lg-12 col-md-6 col-12">
              <TitleCards />
            </div>

            <div className="col-lg-12 col-md-6 col-12">
              <NormalCard />
              <NormalCard cardStyle="bg-primary text-white" />
            </div>
          </div>
        </div>
      </div> */}

      {/* <div className="jr-entry-header">
        <h3 className="entry-heading">
          <IntlMessages id="component.cards.special" />
        </h3>
      </div> */}

      {/* <div className="row">
        <div className="col-md-6 col-12">
          <HeaderCard />
        </div>
        <div className="col-md-6 col-12">
          <BlockquoteCard />
          <ContentTypes />
        </div>
      </div> */}

      {/* <div className="jr-entry-header">
        <h3 className="entry-heading">
          <IntlMessages id="component.cards.withHeader" />
        </h3>
      </div> */}

      {/* <div className="row">
        <div className="col-lg-4 col-sm-6 col-12">
          <HeaderFooterCards cardHeader="Header Title" />
        </div>

        <div className="col-lg-4 col-sm-6 col-12 order-lg-3">
          <HeaderFooterCards
            cardStyle="text-right"
            cardHeader="Right Aligned Header"
          />
        </div>

        <div className="col-lg-4 col-12">
          <HeaderFooterCards
            cardStyle="text-center"
            cardHeader="Center Aligned Header"
          />
        </div>
      </div> */}

      {/* <div className="jr-entry-header">
        <h3 className="entry-heading">
          <IntlMessages id="component.cards.navigational" />
        </h3>
      </div> */}

      {/* <div className="row">
        <div className="col-lg-4 col-md-6 col-12">
          <NavTabCards />
        </div>

        <div className="col-lg-4 col-md-6 col-12">
          <PillsTabCards />
        </div>

        <div className="col-lg-4 col-12 order-lg-2">
          <TabCards />
        </div>
      </div> */}

      {/* <div className="jr-entry-header">
        <h3 className="entry-heading">
          <IntlMessages id="component.cards.image" />
        </h3>
      </div> */}

      {/* <div className="row">
        <div className="col-md-4 col-sm-6 col-12">
          <ImageTopCards />
        </div>

        <div className="col-md-4 col-sm-6 col-12 order-md-3">
          <ImageBottomCards />
        </div>

        <div className="col-md-4 col-sm-12 col-12">
          <ImageCenterCards />
        </div>
      </div> */}

      <div className="jr-entry-header">
        <h3 className="entry-heading">
          <IntlMessages id="component.cards.solid" />
        </h3>
      </div>

      <div className="row">
        <div className="col-lg-4 col-sm-6 col-12">
          <Link to="/app/components/carInsurance">
            <SolidCards
              headerText="Car Insurance"
              cardStyle="bg-primary text-white"
              image={carImage}
            />
          </Link>
        </div>
        <div className="col-lg-4 col-sm-6 col-12">
          <Link to="/app/components/bikeInsurance">
            <SolidCards
              headerText="Bike Insurance"
              cardStyle="bg-primary text-white"
              image={scooterImage}
            />
          </Link>
        </div>
        <div className="col-lg-4 col-sm-6 col-12">
          <Link to="/app/components/healthInsurance">
            <SolidCards
              headerText="Health Insurance"
              cardStyle="bg-primary text-white"
              image={healthCareImage}
            />
          </Link>
        </div>

        {/* <div className="col-lg-4 col-sm-6 col-12">
          <SolidCards
            headerText="Primary Card"
            cardStyle="bg-primary text-white"
          />
        </div> */}

        {/* <div className="col-lg-4 col-sm-6 col-12">
          <SolidCards
            headerText="Warning Card"
            cardStyle="bg-warning text-white"
          />
        </div> */}

        {/* <div className="col-lg-4 col-sm-6 col-12">
          <SolidCards
            headerText="Success Card"
            cardStyle="bg-success text-white"
          />
        </div> */}

        {/* <div className="col-lg-4 col-sm-6 col-12">
          <SolidCards
            headerText="Danger Card"
            cardStyle="bg-danger text-white mb-lg-0"
          />
        </div> */}

        {/* <div className="col-lg-4 col-sm-6 col-12">
          <SolidCards
            headerText="Info Card"
            cardStyle="bg-info text-white mb-sm-0"
          />
        </div> */}

        {/* <div className="col-lg-4 col-sm-6 col-12">
          <SolidCards
            headerText="Dark Card"
            cardStyle="bg-dark text-white mb-0"
          />
        </div> */}
      </div>
    </div>
  );
};
export default Cards;
