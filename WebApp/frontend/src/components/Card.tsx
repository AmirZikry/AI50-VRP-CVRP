import type { ReactNode } from 'react'

const sizes = {
  small: 'max-w-sm',
  medium: 'max-w-md',
  large: 'max-w-2xl',
}


type CardProps = {
  children: ReactNode
  mainText: string
  secondaryText: string
  size?: keyof typeof sizes
}

export const Card = ({ children,mainText,secondaryText, size='medium' }: CardProps) => (
  <div className={`${sizes[size]} rounded-lg border border-gray-300 shadow-sm mt-10 ml-10`}>
    <div className='p-2 text-lg text-left text-black font-bold'>
    {mainText}
    <div className='text-sm font-light'>
        {secondaryText}
    </div>
    </div>
    <div>
    {children}
    </div>
  </div>
)