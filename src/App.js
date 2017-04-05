import React, { Component } from 'react';
import firebase from 'firebase';
import FileUpload from './FileUpload'
import './App.css';

class App extends Component {
  
  constructor(){
    super();

    this.state = {
      'user': null,
      'pictures': []
    };

    this.handleAuth = this.handleAuth.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
  }

  componentWillMount(){
    firebase.auth().onAuthStateChanged(user => {
      this.setState({user})
    });

    firebase.database().ref('photo').on('child_added', snapshot => {
      this.setState({
        'pictures': this.state.pictures.concat(snapshot.val())
      });
    });
  }

  handleAuth(){
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
            .then(result => console.log(`${result.user.email} is logged in`))
            .catch(error => console.log(`Error ${error.code}: ${error.message}`));
  }

  handleLogout(){
    firebase.auth().signOut()
            .then(result => console.log(`${result.user.email} is logged out`))
            .catch(error => console.log(`Error ${error.code}: ${error.message}`));
  }

  handleUpload(event){
        const file = event.target.files[0];
        const storage = firebase.storage().ref('/photo/'+file.name);
        const task = storage.put(file);

        task.on('state_changed', snapshot => {
            let percentage = (snapshot.bytesTranferred / snapshot.totalBytes)*100;
            this.setState({
                'uploadValue': percentage
            });
        }, error => {
            console.log(error.message);
        }, ()=>{
    
            const record = {
              photoURL: this.state.user.photoURL,
              displayName: this.state.user.displayName,
              image: task.snapshot.downloadURL
            };

            const db = firebase.database().ref('photo');
            const newPhoto = db.push();
            newPhoto.set(record);
        });
    }

  renderLoginButton(){
    if(this.state.user){
      return (
        <div>
          <img src={this.state.user.photoURL} alt={this.state.user.displayName} width="250"/>
          <p>Hello {this.state.user.displayName}!</p>
          <button onClick={this.handleLogout}>Logout</button>
          <FileUpload onUpload={this.handleUpload}/>
          {
            this.state.pictures.map(picture => (
              <div>
                <img src={picture.image} alt=""  className="photo"/><br/>
                <img src={picture.photoURL} alt={picture.displayName} className="rounded-image"/><br/>
                <span className="user-name">{picture.displayName}</span>
              </div>
            )).reverse()
          }
        </div>
      );
    }else{
      return(
        <button onClick={this.handleAuth}>Login with Google</button>
      );
    }
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>Welcome to Reactgram</h2>
        </div>
        <div className="App-intro">
          {this.renderLoginButton()}
        </div>
      </div>
    );
  }
}

export default App;
