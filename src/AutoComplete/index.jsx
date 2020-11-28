import React, { useState, createRef, useEffect } from 'react';
import './style.css'

function AutoInput() {

  const [currInput, setInput] = useState("")
  const [textAssociate, setText] = useState("")
  const [inputWidth, setWidth] = useState(2)
  const inputRef = createRef()

  const [wordDic, setDic] = useState([])
  const [sentenceDic, setSenDic] = useState([])

  // 当每次input的值变化时触发
  useEffect(() => {
    // 确保input长度随着内容变化
    setWidth(inputRef.current && inputRef.current.scrollWidth)

    let words = currInput.split(" ")
    let last_word = words[words.length - 1]

    // 每次字符变化时检测是否有可匹配的选项
    let wordMatch = wordDic.filter(v => { // 匹配单词
      if (v.split(" ").length === 1) 
        return v.startsWith(last_word)
      else 
        return false
    })
    
    let sentenceMatch = sentenceDic.filter(v => { // 匹配句子
      if (v.split(" ").length > 1) 
        return v.startsWith(words.join(" "))
      else 
        return false
    })
    // 当输入不为空且目前输入的字符于word字典中某个值完全匹配且有匹配到的句子时，进行句子匹配
    if (last_word && wordMatch.indexOf(last_word) !== -1 && sentenceMatch.length) {
      // 获得目前输入的单词在句子中的位置
      let currMatch = sentenceMatch[0].split(" ").indexOf(last_word)
      if (currMatch + 1 < sentenceMatch[0].split(" ").length) // 若目前输入的单词不是在句子的结尾时，将下一个单词赋值到提示中
        setText(" " + sentenceMatch[0].split(" ")[currMatch + 1]) 
      else 
        setText("")
    } else if (last_word && wordMatch.length) {
      // 当有匹配的字符和输入不为空时，将第一个匹配到的字符去掉重合的部分并赋值到提示中
      setText(wordMatch[0].replace(last_word, ""))
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
    let wordInput =  currInput.trim()// 去除首尾的空格
    if (wordInput) {
      if (wordInput.split(" ").length === 1) {
        let newWord = new Set([...wordDic, wordInput])  // 确保字典内没有重复的字符串
        setDic([...newWord])
      } else {
        let newWord = new Set([...wordDic, ...wordInput.split(" ")])
        setDic([...newWord])
        let newSentence = new Set([...sentenceDic, wordInput])
        setSenDic([...newSentence])
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
            wordDic.length ? wordDic.map((word, index) => {
              return <li key={index}>{word}</li>
            }) : <li>暂无数据</li>
          }
        </ul>
        目前句子字典有：
        <ul>
          {
            sentenceDic.length ? sentenceDic.map((sentence, index) => {
              return <li key={index}>{sentence}</li>
            }) : <li>暂无数据</li>
          }
        </ul>
      </div>
    </div>
  )
}

export default AutoInput;