import React from 'react'

const loading = () => {
    return (
        <div className='flex justify-center items-center'>
            <div className="min-w-screen w-full min-h-screen flex justify-center items-center">
                <div>
                    <span className="loading loading-infinity loading-lg"></span>
                </div>
            </div>
        </div>
    )
}

export default loading