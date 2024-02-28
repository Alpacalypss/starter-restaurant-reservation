import React from "react";
import { Route, Switch } from "react-router-dom";
import Layout from "./layout/Layout";
import DarkMode from "./DarkMode/DarkMode";
import "./App.css";

/**
 * Defines the root application component.
 * @returns {JSX.Element}
 */
function App() {
  return (
    <div className="App">
      <div className="d-flex justify-content-start">
        <DarkMode />
      </div>
      <Switch>
        <Route path="/">
          <Layout />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
