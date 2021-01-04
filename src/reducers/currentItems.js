/**
 * If action type is add_item adds item to items and increments total
 * if action type is remove_item then removes items and decrements total
 * if action type is reset_items then resets total to 0 and makes items an empty array
 *
 * @param state global state of items
 * @param action the action triggered from actions
 * @return {{total: number, items: T[]}|{total: number, items: ([]|*[])}|{total: number, items: []}}
 * @memberOf module:Reducers
 */
const currentItems = (state = {items: [], total: 0}, action) => {
    switch (action.type) {
        case "ADD_ITEM":
            let found = false;
            let newTotal = parseFloat((state.total+action.price).toFixed(2));
            state.items.map(function (dish) {
                if (dish.name === action.payload.name) {
                    dish.q += 1;
                    found = true;
                }
                return null;
            });
            if (!found) {
                return {...state,
                    total: newTotal,
                    items: state.items.concat({id:action.payload.id, name:action.payload.name, q:1})};
            } else {
                return {...state,
                    total: newTotal}
            }
        case "REMOVE_ITEM":
            let deleted = false;
            let newTotal1 = parseFloat((state.total-action.price).toFixed(2));
            state.items.map(function (dish, index) {
                if (dish.name === action.payload) {
                    dish.q -= 1;
                    if (dish.q === 0) {
                        delete state.items[index];
                        deleted = true;

                    }
                }
                return null;
            });
            if (deleted) {
                return {...state,
                    total: newTotal1,
                    items: state.items};
            } else {
                return {...state,
                    total: newTotal1}
            }
        case "RESET_ITEMS":
            return {...state,
            total: 0,
            items: []};
        default:
            return state
    }
};


export default currentItems;
