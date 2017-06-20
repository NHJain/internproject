import React, { Component } from 'react';
import { Link } from 'react-router';
import SplitPane from 'react-split-pane';
import Popup from 'react-popup';
import Dropdown from 'react-dropdown'
var $ = require('jquery');
var classNames = require('classnames');

var process = [];
var ProcessInstancesF = [];
var instanceLog = [];

class ProcessDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            size: undefined,
            dragging: false,
            class: undefined,
            initial: undefined
        };
        this.handleDragStart = this.handleDragStart.bind(this);
        this.handleDragEnd = this.handleDragEnd.bind(this);
        this.handleDrag = this.handleDrag.bind(this);
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

    handleDrag(width) {
        if (width >= 300 && width <= 400) {
            this.setState({ size: 300 });
        } else if (width > 400 && width <= 500) {
            this.setState({ size: 500 });
        } else {
            this.setState({ size: undefined });
        }
    }
    getProcessData() {
        $.ajax({
            type: 'POST',
            url: 'http://localhost:3001/getAllProcess',
            async: false,
            dataType: 'json',
            success: function (data) {
                for (let i = 0; i < data.length; i++) {
                    process[i] = (data[i].ProcessName)
                };
            },
        });

    }

    getProcessInstance(event) {
        ProcessInstancesF = [];
        var self = this;
        console.log(event);
        if(event != null){
            var data = { 'processName': event.target.id };
        }
        else{
            var data = { 'processName': process[0] };
            self.setState({ class: process[0] });
            self.setState({initial:"done"})
        }
        $.ajax({
            type: 'POST',
            url: 'http://localhost:3001/getProcessInstance',
            data: data,
            async: false,
            dataType: 'json',
            success: function (data) {

                for (let i = 0; i < data.length; i++) {
                    ProcessInstancesF[i] = ({ ProcessInstanceId: data[i]._id, StartTime: data[i].StartTime, EndTime: data[i].EndTime });
                }
                self.setState({ class: event.target.id });
            }.bind(this),
        });
        this.forceUpdate();
    }

    getInstanceLog(event) {
        var list = event.target.id.split(" ");
        var data = { 'processInstanceId': event.target.id };
        $.ajax({
            type: 'POST',
            url: 'http://localhost:3001/getInstanceLog',
            data: data,
            async: false,
            dataType: 'json',
            success: function (data) {
                for (let i = 0; i < data.length; i++) {
                    instanceLog[i] = ("Log " + (i + 1) + " " + data[i].LogDescription);
                }
                alert(instanceLog.join("\n"));
            },
        });
    }
    render() {
        this.getProcessData();
        if(this.state.initial === undefined){
            this.getProcessInstance();
        }

        // Get data from route props
        const divStyle = {
            textAlign: 'center',
        };
        const cars = this.props.route.data;
        var listItems = [];
        for (var i = 0; i < process.length; i++) {
            var liClasses = classNames({
                'list-group-item': true,
                'active': this.state.class === process[i]
            });
            listItems.push(<li id={process[i]} onClick={this.getProcessInstance.bind(this)} className={liClasses}>{process[i]}</li>);
        }
        const ProcessInstances = ProcessInstancesF.map((pInstance) =>
            <tr><td><li id={pInstance.ProcessInstanceId} style={divStyle} onClick={this.getInstanceLog.bind(this)} className="list-group-item">{pInstance.ProcessInstanceId}</li></td>
                <td><li id={pInstance.StartTime} style={divStyle} className="list-group-item">{pInstance.StartTime}</li></td>
                <td><li id={pInstance.EndTime} style={divStyle} className="list-group-item">{pInstance.EndTime}</li></td>
            </tr>)
        const ProcessInstancesStartTime = ProcessInstancesF.map((pInstance) =>
            <td><li id={pInstance.StartTime} className="list-group-item">{pInstance.StartTime}</li></td>)
        return (
            <SplitPane split="vertical" minSize={150} defaultSize={445}>
                <div style={Object.assign({})} >
                    <h4>Process</h4>
                    {listItems}
                </div >
                <div style={Object.assign({})}>
                    <h4>Process Instances</h4>
                    <table>
                        <tr>
                            <th><li style={divStyle} className="list-group-item">Process Instance Id</li></th>
                            <th><li style={divStyle} className="list-group-item">Start Time</li></th>
                            <th><li style={divStyle} className="list-group-item">End Time</li></th>
                        </tr>
                        {ProcessInstances}
                    </table>
                </div>
            </SplitPane>
        );
    }
}

export default ProcessDetails