import { appleImg, bagImg, searchImg } from "../utils"
import { navLists } from './../constant/index';

const Navbar = () => {
  return (

      <header className=" w-full py-5 sm:px-10 px-5 flex justify-between items-center">
          <nav className=" flex w-full screen-max-width">
              <img src={appleImg} alt="Apple" width={24} height={18} />
              <div className=" flex flex-1 justify-center max-sm:hidden ">
                  {navLists.map((nav) => (
                      <div key={nav} className="px-5 text-sm text-gray hover:text-white cursor-pointer transition-all ">
                           {nav}
                      </div>
                  ))}
              </div>
              <div className=" flex gap-7 max-sm:justify-end max-sm:flex-1  items-center">
                  <img src={searchImg} alt="Apple" width={18} height={18} />
                  <img src={bagImg } alt="bag"  width={18} height={18} />
              </div>
          </nav>

      </header>

)
}

export default Navbar