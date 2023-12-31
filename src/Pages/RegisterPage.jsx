import React, { useEffect, useState } from 'react';
import { PasswordField } from '../Componets/PasswordInput';
import { Link, useNavigate,useLocation } from 'react-router-dom';
import {userRegister} from '../services/api/auth'
import Swal from 'sweetalert2';
import {useSelector} from "react-redux";



function RegisterPage() {

  const [formData, setFormData] = useState({password: ''});
  const [inputError, setInputError] = useState({});
  const user = useSelector(state => state.user.user);
  const navigate = useNavigate()
  const location = useLocation()
  
  useEffect(() => {
    if(user){
      const previousPath = location.state?.from || '/';
      navigate(previousPath)
    }
    
  }, [user]);

  const sweetalert = ()=>{
    Swal.fire({
      title: 'Successfully Registered ',
      text: 'Varification mail send to your email',
      icon: 'success',
      showCancelButton: false,
      confirmButtonColor: '#3085d6',
      // cancelButtonColor: '#d33',
      confirmButtonText: 'Ok',
    })
  }

  const formValidation = (name,value)=>{
    switch (name) {
      case 'name':
        if (value.trim() === ''){
          setInputError(prev => ({...prev, name: 'Name can\'t be empty!'}));
        }else{
          setInputError(prev => ({...prev, name: ''}));
        }
        break;
      case 'email':
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i;
        if (regex.test(value)) {
          setInputError(prev => ({...prev, email: ''}));
        }else{
          setInputError(prev => ({...prev, email: 'Email is not valid !'}));
        }
        break;
      case 'password':
        if (value.trim() === '') {
          setInputError(prev => ({ ...prev, password: 'Password can\'t be empty!' }));
        }
        
        else if(value.length < 6){
            setInputError(prev => ({...prev, password: 'Must be at least 6 characters long!'}))
          }else{
            setInputError(prev => ({...prev, password: ''}))
          }
        if (formData.password1){
          if(value !== formData.password1){
            setInputError(prev => ({...prev, password1: 'Password not match!'}))
          }else{
            setInputError(prev => ({...prev, password1: ''}))
          }
        }
        break;
      case 'password1':
          if(value !== formData.password){
            setInputError(prev => ({...prev, password1: 'Password not match!'}))
          }else{
            setInputError(prev => ({...prev, password1: ''}))
          }
        break;
      default:
        break;
    }
  }
  

  const handleChange =(e)=>{
    const {name,value} = e.target
    setFormData({...formData,[name]:value.trim()})
    formValidation(name,value)

  }

  const handleSubmit =  (e) => {
    e.preventDefault();
    formValidation('password1', formData.password1);
  
    if (inputError.name || inputError.email || inputError.password || inputError.password1) {
      console.log(inputError);
      return false
    }else{
      console.log('first')
      userRegister(formData).then(()=>{
        sweetalert()
        navigate('/login')
      }).catch((e)=>{
        
          alert(e.response.data.email)
        });
      
    }
    
  };
  
  
  return (
    <>
  {/* <section className="mt-16 flex flex-col md:flex-row w-full"> */}
    
    <section className="w-full  flex flex-col justify-center items-center gap-2 p-2 md:p-8">
      
      <p className="text-center font-semibold italic text-white">Register your Account here!</p>
      <form onSubmit={handleSubmit} className="flex flex-col justify-center items-center">
        <div style={{width:'50%'}}>
          <>
        <input placeholder='Name' name="name" type="text" 
          onChange={handleChange} 
          className={'h-10 w-full text-white focus:outline-0 mb-4 bg-dark-primary p-3 rounded-md'} 
          required/>
          </>
          {inputError.name && <span className="text-red-500" > {inputError.name} </span>}
          
        <input placeholder='Email' name="email" type='email'
          onChange={handleChange} 
          className={'h-10 w-full text-white focus:outline-0  mb-4 bg-dark-primary p-3 rounded-md'} 
          required/>
          {inputError.email && <span className="text-red-500" > {inputError.email} </span>}
        <PasswordField autoComplete="new-password" className='mb-4' 
          name="password" onChange={handleChange} 
          placeholder={'Password'} required/>
          {inputError.password && <span className="text-red-500" > {inputError.password} </span>}
        <PasswordField autoComplete="new-password" placeholder={'Repeat Password'} 
          onChange={handleChange} 
          name="password1" required/>
          {inputError.password1 && <span className="text-red-500" > {inputError.password1} </span>}
        </div>
        <button type="submit" className="bg-slate-900 text-white  p-2 rounded" >
          Register
        </button>
      </form>
     
        <Link to={'/login'} className='text-white'>Already have an account? Click here</Link>
    {/* </section> */}
  </section>


</>
  );
}

export default RegisterPage;
