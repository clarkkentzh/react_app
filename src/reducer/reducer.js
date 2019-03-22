export function toDolist(state = {isShow: false, numbers: 0}, action = {}) {
    const {
      type
    } = action;
    switch (type) {
        case 'RESET_DATA':
            return Object.assign({},state, {
                numbers: 0
            })
        case 'ADD_DATA':
            let num = state.numbers;
            num += 1;
            return Object.assign({},state, {
                numbers: num
            })
        case 'SHOW_DATA':
            return Object.assign({},state, {
                isShow: !state.isShow
            })
        default:
            return state
    }
}