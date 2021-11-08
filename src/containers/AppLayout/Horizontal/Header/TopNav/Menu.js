/* eslint-disable react/prop-types */
import React, { Component } from "react";
import { NavLink, withRouter } from "react-router-dom";
// import { menuDetails } from "../../../data";
import IntlMessages from "util/IntlMessages";
import { connect } from "react-redux";

class Menu extends Component {
  componentDidMount() {
    const { history } = this.props;

    const pathname = `#${history.location.pathname}`; // get current path
    const mainMenu = document.getElementsByClassName("nav-item");
    for (let i = 0; i < mainMenu.length; i++) {
      mainMenu[i].onclick = function() {
        for (let j = 0; j < mainMenu.length; j++) {
          if (mainMenu[j].classList.contains("active")) {
            mainMenu[j].classList.remove("active");
          }
        }
        this.classList.toggle("active");
      };
    }
    const subMenuLi = document.getElementsByClassName("nav-arrow");
    for (let i = 0; i < subMenuLi.length; i++) {
      subMenuLi[i].onclick = function() {
        for (let j = 0; j < subMenuLi.length; j++) {
          if (subMenuLi[j].classList.contains("active")) {
            subMenuLi[j].classList.remove("active");
          }
        }
        this.classList.toggle("active");
      };
    }
    const activeLi = document.querySelector('a[href="' + pathname + '"]'); // select current a element
    try {
      const activeNav = this.closest(activeLi, "ul"); // select closest ul
      if (activeNav.classList.contains("sub-menu")) {
        this.closest(activeNav, "li").classList.add("active");
      } else {
        this.closest(activeLi, "li").classList.add("active");
      }
      const parentNav = this.closest(activeNav, ".nav-item");
      if (parentNav) {
        parentNav.classList.add("active");
      }
    } catch (e) {
      console.log("error: ", e);
    }
  }

  closest(el, selector) {
    try {
      let matchesFn;
      // find vendor prefix
      [
        "matches",
        "webkitMatchesSelector",
        "mozMatchesSelector",
        "msMatchesSelector",
        "oMatchesSelector",
      ].some(function(fn) {
        if (typeof document.body[fn] === "function") {
          matchesFn = fn;
          return true;
        }
        return false;
      });

      let parent;

      // traverse parents
      while (el) {
        parent = el.parentElement;
        if (parent && parent[matchesFn](selector)) {
          return parent;
        }
        el = parent;
      }
    } catch (e) {
      console.log("error: ", e);
    }

    return null;
  }

  processSubMenu(menu) {
    return menu.children && menu.children.length > 0 ? (
      <li className="nav-arrow" key={menu.displayKey}>
        <span className="nav-link">
          <i className="zmdi zmdi-view-dashboard zmdi-hc-fw" />
          <span className="nav-text">
            <IntlMessages id={menu.displayKey} />
          </span>
        </span>
        <ul className="sub-menu">
          {menu.children.map((submenu) => this.processSubMenu(submenu))}
        </ul>
      </li>
    ) : (
      <li key={menu.displayKey}>
        <NavLink className="prepend-icon" to={menu.link}>
          <i className={menu.icon} />
          <span className="nav-text">
            <IntlMessages id={menu.displayKey} />
          </span>
        </NavLink>
      </li>
    );
  }

  processMainMenu(menu) {
    return menu.children && menu.children.length > 0 ? (
      <li className="nav-item" key={menu.displayKey}>
        <span className="nav-link">
          <IntlMessages id={menu.displayKey} />
        </span>
        <ul className="sub-menu">
          {menu.children.map((submenu) => this.processSubMenu(submenu))}
        </ul>
      </li>
    ) : (
      <li className="nav-item" key={menu.displayKey}>
        <NavLink className="prepend-icon" to={menu.link}>
          <i className="zmdi zmdi-view-dashboard zmdi-hc-fw" />
          <span className="nav-text">
            <IntlMessages id={menu.displayKey} />
          </span>
        </NavLink>
      </li>
    );
  }

  render() {
    let menuDetails = this.props.authUser.menuDetails || [];
    //let menuDetails =JSON.parse(localStorage.getItem("menuDetails"))||[];
    return (
      <div className="app-main-menu d-none d-md-block">
        <ul className="navbar-nav navbar-nav-mega">
          {menuDetails.map((menu) => this.processMainMenu(menu))}
        </ul>
      </div>
    );
  }
}

export default withRouter(
  connect((state) => ({ authUser: state.auth.authUser }))(Menu)
);
