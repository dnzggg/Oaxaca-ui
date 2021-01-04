import React, { useState } from "react";
import { CardContent } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import MinusIcon from "@material-ui/icons/Remove";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import { useDispatch } from "react-redux";
import allActions from "../../actions";
import { CardMedia } from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { useN01TextInfoContentStyles } from "@mui-treasury/styles/textInfoContent/n01";
import { useBouncyShadowStyles } from "@mui-treasury/styles/shadow/bouncy";
import TextInfoContent from "@mui-treasury/components/content/textInfo";
import cx from "clsx";
import Button from "@material-ui/core/Button";
import { useWideCardMediaStyles } from "@mui-treasury/styles/cardMedia/wide";
import { useConfirm } from "material-ui-confirm";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";


/**
 * Custom CSS styling for FoodMenuItem.js.
 *
 * @param theme - The global MUI theme created in theme.js
 * @ignore
 */
const useStyles = makeStyles(() => ({
  root: {
    maxWidth: 304,
    margin: "auto",
    boxShadow: "none",
    borderRadius: 0
  },
  content: {
    padding: 24
  },
  cta: {
    marginTop: 24,
    textTransform: "initial",
  }
}));

/**
 * Component that displays a single dish and its information
 *
 * @param props properties passed in FoodMenuItem
 * @return {*} A card that contains information about the item
 * @constructor
 * @memberOf module:Menu
 */
const FoodMenuItem = props => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const textCardContentStyles = useN01TextInfoContentStyles();
  const shadowStyles = useBouncyShadowStyles();
  const mediaStyles = useWideCardMediaStyles();
  const confirm = useConfirm();

  /**
   * Opens dialog for nutritional information
   */
  const openDialog = () => {
    confirm({
      title: "Nutritional Information",
      description: "Caloric number: " + calories,
      confirmationText: "Back",
      cancellationText: "",
      cancellationButtonProps: { disabled: true }
    }).then(() => {});
  };

  const cardStyle = {
    height: "100%"
  };

  /**
   * Calls the redux action addItem to add item from global state
   *
   * @param id of the dish
   * @param value of the dish
   * @param price of the dish
   */
  const PlusButtonHandler = (id, value, price) => {
    setItemQuantity(itemQuantity + 1);
    dispatch(allActions.itemActions.addItem(id, value, price));
  };

  /**
   * Calls the redux action removeItem to remove item from global state
   *
   * @param value of the dish
   * @param price of the dish
   */
  const MinusButtonHandler = (value, price) => {
    if (itemQuantity > 0) {
      setItemQuantity(itemQuantity - 1);
      dispatch(allActions.itemActions.removeItem(value, price));
    }
  };

  const { id, value, description, price, calories, image, quantity } = props;
  const [itemQuantity, setItemQuantity] = useState(quantity);

  return (
    <Grid item lg={3} xs={12} sm={6}>
      <Card className={cx(classes.root, shadowStyles.root)} style={cardStyle}>
        <CardMedia classes={mediaStyles} image={image} />
        <CardContent className={classes.content}>
          <TextInfoContent
            classes={textCardContentStyles}
            heading={value}
            overline={itemQuantity + " X " + price}
            body={description}
          />

            <Button
              color={"primary"}
              className={classes.cta}
              onClick={() => {
                MinusButtonHandler(value, price);
              }}
            >
              <MinusIcon />
            </Button>
            <Button
              color={"primary"}
              className={classes.cta}
              onClick={() => {
                PlusButtonHandler(id, value, price);
              }}
            >
              <AddIcon />
            </Button>
            <Button
              color={"primary"}
              className={classes.cta}
              onClick={() => {
                openDialog();
              }}
            >
              <ChevronRightIcon />
            </Button>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default FoodMenuItem;
