
import { Routes, Route } from 'react-router'

import { DashboardLayout, Profiles, Surgery } from '../Components';



export const Dashboard = () => {
    return (
        <DashboardLayout>

            <Routes>
                <Route path="/*" element={<Profiles />} />

                <Route path="/Perfiles" element={<Profiles />} />
                <Route path="/Cirugia" element={<Surgery />} />

            </Routes>

        </DashboardLayout>
    )
}
