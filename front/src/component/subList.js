import React from "react";

class SubList extends React.Component {
    constructor(props) {
        super(props);

    }
    getPrefixPath(item) {
        if (this.props.prefixPath) {
            return [this.props.prefixPath, item].join('/')
        }
        return item
    }

    getActiveUrlPath(item) {
        let activeUrlPath = ''
        switch (this.props.level) {
            case 'product':
                activeUrlPath = ['/product', item].join('/')
                break
            case 'resource':
                activeUrlPath = ['/resource', this.props.prefixPath, item].join('/')
                break
            case 'action':
                activeUrlPath = ['/action', this.props.prefixPath, item].join('/')
                break
        }
        return activeUrlPath
    }

    handleClick(item) {
        this.props.onChange({
            activeUrlPath: this.getActiveUrlPath(item),
            contentLevel: this.props.level
        })
    }

    shouldComponentUpdate(nextProps) {
        return this.props.sublist !== nextProps.sublist
    }

    getSubContent(nextlevel, item) {
        if (this.props.level == 'action') {
            return <div></div>
        }
        return (
            <SubList
                onChange={data => {
                    this.props.onChange(data)
                }}
                sublist={this.props.sublist[item]}
                level={nextlevel}
                prefixPath={this.getPrefixPath(item)} />
        )
    }

    render() {
        if (!this.props.sublist) {
            return (<div></div>)
        }
        let nextlevel = ''
        switch (this.props.level) {
            case 'product':
                nextlevel = 'resource'
                break
            case 'resource':
                nextlevel = 'action'
                break
            case 'action':
                nextlevel = ''
        }
        return (
            Object.keys(this.props.sublist).map(item => {
                return (
                    <ul>
                        <li key={item} onClick={this.handleClick.bind(this, item)}>{item}</li>
                        {this.getSubContent(nextlevel, item)}
                    </ul>
                )
            })
        )

    }
}

export {
    SubList
}