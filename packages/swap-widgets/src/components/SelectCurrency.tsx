import { BigNumber } from 'ethers'
import { formatUnits, isAddress } from 'ethers/lib/utils'
import { useState } from 'react'
import styled, { keyframes } from 'styled-components'
import { TokenInfo as TokenDetail, NATIVE_TOKEN, NATIVE_TOKEN_ADDRESS } from '../constants'
import useTokenBalances from '../hooks/useTokenBalances'
import { useTokens } from '../hooks/useTokens'
import { useActiveWeb3 } from '../hooks/useWeb3Provider'
import Loading from '../assets/loader.svg'
import Question from '../assets/question.svg'
import questionImg from '../assets/question.svg?url'
import TrashIcon from '../assets/trash.svg'
import { useToken } from '../hooks/useToken'
import { Button } from './Widget/styled'

const Trash = styled(TrashIcon)`
  width: 20px;
  height: 20px;
  cursor: pointer;
  color: ${({ theme }) => theme.text};

  :hover {
    color: ${({ theme }) => theme.error};
  }
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
  width: 20px;
  height: 20px;
  color: ${({ theme }) => theme.accent};

  path {
    stroke-width: 8;
  }
`

export const Input = styled.input`
  font-size: 0.75rem;
  padding: 0.75rem;
  background: transparent;
  outline: none;
  border: none;
  color: ${({ theme }) => theme.text};
  width: 100%;
`

const TokenListWrapper = styled.div`
  flex: 1;
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

const TokenRow = styled.div<{ selected: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0.75rem;
  cursor: pointer;

  :hover {
    background: rgba(22, 21, 27, 1);
  }
`

const TokenInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 1rem;
`

const TokenName = styled.div`
  color: rgba(192, 192, 192, 1);
  font-size: 10.1px;
`

const TokenBalance = styled.div`
  font-size: 1rem;
  overflow: hidden;
  max-width: 6rem;
  text-overflow: ellipsis;
`

const Tabs = styled.div`
  display: flex;
  gap: 24px;
  cursor: pointer;
`

const Tab = styled.div<{ active: boolean }>`
  color: rgba(118, 118, 118, 1);
  font-size: 11px;
  font-weight: 400;
`

const NotFound = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: ${({ theme }) => theme.subText};
`

const ImportToken = ({ address, onImport }: { address: string; onImport: (token: TokenDetail) => void }) => {
  const token = useToken(address)

  if (!token) return null

  return (
    <TokenRow selected={false}>
      <TokenInfo>
        <Question />
        <div style={{ textAlign: 'left' }}>
          <span>{token.symbol}</span>
          <TokenName>{token.name}</TokenName>
        </div>
      </TokenInfo>

      <Button style={{ width: 'fit-content', padding: '8px 16px', marginTop: 0 }} onClick={() => onImport(token)}>
        Import
      </Button>
    </TokenRow>
  )
}

