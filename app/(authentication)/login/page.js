import LoginForm from '@components/Authentication/LoginForm'
import React from 'react'

const page = () => {
  return (
    <div
      className="w-full h-screen flex items-center justify-center"
      style={{
        backgroundImage: "url('./image/backgroundLoginForm.avif')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <LoginForm />
    </div>
  )
}

export default page