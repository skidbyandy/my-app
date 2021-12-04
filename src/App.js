import React, {Component} from "react"
import logo from './logo.svg';
import {Image} from "canvas"
//import './App.css';
import * as tf from '@tensorflow/tfjs';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button } from 'reactstrap';

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
      maskedImgArray: undefined,
      maskedImgArrayprogress: undefined,
      test: undefined,
      test2: undefined,
      test3: undefined
    }
    this.loadPic=this.loadPic.bind(this)
    this.getTensor=this.getTensor.bind(this)
    this.loadModel=this.loadModel.bind(this)
    this.predict=this.predict.bind(this)
    this.activationMap=this.activationMap.bind(this)
    this.maskedImgArray=this.maskedImgArray.bind(this)
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
    tf.browser.toPixels(this.state.actmap.squeeze().gather([0], 2).squeeze().cast('int32'),document.getElementById("aCanvas"))
    //tf.browser.toPixels(tf.browser.toPixels(this.state.actmap.squeeze().gather([0], 2).squeeze().cast('int32').mul(this.state.tensor.squeeze().cast('int32')), document.getElementById("aCanvas")))
    //for i in this.range(this.state.actmap.array()[0][0][0].length){
      //c
      //array.aapend up result
      //
    //}
    //
  }
  range(start, stop) {
      if (typeof stop == 'undefined') {
          stop = start;
          start = 0;
      }

      let result = [...Array(stop).keys()].slice(start, stop);
      return result;
    }

maskedImgArray()
  { //this.state.actmap.arraySync()[0][0][0].length
    let model=this.state.model
    try
    {
      const maskedImgArray=[]
      const divn= tf.scalar(255)
      const tensor=this.state.tensor.squeeze().cast('int32')
      const actmap3d=this.state.actmap.squeeze()
      const length=this.state.actmap.squeeze().arraySync()[0][0].length
      for (let i = 0; i < length; i++)
      {
        this.setState({maskedImgArrayprogress: i})
        let maskedImg= actmap3d.gather([i], 2).squeeze().cast('int32').mul(tensor).div(divn)
        maskedImgArray.push(maskedImg)
        this.setState({maskedImgArray: maskedImgArray})
      }
       //predMIA = softmax(model.predict(masked_input_array))
    }
    catch(error)
    {
      console.log(error)
    }
  }

  test()
  {
    const model=this.state.model
    const buffer=tf.buffer([1024,2])
    for(let i=0; i<this.state.maskedImgArray.length; i++){
      let predict=model.predict(this.state.maskedImgArray[i].expandDims(-1).expandDims(0))
      buffer.set(predict.arraySync()[0], i, 0)
      buffer.set(predict.arraySync()[1], i, 1)
      console.log(i+"/1024")
    }
    let test=buffer.toTensor()
    this.setState({test: test})
  }

  render(){
    return (
      <div className="dev">
        <div>


          <div className="input-group">
            <input type="file" className="form-control" id="jsonuploads" aria-describedby="inputGroupFileAddon04" aria-label="Upload" />
          </div>
          <br></br>
          <div className="input-group">
            <input type="file" class="form-control" id="sharduploads" multiple aria-describedby="inputGroupFileAddon04" aria-label="Upload" />
            <button className="btn btn-outline-secondary" onClick={this.loadModel} type="button" id="inputGroupFileAddon04">loadModel</button>
          </div>
          <br></br>
          <div className="input-group">
            <input type="file" class="form-control" id="picuploads" aria-describedby="inputGroupFileAddon04" aria-label="Upload" />
            <button className="btn btn-outline-secondary" onClick={this.loadPic} type="button" id="inputGroupFileAddon04">&nbsp;loadPic&nbsp;</button>
          </div>
          {
            this.state.imguploaded ?
            <div><br></br><img src={this.state.picurl} id="pic"></img><br></br></div> :
            null
          }

          <div class="btn-group" role="group" aria-label="Basic example">
            <button type="button" class="btn btn-secondary btn-sm" onClick={this.getTensor}>getTensor</button>
            <button type="button" class="btn btn-secondary btn-sm" onClick={this.predict}>predict</button>
            <button type="button" class="btn btn-secondary btn-sm" onClick={this.activationMap}>actMap</button>
            <button type="button" class="btn btn-secondary btn-sm" onClick={this.maskedImgArray}>maskedImgArray</button>
            <button type="button" class="btn btn-secondary btn-sm" onClick={this.test}>test</button>
          </div>

          {this.state.predictarray!==undefined ?  <h1>{this.state.predictarray}</h1> : null}
          <canvas id="aCanvas" width="200" height="100"></canvas>
        </div>
      </div>
    );
  }
}

export default App;
