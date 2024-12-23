import { ReactNode, StrictMode, useState } from 'react'
import styled, { ThemeProvider } from 'styled-components'
import { defaultTheme, Theme } from '../../theme'
import DropdownIcon from '../../assets/dropdown.svg'
import AlertIcon from '../../assets/alert.svg'
import questionImg from '../../assets/question.svg?url'

import useTheme from '../../hooks/useTheme'

import {
  AccountBalance,
  BalanceRow,
  Input,
  InputRow,
  InputWrapper,
  MaxHalfBtn,
  SelectTokenBtn,
  SettingBtn,
  Wrapper,
  Button,
  Dots,
  Detail,
  DetailRow,
  DetailLabel,
  DetailRight,
  ModalHeader,
  ModalTitle,
  MiddleLeft,
  Rate,
  TokenBtn,
  GetInputWrapper,
  BalanceContent,
  CloseButton,
  BackIconWrapper,
  ChevronBtn,
} from './styled'

import { BigNumber } from 'ethers'
import { NATIVE_TOKEN, NATIVE_TOKEN_ADDRESS, SUPPORTED_NETWORKS, TokenInfo, ZIndex } from '../../constants'
import { useActiveWeb3, Web3Provider } from '../../hooks/useWeb3Provider'
import useSwap from '../../hooks/useSwap'
import useTokenBalances from '../../hooks/useTokenBalances'
import { formatUnits } from 'ethers/lib/utils'
import useApproval, { APPROVAL_STATE } from '../../hooks/useApproval'
import { TokenListProvider, useTokens } from '../../hooks/useTokens'
import Confirmation from '../Confirmation'
import InfoHelper from '../InfoHelper'
import TradeRouting from '../TradeRouting'
import SelectCurrency from '../SelectCurrency.tsx'
import DexesSetting from '../DexesSetting.tsx'
import ImportModal from '../ImportModal.tsx'
import Settings from '../Settings.tsx'
import BackIcon from '../../assets/back.svg'

export const DialogWrapper = styled.div`
  z-index: ${ZIndex.DIALOG};

  @supports (overflow: clip) {
    overflow: clip;
  }

  &.open:has(.fixed) {
    &:before {
      content: '';
      position: fixed;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      background: rgba(22, 21, 27, 0.7);
    }
    .absolute {
      opacity: 1;
    }
    .fixed {
      opacity: 1;
    }
  }

  &.close {
    position: absolute;
    opacity: 0;
  }
`

export const DialogContainer = styled.div`
  background-color: rgba(17, 16, 21, 1);
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: 1.7rem;
  z-index: ${ZIndex.DIALOG};
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-height: 44rem;

  @supports (overflow: clip) {
    overflow: clip;
  }

  &.absolute {
    position: absolute;
    left: 3rem;
    right: 3rem;
    top: 12%;
  }

  &.fixed {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    max-width: 400px;
    width: 100%;
  }
`

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const ContentWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow-y: scroll;

  ::-webkit-scrollbar {
    display: none;
  }
`

const SelectTokenText = styled.span`
  font-size: 16px;
  width: max-content;
`

const PoweredBy = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: ${({ theme }) => theme.subText};
  font-size: 12px;
  margin-top: 1rem;
`

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  a {
    color: ${({ theme }) => theme.subText};
    font-size: 12px;
    margin-top: 1rem;
    text-decoration: none;

    :hover {
      color: ${({ theme }) => theme.text};
    }
  }
