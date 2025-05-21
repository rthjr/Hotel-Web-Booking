
import SignUpForm from '@components/Authentication/SignUpForm'
import React from 'react'

const page = () => {
  return (
    <div className="w-full h-screen flex items-center justify-center"
    style={{
      backgroundImage: "url('./image/backgroundSignUpForm.jpg')",
      backgroundSize: "cover",
      backgroundPosition: "center",
    }}>
        <SignUpForm/>
    </div>
  )
}

export default page