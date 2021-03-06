import React, {Component} from 'react';
import {Row, Col} from 'react-bootstrap';

import axios from 'axios';
import Aux from "../../../hoc/_Aux";
import Card from "../../../App/components/MainCard";
import ReactTable from 'react-table-v6'
import 'react-table-v6/react-table.css';
import Swal from 'sweetalert2';
import {
  Badge,
  Modal,
  Form,
  Button
} from 'react-bootstrap';
import {debounce} from 'lodash';
import { ValidatorForm } from 'react-form-validator-core';
import InputValidator from '../../../App/components/InputValidator';
import TimeValidator from '../../../App/components/TimeValidator';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000
});

class Schedule extends Component {

  constructor (props) {
    super(props);
    this.state = {
      loading : true,
      parameter: '',
      errors:[],
      tableData : [],
      modalShow:false,
        id:'',
        name:'',
        time_in:new Date(),
        time_out:new Date(),
    }
  }

  fetchData = (state) => {
    this.setState({
        loading: true
    });
    let parameter = '?page=' + (parseInt(state.page) + 1);
    parameter = parameter + '&limit=' + (parseInt(state.pageSize));
    // eslint-disable-next-line
    state.filtered.map((filter) => {
        parameter = parameter + '&filter[' + filter.id + ']=' + filter.value
    })
    // eslint-disable-next-line
    state.sorted.map((sort) => {
        if (sort.desc) {
            parameter = parameter + '&sort=-' + sort.id
        } else {
            parameter = parameter + '&sort=' + sort.id
        }
    })
    this.setState({
        parameter: parameter
    }, () => {
        this.getData()
    });

  }

  getData = debounce(() => {
    axios({
      methos : 'GET',
      url: `${this.props.base_api_url}schedule${this.state.parameter}`,
      headers: {
        "Authorization" : this.props.auth_token,
      },
    }).then(response=>{
      this.setState({
        tableData : response.data.data,
        total_pages: response.data.last_page,
        loading:false
      })
    }).catch(e=>{
      // return console.log(e)
        try {
          if (e.response.data === "Unauthorized.") {
            Swal.fire({
              title: 'Session Expired!',
              text : 'please re-login',
              icon: 'error',
              confirmButtonText: 'Login',
              allowOutsideClick: false,
            }).then(() => {
              localStorage.clear();
              window.location.href = 'login';
            })
          }
        } catch (e) {
          // console.log(e)
          Swal.fire({
            title: 'Oops Something Wrong!!!',
            icon: 'error',
            confirmButtonText: 'Refresh',
            allowOutsideClick: false,
          }).then(() => {
              window.location.reload();
          })
        }
    })
  },500)

  handleCreate= () =>{
    this.setState({
        edit      : false,
        errors: [],
        id : '',
        name : '',
        time_in:'',
        time_out:'',
        modalShow : true
    });
}

  handleEdit(data){
    // data.persist()
    this.setState({
        edit      : true,
        errors: [],
        id : data.id,
        name : data.name,
        time_in:new Date('2020-01-01 '+data.time_in),
        time_out:new Date('2020-01-01 '+data.time_out),
        modalShow : true
    });
  }

  handleDelete = (data) => {
    Swal.fire({
        title: 'Are you sure?',
        text: "You will not able to revert this!!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
        if (result.value) {
            axios({
                method: 'DELETE',
                url: this.props.base_api_url+'schedule',
                data    : {
                    id: data.id,
                },
                headers: {
                    "Authorization" : this.props.auth_token,
                  },
            })
            .then(response=>{
                this.getData();
                Toast.fire({
                    icon: 'success',
                    title: 'User Deleted',
                });
            })
            .catch(e => {
                Swal.fire('Oops...', 'Something Wrong!', 'error')
            })
            
        }
    })
  }

