// src/App.js
import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import StakePage from "./components/StakePage";
import IndexPage from "./components/IndexPage";
import RegisterPage from "./components/RegisterPage";
import Loader from "./components/Loader";
import WithdrawalPage from "./components/WithdrawalPage";
// import MiningPage from "./components/MiningPage";
import MiningPage from "./components/Mining";
import LoginWithWallet from "./components/LoginWithWallet";
import Profile from "./components/Profile";
import Wheel from "./components/Wheel";
import Withdrawal from "./components/Withdrawal";
import Community from "./components/Community";
import StartAnimation from "./components/StartAnimation";

const App = () => {
  return (
    <Router>
      <Switch>
        
        <Route path="/" exact component={IndexPage} />
        <Route path="/withdrawal" component={Withdrawal} />
        <Route path="/community" component={Community} />
        <Route path="/login" exact component={LoginWithWallet} />
        <Route path="/Loader" exact component={Loader} />
        <Route path="/register" exact component={RegisterPage} />
        <Route path="/dashboard" exact component={Dashboard} />
        <Route path="/profile" exact component={Profile} />
        <Route path="/stake" exact component={StakePage} />
        {/* <Route path="/withdrawal" exact component={WithdrawalPage} /> */}
        <Route path="/mining" exact component={MiningPage} />
        <Route path="/wheel" exact component={Wheel} />
        <Route path="/animation" exact component={StartAnimation} />
      </Switch>
    </Router>
  );
};

export default App;
