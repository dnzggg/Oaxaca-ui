import React from 'react';
import logo from "../../Images/Logo.png";
import TextInfoContent from '@mui-treasury/components/content/textInfo';
import { useN04TextInfoContentStyles } from '@mui-treasury/styles/textInfoContent/n04';


/**
 * The Home  component renders the landing page content.
 *
 * @returns A container with information to be rendered.
 * @constructor
 * @memberOf module:Common
 */
const Home = () => {


    return (
        <div className="row">

            <TextInfoContent
                useStyles={useN04TextInfoContentStyles}
                heading={'Home'}
                body={
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Nisi scelerisque eu ultrices vitae auctor eu augue ut lectus. Amet consectetur adipiscing elit pellentesque. Pretium fusce id velit ut tortor pretium viverra suspendisse potenti. Feugiat in ante metus dictum at. A arcu cursus vitae congue. Natoque penatibus et magnis dis parturient montes nascetur. Vulputate ut pharetra sit amet. Placerat vestibulum lectus mauris ultrices eros in cursus. Laoreet id donec ultrices tincidunt arcu. Auctor elit sed vulputate mi sit." +
                " Eget sit amet tellus cras adipiscing enim. Turpis egestas maecenas pharetra convallis. Lectus proin nibh nisl condimentum id venenatis a condimentum vitae. Id aliquet lectus proin nibh nisl condimentum id venenatis a. Elementum pulvinar etiam non quam lacus suspendisse faucibus interdum. Semper auctor neque vitae tempus quam pellentesque nec nam aliquam."
                }
            />
            <img src={logo} alt={"OAXACA LOGO"}/>
        </div>


    )


};

export default Home;
