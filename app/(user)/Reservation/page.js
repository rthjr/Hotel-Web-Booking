
import React from 'react'
import { AuthProvider } from '@Context/AuthContext/AuthContext'
import Header from '@components/user/layout/Header'
import Footer from '@components/user/layout/Footer'
import ReservationCard from '@components/user/Card/ReservationCard'
import History from '@components/user/Card/History'

const page = () => {
    return (
        <>
            <AuthProvider>
                <div className='flex flex-col gap-8'>
                    <div className='flex flex-col w-full h-full'>
                        <div className='flex flex-col gap-8 w-full'>
                            <div className='shadow-lg w-full flex flex-col justify-center items-center'>
                                <div className='lg:w-9/12 w-full'><Header /></div>
                            </div>
                            <div className='w-full flex flex-col justify-center items-center'>
                                <div className='flex flex-col gap-8 lg:w-9/12 w-full'>
                                    <span className='font-bold text-3xl text-textColor'>Reservation</span>
                                    <div>
                                        <ReservationCard />
                                    </div>
                                    <span className='font-bold text-3xl text-textColor'>History</span>
                                    <div>
                                        <History />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='w-full'><Footer /></div>
                    </div>
                </div>
            </AuthProvider>
        </>
    )
}

export default page