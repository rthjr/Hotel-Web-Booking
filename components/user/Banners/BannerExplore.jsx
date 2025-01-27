import React from 'react'

const BannerExplore = () => {
return (
    <div className='w-full h-screen relative overflow-hidden'>
        <video className='absolute top-0 left-0 w-full h-full object-cover' autoPlay loop muted>
            <source src='/video/ExplorBanner.mp4' type='video/mp4' />
            Your browser does not support the video tag.
        </video>
    </div>
)
}

export default BannerExplore