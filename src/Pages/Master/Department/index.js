import React, {Component} from 'react';
import {Row, Col} from 'react-bootstrap';

import axios from 'axios';
import Aux from "../../../hoc/_Aux";
import Card from "../../../App/components/MainCard";
import ReactTable from 'react-table-v6'
import 'react-table-v6/react-table.css';
import Select from 'react-select';
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

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000
});

class Department extends Component {

  constructor (props) {
    super(props);
    this.state = {
      loading : true,
      parameter: '',
      errors:[],
      usersData:[],
      tableData : [],
      modalShow:false,
        id:'',
        name:'',
        department:'',
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
      url: `${this.props.base_api_url}department${this.state.parameter}`,
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
        department_manager_id:'',
        department_manager_name:'',
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
        department_manager_id:data.department_manager_id,
        department_manager_name:data.department_manager_name,
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
                url: this.props.base_api_url+'department',
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
                    title: 'Delete Success',
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
        url = this.props.base_api_url+'department/'+this.state.id;
    }else{
        url =  this.props.base_api_url+'department';
    }
    axios({
        method  : this.state.edit ? 'PUT' : 'POST',
        url     : url,
        data    : {
          name : this.state.name,
          department_manager_id : this.state.department_manager_id,
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
            title: this.state.edit ? 'Update Success' : 'Create Success'
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

  componentDidMount(){
    this.getUsers()
  }

  onSelectChange = (e,name) => {
    if (e) {
        this.setState({ 
           [name.name] : e.value
        })
    }
  }

  getUsers = () => {
    axios({
        method: 'GET',
        url: this.props.base_api_url+'getUsers',
        headers: {
            "Authorization" : this.props.auth_token,
          },
    })
    .then(response=>{
      this.setState({
        usersData: response.data,
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
        Header: 'Department Manager',
        accessor: 'department_manager_name',
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
                    <Card title='Department' isOption>
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
                  <Modal.Title>Department</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                      <Form.Group>
                          <Form.Label>Department Name</Form.Label>
                          <InputValidator 
                              onChange={this.handleChange} 
                              type="text"
                              name="name"
                              value={this.state.name}
                              validators={['required']}
                              errorMessages={['this field is required']}
                              placeholder="Department Name"
                          />
                          <Form.Text className="text-danger">
                             {this.state.errors.name}
                          </Form.Text>
                      </Form.Group>
                      <Form.Group>
                        <Select
                            onChange={this.onSelectChange}
                            name = "department_manager_id"
                            placeholder = "Select Department Manager"
                            isClearable = {false}
                            isMulti = {false}
                            {...(this.state.edit ? { defaultValue:{value:this.state.department_manager_id,  label:this.state.department_manager_name}} : {})}
                            options={this.state.usersData}
                            styles={this.state.errors.department_manager_id ? {
                              control: (base, state) => ({
                                  ...base,
                                  '&:hover': { borderColor: '#dc3545' },
                                  borderColor: '#dc3545',
                                  boxShadow: 'none',
                              }),
                            }:{}}
                        />
                        <Form.Text className="text-danger">
                             {this.state.errors.department_manager_id}
                        </Form.Text>
                    </Form.Group>
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

export default Department;