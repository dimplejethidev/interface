import type { NextPage } from "next";
import { useState } from "react";
import ProvideLiquidityWidget from "../components/widgets/ProvideLiquidityWidget";
import ToastType from "../types/ToastType";

interface ProvideLiquidityProps {
  showToast: (type: ToastType) => void;
}

const ProvideLiquidity: NextPage<ProvideLiquidityProps> = ({ showToast }) => {
  // used to easily reset component state
  const [keyNum, setKeyNum] = useState(1);

  return (
    <ProvideLiquidityWidget
      showToast={showToast}
      key={`provideliquidity-${keyNum}`}
      setKeyNum={setKeyNum}
    />
  );
};

export default ProvideLiquidity;
