import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { useSelector } from "react-redux";
import CssBaseline from "@material-ui/core/CssBaseline";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import { Redirect } from "react-router";
import formStyles from "../../Styling/formStyles";

/**
 * @module Payment
 */

/**
 * Custom CSS styling for OrderSummary.js.
 *
 * @param theme - The global MUI theme created in theme.js
 * @ignore
 */
const useStyles = makeStyles(theme => ({
  ...formStyles(theme)
}));

/**
 * OrderSummary page is responsible for rendering the dish information for the particular order the customer chose to pay for.
 *
 * @returns {*} - A container with the content to be rendered.
 * @constructor
 * @memberOf module:Payment
 */
function OrderSummary() {
  const classes = useStyles();
  const currentUser = useSelector(state => state.currentUser);
  const [currentOrder, setCurrentOrder] = React.useState();
  const [redirectToTracking, setRedirectToTracking] = React.useState(false);
  const [redirectToPayment, setRedirectToPayment] = React.useState(false);
  const [loadedOrders, setLoadedOrders] = React.useState(false);
  const orderID = localStorage.getItem("ProcessedOrderID");

  /**
   * handleBack function is responsible for changing the state of RedirectToTracking. Once it is true, a ternary expression in the return clause triggers a redirection to Tracking.js
   */
  const handleBack = () => {
    setRedirectToTracking(true);
  };

  /**
   * handleNext function is responsible for changing the state of RedirectToPayment. Once it is true, a ternary expression in the return clause triggers a redirection to PaymentForm.js
   */
  const handleNext = () => {
    setRedirectToPayment(true);
  };

  /**
   * MapOrderItem takes an array of item arrays. It uses the elements in the array to render a list of dishes for a particular order the customer wants to pay.
   * @param value - an array containing order information.
   * @returns A list of dishes with their quantities and prices.
   */
  const MapOrderItem = ({ value }) => {
    return value.map((ele, index) => {
      const { name, cumulative_price, quantity } = ele;
      return (
        <ListItem className={classes.listItem} key={index}>
          <ListItemText primary={name} secondary={cumulative_price} />
          <Typography variant="body2">{quantity}</Typography>
        </ListItem>
      );
    });
  };


  /**
   *  getSummary is a function which fetches the particular order relating to the customer. The response is stored in a state. The orderSummary component is notified via LoadedOrders to render the content.
   */
  const getSummary = () => {
    fetch("//127.0.0.1:5000/get_order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cust_id: currentUser.user.name,
        order_id: orderID
      })
    })
      .then(response => {
        return response.json();
      })
      .then(data => {
        setCurrentOrder(data.data.order);
        setLoadedOrders(true);
      });
  };

  useEffect(() => {
    getSummary();
  }, []);

  /** The return clause renders a container which lists the items within the particular order customer chose to pay.
  * While loadedOrders are false, "loading ... " is displayed. Once they are successfully fetched , the state is changed and orders are then rendered.
  */

  return (
    <React.Fragment>
      <CssBaseline />
      {redirectToTracking ? <Redirect to="/Tracking" /> : null}
      {redirectToPayment ? <Redirect to="/PaymentForm" /> : null}

      <main className={classes.layout}>
        <Paper className={classes.paper}>
          <Typography component="h1" variant="h4" align="center">
            Order Summary
          </Typography>
          {loadedOrders ? (
            <List disablePadding>
              <MapOrderItem value={currentOrder[0].items} />
              <ListItem className={classes.listItem}>
                <ListItemText primary="Total" />
                <Typography variant="subtitle1" className={classes.total}>
                  {currentOrder[0].price}
                </Typography>
              </ListItem>
            </List>
          ) : (
            <Typography variant="subtitle1">Loading orders..</Typography>
          )}
          <div className={classes.buttons}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleBack}
              className={classes.button}
            >
              Back to Tracking
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleNext}
              className={classes.button}
            >
              Next
            </Button>
          </div>
        </Paper>
      </main>
    </React.Fragment>
  );
}

export default OrderSummary;
/**
 * Used https://material-ui.com/getting-started/templates/checkout/ template as inspiration.
 */
