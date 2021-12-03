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
      predictarray: undefined,
      actmap: undefined,
      test: undefined,
      test2: undefined,
      test3: undefined
    }
    this.loadPic=this.loadPic.bind(this)
    this.getTensor=this.getTensor.bind(this)
    this.loadModel=this.loadModel.bind(this)
    this.predict=this.predict.bind(this)
    this.activationMap=this.activationMap.bind(this)
    this.test= this.test.bind(this)
  }

  async loadModel(){
    let jsonUploads  = document.getElementById("jsonuploads").files
    let shardUploads = document.getElementById("sharduploads").files
    let concatArray = Array.from(jsonUploads).concat(Array.from(shardUploads));
    console.log(concatArray)
    const model = await tf.loadLayersModel(tf.io.browserFiles(concatArray));
    this.setState({model: model})
    console.log(model.summary())
  }
  loadPic(){
    console.log("loading")
    this.setState({
      picurl: URL.createObjectURL(document.getElementById("picuploads").files[0])
    })
    console.log(this.state)
    this.setState({imguploaded: true})
  }

  async getTensor(){
    let output = tf.browser.fromPixels(document.getElementById("pic")).resizeBilinear([64,64]);
    const rgb = tf.tensor1d([0.2989, 0.587, 0.114])
    output= tf.sum(output.mul(rgb), 2).expandDims(-1).expandDims(0)
    this.setState({tensor: output})
    let outputArray=await output.array()
    console.log(outputArray[0])
  }

  async predict(){
    let model=this.state.model
    let predict=model.predict(this.state.tensor)
    let predictarray=await predict.array()
    this.setState({predictarray: predictarray})
    console.log(predictarray)
  }

  async scorecam(){
    let model=this.state.model
    //let act_map_array = tf.model(inputs: model.input, outputs: model.getLayer("add_5").output)
  }

  async activationMap(){
    let model=this.state.model
    let actMap= await tf.model({inputs: model.input, outputs: model.getLayer("add_5").output}).predict(this.state.tensor)
    let actMapResized= tf.image.resizeBilinear(actMap,[64,64])
    this.setState({actmap: actMapResized})
  }

  test()
  {
    let model=this.state.model
    try{
      tf.browser.toPixels(this.state.actmap.squeeze().gather([0], 2).cast('int32'), document.getElementById("aCanvas"))
    }catch(error){
      console.log(error)
    }
    try{
      this.state.actmap.squeeze().gather([0], 2)
      this.setState({test2: model.input})
    }catch(error){
      console.log(error)
    }
    try{
      this.setState({test3: model.getLayer("add_5")})
    }catch(error){
      console.log(error)
    }
  }

  render(){
    return (
      <div className="dev">
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
          <button onClick={this.activationMap}>actMap</button>
          <button onClick={this.test}>test</button>
          {this.state.predictarray!=undefined ?  <h1>{this.state.predictarray}</h1> : null}
          <canvas id="aCanvas" width="200" height="100"></canvas>
        </div>
      </div>
    );
  }
}

export default App;
