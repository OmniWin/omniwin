import React from "react";
import { Button } from "@/components/ui/button";

const ConnectWalletButton: React.FC = ({...props}) => {
  return (
    <Button {...props} variant="secondary">Connec</Button>
  );
}

export default ConnectWalletButton;