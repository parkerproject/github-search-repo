import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import SearchPage from "./components/SearchPage";

const App = () => (
  <BrowserRouter>
    <Switch>
      <Route path="/search" render={props => <SearchPage {...props} />} />
    </Switch>
  </BrowserRouter>
);

export default App;
