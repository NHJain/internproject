import React, { Component } from 'react';
import { Link } from 'react-router';
import SplitPane from 'react-split-pane';
import Popup from 'react-popup';
import Dropdown from 'react-dropdown'
var $ = require('jquery');
var classNames = require('classnames');
var FileInput = require('react-file-input');

var dataSetList = [];
//---------------------------------------------
class About extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            size: undefined,
            dragging: false,
            files: [],
            dataSetFlag: false,
        };
        this.handleDragStart = this.handleDragStart.bind(this);
        this.handleDragEnd = this.handleDragEnd.bind(this);
        this.handleDrag = this.handleDrag.bind(this);
    }
    componentWillMount() {
        var self = this;
        $.ajax({
            async: "false",
            url: "http://localhost:3001/getDataSetList",
            dataType: 'json',
            type: 'POST',
            contentType: 'application/json',
            success: function (data) {
                for (var i = 0; i < data.length; i++) {
                    dataSetList[i] = data[i].Name;
                }
                self.setState({ dataSetFlag: true });
                console.log(dataSetList);
            }
        })
    }
    handleDragStart() {
        this.setState({
            dragging: true,
        });
    }
    handleDragEnd() {
        this.setState({
            dragging: false,
        });
        setTimeout(() => {
            this.setState({ size: undefined });
        }, 0);
    }
    handleUpload(e) {
        const files = e.target.files[0]; // do something with files
        console.log(files);
        var reader = new FileReader();
        reader.onload = function (files) {
            var text = reader.result;
            console.log(text);
        }
    }
    handleInputChange(e) {
        e.preventDefault();
        var name = e.target.name;
        var state = this.state;
        state[name] = e.target.value;
        this.setState(state);
        var data={DataSetName:event.target.key}
        $.ajax({
            async: "false",
            url: "http://localhost:3001/getMetaData",
            dataType: 'json',
            data: data,
            type: 'POST',
            contentType: 'application/json',
            success: function (data) {
                for (var i = 0; i < data.length; i++) {
                    dataSetList[i] = data[i].Name;
                }
                self.setState({ dataSetFlag: true });
                console.log(dataSetList);
            }
        })
        
    }
    handleDrag(width) {
        if (width >= 300 && width <= 400) {
            this.setState({ size: 300 });
        } else if (width > 400 && width <= 500) {
            this.setState({ size: 500 });
        } else {
            this.setState({ size: undefined });
        }
    }

    handleChange(e, results) {
        console.log(results);
        results.forEach(result => {
            const [e, file] = result;
            this.props.dispatch(uploadFile(e.target.result));
            console.log(`Successfully uploaded ${file.name}!`);
        });
    }

    render() {
        if (this.state.dataSetFlag) {
            var dslist = dataSetList.map((dataSet) =>
                <option key={dataSet} value={dataSet}>{dataSet}</option>
            );
            return (
                <SplitPane split="vertical" minSize={150} defaultSize={445}>
                    <div style={Object.assign({})} >
                        <h4>Data Set</h4>
                        <div>
                            <select className="form-control" id="DataSet" name="DataSet" value={this.state.value} onChange={this.handleInputChange.bind(this)}>
                                {dslist}
                            </select>
                        </div>
                    </div >
                    <div style={Object.assign({})}>
                        <h4>Process Instances</h4>

                    </div>
                </SplitPane>
            );
        } else {

            return <div>No result found for this subscription</div>;

        }
    }
}

    export default About