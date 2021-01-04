import React, {useEffect} from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {useSelector} from "react-redux";
import TrackingItem from "./TrackingItem";
import Grid from "@material-ui/core/Grid";
import CssBaseline from "@material-ui/core/CssBaseline";
import Alert from "@material-ui/lab/Alert";
import Snackbar from "@material-ui/core/Snackbar";
import {Redirect} from "react-router";
import TextInfoContent from "@mui-treasury/components/content/textInfo";
import {useN04TextInfoContentStyles} from "@mui-treasury/styles/textInfoContent/n04";
import {Typography} from "@material-ui/core";


/**
 * Custom CSS styling for Tracking.js.
 *
 * @param theme - The global MUI theme created in theme.js
 * @ignore
 */
const useStyles = makeStyles(theme => ({
  body: {
    overflow: "hidden"
  },
  root: {
    marginTop: theme.spacing(8),
    alignItems: "center",
    overflow: "hidden"
  },
  orderContainer: {},
  grid: {
    flexGrow: 0,
    width:'99%'
  }
}));

/**
 * Tracking is responsible for rendering current and old order cards for that particular customer.
 *
 * @returns a container with a list of TrackingItem instances.
 * @constructor
 * @memberOf module:Payment
 */
const Tracking = () => {
  const classes = useStyles();
  const currentUser = useSelector(state => state.currentUser); // Get username.
  const [currentOrders, setCurrentOrders] = React.useState([]);
  const [oldOrders, setOldOrders] = React.useState([]);
  const [message, setMessage] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [paymentState, setPaymentState] = React.useState(false);

  /**
   *  getTracking is a function which fetches from the API the list of current orders associated to that particular customer.
   */
  const getTracking = () => {
    fetch("//127.0.0.1:5000/get_cust_orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cust_id: currentUser.user.name })
    })
        .then(response => {
          return response.json();
        })
        .then(data => {
          setCurrentOrders(data.data.orders);
        });
  };

  /**
   *  getOldTracking is a function which fetches from the API the list of past orders associated to that particular customer.
   */
  const getOldTracking = () => {
    fetch("//127.0.0.1:5000/get_old_cust_orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cust_id: currentUser.user.name })
    })
        .then(response => {
          return response.json();
        })
        .then(data => {
          //if (data.data.orders)
          setOldOrders(data.data.orders);
        });
  };

  /**
   *  This effect hook is responsible for re-rendering current and past orders when there's a change, such that the latest orders can be rendered.
   */
  useEffect(() => {
    getTracking();
    getOldTracking();

  }, []);

  /**
   * userAlert is a function responsible for updating the alert message and opening the alert message.
   */
  const userAlert = () => {
    setMessage("Order has been cancelled");
    setOpen(true);
  };

  /**
   *
   * The handleClose function is responsible for handling the closing of the alert notification.
   *
   * @param event - Event information passed from a user's action.
   * @param reason - Reason of the event
   */
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  /**
   *
   * updateState function is responsible for updating the state of an order when cancelled.
   *
   * @param id - The ID of an order being updated.
   * @param state - The current state of the order.
   */
  const updateState = (id, state) => {
    fetch("//127.0.0.1:5000/order_event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order_id: id, order_event: state })
    })
      .then(response => {
        getTracking();
        getOldTracking();
        return response.json();
      })
      .catch(error => {
        console.log(error);
      })
      .then(data => {
        console.log(data);
      });
  };

  /**
   * Responsible for updating the state such that the user gets redirected to the orderSummary.js page to pay.
   * @param orderID
   */
  function paymentRedirection(orderID) {
    setPaymentState(true);
    localStorage.setItem('ProcessedOrderID', orderID);
  }

  /**
   * The MapTrackingItem function takes order information and renders the information on the card.
   *
   * @param value - an array containing order information.
   * @returns A tracking item container
   */
  const MapTrackingItem = ({ value }) => {
    return value.map((ele, index) => {
      const { id, items, ordered_time, price, state, table_number } = ele;
      return (
        <TrackingItem
          sendState={updateState}
          sendAlert={userAlert}
          paymentIntent={paymentRedirection}
          key={index}
          orderState={state}
          tableID={table_number}
          orderID={id}
          allItems={items}
          time={ordered_time}
          totalPrice={price}
        />
      );
    });
  };


  return (
    <React.Fragment>
      <CssBaseline />
      {paymentState ? (
        <Redirect to="/OrderSummary" />
      ) : null}

      {currentOrders ?
          <div>
            <TextInfoContent
                useStyles={useN04TextInfoContentStyles}
                heading={'Current Orders'}
            />
            <Grid spacing={2} container className={classes.grid}>
              <MapTrackingItem value={currentOrders} />
            </Grid>
          </div>
          :
          <div>
            <TextInfoContent
                useStyles={useN04TextInfoContentStyles}
                heading={'Current Orders'}
            />
            <Typography className={classes.typography} color={"textPrimary"} gutterBottom>
              You have no current orders!
            </Typography>
          </div>
      }

      {oldOrders ?
          <div>
            <TextInfoContent
                useStyles={useN04TextInfoContentStyles}
                heading={'Past Orders'}
            />
            <Grid spacing={2} container className={classes.grid}>
              <MapTrackingItem value={oldOrders} />
            </Grid>
          </div>
          :
          <div>
            <TextInfoContent
                useStyles={useN04TextInfoContentStyles}
                heading={'Past Orders'}
            />
            <Typography className={classes.typography} color={"textPrimary"} gutterBottom>
              You have no old orders!
            </Typography>
          </div>
      }

      <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
        <Alert variant="filled" onClose={handleClose} severity={"info"}>
          {message}
        </Alert>
      </Snackbar>
    </React.Fragment>
  );
};

export default Tracking;
