import React, { Component } from 'react';
import { Link } from 'react-router';
import SplitPane from 'react-split-pane';
import Popup from 'react-popup';
import Dropdown from 'react-dropdown'
var $ = require('jquery');
var classNames = require('classnames');
var FileInput = require('react-file-input');
var JSONViewer = require('react-json-viewer');

var dataSetList = [];
var metaData = undefined;
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
            metaDataFlag: false,
            show: true,
            initial: false,
            class: undefined,
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
                    dataSetList[i] = { Name: data[i].Name, directory: data[i].directory };
                }
                self.setState({ dataSetFlag: true });
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
    handleInputChange(e) {
        var self = this;
        if (e != null) {
            e.preventDefault();
            var name = e.target.name;
            var state = this.state;
            state[name] = e.target.value;
            this.setState(state);
            var data = { 'dataSetDirectory': e.target.id };
            console.log(data);
        } else {
            var data = { 'dataSetDirectory': dataSetList[0].directory };
            self.setState({ class: dataSetList[0].directory });
            self.setState({ initial: true });
        }
        $.ajax({
            type: 'POST',
            url: 'http://localhost:3001/getMetaData',
            data: data,
            async: false,
            dataType: 'json',
            success: function (data) {
                console.log(data);
                metaData = data;
                self.setState({ metaDataFlag: true });
                self.setState({ class: e.target.id });
            }
        });

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
            if (!this.state.initial) {
                this.handleInputChange();
            }
            var dslist = [];
            for (var i = 0; i < dataSetList.length; i++) {
                var liClasses = classNames({
                    'list-group-item': true,
                    'active': this.state.class === dataSetList[i].directory
                });
                dslist.push(<li id={dataSetList[i].directory} value={dataSetList[i].directory} key={dataSetList[i].directory} onClick={this.handleInputChange.bind(this)} className={liClasses}>{dataSetList[i].directory}</li>);
            }
            return (
                <SplitPane split="vertical" minSize={150} defaultSize={445}>
                    <div style={Object.assign({})} >
                        <h4>Data Set</h4>
                        <div>
                            {dslist}
                        </div>
                    </div >
                    <div style={Object.assign({})}>
                        <h4>Meta Data</h4>
                        <JSONViewer json={metaData}></JSONViewer>
                    </div>
                </SplitPane>
            );
        } else {

            return <div>No result found for this subscription</div>;

        }
    }
}

export default About