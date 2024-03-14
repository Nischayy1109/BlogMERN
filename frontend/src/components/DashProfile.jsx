import { TextInput,Button, Alert } from 'flowbite-react'
import React, { useState } from 'react'
import {useDispatch,useSelector} from 'react-redux'
import { updateStart,updateFailure,updateSuccess } from '../redux/user/userSlice'
export default function DashProfile() {
  const {currentUser}=useSelector(state => state.user)
  const [formData,setformData]=useState({});
  const [updateUserSuccess,setupdateUserSuccess]=useState(null);
  const [updateUserError,setupdateUserError]=useState(null);
  const dispatch=useDispatch();
  const handleChange=(e)=>{
    setformData({...formData,[e.target.id]:e.target.value});
  }
  //console.log(formData);
  const handleSubmit=async(e)=>{
    e.preventDefault();
    setupdateUserSuccess(null);
    setupdateUserError(null);
    if(Object.keys(formData).length===0){
      setupdateUserError("No changes made");
      return;
    }
    try {
      dispatch(updateStart());
      const res=await fetch(`/api/user/update/${currentUser._id}`,{
        method:'PUT',
        headers:{
          'Content-Type':'application/json',
        },
        body: JSON.stringify(formData)
      })
      const data=await res.json()
      if(!res.ok){
        dispatch(updateFailure(data.message));
        setupdateUserError(data.message);
      }else{
        dispatch(updateSuccess(data));
        setupdateUserSuccess("User profile updated successfully")
      }
    } catch (error) {
      dispatch(updateFailure(error.message));
      setupdateUserError(error.message);
    }
  }
  return (
    <div className='max-w-lg mx-auto p-3 w-full'>
      <h1 className='my-7 text-center font-semibold text-3xl'>
        Profile
      </h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <div className='w-32 h-32 self'>
        </div>
        <img src={currentUser.profilePicture} alt='user' className='w-full h-full rounded-md' />
        <TextInput type='text'  id='username' placeholder='username' defaultValue={currentUser.username} onChange={handleChange}/>
        <TextInput type='text'  id='email' placeholder='email' defaultValue={currentUser.email} onChange={handleChange}/>
        <TextInput type='password'  id='password' placeholder='password' onChange={handleChange}/>
        <Button type='submit' gradientDuoTone='greenToBlue' outline>Update</Button>
      </form>
      <div className='text-red-500 flex justify-between mt-5'>
        <span className='cursor-pointer'>Delete Account</span>
        <span className='cursor-pointer'>Sign Out</span>
      </div>
      { updateUserSuccess && 
      (<Alert color="success" className='mt-5'>{updateUserSuccess}</Alert>) }
      { updateUserError && 
      (<Alert color="failure" className='mt-5'>{updateUserError}</Alert>) }
    </div>
  )
}
