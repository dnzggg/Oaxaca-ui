import React, {useState} from 'react';
import {AppBar, Button, CssBaseline, Slide, Toolbar, Typography, useScrollTrigger,} from '@material-ui/core';
import {makeStyles} from "@material-ui/core/styles";
import PropTypes from "prop-types";
import {ShoppingBasket} from "@material-ui/icons";
import IconButton from "@material-ui/core/IconButton";
import theme from "../../Styling/theme";
import ThemeProvider from "@material-ui/styles/ThemeProvider";
import {useDispatch, useSelector} from "react-redux";
import History from "../../utils/history"
import Avatar from "@material-ui/core/Avatar";
import userActions from "../../actions/userActions";
import Snackbar from "@material-ui/core/Snackbar";
import DashboardIcon from '@material-ui/icons/Dashboard';
import RestaurantMenuIcon from '@material-ui/icons/RestaurantMenu';
import DeckIcon from '@material-ui/icons/Deck';
import Notification from "../Notification/Notification";
import NotificationsIcon from '@material-ui/icons/Notifications';
import {Badge, MuiThemeProvider} from "material-ui";
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {red} from '@material-ui/core/colors';
import PanToolIcon from '@material-ui/icons/PanTool';
import MoneyOffIcon from '@material-ui/icons/MoneyOff';
import PaymentIcon from '@material-ui/icons/Payment';

/**
 * This is used to hide the NavBar when user scrolls down
 *
 * @param props
 * @return {string} HTML markup for slider object
 * @component
 * @ignore
 */
function HideOnScroll(props) {
    const {children, window} = props;

    const trigger = useScrollTrigger({target : window ? window() : undefined});

    return(<Slide appear={false} direction="down" in={!trigger}>{children}</Slide>);
}

HideOnScroll.propTypes = {
    children: PropTypes.element.isRequired,

    window: PropTypes.func,
};

/**
 * Custom CSS styling for NavBar.js.
 *
 * @param theme - The global MUI theme created in theme.js
 * @ignore
 */
const useStyles = makeStyles(({
    root: {
        flexGrow: 1,
        marginBottom: '1%'
    },
    blank: {
        flexGrow: 1,
    },
    header : {
        textAlign: 'center',
        fontSize: 20,
        lineHeight: 2,
        fontWeight: 350,
        fontFamily:
        // eslint-disable-next-line max-len
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
    },
    largeIcon: {
        fontSize: "3em"
    },
}));

/**
 * Component that is used to navigate between pages and for different type of users renders differently
 *
 * @param props properties passed in NavBar
 * @return {string} HTML markup for NavBar
 * @constructor
 * @memberOf module:Common
 */
