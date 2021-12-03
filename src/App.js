import React, {Component} from "react"
import logo from './logo.svg';
import {Image} from "canvas"
//import './App.css';
import * as tf from '@tensorflow/tfjs';

class App extends Component {
  constructor(){
    super()
    this.state={
      imguploaded: false,
      picurl: undefined,
      tensor: undefined,
      model: undefined,
      predictarray: undefined
    }
    this.loadPic=this.loadPic.bind(this)
    this.getTensor=this.getTensor.bind(this)
    this.loadModel=this.loadModel.bind(this)
    this.predict=this.predict.bind(this)
  }

  async loadModel(){
    let jsonUploads  = document.getElementById("jsonuploads").files
    let shardUploads = document.getElementById("sharduploads").files
    let concatArray = Array.from(jsonUploads).concat(Array.from(shardUploads));
    console.log(concatArray)
    const model = await tf.loadLayersModel(tf.io.browserFiles(concatArray));
    this.setState({model: model})
    console.log(model)
  }
  loadPic(){
    console.log("loading")
    this.setState({
      picurl: URL.createObjectURL(document.getElementById("picuploads").files[0])
    })
    console.log(this.state)
    this.setState({imguploaded: true})
  }

  getTensor(){
    let output = tf.browser.fromPixels(document.getElementById("pic")).resizeBilinear([64,64]);
    const rgb = tf.tensor1d([0.2989, 0.587, 0.114])
    output= tf.sum(output.mul(rgb), 2).expandDims(-1).expandDims(0)
    this.setState({tensor: output})
    console.log(output)
  }

  async predict(){
    let model=this.state.model
    let predict=model.predict(this.state.tensor)
    let predictarray=await predict.array()
    this.setState({predictarray: predictarray})
    console.log(predictarray)
  }

  render(){
    return (
      <div className="sidebar">
        <div>
        {
          this.state.imguploaded ?
          <img src={this.state.picurl} id="pic"></img> :
          null
        }
          <input type="file" id="jsonuploads" title="your text" webkitdirectory="" directory="" />
          <input type="file" id="sharduploads" title="your text" webkitdirectory="" directory="" />
          <input type="file" id="picuploads" title="your text" />
          <button onClick={this.loadModel}>loadModel</button>
          <button onClick={this.loadPic}>loadPic</button>
          <button onClick={this.getTensor}>getTensor</button>
          <button onClick={this.predict}>predict</button>
          <nav>
            <div className="logo">Awesome<span>Portfolio</span></div>
            <a href="" className="nav-item">Home</a>
            <a href="" className="nav-item">About</a>
            <a href="" className="nav-item active">Portfolio</a>
            <a href="" className="nav-item">Contact</a>
          </nav>
        </div>
      </div>
    );
  }
}

export default App;
