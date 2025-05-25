import styled from 'styled-components';

export const ButtonWrapper = styled.div`
 .button {
    width: 100%;
    padding-top: 20px;
  }

  .btn {
    display: block;
    padding: 0.8em 1.5em;
    background: transparent;
    outline: none;
    border: 0;
    color: #5b7c99;
    letter-spacing: 0.2em;
    font-family: "GenWanMin2 TW", "STKaiti", "楷体", serif;
    font-size: 18px;
    font-weight: 500;
    cursor: pointer;
    z-index: 1;
    scale: 1.05;
    transition: all 0.4s ease;
  }

  .cube {
    position: relative;
    transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  }

  .cube:hover {
    transform: translate(-4px, -4px) rotate(-1deg);
  }

  .cube .bg-top {
    position: absolute;
    height: 14px;
    background: linear-gradient(45deg, #b8d4e3, #a3c5d9);
    bottom: 100%;
    left: 7px;
    right: -7px;
    transform: skew(-45deg, 0);
    transition: all 0.5s ease;
    box-shadow: inset 0 -2px 4px rgba(91, 124, 153, 0.2);
  }

  .cube .bg-top .bg-inner {
    background: #f7fbfd;
    position: absolute;
    left: 3px;
    right: 3px;
    top: 3px;
    bottom: 3px;
    border: 1px solid #c5d9e8;
  }

  .cube .bg {
    position: absolute;
    left: 0;
    bottom: 0;
    top: 0;
    right: 0;
    background: linear-gradient(135deg, #c4dbe8, #b8d4e3);
    transition: all 0.5s ease;
    box-shadow: inset 0 0 10px rgba(91, 124, 153, 0.1);
  }

  .cube .bg-right {
    position: absolute;
    background: linear-gradient(90deg, #a3c5d9, #8bb5d1);
    top: -7px;
    bottom: 7px;
    width: 14px;
    left: 100%;
    transform: skew(0, -45deg);
    transition: all 0.5s ease;
    box-shadow: inset -2px 0 4px rgba(91, 124, 153, 0.2);
  }

  .cube .bg-right .bg-inner {
    background: #d5e8f0;
    position: absolute;
    left: 3px;
    right: 3px;
    top: 3px;
    bottom: 3px;
    border: 1px solid #c5d9e8;
  }

  .cube .bg-inner {
    background: linear-gradient(135deg, #f9fcfd 0%, #f7fbfd 50%, #f0f8fc 100%);
    position: absolute;
    left: 3px;
    right: 3px;
    top: 3px;
    bottom: 3px;
    border: 2px solid #c5d9e8;
    transition: all 0.4s ease;
    position: relative;
  }

  .cube .bg-inner::before {
    content: '';
    position: absolute;
    inset: 4px;
    border: 1px solid #d5e8f0;
    background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.4), transparent);
  }

  .cube .text {
    position: relative;
    transition: all 0.4s ease;
    text-shadow: 0 1px 2px rgba(91, 124, 153, 0.3);
  }

  .cube:hover .text {
    color: #3c5b7b;
    transform: translateY(-2px);
    text-shadow: 0 3px 6px rgba(91, 124, 153, 0.4);
  }

  .cube:active {
    animation: ink-splash 0.3s ease-out;
  }

  @keyframes ink-splash {
    0% { transform: scale(1) rotate(0deg); }
    50% { transform: scale(0.95) rotate(-0.5deg); }
    100% { transform: scale(1) rotate(0deg); }
  }
`;