import React from 'react';

export default class TableContent extends React.Component {
    getContents = () => {
        if(this.props.data){
            console.log(this.props.data);
            return this.props.data.map( (entry) => {
                <tr>
                    <td>A</td>
                    <td>B</td>
                    <td>C</td>
                </tr>
            } )
        }
    }

    render = () => {
        console.log(this.props.data);
        return this.props.data.map( (entry) => {
            <tr>
                <td>A</td>
                <td>B</td>
                <td>C</td>
            </tr>
        } );
    }
}