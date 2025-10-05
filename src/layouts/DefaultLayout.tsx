import { Outlet } from 'react-router-dom'
import Footer from "@/components/Footer";

const DefaultLayout = () => {
  return (
    <>
      <main className='font-display px-2 py-4 md:px-8 md:py-8 max-w-7xl mx-auto w-full'>
        <Outlet />
      </main>
      <Footer />
    </>
  )
}

export default DefaultLayout