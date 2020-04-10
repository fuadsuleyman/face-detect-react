import React, { Component } from 'react';
import './App.css';
import Clarifai from 'clarifai';
import Navigation from './components/navigation/Navigation';
import Logo from './components/logo/Logo';
import ImageLinkForm from './components/imagelinkform/ImageLinkForm';
import Rank from './components/rank/Rank';
import Particles from 'react-particles-js';
import FaceRecognition from './components/facerecognition/FaceRecognition';
import Signin from './components/signin/Signin';
import Register from './components/register/Register';

// background effect
const particlesOption = {
  particles: {
    number: {
      value: 30,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
}

const app = new Clarifai.App({
  apiKey: 'da62ce5c39564e2f90b7ca22f0eb4d4c'
});

class App extends Component {
  // we create state
  constructor(){
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: {},
      route: 'signin',
      isSignedIn: false
    }
  }


  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {
    this.setState({box: box});
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  } 

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input})
  
    // asagida then-de/ displayFaceBox methodu calculateFaceLocation qaytardigi melumati arqument kimi goturur
    app.models.predict(
      Clarifai.FACE_DETECT_MODEL,
    this.state.input)
    .then(response => this.displayFaceBox(this.calculateFaceLocation(response)))  
    .catch(err => console.log(err))
  }

  // yuxarida construktorda route-u signin kimi gosterdim, asagida shert qoydum
  // yeni sehife acilan kimi signin sehifesi gorunur
  // asagidaki fungsiya ile submit duymesi basilanda route-u 'home' ile deyisirem
  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState({isSignedIn: false})
    } else if (route === 'home'){
      this.setState({isSignedIn: true})
    }
    this.setState({route: route});
  }

  render(){
    const { isSignedIn, imageUrl, route, box } = this.state;
    return(
      <div className='App'>
        <Particles
                className="particles" 
                params={particlesOption}/>
      <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
      { route === 'home'
      ? <div>
      <Logo/>
      <Rank/>
      <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
      <FaceRecognition box={box} imageUrl={imageUrl}/>
  </div>
      : (
        route === 'signin'
        ? <Signin onRouteChange={this.onRouteChange}/>
        : <Register onRouteChange={this.onRouteChange}/>
      )
      }
    </div>
    )
  }
}
  

export default App;
