import React from "react";
import Axios from "axios";

class DocContent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {},
            contentLevel: '',
            isLoading: false,
        }
    }

    getOptionPromt() {
        let optionPromt = ''
        switch (this.props.contentLevel) {
            case 'product':
                optionPromt = 'resources'
                break
            case 'resource':
                optionPromt = 'actions'
                break
            case 'action':
                optionPromt = 'options'
                if (!this.state.data.options) {
                    return
                }
        }
        return (
            <tr><th style={{ textAlign: 'left' }}>{optionPromt}</th></tr>
        )
    }
    componentWillReceiveProps(nextProps) {
        if (this.props.activeUrlPath !== nextProps.activeUrlPath) {
            this.setState({
                isLoading: true,
                contentLevel: nextProps.contentLevel
            });
            Axios.get(nextProps.activeUrlPath)
                .then(response => {
                    this.setState({
                        data: response.data,
                        isLoading: false,
                    })
                })
                .catch(error => {
                    console.log(error);
                    this.setState({
                        isLoading: false,
                    });
                })
        }
    }

    renderSubContent() {
        if (this.state.isLoading) {
            return <div>loading...</div>;
        }
        switch (this.state.contentLevel) {
            case 'product':
                return this.processProduct()
            case 'resource':
                return this.processResource()
            case 'action':
                return this.processAction()
        }
    }
    processProduct() {
        return (
            Object.keys(this.state.data.resources).map((item) => {
                return (
                    <tr>
                        <td>{item}</td>
                        <td>{this.state.data.resources[item]}</td>
                    </tr>
                )
            })
        )
    }
    processResource() {
        return (
            Object.keys(this.state.data.actions).map((item) => {
                return (
                    <tr>
                        <td>{item}</td>
                        <td>{this.state.data.actions[item]}</td>
                    </tr>
                )
            })
        )
    }
    processAction() {
        if (!this.state.data.options) {
            return
        }
        return (
            Object.keys(this.state.data.options).map((item) => {
                return (
                    <tr>
                        <td>--{item}</td>
                        <td style={{ width: '100px' }}>{this.state.data.options[item].vtype}</td>
                        <td style={{ width: '500px' }}>{this.state.data.options[item].desc}</td>
                    </tr>
                )
            })
        )

    }

    render() {
        if (Object.keys(this.state.data).length == 0) {
            return <div></div>
        }
        return (
            <div>
            <h1>{this.state.data.name}</h1>
            <table>
                <tr><td>{this.state.data.desc}</td></tr>
                <tr><th style={{ textAlign: 'left' }}>Syntax</th></tr>
                <tr>
                    {Object.keys(this.state.data.syntax).map(item => {
                        return (
                            <tr><td><code>{this.state.data.syntax[item]}</code></td></tr>
                        )
                    })}
                </tr>
                {this.getOptionPromt()}
                {this.renderSubContent()}
            </table>
            </div>
        )
    }
}

export {
    DocContent
}