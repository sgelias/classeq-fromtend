import { NAVIGATION_OPEN_SIDEBAR, NAVIGATION_CLOSE_SIDEBAR, NAVIGATION_TOGGLE_SIDEBAR } from './types';


export const navigationOpenSidebar = () => async (dispatch: any) => {
    return dispatch({
        type: NAVIGATION_OPEN_SIDEBAR,
    });
};


export const navigationCloseSidebar = () => async (dispatch: any) => {
    return dispatch({
        type: NAVIGATION_CLOSE_SIDEBAR,
    });
};


export const navigationToggleSidebar = () => async (dispatch: any) => {
    return dispatch({
        type: NAVIGATION_TOGGLE_SIDEBAR,
    });
};
