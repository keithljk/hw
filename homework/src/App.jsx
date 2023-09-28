import {useRef, useState, useEffect} from 'react'
import './App.css'
import Navigetor from './Navigator/Navigator'
import axios from 'axios'
import ReactHlsPlayer from 'react-hls-player'

function App() {
  const [isActived, setIsActived] = useState("following")
  // eslint-disable-next-line no-unused-vars
  const [data, setData] = useState({
    following: [],
    forU: []
  })
  const videoRef = useRef(null)
  const contextmenu = (e)=>{
    e.preventDefault()
  }
  const limit = 30 //移動緩衝
  const wrapRef = useRef(null)
  const [offsetY, setOffsetY] = useState(0) //滾動偏移量
  const [total] = useState(3) //傳入的總數
  const [curIndex, setCurIndex] = useState(0)
  const [index, setIndex] = useState(0) //儲存index
  const [startPageY, setStartPageY] = useState(0) //觸屏開始的Ｙ座標

  const getData = async () => {
    const res1 = await axios.get(`http://localhost:3000/following_list`)
    const res2 = await axios.get(`http://localhost:3000/for_you_list`)
console.log(res1.data.items)
console.log(res2.data.items)
    setData({
      following: res1.data.items,
      forU: res2.data.items
    })
  }
  useEffect(() => {
    getData()
  }, [])
  const handleTouchStart = (e) =>{
    setStartPageY(e.changedTouches[0].pageY)
    wrapRef.current.style.transition = ''
  }
  const handleTouchMove = (e) => {
    //down > 0 up < 0
    const dy = e.changedTouches[0].pageY - startPageY
    const isDown = dy > limit
  
    //在第一張下滑
    if(curIndex === 0 && isDown) return
    //在最後一張上滑
    if(curIndex === total - 1 && !isDown) return
  
    const transY = dy + offsetY > 0 ? 0 : dy + offsetY
    wrapRef.current.style.transform = `translate3d(0, ${transY}px, 0)`
  }
  const handleTouchEnd = (e) => {
    const dy = e.changedTouches[0].pageY - startPageY
    //down
    if(dy > limit){
      const index = curIndex - 1
      setCurIndex(index < 0 ? 0 : index)
    }
    //up
    if(dy < -limit){
      const index = curIndex + 1
      if(index > total - 1) return
  
      setCurIndex(index > total ? total : index)
    }

    wrapRef.current.style.transition = `transform .3s`
    setOffsetY(offsetY + dy)
  }
  useEffect(() => {
    let transY = 0
    for(let i = 0; i < curIndex; i++){
      //物件高度
      transY -= 896
    }
    if(wrapRef.current){
      wrapRef.current.style.transform = `translate3d(0, ${transY}px, 0)`
    }
    setOffsetY(transY)
  }, [curIndex])

  useEffect(() => {
    const cIndex = curIndex
    setIndex(cIndex)
    setCurIndex(index)
  }, [isActived])

  return (
    <>
      <Navigetor isActived={isActived} setIsActived={setIsActived} />

      <div
        className='container'
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <ReactHlsPlayer
          className='player'
          src={data[isActived][curIndex]?.play_url ?? ''}
          autoPlay={true}
          controls
          controlsList="nodownload noremoteplayback noplaybackrate nofullscreen"
          disablePictureInPicture={true}
          disableRemotePlayback={true}
          onContextMenu={contextmenu}
          width="414px"
          height="896px"
          playerRef={videoRef}
        />
        <div ref={wrapRef}>
          {
            data[isActived].map(item => 
              <div
                key={item.title}
                className='fixed_wh'
              />
            )
          }
        </div>
      </div>

      
    </>
  )
}

export default App