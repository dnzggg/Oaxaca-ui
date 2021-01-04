import React from 'react';
import Divider from "@material-ui/core/Divider";
import CardHeader from "@material-ui/core/CardHeader";
import CardActions from "@material-ui/core/CardActions";
import Card from "@material-ui/core/Card";
import {makeStyles} from "@material-ui/core/styles";
import Button from '@material-ui/core/Button';
import Typography from "@material-ui/core/Typography";
import CssBaseline from "@material-ui/core/CssBaseline";


/**
 * Custom CSS styling for TableWaiterCard.js
 *
 * @param theme - The global MUI theme created in theme.js
 * @ignore
 */

const useStyles = makeStyles(theme => ({
    button: {
        margin: "auto",
        justifyContent: "center",
        marginBottom: "1.5em",
    },
    paper: {
        marginTop: theme.spacing(8),
        flexGrow: 1
    },
    cardTitle : {
        fontSize:'1.1rem',
    },
    orderCard: {
        margin: theme.spacing(3, 0, 2),
        color: 'primary'

    },

}));

/**
 *
 * TableWaiterCard - Responsible for mapping table information onto a card component.
 *
 * @returns {*} - a rendered container of a card.
 * @constructor
 * @memberOf module:Waiter
 */


const TableWaiterCard = ( props ) => {
    const classes = useStyles();
    const {id, item, state, setOpen, setSeverity, setMessage, getAssignedTables, getUnassignedTables, currentUser} = props;
    const {firstname, lastname, email} = item;


    /**
     *
     *  handleClick function is responsible for allowing a waiter to assign/unassign themselves from a table in a restaurant.
     *
     * @returns success or failure notification.
     */


    const handleClick = () => {
      const waiter_id = (email ? null : currentUser.user.name);
      fetch("//127.0.0.1:5000/table_assignment_event", {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({"waiter_id": waiter_id, "table_id": id})
      }).then((response) => {
          return response.json();
      }).then((data) => {
          if (data.data !== undefined) {
            setSeverity("success");
        		setMessage("Success!");
        		setOpen(true);
          } else {
            // display failure message
      		  setSeverity("error");
      		  setMessage("Something went wrong");
      		  setOpen(true)
          }
          getAssignedTables();
          getUnassignedTables()
      }).catch((error) => {
        console.log(error);
        setSeverity("error");
        setMessage("Something went wrong");
        setOpen(true)
      });
    };

    return (
        <div className={classes.paper} >
            <CssBaseline/>
            <Card className={classes.orderCard}>
                <CardHeader title={"Table " + id}
                titleTypographyProps={
                    {variant:'body1', noWrap:true}
                }/>

                <Divider />
                {email === false ?
                    <Typography gutterBottom variant="subtitle1" style={{marginLeft: "2.5em", marginRight: "2.5em"}}>
                        This table needs a waiter!
                    </Typography>
                  :
                    <Typography gutterBottom variant="subtitle1" style={{marginLeft: "2.5em", marginRight: "2.5em"}}>
                        Assigned to: {firstname} {lastname}
                    </Typography>
                }

                <CardActions >
                {state ?
                    <Button className={classes.button} variant="contained" color="primary" onClick={() => handleClick()}>
                      Unassign
                    </Button>
                    :
                    email === false ?
                    <Button className={classes.button} variant="contained" color="primary" onClick={() => handleClick()}>
                      Assign
                    </Button>
                    :
                    <Button className={classes.button} variant="contained" color="primary" disabled>
                      Cannot Change
                    </Button>
                }
                </CardActions>
            </Card>
        </div>
    );
};


export default (TableWaiterCard);
