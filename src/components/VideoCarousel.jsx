import { useRef } from "react"
import { hightlightsSlides } from "../constant"
import { useState } from "react"
import { useEffect } from "react"
import gsap from "gsap"
import { pauseImg, playImg, replayImg } from "../utils"
import { useGSAP } from "@gsap/react"
import { ScrollTrigger } from "gsap/all"
gsap.registerPlugin(ScrollTrigger)


const VideoCarousel = () => {

    //create REFS....
    const videoRef = useRef([])
    const videoSpanRef = useRef([])
    const videoDivRef = useRef([])

    //create video State....
    const [video, setVideo] = useState({
        isEnd: false,
        startPlay: false,
        videoId: 0,
        isLastVideo: false,
        isPlaying: false,
    });

    // This is called Object Distraction...
    const { isEnd, startPlay, videoId, isPlaying, isLastVideo } = video;
    //loading State...
    const [loadedData, setLoadedData] = useState([]);


    useGSAP(() => {
        gsap.to('#slider', {
            transform: `translateX(${-100 * videoId}%)`,
            duration: 2,
            ease: "power2.inOut",
        })

        gsap.to('#video', {
            scrollTrigger: {
                trigger: '#video',
                toggleActions: 'restart none none none',
                onEnter: () => {
                    setVideo((prev) => ({
                        ...prev, startPlay: true, isPlaying: true
                    }))
                }
            }
        })
    }, [isEnd, videoId])


    useEffect(() => {
        let currentProgress = 0;
        let span = videoSpanRef.current;

        if (span[videoId]) {
            // animation to move the indicator
            let anim = gsap.to(span[videoId], {
                onUpdate: () => {
                    // get the progress of the video
                    const progress = Math.ceil(anim.progress() * 100);

                    if (progress != currentProgress) {
                        currentProgress = progress;

                        // set the width of the progress bar
                        gsap.to(videoDivRef.current[videoId], {
                            width:
                                window.innerWidth < 760
                                    ? "10vw" // mobile
                                    : window.innerWidth < 1200
                                        ? "10vw" // tablet
                                        : "4vw", // laptop
                        });

                        // set the background color of the progress bar
                        gsap.to(span[videoId], {
                            width: `${currentProgress}%`,
                            backgroundColor: "white",
                        });
                    }
                },

                // when the video is ended, replace the progress bar with the indicator and change the background color
                onComplete: () => {
                    if (isPlaying) {
                        gsap.to(videoDivRef.current[videoId], {
                            width: "12px",
                        });
                        gsap.to(span[videoId], {
                            backgroundColor: "#afafaf",
                        });
                    }
                },
            });

            if (videoId === 0) {
                anim.restart();
            }

            // update the progress bar
            const animUpdate = () => {
                anim.progress(
                    videoRef.current[videoId].currentTime /
                    hightlightsSlides[videoId].videoDuration
                );
            };
            if (isPlaying) {
                // ticker to update the progress bar
                gsap.ticker.add(animUpdate);
            } else {
                // remove the ticker when the video is paused (progress bar is stopped)
                gsap.ticker.remove(animUpdate);
            }
        }
    }, [videoId, startPlay]);


    useEffect(() => {
        // check if the video is loaded...
        if (loadedData.length > 3) {
            if (!isPlaying) {
                videoRef.current[videoId].pause();
            }
            else {
                startPlay && videoRef.current[videoId].play();
            }
        }
    }, [startPlay, videoId, isPlaying, loadedData]);



    const handleProcess = (type, i) => {
        switch (type) {

            // this type will perform when the video is in running process
            case "video-end":
                setVideo((prev) => ({ ...prev, isEnd: true, videoId: i + 1 }));
                break;

            // this type will perform when the last video is end
            case "video-last":
                setVideo((prev) => ({ ...prev, isLastVideo: true }));
                break;

            // these types will run when the user performed an action with the button 
            case "video-reset":
                setVideo((prev) => ({ ...prev, videoId: 0, isLastVideo: false }));
                break;

            case "pause":
                setVideo((prev) => ({ ...prev, isPlaying: !prev.isPlaying }));
                break;

            case "play":
                setVideo((prev) => ({ ...prev, isPlaying: !prev.isPlaying }));
                break;

            default:
                return video;
        }
    };

    const handleLoadedMetadata = (i, e) => {
        setLoadedData((prev) => [...prev, e]);

    };

    return (
        <>
            <div className=" flex items-center">

                {hightlightsSlides.map((list, i) => (
                    <div key={list.id} id="slider" className=" sm:pr-20 pr-10">
                        <div className=" video-carousel_container clear-start">

                            <div className=" w-full h-full flex-center rounded-3xl overflow-hidden bg-black">
                                <video
                                    id="video"
                                    playsInline={true}
                                    preload="auto"
                                    muted
                                    ref={(el) => (videoRef.current[i] = el)}
                                    onEnded={() =>
                                        i !== 3
                                            ? handleProcess("video-end", i)
                                            : handleProcess("video-last")}
                                    onPlay={() => {
                                        setVideo((prev) => ({
                                            ...prev,
                                            isPlaying: true
                                        }))
                                    }}
                                    onLoadedMetadata={(e) => handleLoadedMetadata(i, e)}
                                >
                                    <source src={list.video} type="video/mp4" />
                                </video>
                            </div>

                            <div className=" absolute top-12 left-[5%] z-10">
                                {list.textLists.map((text) => (
                                    <p key={text} className=" hiw-text">{text}</p>
                                ))}
                            </div>


                        </div>
                    </div>
                ))}
            </div>

            <div className=" relative flex-center mt-10">
                <div className=" flex-center py-5 px-7 bg-gray-300 backdrop-blur rounded-full" >

                    {videoRef.current.map((_, i) => (
                        <span key={i} className="mx-2 w-3 h-3 bg-gray-200 rounded-full relative cursor-pointer"
                            ref={(el) => videoDivRef.current[i] = el}
                        >

                            <span className=" absolute h-full w-full rounded-full"
                                ref={(el) => videoSpanRef.current[i] = el}
                            />
                        </span>
                    ))}

                </div>

                <button className="control-btn">
                    <img src={
                        isLastVideo ? replayImg : !isPlaying ? playImg : pauseImg}
                        alt={isLastVideo ? 'replay' :
                            !isPlaying ? 'play' : 'pause'}

                        onClick={isLastVideo
                            ? () => handleProcess('video-reset')
                            : !isPlaying
                                ? () => handleProcess('play')
                                : () => handleProcess('pause')
                        }
                    />
                </button>

            </div>
        </>

    )
}

export default VideoCarousel