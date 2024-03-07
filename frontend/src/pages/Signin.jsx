import React, { useState } from 'react'
import {Label, TextInput,Button, Alert, Spinner} from 'flowbite-react'
import { Link, useNavigate } from 'react-router-dom'
import { signInStart,signInFailure,signInSuccess } from '../redux/user/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import OAuth from '../components/OAuth';


export default function SignIn() {
  const [formData,setformData]=useState({});
  // const [errorMessage,setErrorMessage]=useState(null);
  // const [loading,setLoading]=useState(false);
  const {loading,error:errorMessage}=useSelector(state => state.user);
  const navigate=useNavigate();
  const dispatch=useDispatch();
  const handleChange=(e)=>{
    setformData({...formData,[e.target.id]:e.target.value.trim()});
  }
  //console.log(formData)
  const handleSubmit=async(e)=>{
    e.preventDefault();
    if(!formData.email || !formData.password){
      return dispatch(signInFailure('All entries are required'))
    }
    try {
      dispatch(signInStart())
      const res=await fetch('/api/auth/signin',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify(formData),
      })
      const data=await res.json();
      if(data.success==false){
        dispatch(signInFailure(data.message))
      }
      if(res.ok){
        dispatch(signInSuccess(data))
        navigate('/')
      }
    } catch (error) {
      dispatch(signInFailure(error.message))
    }

  }
  return (
    <div className='min-h-screen mt-20'>
      <div className='flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5'>
        <div className='flex-1'>
          <Link to="/" className='font-bold dark:text-white text-5xl'>
              <span className='px-2 py-1 bg-green-500 rounded-lg text-white'>Blogify's  </span>
          </Link>
          <p className='text-sm mt-5'>
            Sign in with your email and password 
            or with Google.
          </p>
        </div>
        <div className='flex-1'>
          <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
            <div>
              <Label value='Enter email' />
              <TextInput type='email' placeholder='Email' id='email' onChange={handleChange}/>
            </div> 
            <div>
              <Label value='Enter password' />
              <TextInput type='password' placeholder='*******' id='password' onChange={handleChange}/>
            </div> 
            <Button gradientDuoTone='greenToBlue' type='submit' disabled={loading}>
              {
                loading?(
                  <>
                    <Spinner size='sm'/>
                    <span className='pl-3'>Loading...</span>
                  </>
                )
                :'Sign In'
              }
            </Button> 
            <OAuth/>  
          </form>
          <div className='flex gap-2 text-sm mt-5'>
            <span>New to Blogify?</span>
            <Link to='/sign-up' className='text-blue-500'>
              Sign Up
            </Link>
          </div>
          {
            errorMessage && (
              <Alert className='mt-5' color='failure'>
                {errorMessage}
              </Alert>
            )
          }
        </div>
      </div>
    </div>
  )
}
