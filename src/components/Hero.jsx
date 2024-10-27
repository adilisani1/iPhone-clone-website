import gsap from "gsap"
import { useGSAP } from "@gsap/react";
import { heroVideo, smallHeroVideo } from "../utils";
import { useState } from "react";
import { useEffect } from "react";

const Hero = () => {

  const [videoSrc, setVideoSrc] = useState(window.innerWidth < 760 ? smallHeroVideo : heroVideo);

  const handleVideoSrc = () => {
    if (window.innerWidth < 760) {
      setVideoSrc(smallHeroVideo)
    } else {
      setVideoSrc(heroVideo)
    }
  }

  useEffect(() => {
    window.addEventListener("resize", handleVideoSrc);

    return () => {
      window.removeEventListener("resize", handleVideoSrc);
    }
  }, [])

  useGSAP(() => {
    gsap.to('#hero', {
      opacity: 1, delay: 2
    }),
      gsap.to('#cta', {
        opacity: 1,
        delay: 2,
        y: -50,
      })
  }, [])

  return (
    <section className=" w-full nav-height bg-black relative">

      <div className=" h-5/6 w-full flex-center flex-col">
        <p id="hero" className=" hero-title">iPhone 16 Pro</p>
        <div className=" md:w-10/12 w-9/12">
          <video className=" pointer-events-none" autoPlay muted playsInline={true} key={videoSrc}>
            <source src={videoSrc} />
          </video>
        </div>
      </div>

      <div id="cta" className=" flex flex-col items-center opacity-0 translate-y-20">
        <a href="#highlights" className=" btn"> Buy </a>
        <p className=" text-gray text-xl font-semibold">
          From $999 or $41.62/mo. for 24 mo.1
        </p>
        <p className=" text-gray text-md font-normal">
          Apple Intelligence coming this fall2
        </p>
      </div>

    </section>
  )
}

export default Hero;