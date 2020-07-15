import React from 'react';
import { connect } from 'react-redux';

import NavbarView from './Navbar';
import { navigationToggleSidebar } from '../reducers/actions';


export type NavbarProps = {
    toogleSidebar: boolean,
    errorMessage?: string,
}


type NavbarState = {}


export class Navbar extends React.Component<NavbarProps, NavbarState> {

    state: NavbarState = {};

    public render() {
        return (
            <NavbarView />
        )
    };
}


const mapStateProps = (state: any) => ({
    errorMessage: state.errorMessage,
})


const mapDispatchToProps = {
    navigationToggleSidebar,
}


export default connect(
    mapStateProps,
    mapDispatchToProps,
)(Navbar);
