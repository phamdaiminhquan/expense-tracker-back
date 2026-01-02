// Styles dùng chung cho LoadingScreen và hiệu ứng bay
export const capybaraStyles = `
  :root {
    --loader-bg-1: #6366f1;
    --loader-bg-2: #ec4899;
    --capy-fur: #8D6E63;
    --capy-dark: #5D4037;
    --capy-vest: #1e1e2e;
    --shirt-white: #ffffff;
    --gold: #fbbf24;
    --orange-skin: #FB8C00;
    --leaf-green: #43A047;
  }

  /* --- LOADER WRAPPER --- */
  .loader-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 9999;
    display: flex;
    justify-content: center;
    align-items: center;
    pointer-events: none;
  }

  /* --- CURTAIN ANIMATION --- */
  .curtain {
    position: absolute;
    left: 0;
    width: 100%;
    height: 50.5%;
    background: linear-gradient(135deg, var(--loader-bg-1), #a855f7, var(--loader-bg-2));
    background-size: 100% 200%;
    transition: transform 1.2s cubic-bezier(0.87, 0, 0.13, 1);
    z-index: 10;
  }

  .curtain-top {
    top: 0;
    transform-origin: top;
    background-position: 0% 0%;
  }

  .curtain-bottom {
    bottom: 0;
    transform-origin: bottom;
    background-position: 0% 100%;
  }

  .loader-content {
    z-index: 20;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    transition: opacity 0.6s ease;
  }

  /* --- LOADING SCREEN CAPYBARA STYLES --- */
  .capy-container {
    position: relative;
    width: 160px;
    height: 150px;
    display: flex;
    justify-content: center;
    animation: breathe 4s ease-in-out infinite;
  }

  .loading-text {
    margin-top: 15px;
    color: rgba(255, 255, 255, 0.95);
    font-size: 0.8rem;
    letter-spacing: 3px;
    text-transform: uppercase;
    font-weight: 800;
  }

  .progress-line {
    width: 50px;
    height: 4px;
    background-color: rgba(255, 255, 255, 0.3);
    border-radius: 10px;
    margin-top: 10px;
    position: relative;
    overflow: hidden;
  }

  .progress-line::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: var(--orange-skin);
    animation: line-load 2s infinite ease-in-out;
  }

  /* --- KEYFRAME ANIMATIONS --- */
  @keyframes breathe {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.02); }
  }

  @keyframes line-load {
    0% { transform: translateX(-100%); }
    50% { transform: translateX(0); }
    100% { transform: translateX(100%); }
  }

  /* --- LOADED STATES --- */
  .loader-wrapper.loaded .curtain-top {
    transform: translateY(-100%);
  }

  .loader-wrapper.loaded .curtain-bottom {
    transform: translateY(100%);
  }

  .loader-wrapper.loaded .loader-content {
    opacity: 0;
    transform: scale(0.9);
  }

  /* --- FLY TRANSITION (Bay Hero Effect) --- */
  .fly-transition {
    transition: all 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  }
`
