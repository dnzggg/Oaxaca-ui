import React, {useEffect, useState} from "react";
import {Dialog, Divider, FlatButton, MuiThemeProvider} from "material-ui";
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from '@material-ui/icons/Close';
import withStyles from "@material-ui/core/styles/withStyles";
import MuiDialogContent from "@material-ui/core/DialogContent";
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {useSelector} from "react-redux";

/**
 * @module Notification
 */

/**
 * Custom CSS styling for Notification.js.
 *
 * @param theme - The global MUI theme created in theme.js
 * @ignore
 */
const styles = theme => ({
    root: {
        margin: 0,
        padding: theme.spacing(2),
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
    },
});

/**
 * Maps notifications to text items
 *
 * @param props properties passed in MapNotifications
 * @return {*} a list of notifications
 * @constructor
 */
const MapNotifications = (props) => {
    const {notifications} = props;
    if (notifications !== []) {
        return notifications.reverse().map(function (notification, index) {
            return (<div key={index}>
                    <Typography >{notification[3]}</Typography>
                    <Divider />
                </div>
                )
        })
    } else {
        return null;
    }
};

/**
 * Adds close button to dialog title
 *
 * @param props properties passed in DialogTitle
 * @return {*} dialog title with a close button
 * @constructor
 */
const DialogTitle = withStyles(styles)(props => {
    const {children, classes, onClose, ...other} = props;
    return (
        <MuiDialogTitle disableTypography className={classes.root} {...other}>
            <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
                <CloseIcon />
            </IconButton>
        </MuiDialogTitle>
    );
});

/**
 * Changes the style of DialogContent
 *
 * @return {*} styled dialog content
 * @constructor
 */
const DialogContent = withStyles(theme => ({
    root: {
        padding: theme.spacing(2),
    },
}))(MuiDialogContent);

/**
 * Component that shows all the notifications that waiter has in a dialog window
 *
 * @param props properties passed in Notification
 * @return {*} a dialog window with all the notifications mapped
 * @constructor
 */
const Notification = (props) => {
    const {numberOfNotifications, open, setOpen} = props;
    const [notifications, setNotifications] = useState([]);
    /**
     * User that is logged in
     */
    const currentUser = useSelector(state => state.currentUser);

    /**
     * React hook that checks if there is a new waiter notification every second
     */
    useEffect(() => {
        if (currentUser.loggedIn && currentUser.staff){
            fetch("//127.0.0.1:5000/get_waiter_notifications", {method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({"waiter_email": currentUser.user.name})
            }).then((response) => {
                return response.json();
            }).then((data) => {
                setNotifications(data.data.notifications);
                numberOfNotifications(notifications.length)
            });
        }
    }, [notifications, open]);

    /**
     * Closes the dialog screen
     */
    function handleClose() {
        setOpen(false)
    }

    /**
     * Clears all the notifications that the waiter has with a button click
     */
    function handleClearNotifications() {
        if (currentUser.loggedIn && currentUser.staff) {
            fetch("//127.0.0.1:5000/clear_waiter_notifications", {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({"waiter_email": currentUser.user.name})
            }).then((response) => {
                return response.json();
            })
        }
    }

    /**
     * All the possible actions that can be done from the dialog screen
     * @type {[]}
     */
    const actions = [
        <FlatButton
            label="Clear"
            keyboardFocused={true}
            onClick={handleClearNotifications}
        />,
    ];

    return (<MuiThemeProvider muiTheme={getMuiTheme()}>
            <Dialog title="Notifications"
                    actions={actions}
                    modal={false}
                    open={open}
                    onRequestClose={handleClose}
                    autoScrollBodyContent={true}>
                <DialogTitle id={"customized-dialog-title"} onClose={handleClose}> </DialogTitle>
                <DialogContent dividers>
                    <MapNotifications notifications={notifications}/>
                </DialogContent>
            </Dialog>
        </MuiThemeProvider>)
};

export default Notification;
