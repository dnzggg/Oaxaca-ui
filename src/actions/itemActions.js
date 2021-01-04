/**
 * Adds item to the global state
 *
 * @param {int} itemId id of the item
 * @param {string} itemName name of the item
 * @param {string} price price of the item
 * @return {{payload: {name: *, id: *}, price: number, type: string}}
 * @memberOf module:Actions
 */
const addItem = (itemId, itemName, price) => {
    return {
        type: "ADD_ITEM",
        payload: {id:itemId, name:itemName},
        price: parseFloat(price.substr(1))
    }
};
/**
 * Removes item to the global state
 *
 * @param {string} item name of the item
 * @param {string} price price of the item
 * @return {{payload: {name: *, id: *}, price: number, type: string}}
 * @memberOf module:Actions
 */
const removeItem = (item, price) => {
    return {
        type: "REMOVE_ITEM",
        payload: item,
        price: parseFloat(price.substr(1))
    }
};
/**
 * Resets items in global state
 *
 * @return {{payload: {name: *, id: *}, price: number, type: string}}
 * @memberOf module:Actions
 */
const resetItems = () => {
    return {
        type: "RESET_ITEMS"
    }
};

export default {
    addItem, removeItem, resetItems
}
