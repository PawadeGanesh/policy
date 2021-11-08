import React from "react";
import ContainerHeader from "components/ContainerHeader/index";
import ProductList from "./ProductList";

function CardList({ match }) {
  return (
    <div>
      <ContainerHeader title={"Showing Available Quotes"} match={match} />
      <ProductList />
    </div>
  );
}

export default CardList;
