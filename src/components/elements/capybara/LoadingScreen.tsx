// LoadingScreen mới cho FinCap
// Đã chuyển toàn bộ logic và CSS từ đoạn code Quan cung cấp
import React from 'react'

const zenLoaderStyles = `
  :root {
      --loader-bg-1: #6366f1; --loader-bg-2: #ec4899;
      --capy-fur: #8D6E63; --capy-dark: #5D4037; --capy-vest: #1e1e2e;
      --shirt-white: #ffffff; --gold: #fbbf24;      
      --orange-skin: #FB8C00; --leaf-green: #43A047;
  }
  .loader-wrapper { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 9999; display: flex; justify-content: center; align-items: center; pointer-events: none; }
  .curtain { position: absolute; left: 0; width: 100%; height: 50.5%; background: linear-gradient(135deg, var(--loader-bg-1), #a855f7, var(--loader-bg-2)); background-size: 100% 200%; transition: transform 1.2s cubic-bezier(0.87, 0, 0.13, 1); z-index: 10; }
  .curtain-top { top: 0; transform-origin: top; background-position: 0% 0%; }
  .curtain-bottom { bottom: 0; transform-origin: bottom; background-position: 0% 100%; }
  .loader-content { z-index: 20; position: relative; display: flex; flex-direction: column; align-items: center; transition: opacity 0.6s ease; }
  .capy-container { position: relative; width: 160px; height: 150px; display: flex; justify-content: center; animation: breathe 4s ease-in-out infinite; }
  .capy-body { position: absolute; bottom: 0; width: 110px; height: 75px; background-color: var(--capy-fur); border-radius: 45px 45px 25px 25px; box-shadow: 0 10px 30px 8px rgba(0,0,0,0.25); z-index: 1; overflow: hidden; }
  .white-shirt-layer { position: absolute; top: 0; left: 50%; transform: translateX(-50%); width: 60px; height: 60px; background: var(--shirt-white); clip-path: polygon(0 0, 100% 0, 50% 80%); z-index: 1; }
  .capy-vest { position: absolute; bottom: 0; left: 0; width: 100%; height: 100%; background-color: #14213d; clip-path: polygon(0% 0%, 25% 0%, 50% 45%, 75% 0%, 100% 0%, 100% 100%, 0% 100%); z-index: 2; }
  .capy-vest::after { content: ''; position: absolute; left: 50%; bottom: 12px; transform: translateX(-50%); width: 5px; height: 5px; border-radius: 50%; background: var(--gold); box-shadow: 0 -10px 0 var(--gold); }
  .capy-head { position: absolute; top: 20px; width: 90px; height: 80px; background-color: var(--capy-fur); border-radius: 45% 45% 40% 40%; box-shadow: 0 2px 10px rgba(0,0,0,0.1); z-index: 5; }
  .capy-ear { position: absolute; top: 20px; width: 16px; height: 16px; background-color: var(--capy-dark); border-radius: 50%; z-index: 0; }
  .ear-left { left: 35px; } .ear-right { right: 35px; }
  .capy-face { position: relative; width: 100%; height: 100%; }
  .capy-eye { position: absolute; top: 24px; width: 10px; height: 10px; background-color: #000; border-radius: 50%; animation: blink 4s infinite; border: 2px solid #fff; }
  .eye-left { left: 20px; } .eye-right { right: 20px; }
  .capy-nose { position: absolute; bottom: 10px; left: 50%; transform: translateX(-50%); width: 40px; height: 46px; background-color: #5c442c; border-radius: 50% 50% 35% 35%; }
  .capy-mouth { position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%); width: 2px; height: 10px; background-color: #000000ff; }
  .orange-fruit { position: absolute; top: -6px; left: 50%; transform: translateX(-50%); width: 32px; height: 28px; background: radial-gradient(circle at 30% 30%, #FFB74D, var(--orange-skin)); border-radius: 50%; box-shadow: 0 2px 5px rgba(0,0,0,0.2); z-index: 10; animation: balance 3s ease-in-out infinite; }
  .orange-fruit::before { content: ''; position: absolute; top: -4px; left: 50%; width: 12px; height: 6px; background-color: var(--leaf-green); border-radius: 10px 0px 10px 0px; transform: rotate(-10deg); }
  .orange-fruit::after { content: ''; position: absolute; top: 0; left: 50%; width: 2px; height: 3px; background-color: #3e2723; transform: translateX(-50%); }
  .loading-text { margin-top: 15px; color: rgba(255, 255, 255, 0.95); font-size: 0.8rem; letter-spacing: 3px; text-transform: uppercase; font-weight: 800; }
  .progress-line { width: 50px; height: 4px; background-color: rgba(255, 255, 255, 0.3); border-radius: 10px; margin-top: 10px; position: relative; overflow: hidden; }
  .progress-line::after { content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-color: var(--orange-skin); animation: line-load 2s infinite ease-in-out; }
  @keyframes balance { 0%, 100% { transform: translate(-50%, 0) rotate(0deg); } 25% { transform: translate(-50%, 1px) rotate(-3deg); } 75% { transform: translate(-50%, 1px) rotate(3deg); } }
  @keyframes breathe { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.02); } } 
  @keyframes blink { 0%, 90%, 100% { transform: scaleY(1); } 95% { transform: scaleY(0.1); } }
  @keyframes line-load { 0% { transform: translateX(-100%); } 50% { transform: translateX(0); } 100% { transform: translateX(100%); } }
  .loader-wrapper.loaded .curtain-top { transform: translateY(-100%); }
  .loader-wrapper.loaded .curtain-bottom { transform: translateY(100%); }
  .loader-wrapper.loaded .loader-content { opacity: 0; transform: scale(0.9); }
`

interface LoadingScreenProps {
  isLoading: boolean
}

export function LoadingScreen({ isLoading }: LoadingScreenProps) {
  return (
    <>
      <style>{zenLoaderStyles}</style>
      <div className={`loader-wrapper ${!isLoading ? 'loaded' : ''}`}>
        <div className="curtain curtain-top"></div>
        <div className="curtain curtain-bottom"></div>
        <div className="loader-content">
          <div className="capy-container">
            <div className="orange-fruit"></div>
            <div className="capy-ear ear-left"></div>
            <div className="capy-ear ear-right"></div>
            <div className="capy-body">
              <div className="white-shirt-layer"></div>
              <div className="capy-vest"></div>
            </div>
            <div className="capy-head">
              <div className="capy-face">
                <div className="capy-eye eye-left"></div>
                <div className="capy-eye eye-right"></div>
                <div className="capy-nose"></div>
                <div className="capy-mouth"></div>
              </div>
            </div>
          </div>
          <div className="loading-text">Capybara Finance</div>
          <div className="progress-line"></div>
        </div>
      </div>
    </>
  )
}

