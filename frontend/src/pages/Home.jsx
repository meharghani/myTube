import React, { useEffect, useState } from 'react'
import useVideo from '../hooks/useVideo'

const Home = () => {
  const [videos, setVideos] = useState([]);
  const videosData = useVideo()
  useEffect(()=>{
    const getAllVideos = async()=>{
      try {
        const data = await videosData()
        setVideos(data.videos)
      } catch (error) {
        console.log(error)
      }
    }
    getAllVideos()

  },[])
  const dateCalculator = (date)=>{ 
    const givenDate = new Date(date);
    const now = new Date();
    const diffInDate = now - givenDate
    const hours = Math.floor(diffInDate/1000/60/60)
    const days = Math.floor(diffInDate/1000/60/60/24)
    let string
    if(days < 1 ){
      if(hours < 1 ){
        string = `${Math.floor(hours * 60)} minuts ago`
      }else if(hours === 1){
        string = `${hours} hour ago`
      }else{
        string = `${hours} hours ago`
      }
    }else if(days === 1){
      string = `${days} day ago`
    }else if(days > 1 && days<7){
        string = `${days} days ago`
    }else if(days >= 7 && days < 30){
     if(Math.floor(days/7) === 1){
      string = `${Math.floor(days/7)} week ago`
     }else{
      string = `${Math.floor(days/7)} weeks ago`
     }
    }else if(days >= 30 && days < 365){
      if(Math.floor(days/30) === 1){
        string = `${Math.floor(days/30)} month ago`
      }else{
        string = `${Math.floor(days/30)} months ago`
      }
    }else{
      if(Math.floor(days/365) === 1){
        string = `${Math.floor(days/365)} year ago`  
      }else{
        string = `${Math.floor(days/365)} years ago`
      }
      
    }

    return string

  }
  return (
    <div className='grid w-[100%] grid-cols-3 mt-4 px-2'>
          {videos && videos.map((video)=>(
          
              <div className='p-2' key={video._id}>
              <a href={video.videoFile}>
              <div className='h-44 bg-slate-200 rounded-2xl '>
              <img className='min-w-[100%] h-[100%] rounded-2xl' src={video.thumbnail} />
              </div>
              </a>
              <div className='mt-3 flex'>
                <div className='flex'>
                <div className='w-11 h-11 rounded-full bg-slate-200 flex items-center justify-center'><img className='w-[100%] h-[100%] rounded-full' src={video.owner.avatar} /></div>
                </div>
                <div className='p-2'>
                <div className='font-bold'>{video.title}</div>
                  <div className='text-gray-600 mt-1 leading-5'>{video.owner.fullname}</div>
                  <div className='text-gray-600'>{video.views} views . {
                      dateCalculator(video.createdAt)

                    }</div>
                </div>
              </div>
           </div>
          ))}
    </div>
  )
}

export default Home