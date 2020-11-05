import React, { useRef, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { GlobalState } from 'src/store/types';

const send = require('../../../../../../../assets/send_button.svg') as string;
import {throttle} from  'lodash'
import './style.scss';

type Props = {
  placeholder: string;
  disabledInput: boolean;
  autofocus: boolean;
  sendMessage: (event: any) => void;
  buttonAlt: string;
  onTextInputChange?: (event: any) => void;
}
function Sender({ sendMessage, placeholder, disabledInput, autofocus, onTextInputChange, buttonAlt }: Props) {
  const showChat = useSelector((state: GlobalState) => state.behavior.showChat);
  const inputRef:any = useRef(null);
  const swiperRef = useRef(null)
  const nextRef = useRef(null)
  const preRef = useRef(null)
  const swiperItem = useRef(null)
  const rcwRef:any = useRef(null)
  const [currentIndex,setCurrentIndex] = useState(0)
  const [pressStatus,setPress] = useState(false)
  const [positionStatus,setPosition] = useState('left')
  const [mousePos,setMousePos] = useState(0)
  let flag = true
  const mock:any=[{
    name: '历史访问记录'
  },{
    name: '联系客服'
  },{
    name: '拨打'
  },{
    name: '哎呀呀'
  },{
    name: '环游世界吗'
  },{
    name: '我是真的'
  },{
    name: '我是一个假的'
  }]
  // @ts-ignore
  useEffect(() => { if (showChat) inputRef.current?.focus(); }, [showChat]);
  useEffect(()=>{
    const preRefCurrent:any = preRef.current
    const nextRefCurrent:any = nextRef.current
     const current:any = swiperItem.current
     
    if(currentIndex===0){
      preRefCurrent.style.color='#999'
    }else{
      preRefCurrent.style.color='#333'
    }
    if(Math.abs((currentIndex+2)*30)>current.getBoundingClientRect().width) {
      nextRefCurrent.style.color = `#999`
    }else{
      nextRefCurrent.style.color = `#333`
    }

    
  },[currentIndex])
  const onChangeCurrentPre = ()=>{
    const current:any = swiperItem.current
   
    if(current){
      let i = currentIndex
      if(i===0) {
      
        return
      }
      let itemIndex = ++i
      current.style.transform =`translate3d(${itemIndex*30}px,0,0)`
      current.style.transition = `transform .5s`
      setCurrentIndex(itemIndex)
    }
  }
  const onChangeCurrentNext = ()=>{
    const current:any = swiperItem.current
    if(current){
      let i = currentIndex
      let itemIndex = --i
      if(Math.abs((itemIndex+2)*30)>current.getBoundingClientRect().width) {
        return
      }
      current.style.transform =`translate3d(${itemIndex*25}px,0,0)`
      current.style.transition = `transform .5s`
      setCurrentIndex(itemIndex)
    }
    
  }
  const handleKeyDown = (e)=>{
    if(e.keyCode===13){
     if(rcwRef){
      //  rcwRef.current.submit()
      rcwRef.current.onsubmit()
     }
      inputRef.current.value = ''
      return 
    }
    
  }

  const handleMouseDown = (ev)=>{
    // 设置当前是否按下
    setPress(true)
    setMousePos(ev.pageX)
  }
  const handleMouseMove = throttle((ev)=>{
    if(pressStatus&&mousePos>ev.pageX){
      const current:any = swiperItem.current
      if(current){
        console.log('滑动一次')
        
        let i = currentIndex
        let itemIndex = --i

        console.log(itemIndex,'itemIndex')
        if(Math.abs((itemIndex+3)*30)>current.getBoundingClientRect().width) {
          return
        }
        itemIndex-=5
        current.style.transform =`translate3d(${(itemIndex)*25}px,0,0)`
        current.style.transition = `transform .5s`
        setCurrentIndex(itemIndex)
      }

    }
  },500,{leading: false})
  const handleMouseUp = ()=>{
    setPress(false)
  }
  return (
    <div>
      <div className="swiperContainer" ref={swiperRef}>
        <span onClick={onChangeCurrentNext} ref={nextRef}>《</span>
        <div className="swiperItem" onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
        <div ref={swiperItem} >
        {mock.map(item=>(<p>
           {item.name}
         </p>))}
        </div>
        </div>
        <span onClick={onChangeCurrentPre} ref={preRef}>》</span>
      </div>
      <form className="rcw-sender" onSubmit={sendMessage} ref={rcwRef}> 
      <input
        type="text"
        className="rcw-new-message"
        name="message"
        ref={inputRef}
        placeholder={placeholder}
        disabled={disabledInput}
        autoFocus={autofocus}
        autoComplete="off"
        onChange={onTextInputChange}
        onKeyDown={handleKeyDown}

      />
      <button type="submit" className="rcw-send">
        <img src={send} className="rcw-send-icon" alt={buttonAlt} />
      </button>
    </form>
    </div>
  );
}

export default Sender;
