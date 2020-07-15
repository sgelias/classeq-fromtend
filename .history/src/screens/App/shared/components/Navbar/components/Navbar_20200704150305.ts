import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import NavbarView from './Navbar';
import { navigationToggleSidebar } from '../reducers/actions';


export class Navbar extends Component {

    constructor(props) {
        super(props);

        this.state = {
            menuIsOpen: false,
        };
    }

    static propTypes = {
        errorMessage: PropTypes.string,
        navigationToggleSidebar: PropTypes.func,
    };

    render() {
        return (
            <NavbarView
                errorMessage={ this.props.errorMessage }
                toogleSidebar={ this.props.navigationToggleSidebar }
            />
        );
    }
}

const mapStateProps = state => ({
    errorMessage: state.errorMessage,
})

const mapDispatchToProps = {
    navigationToggleSidebar,
}

export default connect(
    mapStateProps,
    mapDispatchToProps,
)(Navbar);
