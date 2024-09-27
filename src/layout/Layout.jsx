import { Footer } from "../components/Footer"
import { Navbar } from "../components/Navbar"

export const Layout = ({ children }) => {
    return (
        <>
            <div className="app-container">
                <Navbar/>
                <div className="content">
                    {children}
                </div>
                <Footer />
            </div>
        </>
    )
}