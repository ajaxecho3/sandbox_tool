import { Transition, Dialog } from '@headlessui/react'
import React, { ChangeEvent, Fragment, use, useEffect, useState } from 'react'
import LottieRoulette from '../../components/Lottie/LottieRoulette'
import RouletteWheel from '../../components/RouletteWheel'
import SectionHeader from '../../components/SectionHeader'
import Wheel from '../../components/Wheel'
import useDebounce from '../../hooks/useDebounce'
import RandomGeneratorHexColor from '../../utils/ColorGenerator'

type Props = {}

const Roulette = (props: Props) => {

  const [segments, setSegments] = useState<Array<string>>([])
  const [showWinner, setShowWinner] = useState(false)
  const [winner, setWinner] = useState('')
  const [winners, setWinners] = useState<Array<string>>([])
  const debounceVal = useDebounce(winner)
  const [currentName, setCurrentName] = useState<string>('')
  const [CurrentSegments, setCurrentSegments] = useState<Array<string>>([])


  const handleOnFinish = (e: string) => {
   
    setWinner(e)


  }

  useEffect(() => {
    if (debounceVal !== '') {
      console.log('Winner is ', debounceVal)

      setShowWinner(true)
    }
  }, [debounceVal])
  const handleCloseModal = () => {
    setWinners((prev) => {
      let temp = [...prev]
      temp.push(winner)

      return temp

    })
    setShowWinner(false)
  }

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCurrentName(event.target.value)
  }

  const handleAddSegment = () => {

    let temp = [...segments]

    temp.push(currentName)
    setSegments(temp)
  }

  const handleLoadSegments = () => {
    setCurrentSegments(segments)
  }


  return (
    <div className="__container bg-gray-50">
      <div className='w-full'>
        <SectionHeader lineShow={false} title='Roulette' description='' />
        <section className="text-gray-600 body-font overflow-hidden flex justify-center ">

          <div className='flex justify-center p-6 w-3/6'>
            {
              CurrentSegments.length > 0 ?
                <RouletteWheel
                  segments={CurrentSegments}
                  winningSegment={winners}
                  onFinished={(winner: string) => handleOnFinish(winner)}
                  primaryColor="black"
                  primaryColoraround="#ffffffb4"
                  contrastColor="white"
                  buttonText="Spin"
                  isOnlyOnce={false}
                  size={290}
                  segmentColors={CurrentSegments.map((color) => RandomGeneratorHexColor())}
                  upDuration={1000}
                  downDuration={100}
                />
                :
                <LottieRoulette />
            }
            <Transition appear show={showWinner} as={Fragment}>
              <Dialog as="div" className="relative z-10" onClose={handleCloseModal}>
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="fixed inset-0 bg-black bg-opacity-25" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                  <div className="flex min-h-full h-[350px] items-center justify-center p-4 text-center">
                    <Transition.Child
                      as={Fragment}
                      enter="ease-out duration-300"
                      enterFrom="opacity-0 scale-95"
                      enterTo="opacity-100 scale-100"
                      leave="ease-in duration-200"
                      leaveFrom="opacity-100 scale-100"
                      leaveTo="opacity-0 scale-95"
                    >
                      <Dialog.Panel className="w-full max-w-md transform overflow-hidden h-[350px] rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                        <Dialog.Title
                          as="h3"
                          className="text-lg font-medium leading-6 text-gray-900 text-center"
                        >
                          Winner
                        </Dialog.Title>
                        <div className="mt-2">
                          <p className="text-bold text-center text-gray-500 text-lg">
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
                      </Dialog.Panel>
                    </Transition.Child>
                  </div>
                </div>
              </Dialog>
            </Transition>
          </div>
          <div className=' w-1/3'>
            <div className=" bg-white rounded-lg p-8 flex flex-col md:ml-auto w-full mt-10 md:mt-0 relative z-10 shadow-md mb-5">
              <div className='flex justify-between mb-2'>
                <h2 className="text-gray-900 text-lg mb-1 font-medium title-font">{winners.length > 1 ? "Winners" : "Winner"}</h2>
                <button onClick={() => setWinners([])}>Reset</button>
              </div>
              {
                winners.map((winner, idx) => (
                  <p className="leading-relaxed mb-2 text-gray-600 border-solid rounded-lg border-[1px] p-2" key={idx}>{idx + 1}.{winner}</p>
                ))
              }

            </div>
            <div className=" bg-white rounded-lg p-8 flex flex-col md:ml-auto w-full mt-10 md:mt-0 relative z-10 shadow-md mb-5">
              <div className='flex justify-between mb-2'>
                <h2 className="text-gray-900 text-lg mb-1 font-medium title-font">Segments</h2>
                <button onClick={() => setWinners([])}>Reset</button>
              </div>
              {
                segments.map((segment, idx) => (
                  <p className="leading-relaxed mb-2 text-gray-600 border-solid rounded-lg border-[1px] p-2" key={idx}>{idx + 1}.{segment}</p>
                ))
              }
              <div>
                <button onClick={() => handleLoadSegments()} className='w-full border-solid border-[1px] p-2 rounded-lg bg-indigo-600 hover:bg-indigo-400 text-white'>Load Segments</button>
              </div>

            </div>
            <div className=" bg-white rounded-lg p-8 flex flex-col md:ml-auto w-full mt-10 md:mt-0 relative z-10 shadow-md">
              <div className='flex justify-between mb-2'>
                <h2 className="text-gray-900 text-lg mb-1 font-medium title-font">Add Segment</h2>
              </div>
              <div className="relative mb-4">
                <label htmlFor="name" className="leading-7 text-sm text-gray-600">Name</label>
                <input type="text" onChange={handleInputChange} id="name" name="name" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
              </div>
              <div>
                <button onClick={() => handleAddSegment()} onKeyDown={() => handleAddSegment()} className='w-full border-solid border-[1px] p-2 rounded-lg bg-indigo-600 hover:bg-indigo-400 text-white'>Add</button>
              </div>
            </div>
          </div>
        </section>


      </div>
    </div>
  )
}

export default Roulette