`

enum ModalType {
  SETTING = 'setting',
  CURRENCY_IN = 'currency_in',
  CURRENCY_OUT = 'currency_out',
  REVIEW = 'review',
  DEXES_SETTING = 'dexes_setting',
  IMPORT_TOKEN = 'import_token',
  TRADE_ROUTE = 'trade_route',
}

interface FeeSetting {
  chargeFeeBy: 'currency_in' | 'currency_out'
  feeReceiver: string
  // BPS: 10_000
  // 10 means 0.1%
  feeAmount: number
  isInBps: boolean
}

export interface WidgetProps {
  client: string
  enableRoute?: boolean
  provider?: any
  tokenList?: TokenInfo[]
  theme?: Theme
  defaultTokenIn?: string
  defaultTokenOut?: string
  defaultSlippage?: number
  defaultAmountIn?: string
  feeSetting?: FeeSetting
  onTxSubmit?: (txHash: string, data: any) => void
  enableDexes?: string
  title?: string | ReactNode
  onSourceTokenChange?: (token: TokenInfo) => void
  onAmountInChange?: (amount: string) => void
  onDestinationTokenChange?: (token: TokenInfo) => void
  onError?: (e: any) => void
  showRate?: boolean
  showDetail?: boolean
  width?: number
}

const Widget = ({
  defaultTokenIn,
  defaultTokenOut,
  defaultSlippage,
  defaultAmountIn,
  feeSetting,
  client,
  onTxSubmit,
  enableRoute,
  enableDexes,
  title,
  onSourceTokenChange,
  onAmountInChange,
  onDestinationTokenChange,
  onError,
  showRate,
  showDetail,
  width,
}: {
  defaultTokenIn?: string
  defaultTokenOut?: string
  defaultAmountIn?: string
  feeSetting?: FeeSetting
  client: string
  onTxSubmit?: (txHash: string, data: any) => void
  enableRoute: boolean
  enableDexes?: string
  title?: string | ReactNode
  defaultSlippage?: number
  onSourceTokenChange?: (token: any) => void
  onAmountInChange?: (value: string) => void
  onDestinationTokenChange?: (token: any) => void
  onError?: (e: any) => void
  showRate?: boolean
  showDetail?: boolean
  width?: number
}) => {
  const [showModal, setShowModal] = useState<ModalType | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const toggleClass = () => {
    setIsOpen(prevState => !prevState)
  }
  const { chainId } = useActiveWeb3()
  const isUnsupported = !SUPPORTED_NETWORKS.includes(chainId.toString())

  const tokens = useTokens()
  const {
    loading,
    error,
    tokenIn,
    tokenOut,
    setTokenIn,
    setTokenOut,
    inputAmout,
    setInputAmount,
    trade: routeTrade,
    slippage,
    setSlippage,
    getRate,
    deadline,
    setDeadline,
    allDexes,
    excludedDexes,
    setExcludedDexes,
    setTrade,
    isWrap,
    isUnwrap,
  } = useSwap({
    defaultTokenIn,
    defaultTokenOut,
    defaultAmountIn,
    defaultSlippage,
    feeSetting,
    enableDexes,
    client,
  })

  const trade = isUnsupported ? null : routeTrade

  const [inverseRate, setInverseRate] = useState(false)

  const { balances, refetch } = useTokenBalances(tokens.map(item => item.address))

  const tokenInInfo =
    tokenIn === NATIVE_TOKEN_ADDRESS
      ? NATIVE_TOKEN[chainId]
      : tokens.find(item => item.address.toLowerCase() === tokenIn.toLowerCase())

  const tokenOutInfo =
    tokenOut === NATIVE_TOKEN_ADDRESS
      ? NATIVE_TOKEN[chainId]
      : tokens.find(item => item.address.toLowerCase() === tokenOut.toLowerCase())

  const amountOut =
    isWrap || isUnwrap
      ? inputAmout
      : trade?.routeSummary?.amountOut
      ? formatUnits(trade.routeSummary.amountOut, tokenOutInfo?.decimals).toString()
      : ''

  let minAmountOut = ''

  if (amountOut) {
    minAmountOut =
      isWrap || isUnwrap
        ? parseFloat((+amountOut).toPrecision(8)).toString()
        : (Number(amountOut) * (1 - slippage / 10_000)).toPrecision(8).toString()
  }

  const tokenInBalance = balances[tokenIn] || BigNumber.from(0)
  const tokenOutBalance = balances[tokenOut] || BigNumber.from(0)

  const tokenInWithUnit = formatUnits(tokenInBalance, tokenInInfo?.decimals || 18)
  const tokenOutWithUnit = formatUnits(tokenOutBalance, tokenOutInfo?.decimals || 18)

  const rate =
    isWrap || isUnwrap
      ? 1
      : trade?.routeSummary?.amountIn &&
        trade?.routeSummary?.amountOut &&
        parseFloat(formatUnits(trade.routeSummary.amountOut, tokenOutInfo?.decimals || 18)) / parseFloat(inputAmout)

  const formattedTokenInBalance = parseFloat(parseFloat(tokenInWithUnit).toPrecision(10))

  const formattedTokenOutBalance = parseFloat(parseFloat(tokenOutWithUnit).toPrecision(10))

  const theme = useTheme()

  const priceImpact = !trade?.routeSummary.amountOutUsd
    ? -1
    : ((+trade.routeSummary.amountInUsd - +trade.routeSummary.amountOutUsd) * 100) / +trade.routeSummary.amountInUsd

  const modalTitle = (() => {
    switch (showModal) {
      case ModalType.SETTING:
        return 'Swap Settings'
      case ModalType.CURRENCY_IN:
        return 'Select a token'
      case ModalType.CURRENCY_OUT:
        return 'Select a token'
      case ModalType.DEXES_SETTING:
        return 'Liquidity Sources'
      case ModalType.IMPORT_TOKEN:
        return 'Import Token'
      case ModalType.TRADE_ROUTE:
        return 'Your Trade Route'

      default:
        return null
    }
  })()

  const [tokenToImport, setTokenToImport] = useState<TokenInfo | null>(null)
  const [importType, setImportType] = useState<'in' | 'out'>('in')

  const modalContent = (() => {
    switch (showModal) {
      case ModalType.SETTING:
        return (
          <Settings
            slippage={slippage}
            setSlippage={setSlippage}
            deadline={deadline}
            setDeadline={setDeadline}
            allDexes={allDexes}
            excludedDexes={excludedDexes}
            onShowSource={() => setShowModal(ModalType.DEXES_SETTING)}
          />
        )
      case ModalType.TRADE_ROUTE:
        if (enableRoute) return <TradeRouting trade={trade} currencyIn={tokenInInfo} currencyOut={tokenOutInfo} />
        return null
      case ModalType.CURRENCY_IN:
        return (
          <SelectCurrency
            selectedToken={tokenIn}
            filterTokens={[tokenOut]}
            onChange={token => {
              setTokenIn(token.address)
              setShowModal(null)
              onSourceTokenChange?.(token)
            }}
            onImport={(token: TokenInfo) => {
              setTokenToImport(token)
              setShowModal(ModalType.IMPORT_TOKEN)
              setImportType('in')
            }}
          />
        )
      case ModalType.CURRENCY_OUT:
        return (
          <SelectCurrency
            selectedToken={tokenOut}
            onChange={token => {
              setTokenOut(token.address)
              setShowModal(null)
              onDestinationTokenChange?.(token)
            }}
            onImport={(token: TokenInfo) => {
              setTokenToImport(token)
              setShowModal(ModalType.IMPORT_TOKEN)
              setImportType('out')
            }}
          />
        )
      case ModalType.REVIEW:
        if (rate && tokenInInfo && trade && tokenOutInfo)
          return (
            <Confirmation
              trade={trade}
              tokenInInfo={tokenInInfo}
              amountIn={inputAmout}
              tokenOutInfo={tokenOutInfo}
              amountOut={amountOut}
              rate={rate}
              priceImpact={priceImpact}
              slippage={slippage}
              deadline={deadline}
              client={client}
              onClose={() => {
                setShowModal(null)
                refetch()
              }}
              onTxSubmit={onTxSubmit}
              onError={onError}
              showDetail={showDetail}
            />
          )
        return null
      case ModalType.DEXES_SETTING:
        return <DexesSetting allDexes={allDexes} excludedDexes={excludedDexes} setExcludedDexes={setExcludedDexes} />

      case ModalType.IMPORT_TOKEN:
        if (tokenToImport)
          return (
            <ImportModal
              token={tokenToImport}
              onImport={() => {
                if (importType === 'in') {
                  setTokenIn(tokenToImport.address)
                  setShowModal(null)
                } else {
                  setTokenOut(tokenToImport.address)
                  setShowModal(null)
                }
              }}
            />
          )
        return null
      default:
        return null
    }
  })()

  const {
    loading: checkingAllowance,
    approve,
    approvalState,
  } = useApproval(trade?.routeSummary?.amountIn || '0', tokenIn, trade?.routerAddress || '')

  return (
    <Wrapper width={width}>
      <DialogWrapper className={showModal ? 'open' : 'close'}>
        <DialogContainer className={showModal ? (showModal === ModalType.SETTING ? 'absolute' : 'fixed') : ''}>
          {showModal !== ModalType.REVIEW && (
            <ModalHeader>
              <ModalTitle>{modalTitle}</ModalTitle>
              {showModal !== ModalType.SETTING ? (
                <BackIconWrapper onClick={() => setShowModal(null)}>
                  <BackIcon />
                </BackIconWrapper>
              ) : (
                ''
              )}
            </ModalHeader>
          )}
          <ContentWrapper>{modalContent}</ContentWrapper>
          {showModal === ModalType.SETTING ? (
            <CloseButton onClick={() => setShowModal(null)}>Confrim & close</CloseButton>
          ) : (
            ''
          )}
        </DialogContainer>
      </DialogWrapper>
      <InputWrapper>
        <BalanceRow>
          <BalanceContent>
            <AccountBalance>
              <span>BALANCE</span>
              <p>{formattedTokenInBalance}</p>
            </AccountBalance>

            <MaxHalfBtn onClick={() => setInputAmount(tokenInWithUnit)}>Max</MaxHalfBtn>
            {/* <MaxHalfBtn>Half</MaxHalfBtn> */}
          </BalanceContent>
          <SettingBtn onClick={() => setShowModal(ModalType.SETTING)}>
            <span>⚙️</span>
          </SettingBtn>
        </BalanceRow>

        <InputRow>
          <Input
            value={inputAmout}
            onChange={e => {
              const value = e.target.value.replace(/,/g, '.')
              const inputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d*$`) // match escaped "." characters via in a non-capturing group
              if (value === '' || inputRegex.test(value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))) {
                setInputAmount(value)
              }
              onAmountInChange?.(value)
            }}
            inputMode="decimal"
            autoComplete="off"
            autoCorrect="off"
            type="text"
            pattern="^[0-9]*[.,]?[0-9]*$"
            placeholder="0.0"
            minLength={1}
            maxLength={79}
            spellCheck="false"
          />

          <SelectTokenBtn onClick={() => !isUnsupported && setShowModal(ModalType.CURRENCY_IN)}>
            {tokenInInfo ? (
              <>
                <img
                  width="20"
                  height="20"
                  alt="tokenIn"
                  src={tokenInInfo?.logoURI}
                  style={{ borderRadius: '50%' }}
                  onError={({ currentTarget }) => {
                    currentTarget.onerror = null // prevents looping
                    currentTarget.src = questionImg
                  }}
                />
                <div style={{ marginLeft: '0.8rem', fontSize: '1.2rem', color: 'rgba(192, 192, 192, 1)' }}>
                  {tokenInInfo?.symbol}
                </div>
              </>
            ) : (
              <SelectTokenText>Select a token</SelectTokenText>
            )}
            <DropdownIcon style={{ marginLeft: '0.8rem', width: '0.4rem', height: '0.8rem', flexShrink: '0' }} />
          </SelectTokenBtn>
        </InputRow>
      </InputWrapper>

      {/*{showRate && (
        <MiddleRow>


          {<SwitchBtn
            onClick={() => {
              setTrade(null)
              setTokenIn(tokenOut)
              setTokenOut(tokenIn)
            }}
          >
            <SwitchIcon />
          </SwitchBtn>}
        </MiddleRow>
      )}*/}

      <GetInputWrapper>
        <p>you get</p>
        <InputRow>
          <Input disabled value={isWrap || isUnwrap ? +amountOut : (+amountOut).toPrecision(8)} />
          <TokenBtn>
            {tokenOutInfo ? (
              <>
                <img
                  width="20"
                  height="20"
                  alt="tokenOut"
                  src={tokenOutInfo?.logoURI}
                  style={{ borderRadius: '50%' }}
                  onError={({ currentTarget }) => {
                    currentTarget.onerror = null // prevents looping
                    currentTarget.src = questionImg
                  }}
                />
                <div style={{ marginLeft: '0.8rem', fontSize: '1.8rem', color: 'rgba(192, 192, 192, 1)' }}>
                  {tokenOutInfo?.symbol}
                </div>
              </>
            ) : (
              <SelectTokenText>Select a token</SelectTokenText>
            )}
          </TokenBtn>
        </InputRow>
      </GetInputWrapper>
      <Button
        style={{ marginBottom: '1.6rem' }}
        disabled={!!error || loading || checkingAllowance || approvalState === APPROVAL_STATE.PENDING || isUnsupported}
        onClick={async () => {
          if (approvalState === APPROVAL_STATE.NOT_APPROVED && !isWrap && !isUnwrap) {
            approve()
          } else {
            setShowModal(ModalType.REVIEW)
          }
        }}
      >
        {isUnsupported ? (
          <PoweredBy style={{ fontSize: '16px', marginTop: '0' }}>
            <AlertIcon style={{ width: '24px', height: '24px' }} />
            Unsupported network
          </PoweredBy>
        ) : loading ? (
          <Dots>Calculate best route</Dots>
        ) : error ? (
          error
        ) : isWrap ? (
          'Wrap'
        ) : isUnwrap ? (
          'Unwrap'
        ) : checkingAllowance ? (
          <Dots>Checking Allowance</Dots>
        ) : approvalState === APPROVAL_STATE.NOT_APPROVED ? (
          'Approve'
        ) : approvalState === APPROVAL_STATE.PENDING ? (
          <Dots>Approving</Dots>
        ) : (
          'Swap'
        )}
      </Button>
      {/* <Slippage slippage={slippage} setSlippage={setSlippage} />*/}
      {
        <MiddleLeft>
          {/*<RefreshBtn
            loading={loading}
            onRefresh={() => {
              getRate()
            }}
            trade={trade}
          />*/}
          <Rate>
            {(() => {
              if (!rate) return '--'
              return !inverseRate
                ? `1 ${tokenInInfo?.symbol} = ${+rate.toPrecision(10)} ${tokenOutInfo?.symbol}`
                : `1 ${tokenOutInfo?.symbol} = ${+(1 / rate).toPrecision(10)} ${tokenInInfo?.symbol}`
            })()}
          </Rate>
          <ChevronBtn onClick={toggleClass} className={isOpen ? 'open' : 'close'}>
            <svg className={'pump'} viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M13.578 4.32L13.5873 4.30867L10.9207 2.14867L10.0807 3.18467L11.4587 4.30067C11.1168 4.5084 10.8454 4.81417 10.6796 5.17822C10.5139 5.54228 10.4615 5.94778 10.5293 6.342C10.6293 6.94133 11.042 7.45933 11.576 7.74933C12.1727 8.074 12.696 8.044 13.1613 7.87867L13.1513 12C13.1521 12.1104 13.1254 12.2192 13.0735 12.3167C13.0217 12.4142 12.9464 12.4972 12.8544 12.5582C12.7624 12.6192 12.6566 12.6563 12.5467 12.6662C12.4367 12.676 12.326 12.6583 12.2247 12.6147C12.1453 12.5806 12.0733 12.5315 12.0127 12.47C11.8884 12.3451 11.8187 12.1761 11.8187 12L11.834 10.6667C11.8347 10.4043 11.7833 10.1443 11.683 9.90184C11.5826 9.65937 11.4352 9.43919 11.2493 9.254C11.0636 9.06787 10.843 8.92019 10.6001 8.81941C10.3573 8.71863 10.0969 8.66672 9.83398 8.66667H9.16732V3.33333C9.16732 2.97971 9.02684 2.64057 8.77679 2.39052C8.52674 2.14048 8.18761 2 7.83398 2H3.16732C2.8137 2 2.47456 2.14048 2.22451 2.39052C1.97446 2.64057 1.83398 2.97971 1.83398 3.33333V12.6667C1.83398 13.0203 1.97446 13.3594 2.22451 13.6095C2.47456 13.8595 2.8137 14 3.16732 14H7.83398C8.18761 14 8.52674 13.8595 8.77679 13.6095C9.02684 13.3594 9.16732 13.0203 9.16732 12.6667V10H9.83398C9.9251 10 10.012 10.0173 10.0947 10.052C10.2532 10.1216 10.3797 10.2485 10.4487 10.4073C10.4831 10.4894 10.5008 10.5776 10.5007 10.6667L10.4847 12C10.4847 12.2707 10.5373 12.5327 10.642 12.7787C10.7427 13.018 10.8873 13.232 11.0693 13.4127C11.2544 13.5997 11.4749 13.748 11.7179 13.8488C11.9609 13.9496 12.2215 14.001 12.4847 14C12.7562 14 13.0158 13.9476 13.2633 13.8427C13.502 13.7427 13.7167 13.598 13.8973 13.4153C14.084 13.2301 14.2321 13.0095 14.3329 12.7666C14.4338 12.5236 14.4853 12.263 14.4847 12L14.5007 6C14.4998 5.66512 14.4149 5.3358 14.2537 5.04227C14.0925 4.74874 13.8601 4.50039 13.578 4.32ZM7.83398 5.33333H3.16732V3.33333H7.83398V5.33333ZM12.5007 6.66667C12.3238 6.66667 12.1543 6.59643 12.0292 6.4714C11.9042 6.34638 11.834 6.17681 11.834 6C11.834 5.82319 11.9042 5.65362 12.0292 5.5286C12.1543 5.40357 12.3238 5.33333 12.5007 5.33333C12.6775 5.33333 12.847 5.40357 12.9721 5.5286C13.0971 5.65362 13.1673 5.82319 13.1673 6C13.1673 6.17681 13.0971 6.34638 12.9721 6.4714C12.847 6.59643 12.6775 6.66667 12.5007 6.66667Z"
                fill="#EFEFEF"
              />
            </svg>

            <span>{trade?.routeSummary?.gasUsd ? '$' + (+trade.routeSummary.gasUsd).toPrecision(4) : '--'}</span>

            <svg
              className={'chevron'}
              width="11"
              height="6"
              viewBox="0 0 11 6"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M1.5 1L5.5 5L9.5 1" stroke="#C0C0C0" stroke-linecap="square" stroke-linejoin="round" />
              <path
                d="M1.5 1L5.5 5L9.5 1"
                stroke="black"
                stroke-opacity="0.2"
                stroke-linecap="square"
                stroke-linejoin="round"
              />
            </svg>
          </ChevronBtn>

          {/*{!!rate && (
            <SettingBtn onClick={() => setInverseRate(prev => !prev)}>
              <SwapIcon />
            </SettingBtn>
          )}*/}
        </MiddleLeft>
      }
      {showDetail && (
        <Detail className={isOpen ? 'open' : 'close'}>
          {/*<Row>
            <DetailTitle>More information</DetailTitle>
            {enableRoute && !(isWrap || isUnwrap) && (
              <ViewRouteTitle onClick={() => setShowModal(ModalType.TRADE_ROUTE)}>
                View Routes <Expand style={{ width: 12, height: 12 }} />
              </ViewRouteTitle>
            )}
          </Row>*/}
          <DetailRow>
            <DetailLabel>
              Minimum Received
              <InfoHelper text={`Minimum amount you will receive or your transaction will revert`} />
            </DetailLabel>
            <DetailRight>{minAmountOut ? `${minAmountOut} ${tokenOutInfo?.symbol}` : '--'}</DetailRight>
          </DetailRow>

          <DetailRow>
            <DetailLabel>
              Gas Fee <InfoHelper text="Estimated network fee for your transaction" />
            </DetailLabel>
            <DetailRight>
              {trade?.routeSummary?.gasUsd ? '$' + (+trade.routeSummary.gasUsd).toPrecision(4) : '--'}
            </DetailRight>
          </DetailRow>

          <DetailRow>
            <DetailLabel>
              Price Impact
              <InfoHelper text="Estimated change in price due to the size of your transaction" />
            </DetailLabel>
            <DetailRight
              style={{
                color: priceImpact > 15 ? theme.error : priceImpact > 5 ? theme.warning : theme.text,
              }}
            >
              {priceImpact === -1 ? '--' : priceImpact > 0.01 ? priceImpact.toFixed(3) + '%' : '< 0.01%'}
            </DetailRight>
          </DetailRow>
        </Detail>
      )}
    </Wrapper>
  )
}

