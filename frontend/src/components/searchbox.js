import React from 'react';

export default class SearchBox extends React.Component{
    render = () => {
        const mode = this.props.mode;
        if(mode === "scan"){
            return (<div>
                <div className="search-field-wrapper">
                    <label htmlFor="search-range-input">Range:</label>
                    <input type="text" id="search-range-input"></input>
                </div>
                <div className="search-field-wrapper">
                    <label htmlFor="search-range-input">Range:</label>
                    <input type="text" id="search-range-input"></input>
                </div>
            </div>)
        } else {
            return <div></div>
        }
    }
};