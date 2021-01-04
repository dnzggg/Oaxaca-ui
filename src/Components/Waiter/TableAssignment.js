import React, { useState, useEffect } from "react";
import Typography from "@material-ui/core/Typography";
import { useSelector } from "react-redux";
import makeStyles from "@material-ui/core/styles/makeStyles";
import TableWaiterCard from "./TableWaiterCard"
import {Container} from "@material-ui/core";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import theme from "../../Styling/theme";
import ThemeProvider from "@material-ui/styles/ThemeProvider/ThemeProvider";
import Alert from "@material-ui/lab/Alert";
import Snackbar from '@material-ui/core/Snackbar';
import {useN04TextInfoContentStyles} from "@mui-treasury/styles/textInfoContent/n04";
import TextInfoContent from "@mui-treasury/components/content/textInfo";


/**
 * @module Waiter
 */

/**
 * Custom CSS styling for TableAssignment.js
 *
 * @param theme - The global MUI theme created in theme.js
 * @ignore
 */

const useStyles = makeStyles(theme => ({
    paper: {
        marginTop: theme.spacing(1),
        alignItems: 'center',
    },
    grid: {
      flexGrow: 1
    },
    header : {
        textAlign: 'center',
        fontSize: 24,
        lineHeight: 2,
        fontWeight: 350,
        fontFamily:
        // eslint-disable-next-line max-len
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
    }
}));

/**
 *
 * TableAssignment - Responsible for allowing a waiter to assign/unassign themselves from a table.
 *
 * @returns {*} - a rendered container of each table card.
 * @constructor
 * @memberOf module:Waiter
 */

const TableAssignment = () => {
  const classes = useStyles();
  const currentUser = useSelector(state => state.currentUser);
  const [tables, setTables] = useState([]);
  const [unassignedTables, setunassignedTables] = useState([]);

  // snackbar values
  const [open, setOpen] = useState(false);
	const [severity, setSeverity] = useState("success");
	const [message, setMessage] = useState("You've logged in successfully");


    /**
     *
     * The handleClose function is responsible for handling the closing of the alert notification.
     *
     * @param event - Event information passed from a user's action.
     * @param reason - Reason of the event
     */


    const handleClose = (event, reason) => {
		if (reason === 'clickaway') {
			return
		}
		setOpen(false)
	};

    /**
     *
     * The getAssignedTables function is responsible for fetching the assigned tables from the API and saves them in a state.
     *
     */

  const getAssignedTables = () => {
    fetch("//127.0.0.1:5000/get_tables_and_waiters", {
        method: 'POST'
    }).then((response) => {
        return response.json();
    }).then((data) => {
        setTables(data.data.tables);
    });
  };

    /**
     *
     * The getUnassignedTables function is responsible for fetching the unassigned tables from the API and saves them in a state.
     *
     */

  const getUnassignedTables = () => {
    fetch("//127.0.0.1:5000/get_unassigned_tables", {
        method: 'POST'
    }).then((response) => {
        return response.json();
    }).then((data) => {
        setunassignedTables(data.data.tables);
    });
  };

  useEffect(() => {
      const interval = setInterval(() => {
          getAssignedTables();
          getUnassignedTables()
      }, 1000);

      return () => clearInterval(interval);
  }, []);


    /**
     *
     * The getUnassignedTables function is responsible for mapping table information to the appropriate section.
     *
     * @param value - boolean value for mapping.
     * @return *[] container holding TableWaiterCards for each respective table in the restaurant.
     */

  const MapTables = ({value}) => {
    if (value === true){
      return tables.map((item, index) => {
        const {table_number, email} = item;
        return (
              <React.Fragment key={index}>
                <Grid item xs={6} xm={4} xl={3}>
                  <TableWaiterCard
                    key={index}
                    id={table_number}
                    item={item}
                    state={email===currentUser.user.name}
                    currentUser={currentUser}
                    getAssignedTables={getAssignedTables}
                    getUnassignedTables={getUnassignedTables}
                    setOpen={setOpen}
                    setSeverity={setSeverity}
                    setMessage={setMessage}
                  />
                </Grid>
              </React.Fragment>)
      });
    } else {
      return unassignedTables.map((item, index) => {
        return (
              <React.Fragment key={index}>
                <Grid item xs={6} xm={4} xl={3}>
                  <TableWaiterCard
                    key={index}
                    id={item.table_number}
                    item={{email:false}}
                    currentUser={currentUser}
                    getAssignedTables={getAssignedTables}
                    getUnassignedTables={getUnassignedTables}
                    setOpen={setOpen}
                    setSeverity={setSeverity}
                    setMessage={setMessage}
                  />
                </Grid>
              </React.Fragment>)
      })
    }

  };

  return (
    <React.Fragment>
        <ThemeProvider theme={theme}>
            <CssBaseline />
                <Container component="main">
                <TextInfoContent
                    useStyles={useN04TextInfoContentStyles}
                    heading={'Table Assignment'}
                />
                {
                  unassignedTables === null ?
                    null
                  :
                  <Container>
                      <Typography variant="h5" className={classes.header}>
                          Unassigned Tables
                      </Typography>
                      <div className={classes.paper}>
                        <Grid spacing={4} container className={classes.grid} >
                            <MapTables value={false}/>
                        </Grid>
                      </div>
                  </Container>
                }
                {
                  tables === null ?
                    null
                  :
                  <Container>
                      <Typography variant="h5" className={classes.header}>
                          Assigned Tables
                      </Typography>
                      <div className={classes.paper}>
                        <Grid spacing={4} container className={classes.grid} >
                            <MapTables value={true}/>
                        </Grid>
                      </div>
                  </Container>
                }
            </Container>
        </ThemeProvider>
        <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
					<Alert variant="filled" onClose={handleClose} severity={severity}>
						{message}
					</Alert>
				</Snackbar>
    </React.Fragment>

  );
};

export default TableAssignment;
