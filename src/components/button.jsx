import React, { Component } from 'react';

class Button extends Component {

    render() {
        return (
            <button id={this.props.id} onClick={() => this.props.onClick(this.props.keyValue)}><i className={`fas ${this.props.className}`}></i></button>
        );
    }
}

export default Button;