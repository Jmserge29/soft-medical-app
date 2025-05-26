

import { Link, useLocation } from "react-router"

import { Briefcase, FileText, MessageCircle, User, Syringe } from "lucide-react";

export const DashboardLayout = ({ children }: { children: React.ReactNode }) => {

    const location = useLocation();



    return (
        <div className="h-screen w-full bg-white relative flex overflow-hidden">
            <aside className="h-full w-16 flex flex-col relative text-white" style={{ backgroundColor: '#2253d0' }}>
                <div className="flex-1 flex flex-col space-y-10 items-center justify-center">
                    <Link
                        to="/Perfiles"
                        className={`h-10 w-10 flex items-center justify-center rounded-lg cursor-pointer hover:text-gray-800 hover:bg-white ${location.pathname === "/Perfiles" ? "bg-white text-gray-800" : ""
                            }`}
                    >
                        <User className="w-6 h-6" />
                    </Link>

                    <Link
                        to="/Cirugia"
                        className={`h-10 w-10 flex items-center justify-center rounded-lg cursor-pointer hover:text-gray-800 hover:bg-white ${location.pathname === "/Cirugia" ? "bg-white text-gray-800" : ""
                            }`}
                    >
                        <Syringe className="w-6 h-6" />
                    </Link>

                    <Link
                        to="/Chat"
                        className={`h-10 w-10 flex items-center justify-center rounded-lg cursor-pointer hover:text-gray-800 hover:bg-white ${location.pathname === "/Chat" ? "bg-white text-gray-800" : ""
                            }`}
                    >
                        <MessageCircle className="w-6 h-6" />
                    </Link>

                    <Link
                        to="/CvOfertas"
                        className={`h-10 w-10 flex items-center justify-center rounded-lg cursor-pointer hover:text-gray-800 hover:bg-white ${location.pathname === "/CvOfertas" ? "bg-white text-gray-800" : ""
                            }`}
                    >
                        <FileText className="w-6 h-6" />
                    </Link>
                </div>

                <button
                    // onClick={logout}
                    className="mb-8 h-10 w-10 ml-3 flex items-center justify-center rounded-lg cursor-pointer hover:text-gray-800 hover:bg-white hover:duration-300 hover:ease-linear focus:bg-white"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                </button>
            </aside>

            <div className="w-full h-full flex flex-col justify-between">
                <header className="h-16 w-full flex items-center relative justify-end px-5 space-x-10 text-white" style={{ backgroundColor: '#2253d0' }}>
                    <div className="flex flex-shrink-0 items-center space-x-4 text-white">

                        {/* <div className="flex flex-col items-end">
                            <div className="text-md font-medium">{name} {lastName}</div>
                            <div className="text-sm font-regular">
                                {Array.isArray(roles) && roles.map((role, index) => (
                                    <span key={index}>
                                        {role}{index !== roles.length - 1 && ', '}
                                    </span>
                                ))}
                            </div>
                        </div> */}

                        <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-gray-100">
                            <img
                                src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQC2kOSRJyIgPq-8tpdG2vpYQYwzfct3Gi6DA&s"}
                                alt="Profile"
                                className="w-full h-full object-cover"
                                loading="eager"
                            />
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto bg-gray-50">
                    <div className="p-4">
                        {children}
                    </div>
                </main>


            </div>
        </div>
    )
}
