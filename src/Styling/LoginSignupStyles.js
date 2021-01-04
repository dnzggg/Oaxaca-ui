import theme from "./theme";

/**
 * Generalized styling that's used for log in and Sign Up components.
 *
 */


export default () => ({
    paper: {
        marginTop: theme.spacing(8),
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
    },
    form: {
        width: "100%",
        marginTop: theme.spacing(1)
    },
});
