import { NAVIGATION_OPEN_SIDEBAR, NAVIGATION_CLOSE_SIDEBAR, NAVIGATION_TOGGLE_SIDEBAR } from './types';


export const navigationOpenSidebar = () => {
    return dispatch({
        type: types.NAVIGATION_OPEN_SIDEBAR,
    });
};


export const navigationCloseSidebar = () => async (dispatch: any) => {
    return dispatch({
        type: types.NAVIGATION_CLOSE_SIDEBAR,
    });
};


export const navigationToggleSidebar = () => async (dispatch: any) => {
    return dispatch({
        type: types.NAVIGATION_TOGGLE_SIDEBAR,
    });
};
