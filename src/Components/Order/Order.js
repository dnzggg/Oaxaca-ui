import React from "react";
import { List, ListItem } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import ListItemText from "@material-ui/core/ListItemText";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { useDispatch, useSelector } from "react-redux";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import allActions from "../../actions";
import { Redirect } from "react-router";
import {useMaterialListItemStyles} from "@mui-treasury/styles/listItem/material";
import buttonStyles from "../../Styling/buttonStyles";
import TextInfoContent from "@mui-treasury/components/content/textInfo";
import {useN04TextInfoContentStyles} from "@mui-treasury/styles/textInfoContent/n04";

/**
 * Custom CSS styling for Order.js.
 *
 * @param theme - The global MUI theme created in theme.js
 * @ignore
 */
const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    maxWidth: 250,
    backgroundColor: theme.palette.background.paper,
    alignItems: "center",
    justify: "center",
  },
  inline: {
    display: "inline"
  },
  spacing: {
    marginTop : "2%",
    marginBottom: "2%",
    marginLeft : "15%",
    marginRight : "15%"
  },
  title: {
    marginTop: "2%",
    variant: "h2",
    color: "textSecondary"
  },
  ...buttonStyles()
}));

/**
 * Component that renders the order page where it maps all the ordered items and user is able to check them and confirm
 * their order from this page
 *
 * @return {*} a list of items and a button where they can order food
 * @constructor
 * @memberOf module:Order
 */
const Order = () => {
  const classes = useStyles();
  /**
   * Items that are selected by the user
   */
  const currentItems = useSelector(state => state.currentItems);
  /**
   * User that is logged in
   */
  const currentUser = useSelector(state => state.currentUser);
  const [orderButtonClicked, setOrderButtonClicked] = React.useState(false);
  /**
   * Items that are selected by the user
   */
  const items = currentItems.items;
  const dispatch = useDispatch();
  /**
   * Table number of the user
   * @type {string}
   */
  const table = localStorage.getItem("table");

  /**
   * Component that maps all the items that the customer ordered
   *
   * @return {*} a list of text items that has the name of the dish
   */
  const MapOrderItem = () => {
    const currentItems = useSelector(state => state.currentItems);
    const items = currentItems.items;
    const treasuryStyle = useMaterialListItemStyles();

    if (items.length !== 0) {
      return items.map(function(dish, index) {
        const itemName = dish.name;
        const itemQuantity = dish.q;
        if (itemQuantity > 0) {
          return (
              <ListItem key={index} classes={treasuryStyle}>
                <ListItemText
                    primary={
                      <React.Fragment>
                        <Typography
                            component="span"
                            variant="body1"
                            color="textPrimary"
                        >
                          {itemName}
                        </Typography>
                      </React.Fragment>
                    }
                    secondary={
                      <React.Fragment>
                        <Typography
                            component="span"
                            variant="body2"
                            color="textSecondary"
                        >
                          X {itemQuantity}
                        </Typography>
                      </React.Fragment>
                    }
                />
              </ListItem>
          );
        } else {
          return <div key={index}> </div>;
        }
      });
    } else {

      return <div >
        <Typography variant={"body1"} color={"inherit"} align={"center"}>
          You have not placed any dishes into the basket.
        </Typography>
      </div>;
    }
  };

  /**
   * First gets waiter id from given table number then creates a
   * new notification for the waiter that says table has ordered food
   *
   * @param called from where the function is called
   * @param waiter the id of the waiter gotten from the api with table number
   */
  const callWaiter = (called, waiter={}) => {
    if (called === "outside") {
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
        body: JSON.stringify({"waiter_email": waiter, "message": "Table " + table + " ordered food", "customer_email": currentUser.user.name})
      }).then((response) => {
        return response.json();
      }).then((data) => {
        console.log(data)
      });
    }
  };

  /**
   * Creates order with a button click where it calls the api and gives the ordered items
   */
  const handleClick = () => {
    const apiItems = [];
    items.map(function(dish) {
      for (let i = 0; i < dish.q; i++) {
        apiItems.push(dish.id);
      }
      return null;
    });
    fetch("//127.0.0.1:5000/create_order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        table_num: table,
        items: apiItems,
        customer: currentUser.user.name
      })
    })
      .then(response => {
        return response.json();
      })
      .then(data => {
        console.log(data);
        callWaiter("outside");
        dispatch(allActions.itemActions.resetItems());
        setOrderButtonClicked(true);
      })
      .catch(error => console.log(error));
  };

  /**
   * Checks if the user can order
   * @return {boolean} true if user can order
   */
  const canOrder = () => {
    return items.length === 0
  };

  return (
    <React.Fragment>
      {orderButtonClicked ? <Redirect to={"/Tracking"} /> : null}
      <TextInfoContent
          useStyles={useN04TextInfoContentStyles}
          heading={'Review your order'}
      />

      <List className={classes.spacing}>
        <MapOrderItem />
      </List>

      <Grid container>
        <Grid item xs={12}>
          <Button
            disabled={canOrder()}
            onClick={() => handleClick()}
            type="submit"
            variant="contained"
            color="primary"
            className={classes.button}
          >
            Order
          </Button>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default Order;
