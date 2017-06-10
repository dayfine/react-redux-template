import React, { Component } from 'react';
import { Link, hashHistory } from 'react-router';
import { connect } from 'react-redux';
import { createProduct } from '../../redux/reducers/productsReducer.js';


const _ProductForm = ({ name, onChange, error, save } )=> {
  const _save = (ev)=> {
    ev.preventDefault();
    const input = document.getElementById('imageData');
    const file = input.files[0];
    if(!file){
      return save({ name: name });
    }
    const reader = new FileReader();
    reader.onloadend = (output)=> {
      const imageData = output.target.result;
      save({ name: name, imageData });
    }
    reader.readAsDataURL(file);
  }
  return (
    <form className='well'  encType="multipart/form-data" >
      {
        error ? (
          <div className='alert alert-warning'>Error</div>
        ): (null)
      }
      <div className='form-group'>
        <input value={ name } className='form-control' name='name' onChange={ onChange }/>
      </div>
      <div className='form-group'>
        <input className='form-control'  accept="image/*" name='imageData' id='imageData' type='file'/>
      </div>
      <button className='btn btn-primary' onClick={ _save } disabled={ !name }>Save</button>
    </form>
  );
};

class ProductForm extends Component{
  constructor(){
    super();
    this.state = { name: ''};
    this.onChange = this.onChange.bind(this);
  }
  onChange(ev){
    let change = {};
    change[ev.target.name] = ev.target.value;
    this.setState(change);
  }
  render(){
    const { name, error } = this.state;
    const save = (product)=> {
      this.props.save(product)
        .then(()=> this.setState({ name: '', error: null }))
        .catch((ex)=> { this.setState( { error: ex })});
    }
    return (
      <_ProductForm error={error} save={ save } name={ name } onChange={ this.onChange }></_ProductForm>
    );
  }
}

const mapDispatchToProps = (dispatch)=> {
  return {
    save: (product)=> {
      return dispatch(createProduct(product))
    }
  };
};

export default connect(null, mapDispatchToProps)(ProductForm);
