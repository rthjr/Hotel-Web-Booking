
import ScrollAnimation from '@components/motion/ScrollAnimation'
import AllRooms from '@components/user/Card/AllRooms'
import Footer from '@components/user/layout/Footer'
import Header from '@components/user/layout/Header'
import React from 'react'

const page = () => {
    return (
        <div className='w-full min-h-screen flex flex-col'>
            {/* header */}
            <div className='w-full h-full flex flex-col justify-center items-center flex-shrink-0'>
                <div className='w-9/12 h-full'>
                    <Header />
                </div>
                <ScrollAnimation/>
            </div>

            {/* body */}
            <div className='flex-grow'>
                <AllRooms />
            </div>

            {/* footer */}
            <div className='w-full flex-shrink-0'><Footer /></div>
        </div>
    )
}

export default page