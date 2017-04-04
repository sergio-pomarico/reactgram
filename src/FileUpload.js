import React, { Component } from 'react';
import firebase from 'firebase';

class FileUpload extends Component {
    constructor(){
        super();

        this.state = {
            'uploadValue': 0,
            'picture': null
        };

         this.handleUpload = this.handleUpload.bind(this);
    }

    handleUpload(event){
        const file = event.target.files[0];
        const storage = firebase.storage().ref(`/photo/$(file.name)`);
        const task = storage.put(file);

        task.on('state_changed', snapshot => {
            let percentage = (snapshot.bytesTranferred / snapshot.totalBytes)*100;
            this.setState({
                'uploadValue': percentage
            });
        }, error => {
            console.log(error.message);
        }, ()=>{
            this.setState({
                'uploadValue': 100,
                'picture': task.snapshot.downloadURL
            });
        });
    }

    render(){
        return (
            <div>
                <progress value={this.state.uploadValue} max="100"></progress><br/>
                <input type="file" onChange={this.handleUpload}/><br/>
                <img alt="" src={this.state.picture} width="320"/>
            </div>
        );
    }
}

export default FileUpload;