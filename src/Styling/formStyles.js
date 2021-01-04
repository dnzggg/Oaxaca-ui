import theme from "./theme";

/**
 * Contains generalized CSS styling for a paper layout used in OrderSummary and PaymentForm.js - used from Material UI Samples showcase.
 */


export default () => ({
    listItem: {
        padding: theme.spacing(1, 0)
    },
    total: {
        fontWeight: 700
    },
    title: {
        marginTop: theme.spacing(2)
    },
    layout: {
        width: "auto",
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2),
        [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
            width: 600,
            marginLeft: "auto",
            marginRight: "auto"
        }
    },
    paper: {
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(3),
        padding: theme.spacing(2),
        [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
            marginTop: theme.spacing(6),
            marginBottom: theme.spacing(6),
            padding: theme.spacing(3)
        }
    },
    buttons: {
        display: "flex",
        justifyContent: "flex-end"
    },
    button: {
        marginTop: theme.spacing(3),
        marginLeft: theme.spacing(1)
    }
});