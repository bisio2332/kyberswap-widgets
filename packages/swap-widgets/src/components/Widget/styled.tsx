import styled from 'styled-components'

interface WrapperProps {
  width?: number
}

export const Wrapper = styled.div<WrapperProps>`
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: 1rem;
  width: 37.5rem;
  background: transparent;
  color: ${({ theme }) => theme.text};
  position: relative;
  height: max-content;
`

export const Title = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 1.25rem;
  font-weight: 500;
  align-items: center;
`

export const InputWrapper = styled.div`
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: 1.8rem 2.4rem;
  background: rgba(39, 38, 44, 1);
`

export const GetInputWrapper = styled.div`
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: 1.8rem 2.4rem;
  background: rgba(22, 21, 27, 1);
  margin-top: 0.4rem;
  p {
    color: rgba(118, 118, 118, 1);
    text-align: left;
    text-transform: uppercase;
    font-size: 1.2rem;
    margin: 0 0 3.2rem 0;
  }
`

export const MaxHalfBtn = styled.button`
  outline: none;
  border: none;
  background: linear-gradient(103.19deg, rgba(179, 126, 77, 0.4) 0%, rgba(87, 87, 87, 0.1) 100%, #575757 100%);
  border-radius: ${({ theme }) => theme.buttonRadius};
  color: ${({ theme }) => theme.subText};
  font-size: 0.8rem;
  padding: 0.4rem;
  line-height: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  margin: 0 0.5rem;
  text-transform: lowercase;
  :hover {
    opacity: 0.8;
  }
`

export const BalanceRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2.5rem;
`

export const BalanceContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

export const SettingBtn = styled.button`
  font-size: 1.1rem;
  outline: none;
  border: none;
  border-radius: ${({ theme }) => theme.buttonRadius};
  padding: 0;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.subText};

  :hover {
    opacity: 0.8;
  }

  svg {
    width: 1.25rem;
    height: 1.25rem;
  }
`

export const SwitchBtn = styled(SettingBtn)`
  width: 40px;
  height: 40px;
  background: ${({ theme }) => theme.secondary};

  :hover {
    opacity: 0.8;
  }
`

export const AccountBalance = styled.div`
  gap: 4px;
  display: flex;
  align-items: center;
  font-size: 1.2rem;
  line-height: 0.8rem;
  color: ${({ theme }) => theme.subText};
  span {
    color: rgba(118, 118, 118, 1);
  }
  p {
    margin: 0;
    color: rgba(192, 192, 192, 1);
  }
`

export const InputRow = styled.div`
  display: flex;
  align-items: center;
  margin-top: 0.75rem;
  gap: 1rem;
`

export const Input = styled.input`
  width: 100%;
  font-size: 2.8rem;
  background: transparent;
  outline: none;
  border: none;
  color: ${({ theme }) => theme.text};

  :disabled {
    cursor: not-allowed;
  }
`

export const SelectTokenBtn = styled.button`
  outline: none;
  border: none;
  background: rgba(17, 16, 21, 1);
  border-radius: 30px;
  padding: 0.8rem 1.6rem;
  font-size: 1.2rem;
  color: rgba(192, 192, 192, 1);
  display: flex;
  align-items: center;
  font-weight: 500;
  cursor: pointer;
  width: 12rem;
  :hover {
    opacity: 0.8;
  }
`

export const TokenBtn = styled.button`
  outline: none;
  border: none;
  background: transparent;
  border-radius: ${({ theme }) => theme.buttonRadius};
  padding: 0.375rem 0 0.375rem 0.5rem;
  font-size: 1.9rem;
  color: rgba(192, 192, 192, 1);
  display: flex;
  align-items: center;
  font-weight: 500;
  width: 9rem;
`

export const MiddleRow = styled.div`
  display: flex;
  margin-top: 1rem;
  align-items: center;
  justify-content: space-between;
`

export const MiddleLeft = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
`

export const ChevronBtn = styled.button`
  display: flex;
  align-items: center;
  background: none;
  border: none;
  font-size: 1.4rem;
  color: rgba(255, 255, 255, 1);
  gap: 0.6rem;
  transition: all 0.3s;
  .pump {
    width: 1.6rem;
    height: 1.6rem;
    transition: all 0.3s;
  }
  span, .chevron {
    transition: all 0.3s;
  }
  &.open {
    .pump,
    span {
      opacity: 0;
    }
    .chevron {  
      transform: rotate(-180deg);
    }
  }
  &.close {
    .pump,
    span {
      opacity: 1;
    }
    .chevron {
      transform: rotate(0);
    }
  }
`

export const CloseButton = styled.button`
  outline: none;
  border: none;
  border-radius: ${({ theme }) => theme.buttonRadius};
  width: 100%;
  margin-top: 0.25rem;
  font-size: 1.4rem;
  font-weight: 400;
  padding: 1.1rem;
  background: linear-gradient(103.19deg, rgba(124, 124, 124, 0.57) 0%, rgba(91, 91, 91, 0.1) 100%);
  color: #fff;
  cursor: pointer;
  box-shadow: ${({ theme }) => theme.boxShadow};

  :disabled {
    color: ${({ theme }) => theme.subText};
    background: ${({ theme }) => theme.interactive};
    cursor: not-allowed;

    :active {
      transform: none;
    }
  }

  :active {
    transform: scale(0.99);
  }
`

export const Button = styled.button`
  outline: none;
  border: none;
  border-radius: ${({ theme }) => theme.buttonRadius};
  width: 100%;
  margin-top: 0.4rem;
  font-size: 1.4rem;
  font-weight: 400;
  padding: 1.1rem;
  background: linear-gradient(103.19deg, rgba(179, 126, 77, 0.4) 0%, rgba(87, 87, 87, 0.1) 100%, #575757 100%);
  color: #fff;
  cursor: pointer;
  box-shadow: ${({ theme }) => theme.boxShadow};

  :disabled {
    color: ${({ theme }) => theme.subText};
    background: ${({ theme }) => theme.interactive};
    cursor: not-allowed;

    :active {
      transform: none;
    }
  }

  :active {
    transform: scale(0.99);
  }
`

export const BorderButton = styled.a`
  outline: none;
  border: 1px solid rgba(192, 192, 192, 1);
  border-radius: ${({ theme }) => theme.buttonRadius};
  width: 100%;
  font-size: 1.4rem;
  font-weight: 400;
  padding: 1.1rem;
  background: transparent;
  color: #fff;
  cursor: pointer;
  max-width: 11rem;
  text-decoration: none;
  display: flex;
  line-height: 1.4rem;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  :disabled {
    color: ${({ theme }) => theme.subText};
    background: ${({ theme }) => theme.interactive};
    cursor: not-allowed;

    :active {
      transform: none;
    }
  }

  :active {
    transform: scale(0.99);
  }
`

export const Dots = styled.span`
  &::after {
    display: inline-block;
    animation: ellipsis 1.25s infinite;
    content: '.';
    width: 1em;
    text-align: left;
  }
  @keyframes ellipsis {
    0% {
      content: '.';
    }
    33% {
      content: '..';
    }
    66% {
      content: '...';
    }
  }
`

export const Rate = styled.div`
  font-size: 1.4rem;
  font-weight: 500;
  color: rgba(192, 192, 192, 1);
`

export const Detail = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  font-size: 12px;
  transition: all 0.3s;
  &.open {
    opacity: 1;
  }
  &.close {
    opacity: 0;
  }
`

export const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
`
export const DetailLabel = styled.div`
  display: flex;
  align-items: center;
  font-size: 1.4rem;
  color: rgba(192, 192, 192, 1);
`
export const DetailRight = styled.div`
  font-size: 1.4rem;
  color: rgba(255, 255, 255, 1);
`

export const DetailTitle = styled.div`
  font-size: 12px;
  font-weight: 500;
  line-height: 16px;
  text-transform: uppercase;
  text-align: left;
`
export const ViewRouteTitle = styled.div`
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
  text-align: right;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
`
export const Divider = styled.div`
  width: 100%;
  height: 1px;
  border-bottom: 1px solid ${({ theme }) => theme.stroke};
`
export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

export const ModalTitle = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  font-size: 1.4rem;
  font-weight: 500;
  color: rgba(239, 239, 239, 1);
`
export const BackIconWrapper = styled.div`
  background: rgba(39, 38, 44, 1);
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  cursor: pointer;

  > svg {
    width: 1rem;
    height: 1rem;
  }

  :hover {
    opacity: 0.8;
  }
`