  handleSubmit = (e) => {
    e.preventDefault();
    let url;
    if (this.state.edit) {
        url = this.props.base_api_url+'schedule/'+this.state.id;
    }else{
        url =  this.props.base_api_url+'schedule';
    }
    axios({
        method  : this.state.edit ? 'PUT' : 'POST',
        url     : url,
        data    : {
          name : this.state.name,
          time_in : this.state.time_in,
          time_out : this.state.time_out,
          
        },
        headers : {
            "Authorization" : this.props.auth_token,
          },
    })
    .then(response=>{
        this.getData();
        this.setState({modalShow:false})
        Toast.fire({
            icon: 'success',
            title: this.state.edit ? 'Update Success' : 'Delete Success'
        });
       
    })
    .catch(e => {
      // return console.log(e.response)
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
    this.setState({ 
        [name] : value
    });
  }

  render() {
    const columns = [
      {
        Header: "#",
        id: "row",
        filterable: false,
        sortable:false,
        width: 50,
        Cell: (value) => {
            if (value.original.row_num) {
                return <div>{value.original.row_num}</div>;
            }else{
                return <div>{value.index+1}</div>;
            }
          }
      },
      {
        Header: 'Name',
        accessor: 'name',
        filterable:true
      },
      {
        Header: 'Time In',
        accessor: 'time_in',
        filterable:true
      },
      {
        Header: 'Time Out',
        accessor: 'time_out',
        filterable:true
      },
      {
        Header: 'created_at',
        accessor: 'created_at',
        filterable:true
      },
      {
        Header: 'updated_at',
        accessor: 'updated_at',
        filterable:true
      },
      {
        Header: 'Action',
        sortable: false,
        Cell : row => (
            <div align="center">
                <h5>
                <a href="#!" onClick={() => this.handleEdit(row.original)}><Badge variant="success" className="mr-2">Edit <i className="feather icon-edit"></i></Badge></a>
                <a href="#!" onClick={() => this.handleDelete(row.original)}><Badge variant="danger" className="mr-2">Delete <i className="feather icon-trash-2"></i></Badge></a>
                </h5>                    
            </div>
        )
    }
    ];
    return (
        <Aux>
            <Row>
                <Col>
                  <Button size="sm" variant="primary" style={{width:150}} className="mt-n5 shadow-2 float-right" onClick={this.handleCreate}>Create</Button>
                    <Card title='Schedule' isOption>
                    <ReactTable
                        manual={true}
                        data={this.state.tableData}
                        columns={columns}
                        pages = {this.state.total_pages}
                        loading={this.state.loading}
                        defaultPageSize={10}
                        onFetchData = {
                            (state, instance) => {
                                this.fetchData(state)
                            }
                        }
                        sortable={true}
                        className="-striped -highlight"
                    />
                    </Card>
                </Col>
            </Row>
            <Modal size="lg" show={this.state.modalShow} onHide={()=>{this.setState({modalShow:false})}}>
                <ValidatorForm ref="form" onSubmit={this.handleSubmit}>
                  <Modal.Header closeButton>
                  <Modal.Title>Schedule</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                      <Form.Group>
                          <Form.Label>Name</Form.Label>
                          <InputValidator 
                              onChange={this.handleChange} 
                              type="text"
                              name="name"
                              value={this.state.name}
                              validators={['required']}
                              errorMessages={['this field is required']}
                              placeholder="Name"
                          />
                          <Form.Text className="text-danger">
                             {this.state.errors.name}
                          </Form.Text>
                      </Form.Group>
                      <Form.Row>
                        <Form.Group as={Col}>
                            <Form.Label>Time In</Form.Label>
                              <TimeValidator
                                selected={this.state.time_in}
                                value={this.state.time_in}
                                onChange={(date)=>{this.setState({time_in:date})}}
                                placeholderText="Time In"
                                validators={['required']}
                                errorMessages={['this field is required']}
                                timeCaption="Time In"
                              />
                            <Form.Text className="text-danger">
                              {this.state.errors.time_in}
                            </Form.Text>
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label>Time Out</Form.Label>
                              <TimeValidator
                                selected={this.state.time_out}
                                value={this.state.time_out}
                                onChange={(date)=>{this.setState({time_out:date})}}
                                placeholderText="Time In"
                                validators={['required']}
                                errorMessages={['this field is required']}
                                timeCaption="Time Out"
                              />
                            <Form.Text className="text-danger">
                              {this.state.errors.time_out}
                            </Form.Text>
                        </Form.Group>
                      </Form.Row>
                  </Modal.Body>
                  <Modal.Footer>
                  <Button size="sm" variant="secondary" onClick={()=>{this.setState({modalShow:false})}}>
                      Close
                  </Button>
                  <Button size="sm" type="submit" variant="primary">
                    {this.state.edit ? 'Edit' : 'Create'}
                  </Button>
                  </Modal.Footer>
                  </ValidatorForm>
            </Modal>
        </Aux>
    );
  }
}

export default Schedule;