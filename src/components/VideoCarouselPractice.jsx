import React, { useEffect, useState } from 'react'
import { hightlightsSlides } from '../constant';
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import { pauseImg, playImg, replayImg } from '../utils';

gsap.registerPlugin(ScrollTrigger)

const VideoCarouselPractice = () => {

    const videoRef = useRef([]);
    const videoDivRef = useRef([]);
    const videoSpanRef = useRef([]);

    const [loadedData, setLoadedData] = useState([]);

    const [video, setVideo] = useState(
        { isEnd: false, startPlay: false, videoId: 0, isLastVideo: false, isPlaying: false },
    )

    const { videoId, isPlaying, startPlay, isEnd, isLastVideo } = video;



    useGSAP(() => {

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

    }, [isEnd, videoId]);


    useEffect(() => {
        if (loadedData.length > 3) {
            if (!isPlaying) {
                videoRef.current[videoId].pause();
            }
            else {
                startPlay && videoRef.current[videoId].play();
            }
        }

    }, [loadedData, videoId, isPlaying, startPlay]);


    const handleProcess = (type, i) => {
        switch (type) {
            case 'video-end':
                setVideo((prev) => ({ ...prev, isEnd: true, videoId: i + 1 }));
                break;
            case 'video-last':
                setVideo((prev) => ({ ...prev, isLastVideo: true }))
                break;

            case 'video-reset':
                setVideo((prev) => ({ ...prev, videoId: 0, isLastVideo: false }))
                break;

            case 'play':
                setVideo((prev) => ({ ...prev, isPlaying: !prev.isPlaying }))
                break;

            case 'pause':
                setVideo((prev) => ({ ...prev, isPlaying: !prev.isPlaying }))
                break;
            default:
                return video;
        }
    }

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
                                    ref={(el) => videoRef.current[i] = el}
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

                            <span className=' absolute w-full h-full rounded-full'
                                ref={(el) => videoSpanRef.current[i] = el} />
                        </span>
                    ))}
                </div>

                <button className=' control-btn '
                    onClick={isLastVideo ?
                        () => handleProcess('video-reset')
                        : !isPlaying ?
                            () => handleProcess('play')
                            : () => handleProcess('pause')
                    }>
                    <img src={
                        isLastVideo ? replayImg : !isPlaying ? playImg : pauseImg
                    } alt={
                        isLastVideo ? 'replayImg' : !isPlaying ? 'playImg' : 'pauseImg'
                    } />
                </button>
            </div>

        </>

    )
}

export default VideoCarouselPractice