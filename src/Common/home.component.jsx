var React = require("react");
var Router = require("react-router");
var Route = require("react-router");
var ReactDOM = require('react-dom');
var $ = require('jquery');

var environmentNames = [];
var buNames = [];
module.exports = React.createClass({
    getInitialState: function () {
        return {
            name: "",
            tagline: "",
            envList: false,
            buName: false
        }
    },
    componentWillMount: function () {
        var self = this;
        $.ajax({
            async: "false",
            url: "http://localhost:3001/getAllBUnit",
            dataType: 'json',
            type: 'POST',
            contentType: 'application/json',
            success: function (data) {
                for (var i = 0; i < data.length; i++) {
                    buNames[i] = data[i].Name;
                }
                self.setState({ buName: true });
            }
        });
        $.ajax({
            async: "false",
            url: "http://localhost:3001/getAllEnvironment",
            dataType: 'json',
            type: 'POST',
            contentType: 'application/json',
            success: function (data) {
                for (var i = 0; i < data.length; i++) {
                    environmentNames[i] = data[i].Name;
                }
                self.setState({ envList: true });
            }
        });
    },
    //  FLUX Actions--Dispatchers--Stores--Views
    viewprocess: function (e) {
        e.preventDefault();
        return <Chokers />
    },

    handleClick(compName, e) {
        console.log(compName);
        this.setState({ render: compName });
    },
    addSchool: function (e) {
        e.preventDefault();
        //actions.addSchool(this.state);
        var name = e.target.name;
        var state = this.state;
        var lookup = {

            'description': state,
        }
        $.ajax({
            url: "http://localhost:3001/defineProcess",
            dataType: 'json',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(lookup),
            success: function (data) {
                //We set the state again after submission, to update with the submitted data
                this.setState({ data: data });
                console.log(data);
            }.bind(this),
            error: function (xhr, status, err) {
                console.error("http://localhost:3001/defineProcess", status, err.toString());
            }.bind(this)
        });
        this.setState({
            BusinessUnit: '',
            Env: '',
            name: '',
            address: ''

        });
    },
    handleInputChange: function (e) {
        e.preventDefault();
        var name = e.target.name;
        var state = this.state;
        state[name] = e.target.value;
        this.setState(state);
    },
    getEnvironmentName: function (e) {

    },
    render: function () {
        if (this.state.envList && this.state.buName) {
            var selection = [<option value='No Selection'>No Selection</option>]
            var envList1 = environmentNames.map((env) =>
                <option value={env}>{env}</option>
            );
            envList1 = selection.concat(envList1);
            var buList = buNames.map((bu) =>
                <option value={bu}>{bu}</option>
            );
            buList = selection.concat(buList);
            const wellStyles = { Width: 400, margin: '0 auto 10px' };
            return (
                <form className="form" >
                    <div className="form-group" style={wellStyles}>
                        <label className="control-label" htmlFor="selection">Business Unit Name:</label>
                        <select className="form-control" id="BusinessUnit" name="BusinessUnit" value={this.state.value} onChange={this.handleInputChange}>
                            {buList}
                        </select>
                    </div>
                    <div className="form-group" style={wellStyles}>
                        <label className="control-label" htmlFor="selection">Environment :</label>
                        <select className="form-control" id="Env" name="Env" value={this.state.value} onChange={this.handleInputChange}>
                            {envList1}
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="control-label" htmlFor="name">Process Name:</label>
                        <input type="text" className="form-control" id="name" name="name" value={this.state.name} onChange={this.handleInputChange} placeholder="Process Name" />
                    </div>
                    <div className="form-group">
                        <label className="control-label" htmlFor="tagline">Process Description:</label>
                        <input type="text" className="form-control" id="tagline" name="tagline" value={this.state.address} onChange={this.handleInputChange} placeholder="Process Description" />
                    </div>

                    <div className="form-group">
                        <button className="btn" onClick={this.addSchool} type="submit">Add Process</button>
                    </div>

                </form>
            )
        } else {
            return <div>No result found for this subscription</div>;
        }
    }
})
class Chokers extends React.Component {
    render() {
        return <div>Inside Chockers</div>
    }
}


