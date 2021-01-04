import React from 'react';
import Divider from "@material-ui/core/Divider";
import CardHeader from "@material-ui/core/CardHeader";
import CardActions from "@material-ui/core/CardActions";
import FormControl from "@material-ui/core/FormControl";
import Card from "@material-ui/core/Card";
import {makeStyles} from "@material-ui/core/styles";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import Typography from "@material-ui/core/Typography";
import CssBaseline from "@material-ui/core/CssBaseline";



/**
 * Custom CSS styling for WaiterMenuItem.js.
 *
 * @param theme - The global MUI theme created in theme.js
 * @ignore
 */
const useStyles = makeStyles(theme => ({
    form: {
        width: '100%',
        marginTop: theme.spacing(1),

    },
    paper: {
        marginTop: theme.spacing(8),
        flexGrow: 1,
    },
    cardTitle : {
        fontSize:'1.1rem'
    },
    orderCard: {
        margin: theme.spacing(3, 0, 2),
        color: 'primary'

    },

}));

/**
 * WaiterMenuItem is a component responsible for rendering each available menu item with their respective availability states and updating them.
 * @returns {*} - A container with the respective content.
 * @constructor
 * @memberOf module:Waiter
 */
const WaiterMenuItem = ( props ) => {
    const classes = useStyles();
    const {id,value,state} = props;

    /**
     * handleChange function handles the change of radio button that updates the state of dish availability.
     * @param event - The user's action on the radio buttons.
     */
    const handleChange = event => {
        let itemID = id;
        let state = event.target.value;
        let element = [itemID,state];
        props.sendState(element);
    };

    return (
        <div className={classes.paper} >
            <CssBaseline/>
            <Card className={classes.orderCard}>
                <CardHeader title={value}
                titleTypographyProps={
                    {variant:'body1', noWrap:true}
                }/>

                <Divider />

                <Typography gutterBottom variant="subtitle1">
                    ID {id}
                </Typography>
                <CardActions >
                    <FormControl component="fieldset" className={classes.form}>
                        <RadioGroup aria-label="Availability" name="dishState" onChange={handleChange} defaultValue={ (state===true) ? "Available":"Unavailable"}>
                            <FormControlLabel value="Available" control={<Radio color={'primary'} />} label="Available" />
                            <FormControlLabel value="Unavailable" control={<Radio color={'primary'}/>} label="Unavailable" />
                        </RadioGroup>
                    </FormControl>
                </CardActions>
            </Card>
        </div>
    );
};


export default (WaiterMenuItem);
