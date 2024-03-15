import { TextInput,Button, Alert, Modal } from 'flowbite-react'
import React, { useState } from 'react'
import {useDispatch,useSelector} from 'react-redux'
import { updateStart,updateFailure,updateSuccess,deleteUserFailure,deleteUserStart,deleteUserSuccess,signoutSuccess } from '../redux/user/userSlice'
import {HiOutlineExclamationCircle} from 'react-icons/hi'
export default function DashProfile() {
  const {currentUser,error}=useSelector(state => state.user)
  const [formData,setformData]=useState({});
  const [updateUserSuccess,setupdateUserSuccess]=useState(null);
  const [updateUserError,setupdateUserError]=useState(null);
  const [showModal,setshowModal]=useState(false);
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
  const handleDeleteUser=async()=>{
    setshowModal(false)
    try {
      dispatch(deleteUserStart());
      const res=await fetch(`/api/user/delete/${currentUser._id}`,{
        method:'DELETE',
      })
      const data=await res.json()
      if(!res.ok){
        dispatch(deleteUserFailure(data.message))
      }else{
        dispatch(deleteUserSuccess(data));
      }
      
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  }
  const handleSignout=async()=>{
    try {
      const res=await fetch('/api/user/signout',{
        method:'POST',
      })
      const data=await res.json();
      if(!res.ok){
        console.log(data.message);
      }else{
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.log(error.message);
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
        <span onClick={()=>setshowModal(true)} className='cursor-pointer'>Delete Account</span>
        <span onClick={handleSignout}className='cursor-pointer'>Sign Out</span>
      </div>
      { updateUserSuccess && 
      (<Alert color="success" className='mt-5'>{updateUserSuccess}</Alert>) }
      { updateUserError && 
      (<Alert color="failure" className='mt-5'>{updateUserError}</Alert>) }
      { error && 
      (<Alert color="failure" className='mt-5'>{error}</Alert>) }
      <Modal show={showModal} onClose={()=>setshowModal(true)} popup size='md'>
        <Modal.Header/>
          <Modal.Body>
            <div className='text-center'>
              <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto'/>
              <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>Do you want to delete your account?</h3>
              <div className='flex justify-center gap-10'>
                <Button color='failure' onClick={handleDeleteUser}>Confirm</Button>
                <Button color='gray' onClick={()=>setshowModal(false)}>Cancel</Button>
              </div>
            </div>
          </Modal.Body>
      </Modal>
    </div>
  )
}
