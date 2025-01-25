import BannerContact from '@components/user/Banners/BannerContact'
import Footer from '@components/user/layout/Footer'
import Header from '@components/user/layout/Header'
import React from 'react'

const page = () => {
    return (
        <div className='w-full h-full flex flex-col'>
            {/* Header */}
            <div className='w-full flex justify-center items-center shadow-2xl sticky top-0 z-10 bg-white'>
                <div className='w-10/12'>
                    {/* Header */}
                    <Header />
                </div>
            </div>
            <div className='flex flex-col gap-8'>
                {/* banner */}
                <div>
                    <BannerContact />
                </div>
                <section className="bg-gray-100">
                    <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 gap-x-16 gap-y-8 lg:grid-cols-5">
                            <div className="lg:col-span-2 lg:py-12">
                                <p className="max-w-xl text-lg">
                                    At the same time, the fact that we are wholly owned and totally independent from
                                    manufacturer and other group control gives you confidence that we will only recommend what
                                    is right for you.
                                </p>

                                <div className="mt-8">
                                    <a href="#" className="text-2xl font-bold text-pink-600"> 0151 475 4450 </a>

                                    <address className="mt-2 not-italic">282 Kevin Brook, Imogeneborough, CA 58517</address>
                                </div>
                            </div>

                            <div className="rounded-lg bg-white p-8 shadow-lg lg:col-span-3 lg:p-12">
                                <form action="#" className="space-y-4">
                                    <div>
                                        <label className="sr-only" htmlFor="name">Name</label>
                                        <input
                                            className="w-full rounded-lg border-current p-3 text-sm"
                                            placeholder="Name"
                                            type="text"
                                            id="name"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div>
                                            <label className="sr-only" htmlFor="email">Email</label>
                                            <input
                                                className="w-full rounded-lg border-current p-3 text-sm"
                                                placeholder="Email address"
                                                type="email"
                                                id="email"
                                            />
                                        </div>

                                        <div>
                                            <label className="sr-only" htmlFor="phone">Phone</label>
                                            <input
                                                className="w-full rounded-lg border-current p-3 text-sm"
                                                placeholder="Phone Number"
                                                type="tel"
                                                id="phone"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4 text-center sm:grid-cols-3">
                                        <div>
                                            <label
                                                htmlFor="Option1"
                                                className="block w-full cursor-pointer rounded-lg border-current p-3 text-gray-600 hover:border-black has-[:checked]:border-black has-[:checked]:bg-black has-[:checked]:text-white"
                                                tabIndex="0"
                                            >
                                                <input className="sr-only" id="Option1" type="radio" tabIndex="-1" name="option" />

                                                <span className="text-sm"> Option 1 </span>
                                            </label>
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="Option2"
                                                className="block w-full cursor-pointer rounded-lg border-current p-3 text-gray-600 hover:border-black has-[:checked]:border-black has-[:checked]:bg-black has-[:checked]:text-white"
                                                tabIndex="0"
                                            >
                                                <input className="sr-only" id="Option2" type="radio" tabIndex="-1" name="option" />

                                                <span className="text-sm"> Option 2 </span>
                                            </label>
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="Option3"
                                                className="block w-full cursor-pointer rounded-lg border-current p-3 text-gray-600 hover:border-black has-[:checked]:border-black has-[:checked]:bg-black has-[:checked]:text-white"
                                                tabIndex="0"
                                            >
                                                <input className="sr-only" id="Option3" type="radio" tabIndex="-1" name="option" />

                                                <span className="text-sm"> Option 3 </span>
                                            </label>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="sr-only" htmlFor="message">Message</label>

                                        <textarea
                                            className="w-full rounded-lg border-current p-3 text-sm"
                                            placeholder="Message"
                                            rows="8"
                                            id="message"
                                        ></textarea>
                                    </div>

                                    <div className="mt-4">
                                        <button
                                            type="submit"
                                            className="inline-block w-full rounded-lg bg-black px-5 py-3 font-medium text-white sm:w-auto"
                                        >
                                            Send Enquiry
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </section>
                <div>
                    <Footer />
                </div>
            </div>
        </div>
    )
}

export default page