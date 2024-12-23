import { useState } from "react";
import { useZapState } from "../../hooks/useZapInState";
import AlertIcon from "@/assets/svg/alert.svg";

export const parseSlippageInput = (str: string): number =>
  Math.round(Number.parseFloat(str) * 100);
export const validateSlippageInput = (
  str: string
): { isValid: boolean; message?: string } => {
  if (str === "") {
    return {
      isValid: true,
    };
  }

  const numberRegex = /^(\d+)\.?(\d{1,2})?$/;
  if (!str.match(numberRegex)) {
    return {
      isValid: false,
      message: `Enter a valid slippage percentage`,
    };
  }

  const rawSlippage = parseSlippageInput(str);

  if (Number.isNaN(rawSlippage)) {
    return {
      isValid: false,
      message: `Enter a valid slippage percentage`,
    };
  }

  if (rawSlippage < 0) {
    return {
      isValid: false,
      message: `Enter a valid slippage percentage`,
    };
  } else if (rawSlippage < 50) {
    return {
      isValid: true,
      message: `Your transaction may fail`,
    };
  } else if (rawSlippage > 5000) {
    return {
      isValid: false,
      message: `Enter a smaller slippage percentage`,
    };
  } else if (rawSlippage > 500) {
    return {
      isValid: true,
      message: `Your transaction may be frontrun`,
    };
  }

  return {
    isValid: true,
  };
};

const SlippageInput = () => {
  const { slippage, setSlippage } = useZapState();
  const [v, setV] = useState(() => {
    if ([5, 10, 50, 100].includes(slippage)) return "";
    return ((slippage * 100) / 10_000).toString();
  });

  const [isFocus, setIsFocus] = useState(false);
  const { isValid, message } = validateSlippageInput(v);

  return (
    <>
      <div className="slp-input-wrapper">
        {[5, 10, 50, 100].map((item) => (
          <div
            className="slp-item"
            data-active={item === slippage}
            role="button"
            onClick={() => setSlippage(item)}
            key={item}
          >
            {(item * 100) / 10_000}%
          </div>
        ))}

        <div
          className="slp-item slp-item-input"
          data-active={![5, 10, 50, 100].includes(slippage)}
          data-error={!!message && !isValid}
          data-warning={!!message && isValid}
          data-focus={isFocus}
          style={{
            width: "72px",
          }}
        >
          {message && (
            <AlertIcon
              style={{
                position: "absolute",
                top: 7,
                left: 4,
                width: 16,
                height: 16,
                color: isValid ? "var(--ks-lw-warning)" : "var(--ks-lw-error)",
              }}
            />
          )}
          <input
            data-active={![5, 10, 50, 100].includes(slippage)}
            placeholder="Custom"
            onFocus={() => setIsFocus(true)}
            onBlur={(e) => {
              setIsFocus(false);
              if (!e.currentTarget.value) setSlippage(10);
              else if (isValid)
                setSlippage(parseSlippageInput(e.currentTarget.value));
            }}
            value={v}
            onChange={(e) => {
              const value = e.target.value;

              if (value === "") {
                setV(value);
                setSlippage(10);
                return;
              }

              const numberRegex = /^(\d+)\.?(\d{1,2})?$/;
              if (!value.match(numberRegex)) {
                e.preventDefault();
                return;
              }

              const res = validateSlippageInput(value);

              if (res.isValid) {
                const parsedValue = parseSlippageInput(value);
                setSlippage(parsedValue);
              } else {
                setSlippage(10);
              }
              setV(value);
            }}
            pattern="/^(\d+)\.?(\d{1,2})?$/"
          />
          <span>%</span>
        </div>
      </div>
      {message && (
        <div
          style={{
            fontSize: "12px",
            color: isValid ? "var(--ks-lw-warning)" : "var(--ks-lw-error)",
            textAlign: "left",
            marginTop: "4px",
          }}
        >
          {message}
        </div>
      )}
    </>
  );
};

export default SlippageInput;
