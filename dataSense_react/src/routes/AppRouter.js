/**
 * AppRouter component that renders a set of routes defined in the `routesObject` array.
 *
 * The `routesObject` array contains objects with the following properties:
 * - `path`: The URL path for the route
 * - `element`: The React element to render for the route
 *
 * Example:
 * ```
 * const routesObject = [
 *   {
 *     path: "/",
 *     element: <HomePage />,
 *   },
 *   {
 *     path: "/about",
 *     element: <AboutPage />,
 *   },
 * ];
 * ```
 *
 * The AppRouter component uses the `react-router-dom` library to render the routes.
 *
 * @returns {React.ReactElement} The AppRouter component
 */
import React from "react";
import { Routes, Route } from "react-router-dom";
import FileUploadPage from "../pages/fileUpload/FileUploadPage";
import ProfilePage from "../pages/profilerPage/ProfilePage";
import Home from "../pages/Home";
import LoginForm from "../pages/LoginPage";
import AboutUs from "../pages/AboutUsPage";
import ContactUs from "../pages/ContactUsPage";
import PricingPage from "../pages/PricingPage";

const routesObject = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/aboutUs",
    element: <AboutUs />,
  },
  {
    path: "/contactUs",
    element: <ContactUs />,
  },
  {
    path: "/pricing",
    element: <PricingPage />,
  },
  {
    path: "/login",
    element: <LoginForm />,
  },
  {
    path: "/upload",
    element: <FileUploadPage />,
  },
  {
    path: "/profiler/:domain/:fileName",
    element: <ProfilePage />,
  },
];

const AppRouter = () => (
  <Routes>
    {routesObject.map((route) => (
      <Route key={route.path} path={route.path} element={route.element} />
    ))}
  </Routes>
);

export default AppRouter;
