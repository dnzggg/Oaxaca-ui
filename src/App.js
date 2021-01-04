import React, {useEffect} from 'react';
import './App.css';
import Home from "./Components/Common/Home";
import FoodMenu from "./Components/Menu/FoodMenu";
import About from "./Components/Common/About";
import {Route, Router} from "react-router-dom";
import history from "./utils/history";
import NavBar from "./Components/Common/NavBar";
import SignIn from "./Components/LoginAndSignUp/Login";
import SignUp from "./Components/LoginAndSignUp/SignUp";
import WaiterDashboard from "./Components/Waiter/WaiterDashboard";
import {useDispatch, useSelector} from "react-redux";
import Order from "./Components/Order/Order";
import Tracking from "./Components/Payment/Tracking";
import WaiterMenu from "./Components/Waiter/WaiterMenu";
import userActions from "./actions/userActions";
import OrderSummary from "./Components/Payment/OrderSummary";
import PaymentForm from "./Components/Payment/PaymentForm";
import PostPaymentPage from "./Components/Payment/PostPaymentPage";
import TableAssignment from "./Components/Waiter/TableAssignment"
import PaymentInformation from "./Components/Payment/PaymentInformation";


/**
 * Component that renders NavBar to all pages and creates routes to pages
 *
 * @return {string} HTML markup for the whole website
 * @constructor
 */
const App = () => {
    /**
     * User that is logged in
     */
    const currentUser = useSelector(state => state.currentUser);

    const dispatch = useDispatch();
    /**
     * When page is reloaded if user is logged in auto logs the user
     * @method
     */
    useEffect(() => dispatch(userActions.autoLogIn()),
        [dispatch]);

    return (
            <div className="App">
                <Router history={history}>
                    <div className="Index">
                        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
                        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />


                        <NavBar />

                        <Route exact path="/">
                            <Home />
                        </Route>
                        <Route path="/Home">
                            <Home/>
                        </Route>
                        <Route path="/About">
                            <About/>
                        </Route>
                        <Route path="/Menu">
                            <FoodMenu />
                        </Route>
                        <Route path="/PaymentInfo">
                            <PaymentInformation/>
                        </Route>

                        {currentUser.staff ?
                            <>
                                <Route path="/WaiterDashboard">
                                    <WaiterDashboard />
                                </Route>
                                <Route path="/WaiterMenu">
                                    <WaiterMenu />
                                </Route>
                                <Route path="/TableAssignment">
                                    <TableAssignment />
                                </Route>
                                <Route path="/RegisterWaiter">
                                    <SignUp />
                                </Route>

                            </>
                            :
                            <>
                                <Route path="/WaiterDashboard">
                                    <FoodMenu />
                                </Route>
                                <Route path="/WaiterMenu">
                                    <FoodMenu />
                                </Route>
                                <Route path="/TableAssignment">
                                    <FoodMenu />
                                </Route>
                                <Route path="/RegisterWaiter">
                                    <FoodMenu />
                                </Route>
                            </>
                        }

                        {currentUser.loggedIn ?
                            <>
                                <Route path="/Login">
                                    <FoodMenu />
                                </Route>
                                <Route path="/Register">
                                    <FoodMenu />
                                </Route>
                                <Route path="/Order">
                                    <Order />
                                </Route>
                                <Route path="/Tracking">
                                    <Tracking/>
                                </Route>
                                <Route path="/PaymentForm">
                                    <PaymentForm/>
                                </Route>
                                <Route path="/OrderSummary">
                                    <OrderSummary/>
                                </Route>
                                <Route path="/PostPaymentPage">
                                    <PostPaymentPage/>
                                </Route>
                            </>
                            :
                            <>
                                <Route path="/Login">
                                    <SignIn />
                                </Route>
                                <Route path="/Register">
                                    <SignUp />
                                </Route>
                                <Route path="/Order">
                                    <SignIn />
                                </Route>
                            </>}
                    </div>
                </Router>
            </div>
        );
};

export default App;
