import React from 'react';
import PropTypes from 'prop-types';

import NavbarView from './NavbarView';

interface Props {
    navigationToggleSidebar: boolean
}

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
