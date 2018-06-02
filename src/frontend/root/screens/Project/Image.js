// @flow @jsx h

import { h } from 'preact'

type Props = { alt: string, id: string }

const BASE_URL = 'https://res.cloudinary.com/mariuslundgard/image/upload'

export default function Image (props: Props) {
  const { alt, id } = props
  const srcs = {
    large2x: `${BASE_URL}/c_fill,h_726,w_1290/${id}.jpg`,
    large: `${BASE_URL}/c_fill,h_363,w_645/${id}.jpg`,
    medium2x: `${BASE_URL}/c_fill,h_574,w_1020/${id}.jpg`,
    medium: `${BASE_URL}/c_fill,h_287,w_510/${id}.jpg`,
    small2x: `${BASE_URL}/c_fill,h_422,w_750/${id}.jpg`,
    small: `${BASE_URL}/c_fill,h_211,w_375/${id}.jpg`
  }

  return (
    <div class='ml-project__image'>
      <img
        src={srcs.small}
        alt={alt}
        srcset={[
          `${srcs.large2x} 1290w`,
          `${srcs.large} 645w`,
          `${srcs.medium2x} 1020w`,
          `${srcs.medium} 510w`,
          `${srcs.small2x} 750w`,
          `${srcs.small} 375w`
        ].join(',')}
        sizes={[
          `(min-width: 900px) 645px`,
          `(min-width: 540px) 510px`,
          '100vw'
        ].join(',')}
        width='1290'
        height='574'
      />
    </div>
  )
}
