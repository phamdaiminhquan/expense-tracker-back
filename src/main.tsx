import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from './redux/store.redux'
import AppLoader from './AppLoader'
import './index.css'
import LoadingScreenZen from '@/components/LoadingScreenZen'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <PersistGate loading={<LoadingScreenZen isLoading={true} />} persistor={persistor}>
      <AppLoader />
    </PersistGate>
  </Provider>
)
