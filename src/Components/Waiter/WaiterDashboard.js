import React, {useEffect, useState} from 'react';
import {CssBaseline, Typography, withStyles} from '@material-ui/core';
import Copyright from "../Common/Copyright";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import OrderItem from "../Order/OrderItem";
import {useN04TextInfoContentStyles} from "@mui-treasury/styles/textInfoContent/n04";
import TextInfoContent from "@mui-treasury/components/content/textInfo";


/**
 * Custom CSS styling for WaiterDashboard.js.
 *
 * @param theme - The global MUI theme created in theme.js
 * @ignore
 */
const useStyles = theme => ({
    root: {
        flexGrow: 1,
        marginTop: 10,
    },

    card: {
        padding: theme.spacing(6),
        marginTop: theme.spacing(6),
        display: 'flex',
        textAlign: 'center',
        flexDirection: 'column',
        alignItems: 'center',
        fontSize: 20
    },

    typography: {
        marginTop: 10, fontSize: 25
    }
});

const _ = require('lodash');

/**
 *
 * WaiterDashboard - component responsible for displaying the dashboard
 * where the waiter can change state of orders and cancel them
 *
 * @param props
 * @returns {*} - a rendered container of three lists containing order from differend sates
 * @constructor
 * @memberOf module:Waiter
 */
const WaiterDashboard = (props) => {
    const {classes} = props;

    /**
     * State variables
     */
    const [state, setState] = useState({requested: [], cooking: [], ready_to_deliver: []});

    //Function called at an interval to refresh the state and re-render the dashboard.
    /**
     * Function called at an interval to refresh the state and re-render the dashboard.
     */
    useEffect(() => {
        const interval = setInterval(() => {
            const orderStates = ["requested", "ready_to_deliver", "cooking"];
            fetch("//127.0.0.1:5000/get_orders", {method:'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({"states": orderStates})
            }).then(response => {
                return response.json()
            }).then(data => {
                // if the array is not null
                let orders = data.data.orders;
                // eslint-disable-next-line
                const changedState = {"requested": [], "ready_to_deliver": [], "cooking": []};
                if(orders){
                    orders.forEach(ele => {
                        changedState[ele.state].push(ele)
                    })
                }
                if (!_.isEqual(state, changedState)) {
                    setState(changedState)
                }
                // else do nothing
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [state]);

    /**
     *
     * MapOrderItem - maps all the orders as cards.
     * called for each of three state columns.
     * @param {value} - a list of all orders.
     * @returns {*} - a map of orders as cards
     * */
    const MapOrderItem = ({value}) => {
        return value.map((ele, index) => {
            let {state, id, table_number, items, ordered_time, price} = ele;
            return (<OrderItem key={index} orderState={state} tableID={table_number} orderID={id} allItems={items} time={ordered_time} totalPrice={price} />)
        })
    };

    return (
            <React.Fragment>
                <CssBaseline />

                <Grid container spacing={3}>
                    {/*Grid for the to be confirmed, order objects will later be loaded in dynamically*/}
                    <Grid item xs>
                        <TextInfoContent
                            useStyles={useN04TextInfoContentStyles}
                            heading={'To Be Confirmed'}
                        />
                        { state.requested.length === 0 ?
                            <Typography className={classes.typography} color={"textPrimary"} gutterBottom>
                                Nothing has been requested!
                            </Typography>
                            :
                            <MapOrderItem value={state.requested}/>
                        }

                      </Grid>

                    <Grid item xs>
                        <TextInfoContent
                            useStyles={useN04TextInfoContentStyles}
                            heading={'In Progress'}
                        />
                        { state.cooking.length === 0 ?
                            <Typography className={classes.typography} color={"textPrimary"} gutterBottom>
                                Nothing is being cooked!
                            </Typography>
                            :
                            <MapOrderItem value={state.cooking}/>
                        }
                    </Grid>

                    <Grid item xs>
                        <TextInfoContent
                            useStyles={useN04TextInfoContentStyles}
                            heading={'To Be Served'}
                        />
                        { state.ready_to_deliver.length === 0 ?
                            <Typography className={classes.typography} color={"textPrimary"} gutterBottom>
                                Nothing to be served yet!
                            </Typography>
                            :
                            <MapOrderItem value={state.ready_to_deliver}/>
                        }
                    </Grid>
                </Grid>

                    <Box mt={5}>
                        <Copyright />
                    </Box>
            </React.Fragment>

        );
};

export default withStyles(useStyles)(WaiterDashboard);
