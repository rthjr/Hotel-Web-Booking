import Header from '@components/layout/Header'
import React from 'react'

const Home = () => {
  return (
    <div className='w-full h-full'>
      <div className='w-full flex justify-center items-center shadow-2xl'>
        <div className='w-10/12'>
          {/* Header */}
          <Header />

        </div>

      </div>
    </div>
  )
}

export default Home