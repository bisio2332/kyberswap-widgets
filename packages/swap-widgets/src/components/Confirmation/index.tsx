import styled, { keyframes } from 'styled-components'
import { Trade } from '../../hooks/useSwap'
import Warning from '../../assets/warning.svg'
import {
  BackIconWrapper,
  BorderButton,
  Button,
  Detail,
  DetailLabel,
  DetailRight,
  DetailRow,
  ModalHeader,
  ModalTitle,
} from '../Widget/styled'
import useTheme from '../../hooks/useTheme'
import { useActiveWeb3 } from '../../hooks/useWeb3Provider'
import { useEffect, useState } from 'react'
import { BigNumber } from 'ethers'
import { AGGREGATOR_PATH, NATIVE_TOKEN_ADDRESS, SCAN_LINK, TokenInfo, WRAPPED_NATIVE_TOKEN } from '../../constants'
import BackIcon from '../../assets/back.svg'
import ArrowIcon from '../../assets/arrow.svg'
import Loading from '../../assets/loader.svg'
import External from '../../assets/external.svg'
import SuccessSVG from '../../assets/success.svg'
import ErrorIcon from '../../assets/error.svg'
import Info from '../../assets/info.svg'
import DropdownIcon from '../../assets/dropdown.svg'
import InfoHelper from '../InfoHelper'
import questionImg from '../../assets/question.svg?url'
import { useWETHContract } from '../../hooks/useContract'
import { friendlyError } from '../../utils/errorMessage'

const Success = styled(SuccessSVG)`
  color: ${({ theme }) => theme.success};
`

const StyledError = styled(ErrorIcon)`
  color: ${({ theme }) => theme.error};
`

const ArrowDown = styled(BackIcon)`
  color: ${({ theme }) => theme.subText};
  transform: rotate(-90deg);
`

const Arrow = styled(ArrowIcon)`
  color: rgba(239, 239, 239, 1);
  transform: rotate(-90deg);
  overflow: visible;
`

const Flex = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 1.5rem;
  gap: 0.5rem;
  align-items: center;
  font-weight: 500;

  img {
    border-radius: 50%;
  }
`

const CountWrapper = styled.div`
  display: flex;
  flex-direction: column;
  text-align: left;
`
const Count = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  margin-bottom: 0.4rem;
  font-size: 1.8rem;
  padding: 0.25rem;
  &:before {
    content: '';
    width: 1rem;
    height: 1px;
    background: rgba(118, 118, 118, 1);
    position: absolute;
    bottom: 0;
  }
`

const Note = styled.div`
  color: ${({ theme }) => theme.subText};
  font-size: 0.75rem;
  text-align: left;
`

const PriceImpactHigh = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  border-radius: ${({ theme }) => theme.buttonRadius};
  background: ${({ theme }) => theme.warning + '40'};
  color: ${({ theme }) => theme.warning};
  font-size: 12px;
  font-weight: 500px;
  padding: 12px;
`

const PriceImpactVeryHigh = styled(PriceImpactHigh)`
  background: ${({ theme }) => theme.error + '40'};
  color: ${({ theme }) => theme.error};
`

const Central = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 8px;
  flex: 1;
`

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`

const Spinner = styled(Loading)`
  animation: 2s ${rotate} linear infinite;
  width: 94px;
  height: 94px;
  color: ${({ theme }) => theme.accent};
`

const ViewTx = styled.a`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  color: ${({ theme }) => theme.accent};
  font-size: 14px;
  gap: 4px;
`

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background: linear-gradient(103.36deg, rgba(195, 156, 75, 0.4) 0%, rgba(91, 91, 91, 0.1) 100%);
`

const WaitingText = styled.div`
  font-size: 1.6rem;
  font-weight: 500;
`

const Amount = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 6px;
  margin-top: 30px;
  margin-bottom: 20px;
  img {
    border-radius: 50%;
  }
`

const AmountWrapper = styled.div`
  display: flex;
  align-items: center;
  font-size: 18px;
  gap: 6px;
  div {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    span {
      position: relative;
      margin: 0.25rem 0 0 0 !important;
      padding: 0.25rem 0 0 0;
      font-size: 14px !important;
      &:before {
        content: '';
        width: 1rem;
        height: 1px;
        background: rgba(118, 118, 118, 1);
        position: absolute;
        right: 0;
        top: 0;
      }
    }
  }
  img {
    border-radius: 50%;
  }
  .right-side {
    align-items: flex-start;
    span {
      &:before {
        right: auto;
        left: 0;
      }
    }
  }
`

const SubText = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.subText};
  margin-top: 12px;
`

