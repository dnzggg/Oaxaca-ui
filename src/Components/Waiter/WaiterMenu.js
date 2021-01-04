import React, {useEffect, useState} from 'react';
import {Container} from "@material-ui/core";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import WaiterMenuItem from "./WaiterMenuItem";
import Button from "@material-ui/core/Button";
import {makeStyles} from "@material-ui/core/styles";
import theme from "../../Styling/theme";
import ThemeProvider from "@material-ui/styles/ThemeProvider/ThemeProvider";
import Snackbar from '@material-ui/core/Snackbar';
import Alert from "@material-ui/lab/Alert";
import buttonStyles from "../../Styling/buttonStyles";


/**
 * Custom CSS styling for WaiterMenu.js.
 *
 * @param theme - The global MUI theme created in theme.js
 * @ignore
 */

const useStyles = makeStyles(theme => ({

    paper: {
        marginTop: theme.spacing(8),
        alignItems: 'center',

    },
    form: {
        width: '100%',
        marginTop: theme.spacing(1),
    },
    grid :{
        flexGrow:1
    },
    ...buttonStyles(theme)
}));


/**
 *
 * WaiterMenu - component responsible for displaying all the dishes available to the waiter.
 * Each dish will show a drop-down menu with availability choices, selected dishes will be updated once the submit button is pressed to submit the new availability.
 *
 * @returns {*} - a rendered container of each menu item.
 * @constructor
 * @memberOf module:Waiter
 */

const WaiterMenu = () => {
    const [items, setItems] = useState([]);
    const [vegan] = useState(false);
    const [vegetarian] = useState(false);
    const [glutenFree] = useState(false);
    const [open, setOpen] = React.useState(false);
    const [severity, setSeverity] = React.useState("");
    const [message, setMessage] = React.useState("");
    const [updatedItems,setUpdatedItems] = useState([]);
    const [unavailableItems,setUnavailableItems] = useState([]);
    const classes = useStyles();


    /**
     *
     * GetMenu is responsible for fetching the set of items from the API.
     *
     * @returns {*} - A list of items with their respective availability states.
     */
    const getMenu = () => {
        fetch("//127.0.0.1:5000/menu", {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({"getAll": true})
        }).then((response) => {
            return response.json();
        }).then((data) => {
            setItems(data.data.items);
            const items = [];
            data.data.items.forEach( ele => {
                if (ele.available === false){
                    items.push([ele.id, "Available"])
                }
            });
            setUnavailableItems(items)
        });
    };
    useEffect(() => {
        getMenu()
    }, []);


    /**
     *
     * handleState updates array of items that need a state update. Function is passed as a prop to be called back by child component (waiterMenuItem)
     *
     */

    const handleState = (item) => {
        // Item is the "ID,state" pair. that is added to the updatedArray state.
        let tempArray = updatedItems;
        tempArray.push(item);
        setUpdatedItems(tempArray);
    };

    /**
     * MapWaiterMenuItem uses the set of items retrieved from getMenu to map the relevant information to the WaiterMenuItem components.
     *
     * @param value which is the type of dish
     * @return a list WaiterMenuItem objects
     */

    const MapWaiterMenuItem = ({value}) => {
        return items.map((dish, index) => {
            const type = dish.type;
            if(type === value){
                if ((vegan && dish.vegan === vegan) || (vegetarian && dish.vegetarian === vegetarian) || (glutenFree && dish.gluten_free === glutenFree)){
                    return (<WaiterMenuItem sendState={handleState} key={index} id={dish.id} value={dish.name} />)
                }else if (!vegan && !vegetarian && !glutenFree) {
                    return (<WaiterMenuItem  sendState={handleState} key={index} id={dish.id} value={dish.name} state={dish.available}/>)
                }
            } return null;
        });
    };

    /**
     *
     * The handleClose function is responsible for handling the closing of the alert notification.
     *
     * @param event - Event information passed from a user's action.
     * @param reason - Reason of the event
     */

    const handleClose = (event, reason) => {
        // Handles the closing of a notification.
        if (reason === 'clickaway') {
            return
        }
        setOpen(false)
    };

    /**
     *
     * handleReset function is responsible for handling the resetting of the availability states of dishes.
     *
     * @param event - Event information passed from a user's action , the button click.
     */

    const handleReset = event => {
        /* Handles the reset of availability states back to default. */
        event.preventDefault();
        handleChange(unavailableItems)
    };

    /**
     *
     * handleSubmit function is responsible for handling the submission of the availability states of dishes.
     *
     * @param event - Event information passed from a user's action , the button click.
     */

    const handleSubmit = (event) => {
        event.preventDefault();
        handleChange(updatedItems)
    };

    /**
     *
     * handleChange function is responsible for handling the sending the updated item availabilities to the API.
     *
     * @param items - the list of items with their availability states.
     */

    const handleChange = items => {
       items.forEach(item => {
           let state = (item[1] === "Available");
           fetch("//127.0.0.1:5000/menu_item_availability", {
               method: 'POST',
               headers: {'Content-Type': 'application/json'},
               body: JSON.stringify({'menuId':item[0],'newState':state})
           }).then(response => {
               setUpdatedItems([]);
               getMenu();
               setSeverity("success");
               setMessage("Availability has been successfully updated");
               setOpen(true);
               return response.json()
           }).catch(error => {
               console.log(error);
               setSeverity("failure");
               setMessage("There has been an error.");
               setOpen(true);

           })
       })
   };

    return (
        <React.Fragment>
            <ThemeProvider theme={theme}>
            <CssBaseline />
                <Container component="main">
                    <div className={classes.paper}>
                    <Grid spacing={2}
                          container
                          className={classes.grid}
                    >
                        <Grid item xs>
                            <MapWaiterMenuItem value={"starter"} />
                        </Grid>

                        <Grid item xs>
                            <MapWaiterMenuItem value={"side"}/>
                        </Grid>

                        <Grid item xs>
                            <MapWaiterMenuItem value={"main"}/>
                        </Grid>

                        <Grid item xs>
                            <MapWaiterMenuItem value={"dessert"} className={classes.itemCard} />
                        </Grid>
                    </Grid>
                        <Grid
                            container
                            spacing={4}
                            className={classes.grid}
                        >
                            <Grid item xs>
                                <form className={classes.form} onSubmit={handleReset}>
                                    <Button
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        color="primary"
                                        className={classes.buttonTwo}
                                    >
                                        Reset
                                    </Button>
                                </form>
                            </Grid>

                            <Grid item xs>
                                <form className={classes.form} onSubmit={handleSubmit} method = "post">
                                    <Button
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        color="primary"
                                        className={classes.button}
                                    >
                                        Submit
                                    </Button>
                                </form>
                            </Grid>

                        </Grid>
                </div>
                    <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
                        <Alert variant="filled" onClose={handleClose} severity={severity}>
                            {message}
                        </Alert>
                    </Snackbar>

            </Container>
            </ThemeProvider>



        </React.Fragment>

    )
};

export default WaiterMenu;
