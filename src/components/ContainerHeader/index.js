import React from "react";
import { Breadcrumb, BreadcrumbItem } from "reactstrap";
// import { menuDetails } from "containers/AppLayout/data";
import IntlMessages from "util/IntlMessages";
import { useSelector } from "react-redux";

// const getDisplayString = (sub) => {
//   const arr = sub.split("-");
//   if (arr.length > 1) {
//     return (
//       arr[0].charAt(0).toUpperCase() +
//       arr[0].slice(1) +
//       " " +
//       arr[1].charAt(0).toUpperCase() +
//       arr[1].slice(1)
//     );
//   } else {
//     return sub.charAt(0).toUpperCase() + sub.slice(1);
//   }
// };
// const getUrlString = (path, sub, index) => {
//   if (index === 0) {
//     return "#/";
//   } else {
//     return "#/" + path.split(sub)[0] + sub;
//   }
// };

var menuPath = [];

const checkChildren = (children, menuLink) => {
  if(children===""||children===null||children===undefined){}
  else{
  for (var j = 0; j < children.length; j++) {
    if (children[j].children && children.length > 0) {
      var str = checkChildren(children[j].children, menuLink);
      if (str !== "") {
        menuPath.push(children[j].displayKey);
        return children[j].displayKey + " > " + str;
      }
    } else if (children[j].link === menuLink) {
      menuPath.push(children[j].displayKey);
      return children[j].displayKey;
    }
  }
}
  return "";
};

const ContainerHeader = ({ title, match }) => {
  const { authUser } = useSelector(({ auth }) => auth);
  let menuDetails = authUser.menuDetails || [];
  const path = match.path.substr(1);
  menuPath = [];
  // const subPath = path.split("/");
  for (var i = 0; i < menuDetails.length; i++) {
    var str = checkChildren(menuDetails[i].children, "/" + path);
    if (str !== "") {
      menuPath.push(menuDetails[i].displayKey);
    }
  }

  //Reversing as the content would have been inserted in the reverse order
  menuPath.reverse();

  return (
    <div className="page-heading d-sm-flex justify-content-sm-between align-items-sm-center">
      <h2 className="title mb-3 mb-sm-0">{title}</h2>

      <Breadcrumb className="mb-0" tag="nav">
        {menuPath.map((sub, index) => {
          return (
            <BreadcrumbItem
              active={menuPath.length === index + 1}
              tag={menuPath.length === index + 1 ? "span" : "a"}
              key={index}
            >
              <IntlMessages id={sub} />
            </BreadcrumbItem>
          );
        })}
        {/* {subPath.map((sub, index) => {
            return <BreadcrumbItem active={subPath.length === index + 1}
                                   tag={subPath.length === index + 1 ? "span" : "a"} key={index}
                                   href={getUrlString(path, sub, index)}>{getDisplayString(sub)}</BreadcrumbItem>
          }
        )} */}
      </Breadcrumb>
    </div>
  );
};

export default ContainerHeader;
