/*!

=========================================================
* Light Bootstrap Dashboard React - v2.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/light-bootstrap-dashboard-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/light-bootstrap-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import Dashboard from "views/Dashboard.js";
import UserProfile from "views/UserProfile.js";
import ResumeUpload from "views/ResumeUpload.js";
import ExampleResumes from "views/ExampleResumes.js";
import OtherResources from "views/OtherResources.js";
import Maps from "views/Maps.js";
import Notifications from "views/Notifications.js";
import Upgrade from "views/Upgrade.js";

const dashboardRoutes = [
  // {
  //   upgrade: true,
  //   path: "/upgrade",
  //   name: "Upgrade to PRO",
  //   icon: "nc-icon nc-alien-33",
  //   component: Upgrade,
  //   layout: "/admin",
  // },
  // {
  //   path: "/",
  //   name: "Home",
  //   icon: "nc-icon nc-satisfied",
  //   component: Dashboard,
  //   layout: "/admin",
  // },
  {
    path: "/interview",
    name: "Upload & Interview",
    icon: "nc-icon nc-cloud-upload-94",
    component: ResumeUpload, 
    layout: "/admin",
  },
  // {
  //   path: "/user",
  //   name: "Generated Profile",
  //   icon: "nc-icon nc-circle-09",
  //   component: UserProfile,
  //   layout: "/admin",
  // },
  {
    path: "/examples",
    name: "Example Resumes",
    icon: "nc-icon nc-paper-2",
    component: ExampleResumes,
    layout: "/admin",
  },
  {
    path: "/resources",
    name: "Other Resources",
    icon: "nc-icon nc-bulb-63",
    component: OtherResources,
    layout: "/admin",
  },
  // {
  //   path: "/maps",
  //   name: "Maps",
  //   icon: "nc-icon nc-pin-3",
  //   component: Maps,
  //   layout: "/admin",
  // },
  // {
  //   path: "/notifications",
  //   name: "Notifications",
  //   icon: "nc-icon nc-bell-55",
  //   component: Notifications,
  //   layout: "/admin",
  // },
];

export default dashboardRoutes;
