import React from "react";
import IntlMessages from "util/IntlMessages";

export const userImageList = [
  {
    id: 1,
    image: require("assets/images/insurance/man1.jpg"),
    name: "Abhishek Rana",
    rating: "5.0",
    deals: "33 Policies",
  },
  {
    id: 3,
    image: require("assets/images/insurance/user_blank.png"),
    name: "Yug Sarhma",
    rating: "5.0",
    deals: "27 Policies",
  },
  {
    id: 2,
    image: require("assets/images/insurance/woman1.jpg"),
    name: "Neha Gupta",
    rating: "4.5",
    deals: "21 Policies",
  },
  {
    id: 4,
    image: require("assets/images/insurance/user_blank.png"),
    name: "Mahesh Gowda",
    rating: "5.0",
    deals: "27 Policies",
  },
  {
    id: 5,
    image: require("assets/images/insurance/user_blank.png"),
    name: "Anupama Reddy",
    rating: "5.0",
    deals: "27 Policies",
  },
];

export const data1 = [
  { name: "Let A", uv: 40, pv: 24, amt: 20 },
  { name: "Let B", uv: 30, pv: 13, amt: 21 },
  { name: "Let C", uv: 60, pv: 98, amt: 29 },
  { name: "Let D", uv: 27, pv: 39, amt: 20 },
  { name: "Let E", uv: 78, pv: 48, amt: 28 },
  { name: "Let F", uv: 23, pv: 38, amt: 20 },
  { name: "Let G", uv: 56, pv: 43, amt: 20 },
];

export const latestPostList = [
  {
    image: "https://via.placeholder.com/93x93",
    title: "5 DIY tips to use in kitchen",
    description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit...",
    date: "28 Oct, 2016",
    color: "bg-primary",
  },

  {
    image: "https://via.placeholder.com/93x93",
    title: "Flowers which keep you healthy",
    description: "There are many variations of passages of Lorem Ipsum...",
    date: "27 Feb, 2017",
    color: "bg-danger",
  },
  {
    image: "https://via.placeholder.com/93x93",
    title: "Top 5 beaches in the world",
    description:
      "It is a long established fact that a reader will be distract...",
    date: "24 Feb, 2017",
    color: "bg-info",
  },
];

export const lableList = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
export const appNotification = [
  {
    id: 1,
    title: "Invitation",
    desc: [
      <span className="jr-link" key={1}>
        Stella
      </span>,
      " has sent you an invitation to join project ",
      <span className="jr-link" key={2}>
        Drift
      </span>,
    ],
    image: "https://via.placeholder.com/150x150",
  },
  {
    id: 2,
    title: "Message",
    desc: [
      "Need your help on Jumbo ",
      <span className="jr-link" key={3}>
        Martin J.
      </span>,
    ],
    image: "https://via.placeholder.com/150x150",
  },
  {
    id: 3,
    title: "Invitation",
    desc: [
      <span className="jr-link" key={4}>
        Guptil
      </span>,
      " has sent you an invitation to join project ",
      <span className="jr-link" key={5}>
        Flexile
      </span>,
    ],
    image: "https://via.placeholder.com/150x150",
  },
  {
    id: 4,
    title: "Invitation",
    desc: [
      <span className="jr-link" key={6}>
        Alex
      </span>,
      " has sent you an invitation to join project ",
      <span className="jr-link" key={7}>
        Mouldifi
      </span>,
    ],
    image: "https://via.placeholder.com/150x150",
  },
];

export const announcementsNotification = [
  {
    id: 5,
    title: "Invitation",
    desc: [
      <span className="jr-link" key={7}>
        Alex
      </span>,
      " has sent you an invitation to join project ",
      <span className="jr-link" key={8}>
        Mouldifi
      </span>,
    ],
    image: "https://via.placeholder.com/128x128",
  },
  {
    id: 6,
    title: "Message",
    desc: [
      "Need your help on Jumbo",
      <span className="jr-link" key={9}>
        Jeson Born
      </span>,
    ],
    image: "https://via.placeholder.com/150x150",
  },
  {
    id: 7,
    title: "Invitation",
    desc: [
      <span className="jr-link" key={10}>
        Stella
      </span>,
      " has sent you an invitation to join project ",
      <span className="jr-link" key={11}>
        Drift
      </span>,
    ],
    image: "https://via.placeholder.com/150x150",
  },
  {
    id: 8,
    title: "Invitation",
    desc: [
      <span className="jr-link" key={12}>
        Guptil
      </span>,
      " has sent you an invitation to join project ",
      <span className="jr-link" key={13}>
        Mouldifi
      </span>,
    ],
    image: "https://via.placeholder.com/150x150",
  },
];

