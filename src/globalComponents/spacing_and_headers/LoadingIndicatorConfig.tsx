import React, { useContext } from 'react'
import { ImageContext } from '../../globalUtilities/imageContext'
import { TailSpin } from 'react-loader-spinner'

const LoadingIndicatorConfig: React.FC = () => {
  const { imageHeight, imageWidth } = useContext(ImageContext)
  return <div style={{ position: 'absolute', width: imageWidth, height: imageHeight, display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'visible' }}>
        <TailSpin
            height="80"
            width="80"
            color="#153243"
            ariaLabel="tail-spin-loading"
            radius="0.75"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
        />
    </div>
}

export default LoadingIndicatorConfig
