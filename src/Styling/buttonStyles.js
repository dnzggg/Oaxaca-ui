import theme from "./theme";

/**
 * Contains generalized CSS styling for two button types.
 */


export default () => ({
    button: {
        margin: theme.spacing(1, 0, 0),
        background:
            "linear-gradient(144deg, rgba(252,192,26,1) 0%, rgba(135,211,51,1) 90%)",
        borderRadius: 3,
        border: 0,
        color: "white",
        height: 40,
        padding: "0 30px",
        boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)"
    },
    buttonTwo: {
            margin: theme.spacing(1, 0, 2),
            background: 'linear-gradient( 109.6deg,  rgba(227,236,62,0.68) 11.2%, rgba(230,29,58,0.78) 91.3% )',
            borderRadius: 3,
            border: 0,
            color: 'white',
            height: 40,
            padding: '0 30px',
            boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
        },
});