export default function SwapWidget({
  provider,
  tokenList,
  theme,
  defaultTokenIn,
  defaultTokenOut,
  defaultAmountIn,
  defaultSlippage,
  feeSetting,
  client,
  onTxSubmit,
  enableRoute = true,
  enableDexes,
  title,
  onSourceTokenChange,
  onAmountInChange,
  onDestinationTokenChange,
  onError,
  showRate = true,
  showDetail = true,
  width,
}: WidgetProps) {
  return (
    <StrictMode>
      <ThemeProvider theme={theme || defaultTheme}>
        <Web3Provider provider={provider}>
          <TokenListProvider tokenList={tokenList}>
            <Widget
              defaultTokenIn={defaultTokenIn}
              defaultAmountIn={defaultAmountIn}
              defaultTokenOut={defaultTokenOut}
              defaultSlippage={defaultSlippage}
              feeSetting={feeSetting}
              client={client}
              onTxSubmit={onTxSubmit}
              onSourceTokenChange={onSourceTokenChange}
              onAmountInChange={onAmountInChange}
              onDestinationTokenChange={onDestinationTokenChange}
              onError={onError}
              enableRoute={enableRoute}
              enableDexes={enableDexes}
              title={title}
              showRate={showRate}
              showDetail={showDetail}
              width={width}
            />
          </TokenListProvider>
        </Web3Provider>
      </ThemeProvider>
    </StrictMode>
  )
}
