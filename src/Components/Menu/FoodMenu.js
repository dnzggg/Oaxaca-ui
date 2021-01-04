import React, {useEffect, useState} from 'react';
import {Container, CssBaseline} from '@material-ui/core';
import Copyright from "../Common/Copyright";
import Box from "@material-ui/core/Box";
import FoodMenuItem from "./FoodMenuItem";
import Grid from "@material-ui/core/Grid";
import Switch from '@material-ui/core/Switch';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import {useSelector} from "react-redux";
import {ConfirmProvider} from "material-ui-confirm";
import TextInfoContent from "@mui-treasury/components/content/textInfo";
import {useN04TextInfoContentStyles} from "@mui-treasury/styles/textInfoContent/n04";

/**
 * @module Menu
 */

/**
 * Component responsible for displaying the Menu
 * where the customer can see the items in the menu
 * select different types of dishes and add items to
 * basket to be able to order them later
 *
 * @param props properties passed in FoodMenu
 * @return {*} a map of dishes in menu as cards
 * @constructor
 * @memberOf module:Menu
 */
const FoodMenu = (props) => {
    /**
     * Items that are fetched from the api
     */
    const [items, setItems] = useState([]);
    /**
     * Checks if user selected vegan
     */
    const [vegan, setVegan] = useState(false);
    /**
     * Checks if user selected vegetarian
     */
    const [vegetarian, setVegetarian] = useState(false);
    /**
     * Checks if user selected gluten free
     */
    const [glutenFree, setGlutenFree] = useState(false);

    /**
     * React hook that fetches menu from the api every second
     */
    useEffect(() => {
        const interval = setInterval(() => {
            const abortController = new AbortController();
            fetch("//127.0.0.1:5000/menu", {signal: abortController.signal, method: 'POST'}).then((response) => {
                return response.json();
            }).then((data) => {
                setItems(data.data.items);
            });

            return function cleanup() {
                abortController.abort()
            }
        }, 1000);

        return () => clearInterval(interval)

    }, [items]);


    const {handlerPlus, handlerMinus} = props;
    /**
     * Maps menu items from items that are in the menu
     *
     * @param value which is the type of dish
     * @return FoodMenuItem
     */
    const MapMenuItem = ({value}) => {
        const item = useSelector(state => state.currentItems.items);

        return items.map((dish, index) => {
            const type = dish.type;
            let q = 0;
            item.forEach(ele => {
                if (ele.name === dish.name) {
                    q = ele.q;
                }
            });
            if(type === value){
              if ((vegan && dish.vegan === vegan) || (vegetarian && dish.vegetarian === vegetarian) || (glutenFree && dish.gluten_free === glutenFree)){
                return (<FoodMenuItem handlerMinus={handlerMinus} handlerPlus={handlerPlus} key={index} id={dish.id} value={dish.name} description={dish.description} price={dish.price} calories={dish.calories} image={dish.image} quantity={q}/>)
              }else if (!vegan && !vegetarian && !glutenFree) {
                  return (<FoodMenuItem handlerMinus={handlerMinus} handlerPlus={handlerPlus} key={index} id={dish.id} value={dish.name} description={dish.description} price={dish.price} calories={dish.calories} image={dish.image} quantity={q}/>)
              }
            } else {
                return (<div key={index}> </div>);
            }
            return null;
        });
    };

    return (
        <ConfirmProvider>
            <React.Fragment>
                <CssBaseline />
                <Container maxWidth={"xl"}>
                    <FormControl component="fieldset">
                      <FormGroup aria-label="position" row>
                        <FormControlLabel
                          checked={vegan}
                          onChange={()=>setVegan(!vegan)}
                          control={<Switch color="primary" />}
                          label="Vegan"
                          labelPlacement="start"
                        />
                        <FormControlLabel
                          checked={vegetarian}
                          onChange={()=>setVegetarian(!vegetarian)}
                          control={<Switch color="primary" />}
                          label="Vegetarian"
                          labelPlacement="start"
                        />
                        <FormControlLabel
                          checked={glutenFree}
                          onChange={()=>setGlutenFree(!glutenFree)}
                          control={<Switch color="primary" />}
                          label="Gluten-Free"
                          labelPlacement="start"
                        />
                      </FormGroup>
                    </FormControl>

                    <TextInfoContent
                        useStyles={useN04TextInfoContentStyles}
                        heading={'Starters'}
                    />
                    <Grid container spacing={2}>
                        <MapMenuItem value={"starter"}/>
                    </Grid>

                    <TextInfoContent
                        useStyles={useN04TextInfoContentStyles}
                        heading={'Sides'}
                    />

                    <Grid container spacing={2}>
                        <MapMenuItem value={"side"} />
                    </Grid>

                    <TextInfoContent
                        useStyles={useN04TextInfoContentStyles}
                        heading={'Mains'}
                    />
                    <Grid container spacing={2}>
                        <MapMenuItem value={"main"} />
                    </Grid>

                    <TextInfoContent
                        useStyles={useN04TextInfoContentStyles}
                        heading={'Desserts'}
                    />
                    <Grid container spacing={2}>
                        <MapMenuItem value={"dessert"} />
                    </Grid>

                    <Box mt={5}>
                        <Copyright />
                    </Box>

                </Container>
            </React.Fragment>
        </ConfirmProvider>
        )
};

export default (FoodMenu);
