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
      picurl: undefined
    }
    this.loadPic=this.loadPic.bind(this)
  }

  async loadModel(){
    let jsonUploads  = document.getElementById("jsonuploads").files
    let shardUploads = document.getElementById("sharduploads").files
    let concatArray = Array.from(jsonUploads).concat(Array.from(shardUploads));
    console.log(concatArray)
    const model = await tf.loadLayersModel(tf.io.browserFiles(concatArray));
    console.log(model)
  }
  async loadPic(){
    console.log("loading")
    this.setState({
      picurl: URL.createObjectURL(document.getElementById("picuploads").files[0])
    })
    console.log(this.state)
    this.setState({imguploaded: true})
  }
  async getTensor(){
    const output = tf.browser.fromPixels(document.getElementById("pic"));
    console.log(output)
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
