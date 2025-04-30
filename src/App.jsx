import { useState } from 'react'
import reactLogo from './assets/react.svg'
import virteLogo from '/vite.svg'
import './App.css'
import { URL } from './constants'
import Answer from './components/Answer'
// import Answer from './components/Answer'

function App() {
  const [question, setQuestion] = useState('')
  const [result,setResult]=useState([])
  const [recentHistory,setRecentHistory]=useState(JSON.parse(localStorage.getItem('history'))

)

   const payload={
      "contents": [{
    "parts":[{"text": question}]
    }]
  }
  const askQuestion=async()=>{
    if(localStorage.getItem('history')){
      let history=JSON.parse(localStorage.getItem('history'));
        history=[question, ...history]
      localStorage.setItem('history',JSON.stringify(history))
      setRecentHistory(history)
    }
    else{
      localStorage.setItem('history',JSON.stringify([question]))
      setRecentHistory([question])
    }
    
    // if(localStorage.getItem('history'))
    //   {
    //   let history= JSON.parse(localStorage.getItem('history'))
    //   history=[question, ...history]
    //   localStorage.setItem('history', JSON.stringify(history))
    //   setRecentHistory(history)
    // }
    // else{
    //   localStorage.setItem('history', JSON.stringify([question]))
    //   setRecentHistory([question])
    // }
    
    
    console.log(recentHistory);
    
    let response = await fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
    
      response=await response.json();
      
      let dataString=response.candidates[0].content.parts[0].text;

      dataString=dataString.split("\n");
      
      // dataString=dataString.map((item)=>item.trim());
      // console.log(dataString);
      
      // console.log(response.candidates[0].content.parts[0].text);
      // setResult(response.candidates[0].content.parts[0].text)
      // setResult(dataString)
      // setResult([question,dataString])
      setResult([...result,{type:'q',text:question},{type:'a',text:dataString}])
      setQuestion('')
  }
  const isEnter=()=>{
    console.log(event.key);
    if(event.key=='Enter'){
      askQuestion();
    }
    
  }
  // console.log(result);
  const remove=()=>{
          localStorage.clear();
          setRecentHistory([])
  }  

  return (
    <div className='grid grid-cols-5 h-screen'>
      <div className='col-span-1 bg-zinc-500'>
          <h1 className='text-center text-white text-3xl mt-5'>Recent History
          <button><i class="fa-solid fa-trash curse-pointer" onClick={remove}></i></button>
          </h1>
          
          <ul className='text-left overflow-auto'>
              {
                recentHistory && recentHistory.map((item, index) => (
                <li key={index} className="text-white p-2 border-b">{item}</li>
                  ))
              }
          </ul>

      </div>
      <div className='col-span-4 p-10 '>
        <h1 className='text-red-500 text-center text-5xl'>Welcome to AI, how may i help you..??</h1>
          <div className="container h-120 overflow-auto">
            <div className='text-white'>
            <ul>
            {
              result.map((item,index)=>(
                item.type=='q'?
              <li key={index+Math.random()} className='text-right p-2 bg-zinc-600 rounded-tl-3xl rounded-br-3xl rounded-bl-3xl w-fit'>
              <Answer ans={item.text} totalresult={1}/>
            </li>:item.text.map((ansItem,ansIndex)=>(
              <li key={ansIndex+Math.random()} className='text-left p-2'>
              <Answer ans={ansItem} totalresult={item.length} index={ansIndex}/>
            </li>
            ))
              ))
            }
            </ul>
            {/* {result} */}
            {/* <ul>
  {
    result && result.map((item,index) => (
      <li key={index+Math.random()} className='text-white p-2'>
        <Answer ans={item} />
      </li>
    ))
  }
</ul> */}
        


            </div>
            
          </div>
          <div className='bg-zinc-800 pr-5 w-1/2 text-white m-auto rounded-4xl border-white flex p-1 h-16'>
            <input type="text" value={question}
            onKeyDown={isEnter} onChange={(event)=>setQuestion(event.target.value)} placeholder='ask me anything' className='w-full h-full p-3 outline-none'/>
            <button onClick={askQuestion}>Ask</button>
          </div>
      </div>
    </div>
  )
}

export default App