const ErrMsg = styled.div<{ show: boolean }>`
  margin-top: ${({ show }) => (show ? '12px' : '0')};
  max-height: ${({ show }) => (show ? '200px' : '0')};
  transition: 0.2s ease-out;

  font-size: 12px;
  color: ${({ theme }) => theme.subText};
  overflow-wrap: break-word;
  overflow-y: scroll;

  /* width */
  ::-webkit-scrollbar {
    display: unset;
    width: 6px;
    border-radius: 999px;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    background: transparent;
    border-radius: 999px;
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.subText + '66'};
    border-radius: 999px;
  }
`

const ErrorDetail = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  cursor: pointer;
`

const DownIcon = styled(DropdownIcon)<{ open: boolean }>`
  transform: rotate(${({ open }) => (!open ? '0' : '-180deg')});
  transition: all 0.2s ease;
`

function calculateGasMargin(value: BigNumber): BigNumber {
  const defaultGasLimitMargin = BigNumber.from(20_000)
  const gasMargin = value.mul(BigNumber.from(2000)).div(BigNumber.from(10000))

  return gasMargin.gte(defaultGasLimitMargin) ? value.add(gasMargin) : value.add(defaultGasLimitMargin)
}

function Confirmation({
  trade,
  tokenInInfo,
  amountIn,
  tokenOutInfo,
  amountOut,
  rate,
  slippage,
  priceImpact,
  onClose,
  deadline,
  client,
  onTxSubmit,
  onError,
  showDetail,
}: {
  trade: Trade
  tokenInInfo: TokenInfo
  amountIn: string
  tokenOutInfo: TokenInfo
  amountOut: string
  rate: number
  slippage: number
  priceImpact: number
  onClose: () => void
  deadline: number
  client: string
  onTxSubmit?: (txHash: string, data: any) => void
  onError?: (e: any) => void
  showDetail?: boolean
}) {
  const theme = useTheme()
  const { provider, account, chainId } = useActiveWeb3()

  let minAmountOut = '--'

  const isWrap =
    trade.routeSummary.tokenIn.toLowerCase() === NATIVE_TOKEN_ADDRESS.toLowerCase() &&
    trade.routeSummary.tokenOut.toLowerCase() === WRAPPED_NATIVE_TOKEN[chainId].address.toLowerCase()
  const isUnwrap =
    trade.routeSummary.tokenOut.toLowerCase() === NATIVE_TOKEN_ADDRESS.toLowerCase() &&
    trade.routeSummary.tokenIn.toLowerCase() === WRAPPED_NATIVE_TOKEN[chainId].address.toLowerCase()

  if (amountOut && !isWrap && !isUnwrap) {
    minAmountOut = (Number(amountOut) * (1 - slippage / 10_000)).toPrecision(8).toString()
  }

  const [attempTx, setAttempTx] = useState(false)
  const [txHash, setTxHash] = useState('')
  const [txStatus, setTxStatus] = useState<'success' | 'failed' | ''>('')
  const [txError, setTxError] = useState<any>('')
  const [showErrorDetail, setShowErrorDetail] = useState(false)

  useEffect(() => {
    if (txHash) {
      const i = setInterval(() => {
        provider?.getTransactionReceipt(txHash).then(res => {
          if (!res) return

          if (res.status) {
            setTxStatus('success')
          } else setTxStatus('failed')
        })
      }, 10_000)

      return () => {
        clearInterval(i)
      }
    }
  }, [txHash, provider])

  const [snapshotTrade, setSnapshotTrade] = useState<{
    amountIn: string
    amountOut: string
  } | null>(null)

  const wethContract = useWETHContract()

  const confirmSwap = async () => {
    setSnapshotTrade({ amountIn, amountOut })
    try {
      setAttempTx(true)
      setTxHash('')
      setTxError('')

      if (isWrap) {
        if (!wethContract) return
        const estimateGas = await wethContract.estimateGas.deposit({
          value: BigNumber.from(trade.routeSummary.amountIn).toHexString(),
        })
        const txReceipt = await wethContract.deposit({
          value: BigNumber.from(trade.routeSummary.amountIn).toHexString(),
          gasLimit: calculateGasMargin(estimateGas),
        })

        setTxHash(txReceipt?.hash || '')
        onTxSubmit?.(txReceipt?.hash || '', txReceipt)
        setAttempTx(false)

        return
      }

      if (isUnwrap) {
        if (!wethContract) return
        const estimateGas = await wethContract.estimateGas.withdraw(
          BigNumber.from(trade.routeSummary.amountIn).toHexString(),
        )
        const txReceipt = await wethContract.withdraw(BigNumber.from(trade.routeSummary.amountIn).toHexString(), {
          gasLimit: calculateGasMargin(estimateGas),
        })

        setTxHash(txReceipt?.hash || '')
        onTxSubmit?.(txReceipt?.hash || '', txReceipt)
        setAttempTx(false)

        return
      }

      const date = new Date()
      date.setMinutes(date.getMinutes() + (deadline || 20))

      const buildRes = await fetch(
        `https://aggregator-api.kyberswap.com/${AGGREGATOR_PATH[chainId]}/api/v1/route/build`,
        {
          method: 'POST',
          headers: {
            'x-client-id': client,
          },
          body: JSON.stringify({
            routeSummary: trade.routeSummary,
            deadline: Math.floor(date.getTime() / 1000),
            slippageTolerance: slippage,
            sender: account,
            recipient: account,
            source: client,
          }),
        },
      ).then(r => r.json())

      if (!buildRes.data) {
        throw new Error('Build route failed: ' + JSON.stringify(buildRes.details))
      }

      const estimateGasOption = {
        from: account,
        to: trade?.routerAddress,
        data: buildRes.data.data,
        value: BigNumber.from(tokenInInfo.address === NATIVE_TOKEN_ADDRESS ? trade?.routeSummary.amountIn : 0),
      }

      const gasEstimated = await provider?.estimateGas(estimateGasOption)

      const res = await provider?.getSigner().sendTransaction({
        ...estimateGasOption,
        gasLimit: calculateGasMargin(gasEstimated || BigNumber.from(0)),
      })

      setTxHash(res?.hash || '')
      onTxSubmit?.(res?.hash || '', res)
      setAttempTx(false)
    } catch (e) {
      setAttempTx(false)
      setTxError(e)
      onError?.(e)
    }
  }

  if (attempTx || txHash)
    return (
      <>
        <Central>
          {txStatus === 'success' ? <Success /> : txStatus === 'failed' ? <StyledError /> : <Spinner />}
          {txHash ? (
            txStatus === 'success' ? (
              <WaitingText>Transaction successful</WaitingText>
            ) : txStatus === 'failed' ? (
              <WaitingText>Transaction failed</WaitingText>
            ) : (
              <WaitingText>Processing transaction</WaitingText>
            )
          ) : (
            <WaitingText>Waiting For Confirmation</WaitingText>
          )}
          <Amount>
            <AmountWrapper>
              <div style={{ marginRight: '10px' }}>
                {+Number(snapshotTrade?.amountIn).toPrecision(6)}
                {!!trade?.routeSummary?.amountInUsd && (
                  <span
                    style={{
                      marginRight: '4px',
                      color: theme.subText,
                    }}
                  >
                    ~
                    {(+trade.routeSummary.amountInUsd).toLocaleString('en-US', {
                      style: 'currency',
                      currency: 'USD',
                    })}
                  </span>
                )}
              </div>
              <img src={tokenInInfo.logoURI} width="44" height="44" alt="" />
            </AmountWrapper>
            <Arrow style={{ transform: 'rotate(180deg)', color: 'rgba(239, 239, 239, 1)' }} />
            <AmountWrapper>
              <img src={tokenOutInfo.logoURI} width="44" height="44" alt="" />
              <div className={'right-side'}>
                {+Number(snapshotTrade?.amountOut).toPrecision(6)}
                {!!trade?.routeSummary?.amountOutUsd && (
                  <span
                    style={{
                      marginRight: '4px',
                      color: theme.subText,
                    }}
                  >
                    ~
                    {(+trade.routeSummary.amountOutUsd).toLocaleString('en-US', {
                      style: 'currency',
                      currency: 'USD',
                    })}
                  </span>
                )}
              </div>
            </AmountWrapper>
          </Amount>
          {!txHash && <SubText>Confirm this transaction in your wallet</SubText>}
          {txHash && txStatus === '' && <SubText>Waiting for the transaction to be mined</SubText>}
        </Central>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
          {txHash && (
            <BorderButton href={`${SCAN_LINK[chainId]}/tx/${txHash}`} target="_blank" rel="noopener norefferer">
              view txn <External />
            </BorderButton>
          )}
          <Button style={{ marginTop: 0 }} onClick={onClose}>
            Back to app
          </Button>
        </div>
      </>
    )

  if (txError)
    return (
      <>
        <Central>
          <StyledError />
          <WaitingText>{friendlyError(txError)}</WaitingText>
        </Central>

        <div>
          <Divider />
          <ErrorDetail role="button" onClick={() => setShowErrorDetail(prev => !prev)}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '14px',
              }}
            >
              <Info />
              Error details
            </div>
            <DownIcon open={showErrorDetail} />
          </ErrorDetail>
          <Divider />
          <ErrMsg show={showErrorDetail}>{txError?.data?.message || txError?.message}</ErrMsg>
        </div>

        {showErrorDetail && <Divider />}
        {txHash && (
          <ViewTx>
            View transaction <External />
          </ViewTx>
        )}
        <Button style={{ marginTop: 0 }} onClick={onClose}>
          {txError ? 'Dismiss' : 'Close'}
        </Button>
      </>
    )

  return (
    <>
      <ModalHeader style={{ marginBottom: '20px' }}>
        <ModalTitle role="button">
          You’re swapping
          <BackIconWrapper onClick={onClose}>
            <BackIcon />
          </BackIconWrapper>
        </ModalTitle>
      </ModalHeader>

      <Flex>
        <CountWrapper>
          <Count>
            {+Number(amountIn).toPrecision(10)}
            <div>{tokenInInfo.symbol}</div>
          </Count>
          {!!trade?.routeSummary?.amountInUsd && (
            <span
              style={{
                fontSize: '1.2rem',
                marginRight: '4px',
                color: theme.subText,
              }}
            >
              ~
              {(+trade.routeSummary.amountInUsd).toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD',
              })}
            </span>
          )}
        </CountWrapper>
        <img
          src={tokenInInfo.logoURI}
          width="28"
          alt=""
          height="28"
          onError={({ currentTarget }) => {
            currentTarget.onerror = null // prevents looping
            currentTarget.src = questionImg
          }}
        />
      </Flex>

      <Arrow style={{ transform: 'rotate(-90deg)', color: 'rgba(239, 239, 239, 1)' }} />

      <Flex>
        <CountWrapper>
          <Count>
            {+Number(amountOut).toPrecision(10)}
            <div>{tokenOutInfo.symbol}</div>
          </Count>
          {!!trade?.routeSummary?.amountOutUsd && (
            <span
              style={{
                fontSize: '1.2rem',
                marginRight: '4px',
                color: theme.subText,
              }}
            >
              ~
              {(+trade.routeSummary.amountOutUsd).toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD',
              })}
            </span>
          )}
        </CountWrapper>
        <img
          alt=""
          src={tokenOutInfo.logoURI}
          width="28"
          height="28"
          onError={({ currentTarget }) => {
            currentTarget.onerror = null // prevents looping
            currentTarget.src = questionImg
          }}
        />
      </Flex>
      <Divider />
      {/*{isWrap || isUnwrap ? null : (
        <Note>
          Output is estimated. You will receive at least {minAmountOut} {tokenOutInfo.symbol} or the transaction will
          revert.
        </Note>
      )}*/}

      {showDetail && (
        <Detail>
          {/* <DetailRow>
            <DetailLabel>Current Price</DetailLabel>
            <DetailRight>
              1 {tokenInInfo.symbol} = {parseFloat(rate.toPrecision(6))} {tokenOutInfo.symbol}
            </DetailRight>
          </DetailRow>*/}

          <DetailRow>
            <DetailLabel>
              Minimum Received
              <InfoHelper text={`Minimum amount you will receive or your transaction will revert`} />
            </DetailLabel>
            <DetailRight>
              {minAmountOut} {minAmountOut === '--' ? '' : tokenOutInfo.symbol}
            </DetailRight>
          </DetailRow>

          <DetailRow>
            <DetailLabel>
              Gas Fee
              <InfoHelper text="Estimated network fee for your transaction" />
            </DetailLabel>
            {isWrap || isUnwrap ? (
              <DetailRight>--</DetailRight>
            ) : (
              <DetailRight>${(+trade.routeSummary.gasUsd).toPrecision(4)}</DetailRight>
            )}
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

          {/*<DetailRow>
            <DetailLabel>Slippage</DetailLabel>
            <DetailRight>{(slippage * 100) / 10_000}%</DetailRight>
          </DetailRow>*/}
        </Detail>
      )}

      <div style={{ marginTop: 'auto' }}>
        {isWrap || isUnwrap ? null : priceImpact > 15 ? (
          <PriceImpactVeryHigh>
            <Warning /> Price Impact is Very High
          </PriceImpactVeryHigh>
        ) : priceImpact > 5 ? (
          <PriceImpactHigh>
            <Warning /> Price Impact is High
          </PriceImpactHigh>
        ) : priceImpact === -1 ? (
          <PriceImpactHigh>
            <Warning />
            Unable to calculate Price Impact
          </PriceImpactHigh>
        ) : null}
        <Button onClick={confirmSwap}>💸 Confirm and {isWrap ? 'wrap' : isUnwrap ? 'unwrap' : 'swap'}</Button>
      </div>
    </>
  )
}

export default Confirmation
