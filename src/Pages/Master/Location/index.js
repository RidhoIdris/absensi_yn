import { GoogleApiWrapper, Map,Marker, Circle } from 'google-maps-react';
import React from 'react';
import { Card, Form, Col,Button } from 'react-bootstrap';
import Aux from "../../../hoc/_Aux";
import { ValidatorForm } from 'react-form-validator-core';
import InputValidator from '../../../App/components/InputValidator';
import axios from 'axios';
import Swal from 'sweetalert2';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000
});


class Location extends React.Component {
      constructor (props) {
        super(props);
        this.state = {
          position : {
            lat : -6.229728,
            lng : 106.6894316
          },
          radius:0,
          id : '',
          errors:[]
        }
      }

      componentDidMount(){
        this.getData()
      }

      getData = () => {
        axios({
            method: 'GET',
            url: this.props.base_api_url+'location',
            headers: {
                "Authorization" : this.props.auth_token,
              },
        })
        .then(response=>{
          this.setState(prevState=>({
            radius:parseInt(response.data.radius),
            id : response.data.id,
            position : {
              ...prevState,
              lat : parseFloat(response.data.lat),
              lng : parseFloat(response.data.lng),
            }
          }))
        })
        .catch(e => {
          try{ 
            if (e.response.data === "Unauthorized.") {
                Swal.fire('Session Expired!', 'please re-login', 'error').then((result) => {
                 if (result.value) {
                     localStorage.clear();
                     window.location.href =  'login';
                 }
               })
             }else if(e.response.status === 422){
                 this.setState({ errors: e.response.data.errors });
             }
          }catch(e){
              Swal.fire({
                  title: 'Oops Something Wrong!!!',
                  icon : 'error',
                  confirmButtonText:'Refresh',
                  allowOutsideClick: false,
                  }).then(() => {
                      window.location.reload();
              })
          }
        })
      }

      handleChange = (e) => {
        const { name, value } = e.target;
        this.setState(prevState => ({
          position : {
            ...prevState.position,
            [name] :parseFloat(value)
          }
        }))
        console.log(this.state.position)
      }

      handleSubmit = (e) => {
        e.preventDefault();
        Swal.fire({
            title: 'Are you sure?',
            text: "You will not able to revert this!!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Change it!'
            }).then((result) => {
            if (result.value) {
                axios({
                    method: 'PUT',
                    url: this.props.base_api_url+'location/'+this.state.id,
                    data    : {
                        radius: this.state.radius,
                        lat: this.state.position.lat,
                        lng: this.state.position.lng,
                    },
                    headers: {
                        "Authorization" : this.props.auth_token,
                      },
                })
                .then(response=>{
                    Toast.fire({
                        icon: 'success',
                        title: 'Change Data Success',
                    });
                })
                .catch(e => {
                  try{ 
                    if (e.response.data === "Unauthorized.") {
                        Swal.fire('Session Expired!', 'please re-login', 'error').then((result) => {
                         if (result.value) {
                             localStorage.clear();
                             window.location.href =  'login';
                         }
                       })
                     }else if(e.response.status === 422){
                         this.setState({ errors: e.response.data.errors });
                     }
                  }catch(e){
                      Swal.fire({
                          title: 'Oops Something Wrong!!!',
                          icon : 'error',
                          confirmButtonText:'Refresh',
                          allowOutsideClick: false,
                          }).then(() => {
                              window.location.reload();
                      })
                  }
                })
                
            }
        })
      }

    render() {
        return (
            <Aux>
              <Card>
                  <Card.Header>
                      <Card.Title as="h5">Attedance Location</Card.Title>
                  </Card.Header>
                  <Card.Body>
                  <ValidatorForm ref="form" onSubmit={this.handleSubmit}>
                    <Form.Row>
                      <Form.Group as={Col} lg="6" sm="12">
                        <Form.Label>Latitude</Form.Label>
                        <InputValidator 
                              onChange={this.handleChange} 
                              type="text"
                              name="lat"
                              value={this.state.position.lat}
                              validators={['required']}
                              errorMessages={['this field is required']}
                              placeholder="Input Here..."
                          />
                          <Form.Text className="text-danger">
                             {this.state.errors.lat}
                          </Form.Text>
                      </Form.Group>
                      <Form.Group as={Col} lg="6" sm="12">
                        <Form.Label>Longitude</Form.Label>
                        <InputValidator 
                              onChange={this.handleChange} 
                              type="text"
                              name="lng"
                              value={this.state.position.lng}
                              validators={['required']}
                              errorMessages={['this field is required']}
                              placeholder="Input Here..."
                          />
                          <Form.Text className="text-danger">
                             {this.state.errors.lng}
                          </Form.Text>
                      </Form.Group>
                    </Form.Row>
                    <Form.Group>
                       <Form.Label htmlFor="radius">Radius {this.state.radius} Meter</Form.Label>
                      <input type="range" onChange={(e)=>{this.setState({radius:parseInt(e.target.value)})}} className="custom-range" min="10" value={parseInt(this.state.radius)} defaultValue={parseInt(this.state.radius)} max="30" id="radius" />
                    </Form.Group>
                    <Button size="sm" type="submit" variant="primary" className="shadow-2 mb-4 btn-block">Save Change</Button>
                  </ValidatorForm>
                      <div style={{height: '500px', width: '100%'}}>
                          <Map
                              className="map"
                              google={this.props.google}
                              center={this.state.position}
                              defaultCenter={this.state.position}
                              zoom={19}
                          >
                            <Circle
                              center={this.state.position}
                              radius={this.state.radius}
                            />
                            <Marker
                              name={'Me'}
                              position={this.state.position} />
                            <Marker />
                          </Map>
                      </div>
                  </Card.Body>
              </Card>
            </Aux>
        );
    }
}

export default GoogleApiWrapper({
    apiKey: 'AIzaSyCE0nvTeHBsiQIrbpMVTe489_O5mwyqofk'
})(Location);