import React, { useState, createRef, useEffect } from 'react';
import './style.css'
import { maxKeyInDic } from './util'

const useDictionary = () => {
  const [wordDic, setWordDic] = useState({})
  const [followDic, setFollDic] = useState({})

  function setToWordDic(wordInput) {
    setWordDic(oldDict => {
      let dictionary = {...oldDict}
      if (wordInput in dictionary) {
        dictionary[wordInput] += 1
      } else {
        dictionary[wordInput] = 1
      }
      return dictionary
    })
  }

  function setToFollDic(sentenceInput) {
    sentenceInput.split(" ").forEach((item, index, arr) => {
      setToWordDic(item) // 统计该单词出现的次数

      if (index < arr.length - 1) {  // 统计该单词后跟随的单词
        setFollDic(oldDict =>{
          let dictionary = {...oldDict}
          if (item in dictionary) {  
            if (arr[index + 1] in dictionary[item])
              dictionary[item][arr[index + 1]] += 1
            else 
              dictionary[item][arr[index + 1]] = 1
          } else {
            dictionary[item] = {}
            dictionary[item][arr[index + 1]] = 1
          }
          return dictionary
        })
      }
    })
  }

  return {wordDic, followDic, setToWordDic, setToFollDic}
}

function AutoInput() {

  const [currInput, setInput] = useState("")
  const [textAssociate, setText] = useState("")
  const [inputWidth, setWidth] = useState(2)
  const inputRef = createRef()

  const {wordDic, followDic, setToWordDic, setToFollDic} = useDictionary()

  // 当每次input的值变化时触发
  useEffect(() => {
    // 确保input长度随着内容变化
    setWidth(inputRef.current && inputRef.current.scrollWidth)

    let words = currInput.split(" ")
    let last_word = words[words.length - 1]

    // 每次字符变化时检测是否有可匹配的选项
    let wordMatch = Object.keys(wordDic).filter(v => { // 匹配单词
      return v.startsWith(last_word)
    });
    
    // 当输入不为空且目前输入的字符于word字典中某个值完全匹配时，推测下一个单词
    if (last_word && wordMatch.indexOf(last_word) !== -1) {

      let followWord = followDic[last_word]
      if (!followWord) {  // 若单词没有跟随单词的统计数据，则清空提示
        setText("")
      } else {
        setText(" " + maxKeyInDic(followWord, Object.keys(followWord))) // 将单词后出现最高频的单词作为提示
      }
    } else if (last_word && wordMatch.length) { // 当有匹配的字符和输入不为空时
      // 获取频率最高的词
      let maxFreqWord = maxKeyInDic(wordDic, wordMatch)
      // 将匹配到的字符去掉重合的部分并赋值到提示中
      setText(maxFreqWord.replace(last_word, ""))
    } else {
      // 当条件不符合时将提示文本设置为空
      setText("")
    }
  }, [currInput])

  // 监听按键事件
  const handleKey = e => {
    if (e.keyCode === 9) { // 当tab被按下
      e.preventDefault()
      setInput(currInput + textAssociate)
    } else if(e.keyCode === 13) { // 当Enter被按下
      e.preventDefault()
      handleSubmit()
    }
  }

  // 监听输入事件
  function handleChange(e) {
    setInput(e.target.value)
    setWidth(2) // 确保输入框能够回缩
  }

  // 当点击时，添加字符进字典中，并清空输入框
  const handleSubmit = () => {
    // 仅当输入的值不为空时，将值引入字典
    let inputValue =  currInput.trim()// 去除首尾的空格
    if (inputValue) {
      if (inputValue.split(" ").length === 1) {
        setToWordDic(inputValue)
      } else {
        setToFollDic(inputValue)
      }
    }
    setInput("")
  }

  return (
    <div>
      <div className="input-wrapper" onClick={() => inputRef.current && inputRef.current.focus()}>
        <input 
          className="auto-input"
          value={currInput}
          ref={inputRef}
          onChange={handleChange}
          onKeyDown={handleKey}
          style={{width:inputWidth}}
          spellCheck="false"
          autoComplete="off"
        />
        <span className="associate-text">{textAssociate}</span>
      </div>
      <br />
      <button onClick={handleSubmit}>submit</button>
      <div>
        目前单词字典里有：
        <ul>
          {
            Object.keys(wordDic).length 
            ? Object.keys(wordDic).map((word, index) => {
              return <li key={index}>{word}:{wordDic[word]}</li>
            }) 
            : <li>暂无数据</li>
          }
        </ul>
        目前统计的跟随单词：
        <div>
          {
            Object.keys(followDic).length 
            ? Object.keys(followDic).map((word, index) => {
              return (
              <div key={index}>
                {word}
                <ul>
                  {
                    Object.keys(followDic[word]).map((foll, index) => {
                      return <li key={index+foll+word}>
                        {foll}: {followDic[word][foll]}
                      </li>
                    })
                  }
                </ul>
              </div>
              )
            }) 
            : <ul>暂无数据</ul>
          }
        </div>
      </div>
    </div>
  )
}

export default AutoInput;