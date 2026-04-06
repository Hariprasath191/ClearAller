import { Toaster } from 'react-hot-toast'

export function ToastHost() {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        duration: 3500,
        style: {
          background: 'rgba(16, 22, 25, 0.92)',
          color: '#F5FAFC',
          borderRadius: 16,
          padding: '12px 14px',
        },
      }}
    />
  )
}

