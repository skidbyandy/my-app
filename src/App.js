import React, {Component} from "react"
import logo from './logo.svg';
//import './App.css';
//https://drive.google.com/u/1/uc?id=10MTjV9pEvFEOwas7FAaw2_ZMRTF5M4nB&export=download
import * as tf from '@tensorflow/tfjs';
//https://drive.google.com/u/0/uc?id=1axaZixjs1KtZtUd1lKz1j2V0owMneC_v&export=download
class App extends Component {

  async loadModel(){
    let jsonUploads  = document.getElementById("jsonuploads").files
    let shardUploads = document.getElementById("sharduploads").files
    let concatArray = Array.from(jsonUploads).concat(Array.from(shardUploads));
    console.log(concatArray)
    const model = await tf.loadLayersModel(tf.io.browserFiles(concatArray));
    console.log(model)
  }

  render(){
    return (
      <div class="sidebar">
        <div>
          <input type="file" id="jsonuploads" title="your text" webkitdirectory="" directory="" />
          <input type="file" id="sharduploads" title="your text" webkitdirectory="" directory="" />
          <button onClick={this.loadModel}>submit</button>
          <nav>
            <div class="logo">Awesome<span>Portfolio</span></div>
            <a href="" class="nav-item">Home</a>
            <a href="" class="nav-item">About</a>
            <a href="" class="nav-item active">Portfolio</a>
            <a href="" class="nav-item">Contact</a>
          </nav>
        </div>
      </div>
    );
  }
}

export default App;