function SelectCurrency({
  selectedToken,
  filterTokens,
  onChange,
  onImport,
}: {
  selectedToken: string
  filterTokens?: string[]
  onChange: (token: TokenDetail) => void
  onImport: (token: TokenDetail) => void
}) {
  const tokens = useTokens()
  const [search, setSearch] = useState('')
  const tokenAddress = tokens.map(item => item.address)
  const { balances, loading } = useTokenBalances(tokenAddress)

  const { chainId } = useActiveWeb3()
  const tokenWithBalances = [
    ...tokens
      .filter(item => !(filterTokens || []).some(token => token === item.address))
      .map(item => {
        const balance = balances[item.address]
        const formattedBalance = formatUnits(balance || BigNumber.from(0), item.decimals)

        return { ...item, balance, formattedBalance }
      })
      .sort((a, b) => parseFloat(b.formattedBalance) - parseFloat(a.formattedBalance)),
  ].filter(
    token =>
      token.address.toLowerCase() === search.trim().toLowerCase() ||
      token.name.toLowerCase().includes(search.toLowerCase()) ||
      token.symbol.toLowerCase().includes(search.toLowerCase()),
  )

  const popularToken = [
    {
      ...{
        name: 'UCDC',
        symbol: ' USD Coin',
        decimals: 18,
        address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
        chainId: 1,
        logoURI: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png',
      },
      balance: balances['0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7'],
      formattedBalance: formatUnits(balances['0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7'] || BigNumber.from(0), 18),
    },
    {
      ...NATIVE_TOKEN[chainId],
      balance: balances[NATIVE_TOKEN_ADDRESS],
      formattedBalance: formatUnits(balances[NATIVE_TOKEN_ADDRESS] || BigNumber.from(0), 18),
    },
    {
      ...{
        name: 'UCDT',
        symbol: 'Tether USD',
        decimals: 18,
        address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
        chainId: 1,
        logoURI: 'https://s2.coinmarketcap.com/static/img/coins/64x64/825.png',
      },
      balance: balances[NATIVE_TOKEN_ADDRESS],
      formattedBalance: formatUnits(balances[NATIVE_TOKEN_ADDRESS] || BigNumber.from(0), 18),
    },
  ]

  const [tab] = useState<'all' | 'imported'>('all')

  return (
    <>
      <Tabs style={{ paddingTop: '20px' }}>
        <Tab active={tab === 'all'} role="button">
          Popular
        </Tab>
      </Tabs>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingRight: '16px',
          paddingBottom: '28px',
        }}
      >
        {popularToken.map(token => {
          return (
            <TokenRow
              style={{ padding: '0' }}
              selected={token.address === selectedToken}
              key={token.address}
              onClick={() => {
                onChange(token)
              }}
            >
              <TokenInfo>
                <img
                  src={token.logoURI}
                  width="37"
                  height="37"
                  alt="logo"
                  style={{
                    borderRadius: '999px',
                  }}
                  onError={({ currentTarget }) => {
                    currentTarget.onerror = null // prevents looping
                    console.log(questionImg)
                    currentTarget.src = questionImg
                  }}
                />
                <div style={{ textAlign: 'left' }}>
                  <span style={{ fontSize: '11.2px' }}>{token.symbol}</span>
                  <TokenName>{token.name}</TokenName>
                </div>
              </TokenInfo>
            </TokenRow>
          )
        })}
      </div>
      <Tabs>
        <Tab active={tab === 'all'} role="button">
          All tokens
        </Tab>
      </Tabs>
      <div
        style={{ display: 'flex', alignItems: 'center', width: '100%', borderBottom: '1px solid rgba(61, 60, 66, 1)' }}
      >
        🔍
        <Input placeholder="search tokens" value={search} onChange={e => setSearch(e.target.value)} />
      </div>
      <TokenListWrapper>
        {!tokenWithBalances.length && isAddress(search.trim()) && (
          <ImportToken address={search.trim()} onImport={onImport}></ImportToken>
        )}

        {!tokenWithBalances.length && !isAddress(search.trim()) && <NotFound>No results found</NotFound>}

        {tokenWithBalances.map(token => {
          return (
            <TokenRow
              selected={token.address === selectedToken}
              key={token.address}
              onClick={() => {
                onChange(token)
              }}
            >
              <TokenInfo>
                <img
                  src={token.logoURI}
                  width="37"
                  height="37"
                  alt="logo"
                  style={{
                    borderRadius: '999px',
                  }}
                  onError={({ currentTarget }) => {
                    currentTarget.onerror = null // prevents looping
                    console.log(questionImg)
                    currentTarget.src = questionImg
                  }}
                />
                <div style={{ textAlign: 'left' }}>
                  <span style={{ fontSize: '11.2px' }}>{token.symbol}</span>
                  <TokenName>{token.name}</TokenName>
                </div>
              </TokenInfo>
            </TokenRow>
          )
        })}
      </TokenListWrapper>
    </>
  )
}

export default SelectCurrency
