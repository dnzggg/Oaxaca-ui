import React, {useEffect, useState} from "react";
import {Grid, Typography} from "@material-ui/core";
import {Card, MuiThemeProvider} from "material-ui";
import {makeStyles} from "@material-ui/core/styles";
import {useSelector} from "react-redux";
import {useN04TextInfoContentStyles} from "@mui-treasury/styles/textInfoContent/n04";
import TextInfoContent from "@mui-treasury/components/content/textInfo";


/**
 * Custom CSS styling for PaymentInformation.js.
 *
 * @param theme - The global MUI theme created in theme.js
 * @ignore
 */
const useStyles = makeStyles(theme => ({
   card: {
       padding: theme.spacing(6),
       margin: theme.spacing(6),
       display: 'flex',
       textAlign: 'center',
       flexDirection: 'column',
       alignItems: 'center',
       fontSize: 20
   },
    typography: {
        marginTop: 10, fontSize: 25
    }
}));

/**
 *
 * @return {*}
 * @constructor
 * @memberOf module:Payment
 */
const PaymentInformation = () => {
    const [info, setInfo] = useState([]);
    const classes = useStyles();
    const currentUser = useSelector(state => state.currentUser);

    useEffect(() => {
        const interval = setInterval(() => {
            if (currentUser.user !== undefined) {
                const waiter_id = currentUser.user.name;
                fetch("//127.0.0.1:5000/get_waiters_orders", {method:'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({"waiter_id": waiter_id, "states": ["delivered"]})
                }).then(response => {
                    return response.json()
                }).then(data => {
                        setInfo(data.data.orders)
                    }
                )
            }
        }, 1000);

        return () => clearInterval(interval);
        }
        ,[]);

    const MapPaymentInformation = () => {
        return info.map(function ({table_number}, index) {
            return (
                <Grid key={index} item xs={12} md={3}>
                    <Card className={classes.card}>
                        <Typography>Table {table_number} hasn't payed yet</Typography>
                    </Card>
                </Grid> )
        })
    };

    return (
        <React.Fragment>
            <MuiThemeProvider>
                <TextInfoContent
                    useStyles={useN04TextInfoContentStyles}
                    heading={'Customer Payment Information'}
                />
                {info ?
                    <Grid container spacing={3}>
                        <MapPaymentInformation/>
                    </Grid>
                    :
                    <Typography className={classes.typography} color={"textPrimary"} gutterBottom>
                        Nothing has been delivered!
                    </Typography>
                }
            </MuiThemeProvider>
        </React.Fragment>
    )
};

export default PaymentInformation;
