import React from 'react';
import TextInfoContent from "@mui-treasury/components/content/textInfo";
import {useN04TextInfoContentStyles} from "@mui-treasury/styles/textInfoContent/n04";


/**
 * The About  component renders information describing the restaurant.
 *
 * @returns A container with information about the restaurant.
 * @class
 * @memberOf module:Common
 */
const About = () => {

    return (
        <div className="row">

            <TextInfoContent
                useStyles={useN04TextInfoContentStyles}
                heading={'About this restaurant'}
                body={
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Nisi scelerisque eu ultrices vitae auctor eu augue ut lectus. Amet consectetur adipiscing elit pellentesque. Pretium fusce id velit ut tortor pretium viverra suspendisse potenti. Feugiat in ante metus dictum at. A arcu cursus vitae congue. Natoque penatibus et magnis dis parturient montes nascetur. Vulputate ut pharetra sit amet. Placerat vestibulum lectus mauris ultrices eros in cursus. Laoreet id donec ultrices tincidunt arcu. Auctor elit sed vulputate mi sit." +
                    " Eget sit amet tellus cras adipiscing enim. Turpis egestas maecenas pharetra convallis. Lectus proin nibh nisl condimentum id venenatis a condimentum vitae. Id aliquet lectus proin nibh nisl condimentum id venenatis a. Elementum pulvinar etiam non quam lacus suspendisse faucibus interdum. Semper auctor neque vitae tempus quam pellentesque nec nam aliquam."
                }
            />

        </div>
    )

};

export default About;
