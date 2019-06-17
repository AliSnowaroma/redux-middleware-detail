export default (state = {},action) => {
    switch(action.type){
        case 'TEST':
            return {
                ...state,
                name:action.data
            }
        default:
            return state;
    }
}