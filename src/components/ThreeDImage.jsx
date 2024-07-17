import React, { useState } from 'react'
import { Spinner } from './Spinner'
import { SpinnerComponent } from './SpinnerComponent'


export const ThreeDImage = ({imgPath="/models/Atril DF 19-06-2023.glb"}) => {
  const [loading, setLoading] = useState(false)

  const onLoadStart = ()=>{
    setLoading(true)
  }
  const onLoaded=()=>{
    setLoading(false)
  }

  return (
    <div className='row m-0 justify-content-center'>
      <x-model class="model" onloadstart={onLoadStart} onloaded={onLoaded} src={imgPath}></x-model>
        {loading ? (
          <div className="d-flex flex-column">
            <SpinnerComponent/> <small>Cargando modelo 3D...</small>
          </div>
          ) :   ""
        }
    </div >
  )
}