export const products = [
  {
    image: "https://via.placeholder.com/400x400",
    title: "Creactive watch",
    description:
      "Contrary to popular belief, Lorem Ipsum is not simply random text.",
    mrp: 250,
    offerPrice: 200,
  },
  {
    image: "https://via.placeholder.com/400x400",
    title: "Table Lamp",
    description:
      "It is a long established fact that a reader will be distracted",
    mrp: 250,
    offerPrice: 200,
  },
  {
    image: "https://via.placeholder.com/400x400",
    title: "Trimmer",
    description:
      "There are many variations of passages of Lorem Ipsum available",
    mrp: 250,
    offerPrice: 200,
  },
  {
    image: "https://via.placeholder.com/400x400",
    title: "Travel Bag",
    description: "The standard chunk of Lorem Ipsum used since the 1500s",
    mrp: 250,
    offerPrice: 200,
  },
];

export const marketingData = [
  {
    id: 1,
    name: "Facebook Ads",
    desc: "63 Likes, 387 Shares",
    icon: "facebook-box",
    color: "bg-indigo lighten-1",
    budget: 570,
    growth: 20,
  },

  {
    id: 2,
    name: "Twitter Ads",
    desc: "43 Likes, 545 Shares",
    icon: "twitter-box",
    color: "bg-light-blue accent-2",
    budget: 811,
    growth: -5,
  },

  {
    id: 3,
    name: "Instagram",
    desc: "83 Follows, 79 Likes",
    icon: "instagram",
    color: "bg-pink accent-3",
    budget: 685,
    growth: 20,
  },
];

export const signUpData = {
  chartData: [200, 75, 300, 100, 200, 70],
  labels: ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
};

export const trafficData = [
  { name: "Page A", pv: 0 },
  { name: "Page B", pv: 2000 },
  { name: "Page C", pv: 600 },
  { name: "Page D", pv: 4400 },
  { name: "Page D", pv: 900 },
  { name: "Page H", pv: 4860 },
];

export const totalRevenueData = {
  chartData: [200, 50, 250, 100, 370, 100],
  labels: ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
};

export const projects = [
  {
    id: 1,
    name: "Jambo Admin",
    date: "Oct 21",
    status: "Completed",
    color: "success",
    progressValue: 98,
    teamList: [
      { id: 1, image: "https://via.placeholder.com/150x150", name: "" },
      { id: 2, image: "https://via.placeholder.com/150x150", name: "" },
      { id: 3, image: "https://via.placeholder.com/150x150", name: "" },
      { id: 4, image: "https://via.placeholder.com/150x150", name: "" },
    ],
  },
  {
    id: 2,
    name: "Chatbull",
    date: "Oct 22",
    status: "On Hold",
    color: "warning",
    progressValue: 70,
    teamList: [
      { id: 1, image: "https://via.placeholder.com/150x150", name: "" },
      { id: 2, image: "https://via.placeholder.com/150x150", name: "" },
      { id: 3, image: "https://via.placeholder.com/150x150", name: "" },
      { id: 4, image: "https://via.placeholder.com/150x150", name: "" },
    ],
  },
  {
    id: 3,
    name: "Mouldifi",
    date: "Nov 12",
    status: "Delayed",
    color: "info",
    progressValue: 40,
    teamList: [
      { id: 1, image: "https://via.placeholder.com/150x150", name: "" },
      { id: 2, image: "https://via.placeholder.com/150x150", name: "" },
      { id: 3, image: "https://via.placeholder.com/150x150", name: "" },
      { id: 4, image: "https://via.placeholder.com/150x150", name: "" },
    ],
  },
  {
    id: 4,
    name: "Simplify Timer",
    date: "Nov 21",
    status: "Completed",
    color: "success",
    progressValue: 98,
    teamList: [
      { id: 1, image: "https://via.placeholder.com/150x150", name: "" },
      { id: 2, image: "https://via.placeholder.com/150x150", name: "" },
      { id: 3, image: "https://via.placeholder.com/150x150", name: "" },
      { id: 4, image: "https://via.placeholder.com/150x150", name: "" },
    ],
  },
];
