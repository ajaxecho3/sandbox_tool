/* eslint-disable @next/next/no-img-element */
import React, { ChangeEvent, ChangeEventHandler, FormEvent, Fragment, use, useEffect, useState } from 'react'
import Input from '../../components/common/Input'
import Modal from '../../components/common/Modal'
import RouletteWheel from '../../components/RouletteWheel'
import useDebounce from '../../hooks/useDebounce'
import RandomGeneratorHexColor from '../../utils/ColorGenerator'
import ColorPicker from '../../components/common/ColorPicker'
import AvatarMe from '../../components/common/Avatar'
import LottieConfetti from '../../components/Lottie/LottieConfetti'
type Props = {}

type Segment = { name: string, color: string, image: string}
type Setting = {
  upTime: number, downTime: number, color: string, bgColor: string, colorContrast: string,fontSize: number,buttonText: string, wheelSize: number
}

function convertToBase64(file: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}
const Roulette = (props: Props) => {

  const [segments, setSegments] = useState<Array<Segment>>([])
  const [showWinner, setShowWinner] = useState(false)
  const [winner, setWinner] = useState('')
  const [winners, setWinners] = useState<Array<string>>([])
  const debounceVal = useDebounce(winner)
  const [CurrentSegments, setCurrentSegments] = useState<Array<string>>([])
  const [showSetting, setShowSetting] = useState(false)
  const [settings, setSettings] = useState<Setting>({
    upTime: 1000,
    downTime:500,
    color: '#000000',
    bgColor: '#ffffff',
    colorContrast: '#ffffff',
    fontSize: 17,
    wheelSize: 290,
    buttonText: 'Spin'
  })

  const handleOnFinish = (e: string) => {
    setWinner(e)
  }

  const handleCloseModal = () => {
  
    setWinners((prev) => {
      let temp = [...prev]
      temp.push(winner)

      return temp

    })
    setCurrentSegments((prev) => prev.filter((d) => d !== winner))
    
    setShowWinner(false)
  }

  const handleLoadSegments = () => {
    const segmentsName = segments.map((segments) => segments.name)
    setCurrentSegments(segmentsName)
    
  }
  const [formData, setFormData] = useState<Segment>({
    name: "",
    color: "#000000",
    image: '',
  });

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files![0];
    const base64 = await convertToBase64(file);
    setFormData({
      ...formData,
      image: base64,
    });
  };
  function random() {
    return Math.random() - 0.5 * 50;
  }
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if(formData.name === 'iatmanila'){
      let iatTeam = [
        { name: 'Bernard', color: RandomGeneratorHexColor(), image: '' },
        { name: 'Alan', color: RandomGeneratorHexColor(), image: '' },
        { name: 'Day', color: RandomGeneratorHexColor(), image: '' },
        { name: 'Sherwin', color: RandomGeneratorHexColor(), image: '' },
        { name: 'Kerby', color: RandomGeneratorHexColor(), image: '' },
        { name: 'Jean', color: RandomGeneratorHexColor(), image: '' },
        { name: 'Kim', color: RandomGeneratorHexColor(), image: '' },
        { name: 'Khars', color: RandomGeneratorHexColor(), image: '' },
        { name: 'Monica', color: RandomGeneratorHexColor(), image: '' },
        { name: 'Charm', color: RandomGeneratorHexColor(), image: '' },
        { name: 'Jeff', color: RandomGeneratorHexColor(), image: '' },
        { name: 'Cams', color: RandomGeneratorHexColor(), image: '' },
        { name: 'Dianne', color: RandomGeneratorHexColor(), image: '' },
        { name: 'Franz', color: RandomGeneratorHexColor(), image: '' },
        { name: 'Venus', color: RandomGeneratorHexColor(), image: '' },
        { name: 'Gelyn', color: RandomGeneratorHexColor(), image: '' },
      ].sort(random)

      setSegments(iatTeam)
      setFormData({
        name: '',
        color: RandomGeneratorHexColor(),
        image: ''
      })
    }else{
      const temp_segment = [...segments]
      temp_segment.push(formData)
      console.log(formData);
      setSegments(temp_segment)
      setFormData({
        name: '',
        color: RandomGeneratorHexColor(),
        image: ''
      })
    }
  };

  const handleCloseSetting = () =>{
    setShowSetting(false)
  }

 


  useEffect(() => {
    if (debounceVal !== '') {
    
      setShowWinner(true)
    }
  }, [debounceVal])


  const handleChangeColor = (targetName: string, color: string) => {
    
    

    setSegments((prevSegments) => {

      return prevSegments.map((segment) => {
        if(segment.name === targetName){
          return {...segment, color: color}
        }else{
          return segment
        };
      })
    })
  }

  const getColorByName = (name: string) => {

    const selectSegment = segments.filter((seg) => seg.name === name)
    return selectSegment[0]?.color ?? ''
  }

  const resetSegments = () => {
    setSegments([])
    setWinners([])
    setCurrentSegments([])
    setWinner('')
  }
  


  return (
    <div className="__container bg-gray-50">
      <div className='w-full relative'>
        
        {
          CurrentSegments.length === 0 && (
            <button onClick={() => setShowSetting(true)} className='hover:text-indigo-800 text-[20px] flex items-center'>
              <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="0"
                viewBox="0 0 512 512"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg">
                <path d="M413.967 276.8c1.06-6.235 1.06-13.518 1.06-20.8s-1.06-13.518-1.06-20.8l44.667-34.318c4.26-3.118 5.319-8.317 2.13-13.518L418.215 115.6c-2.129-4.164-8.507-6.235-12.767-4.164l-53.186 20.801c-10.638-8.318-23.394-15.601-36.16-20.801l-7.448-55.117c-1.06-4.154-5.319-8.318-10.638-8.318h-85.098c-5.318 0-9.577 4.164-10.637 8.318l-8.508 55.117c-12.767 5.2-24.464 12.482-36.171 20.801l-53.186-20.801c-5.319-2.071-10.638 0-12.767 4.164L49.1 187.365c-2.119 4.153-1.061 10.399 2.129 13.518L96.97 235.2c0 7.282-1.06 13.518-1.06 20.8s1.06 13.518 1.06 20.8l-44.668 34.318c-4.26 3.118-5.318 8.317-2.13 13.518L92.721 396.4c2.13 4.164 8.508 6.235 12.767 4.164l53.187-20.801c10.637 8.318 23.394 15.601 36.16 20.801l8.508 55.117c1.069 5.2 5.318 8.318 10.637 8.318h85.098c5.319 0 9.578-4.164 10.638-8.318l8.518-55.117c12.757-5.2 24.464-12.482 36.16-20.801l53.187 20.801c5.318 2.071 10.637 0 12.767-4.164l42.549-71.765c2.129-4.153 1.06-10.399-2.13-13.518l-46.8-34.317zm-158.499 52c-41.489 0-74.46-32.235-74.46-72.8s32.971-72.8 74.46-72.8 74.461 32.235 74.461 72.8-32.972 72.8-74.461 72.8z"></path>
              </svg>
            </button>
          )
        }
        <Modal 
          onClose={handleCloseSetting}
          isOpen={showSetting}
          headerContent={<h3 className='text-lg font-medium leading-6 text-gray-900 '>Settings</h3>}
          hideHeader={false} 
        >
          <div className='flex mt-2 space-x-1' >
            <div className="mb-3 xl:w-96">
              <Input label='Up-time Duration' value={settings.upTime} type='number' onChange={(e) => setSettings((prev) => {
                return { ...prev, upTime: Number(e.target.value) }
              })} />
            </div>
            <div className="mb-3 xl:w-96">
              <Input label='Down-time Duration' value={settings.downTime} type='number' onChange={(e) => setSettings((prev) => {
                return { ...prev, downTime: Number(e.target.value) }
              })} />
            </div>
            <div className="mb-3 xl:w-96">
              <Input label='Wheel Size' value={settings.wheelSize}  type='number' onChange={(e) => setSettings((prev) => {
                return { ...prev, wheelSize: Number(e.target.value) }
              })} />
            </div>
          </div>
          <div className='flex space-x-1' >
            <div className="mb-3 xl:w-96">
              <Input label='Spin Button Color' value={settings.color} type='color' onChange={(e) => setSettings((prev) => {
                return { ...prev, color: e.target.value }
              })} />
            </div>
            <div className="mb-3 xl:w-96">
              <Input label='Background Color' value={settings.bgColor} type='color' onChange={(e) => setSettings((prev) => {
                return { ...prev, bgColor: e.target.value }
              })} />
            </div>
            <div className="mb-3 xl:w-96">
              <Input label='Color Contrast' value={settings.colorContrast} type='color' onChange={(e) => setSettings((prev) => {
                return { ...prev, colorContrast: e.target.value }
              })} />
            </div>
          </div>
          <div className='flex space-x-1' >
            <div className="mb-3 xl:w-96">
              <Input label='Font size' value={settings.fontSize} type='number' onChange={(e) => setSettings((prev) => {
                return { ...prev, fontSize: Number(e.target.value) }
              })} />
            </div>
            <div className="mb-3 xl:w-96">
              <Input label='Button Text' value={settings.buttonText} type='text' onChange={(e) => setSettings((prev) => {
                return { ...prev, buttonText: e.target.value }
              })} />
            </div>
            
          </div>
        </Modal>
        
        <section className="text-gray-600 body-font overflow-hidden flex justify-center ">

          <div className='flex justify-center p-6 w-3/6'>
           {
            CurrentSegments.length > 0 && (
                <RouletteWheel
                  fontSize={settings.fontSize}
                  segments={CurrentSegments}
                  winningSegment={winner}
                  onFinished={(winner: string) => handleOnFinish(winner)}
                  primaryColor={settings.color}
                  primaryColoraround={settings.bgColor}
                  contrastColor={settings.colorContrast}
                  buttonText={settings.buttonText}
                  isOnlyOnce={false}
                  size={settings.wheelSize}
                  segmentColors={segments.map((segment) => segment.color)}
                  upDuration={settings.upTime}
                  downDuration={settings.downTime}
                />
            )
           }
          
          </div>
          
        </section>
        <div className='flex space-x-3'>
          <Modal
            isOpen={showWinner}
            onClose={handleCloseModal}
            headerContent={<h3 className=' text-5xl font-medium leading-6 text-gray-900 text-center'>Winner</h3>}
            hideHeader={false}
           >
            <LottieConfetti className=' absolute pointer-events-none' />
            <div className='flex justify-center items-center mt-4'>
              <AvatarMe tw='w-40 h-40' name={winner} color={getColorByName(winner)}/>
              {/* <img className='h-40 w-40 rounded-lg ring-2 ring-white' src='https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' alt='winner'/> */}
            </div>

            <div className="mt-2">
              <p className="text-bold text-center text-gray-500 text-4xl">
                {winner}
              </p>
            </div>
           
            <div className="mt-4 flex justify-center">
              <button
                type="button"
                className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                onClick={handleCloseModal}
              >
                Got it, thanks!
              </button>
            </div>
            </Modal>
          {
            winners.length !== 0 && (
              <div className=" bg-white rounded-lg p-8 flex flex-col md:ml-auto w-full mt-10 md:mt-0 lg:top-0 lg:right-0 lg:w-3/12 lg:max-h-[550px] lg:overflow-y-auto z-10 shadow-md mb-5 relative lg:absolute">
                <div className='flex justify-between mb-2'>
                  <h2 className="text-gray-900 text-lg mb-1 font-medium title-font">{winners.length > 1 ? "Winners" : "Winner"}</h2>
                  <button onClick={() => setWinners([])}>Reset</button>
                </div>
                {
                  winners.map((winner, idx) => (
                    <div key={idx} className='mb-2 text-gray-600  p-2 flex space-x-3 items-center'>
                      <AvatarMe tw='h-10 w-10' name={winner} color={getColorByName(winner)} />
                      <p className=" leading-relaxed text-2xl" >
                        {winner}
                      </p>
                    </div>

                  ))
                }

              </div>
            )
          }
         
        </div>
        <div className='flex justify-between  flex-col lg:flex-row lg:space-x-3 lg:mx-auto lg:w-1/2'>
          {
            segments.length !== 0 && (
              <div className=" bg-white rounded-lg p-8 flex flex-col md:ml-auto w-full mt-10 md:mt-0 relative z-10 shadow-md mb-5">
                <div className='flex justify-between mb-2'>
                  <h2 className="text-gray-900 text-lg mb-1 font-medium title-font">Segments</h2>
                  <div className='flex space-x-2'>
                    <button onClick={() => handleLoadSegments()} className='w-full border-solid border-[1px] px-2 rounded-lg bg-indigo-600 hover:bg-indigo-400 text-white'>Load Segments</button>
                    <button onClick={() => resetSegments()}>Reset</button>
                  </div>
                </div>
                {
                  segments.map((segment, idx) => (
                    <div key={idx} className='mb-2 text-gray-600 border-solid rounded-lg border-[1px] p-2 flex justify-between space-x-3 items-center'>
                      <div className='flex items-center justify-between space-x-3'>
                        {
                          segment.image !== '' ?
                            <img className="inline-block h-10 w-10 rounded-full ring-2 ring-white" src={segment.image} alt="" />
                            :
                            <AvatarMe tw='h-10 w-10' name={segment.name} color={segment.color}  />

                        }
                        <p className="leading-relaxed text-lg" >
                          {segment.name}
                        </p>
                      </div>
                      <div>
                        <ColorPicker selectedColor={segment.color} onChange={(e) => handleChangeColor(segment.name,e.hex)} />
                      </div>
                    </div>
                  ))
                }


              </div>
            )
          }
          <div className=" bg-white rounded-lg p-8 flex flex-col md:ml-auto w-full max-h-56 lg:w-full mt-10 md:mt-0 relative  shadow-md">
            <div className='flex justify-between mb-2'>
              <h2 className="text-gray-900 text-lg mb-1 font-medium title-font">Add Segment</h2>
            </div>
            <div className="relative mb-4  ">
              <form
                onSubmit={handleSubmit}
              >
                <div className="mb-4 w-full flex flex-col">
                  <label
                    className="block text-gray-700 font-medium mb-2"
                    htmlFor="name"
                  >
                    Name
                  </label>
                  <input
                    required
                    className="border border-gray-400 p-2 w-full"
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
               
                <button disabled={winners.length !== 0 ? true : false} className=" disabled:bg-gray-600 disabled:hover:bg-gray-600 bg-indigo-500 text-white py-2 px-4 rounded-full w-full hover:bg-indigo-600">
                  Add
                </button>
              </form>
            </div>
           
          </div>
        </div>


      </div>
    </div>
  )
}

export default Roulette