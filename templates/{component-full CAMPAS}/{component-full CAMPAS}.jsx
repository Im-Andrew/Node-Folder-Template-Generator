import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import style from './{component CAMPAS}.scss';

class {component PASCAL} extends React.Component {
    state = {
        show: true
    };

    static propTypes = {
        children: PropTypes.node
    };

    static defaultProps = {
        children: ''
    };

    render() {
        const { children } = this.props;
        const { show } = this.state;

        return show && children;
    }
}

export {{component PASCAL}};
