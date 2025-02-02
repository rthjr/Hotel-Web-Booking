import Link from 'next/link';
import React from 'react';
import { FaHome } from 'react-icons/fa';

const Topbar = () => {
    return (
        <>
            <div className="p-4">
                <div className="sm:hidden">
                    <label htmlFor="Tab" className="sr-only">Tab</label>
                    <select id="Tab" className="w-full rounded-md border-2 border-textColor">
                        {/* Use plain text or HTML-compatible content inside <option> */}
                        <option>Home</option>
                    </select>
                </div>

                <div className="hidden sm:block">
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex gap-6">
                            <Link href="/"
                                className="shrink-0 rounded-t-lg border border-gray-300 border-b-white p-3 text-sm font-medium text-black">
                                <FaHome size={30} color="black" /> {/* Icon is fine here */}
                                <span>Home</span>
                            </Link>
                        </nav>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Topbar;