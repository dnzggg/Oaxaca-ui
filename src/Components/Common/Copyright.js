import Typography from "@material-ui/core/Typography";
import Link from '@material-ui/core/Link';
import React from 'react';

/**
 * @module Common
 */

/**
 * The Copyright component renders the copyright footer across all pages.
 *
 * @returns A container containing the footer content to be rendered.
 * @class
 * @memberOf module:Common
 */
const Copyright = () => {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="#">
                Oaxaca
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
};

export default Copyright;