function NavBar(props) {
    const classes = useStyles();
    const dispatch = useDispatch();
    /**
     * User that is logged in
     */
    const currentUser = useSelector(state => state.currentUser);
    /**
     * Total price of what the user has put in to basket
     */
    const total = useSelector(state => state.currentItems.total);
    const vertical = "bottom";
    const horizontal = "right";
    /**
     * To check if notification is open
     */
    const [notificationOpen, setNotificationOpen] = useState(false);
    /**
     * To check the amount of notifications
     */
    const [notificationCount, setCount] = useState(0);
    /**
     * Table number of the user
     * @type {string}
     */
    const table = localStorage.getItem("table");

    /**
     * It logs the user out when logout button is pressed
     */
    function logOut() {
        dispatch(userActions.logOut());
        fetch("//127.0.0.1:5000/logout", {method: 'POST'})
            .then((response) => {
            return response.json();
        })
    }

    /**
     * To set the number of notifications received from the api
     * @param number number of notifications
     */
    const handleNumberOfNotifications = (number) => {
        setCount(number)
    };
    /**
     * First gets waiter id from given table number then creates a new notification for the waiter that says table needs help
     * @param called from where the function is called
     * @param waiter the id of the waiter gotten from the api with table number
     */
    const callWaiter = (called, waiter={}) => {
        if (called === "button") {
            fetch("//127.0.0.1:5000/get_waiter_assigned_to_table", {method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({"table_id": table})
            }).then((response) => {
                return response.json();
            }).then((data) => {
                const waiter_email = data.data.waiter_id;
                callWaiter("function", waiter_email)
            });
        } else if (called === "function") {
            fetch("//127.0.0.1:5000/add_waiter_notification", {method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({"waiter_email": waiter, "message": "Table " + table + " needs help", "customer_email": currentUser.user.name})
            }).then((response) => {
                return response.json();
            }).then((data) => {
                console.log(data)
            });
        }
    };

    return(
        <div className={classes.root}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <HideOnScroll {...props}>
                    <AppBar className={classes.size} color={"secondary"}>
                        <Toolbar>
                            <Button onClick={() => History.push("/Home")} className={classes.header} color={"inherit"}>Home</Button>
                            <Button onClick={() => History.push("/About")} className={classes.header} color={"inherit"}>About</Button>
                            <Button onClick={() => History.push("/Menu")} className={classes.header} color={"inherit"}>Menu</Button>

                            <Typography variant="h6" className={classes.blank}> </Typography>

                            {currentUser.loggedIn ?
                                <>
                                    {currentUser.staff ?
                                        <>
                                            <Button onClick={() => History.push("/RegisterWaiter")} edge={"start"} color={"inherit"}>
                                                Register New Waiter
                                            </Button>
                                            <MuiThemeProvider muiTheme={getMuiTheme()}>
                                                <Badge badgeContent={notificationCount} badgeStyle={{top: 20, right: 15, backgroundColor: red.A400}}>
                                                    <IconButton style={{bottom: 5}} onClick={() => setNotificationOpen(true)} edge={"start"} color={"inherit"} tooltip={"notifications"} aria-label={"notification"}>
                                                        <NotificationsIcon />
                                                    </IconButton>
                                                </Badge>
                                            </MuiThemeProvider>
                                            <IconButton onClick={() => History.push("/WaiterDashboard")} edge={"start"} color={"inherit"} aria-label={"dashboard"}>
                                                <DashboardIcon fontSize="large" />
                                            </IconButton><IconButton onClick={() => History.push("/PaymentInfo")} edge={"start"} color={"inherit"} aria-label={"payment"}>
                                                <MoneyOffIcon fontSize="large" />
                                            </IconButton>
                                            <IconButton onClick={() => History.push("/WaiterMenu")} edge={"start"} color={"inherit"} aria-label={"dashboard"}>
                                                <RestaurantMenuIcon  fontSize="large"/>
                                            </IconButton>
                                            <IconButton onClick={() => History.push("/TableAssignment")} edge={"start"} color={"inherit"} aria-label={"dashboard"}>
                                                <DeckIcon  fontSize="large"/>
                                            </IconButton>
                                        </>
                                        :
                                        <>
                                            <IconButton onClick={() => callWaiter("button")} edge={"start"} color={"inherit"} aria-label={"notify"}>
                                                <PanToolIcon  fontSize="large"/>
                                            </IconButton>
                                            <IconButton onClick={() => History.push("/Tracking")} edge={"start"} color={"inherit"} aria-label={"payment"}>
                                                <PaymentIcon  fontSize="large"/>
                                            </IconButton>
                                            <IconButton onClick={() => History.push("/Order")} edge="start" color={"inherit"} aria-label={"basket"}>
                                                <ShoppingBasket fontSize="large" />
                                            </IconButton>
                                        </>}
                                    <Avatar className={classes.yellow} onClick={() => logOut()}>{currentUser.user.name[0]}</Avatar>
                                </>
                                :
                                <>
                                    <IconButton onClick={() => History.push("/Order")} edge="start" color={"inherit"} aria-label={"basket"}>
                                        <ShoppingBasket fontSize="large" />
                                    </IconButton>
                                    <Button onClick={() => History.push("/Register")} color={"inherit"} className={classes.header}>Register</Button>
                                    <Button onClick={() => History.push("/Login")} color={"inherit"} className={classes.header}>Login</Button>
                                </>}

                        </Toolbar>
                    </AppBar>
                </HideOnScroll>
                <Notification numberOfNotifications={handleNumberOfNotifications} open={notificationOpen} setOpen={setNotificationOpen}/>
                <Toolbar />
                {total>0? <Snackbar
                    anchorOrigin={{ vertical, horizontal }}
                    key={`${vertical},${horizontal}`}
                    open={true}
                    message={"Total price: " + total}
                /> : null}
            </ThemeProvider>
        </div>
        );
}

export default NavBar;
