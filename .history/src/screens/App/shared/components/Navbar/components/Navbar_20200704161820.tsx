import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import NavbarView from './NavbarView';
import { navigationToggleSidebar } from '../reducers/actions';


export default class Navbar extends React.Component {

    constructor(props: any) {
        super(props);

        this.state = {
            menuIsOpen: false,
        };
    }

    static propTypes = {
        //errorMessage: PropTypes.string,
        navigationToggleSidebar: PropTypes.func,
    };

    public render() {
        return (
            <NavbarView
                toogleSidebar={ this.props.navigationToggleSidebar }
            />
        );
    }
}
