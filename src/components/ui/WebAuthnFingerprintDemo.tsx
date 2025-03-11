import React, { useState } from "react";
import { Button } from "@mui/material";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const WebAuthnFingerprintDemo = () => {
  const [status, setStatus] = useState("");
  const navigate = useNavigate();

  const registerPasskey = async () => {
    try {
      setStatus("Registering...");
      // Mock registration process
      const success = true;
      if (success) {
        setStatus("Passkey registered successfully using biometrics!");
        toast.success("Login Successful! Welcome back.");
        navigate("/dashboard");
      } else {
        throw new Error("Registration failed");
      }
    } catch (error) {
      setStatus(`Error: ${(error as Error).message}`);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-center">Biometric Authentication</h3>
      <div className="flex flex-col gap-2">
        <Button onClick={registerPasskey} variant="contained" className="w-full">
          Login with Biometrics
        </Button>
      </div>
      {status && <p className="text-sm text-center">{status}</p>}
    </div>
  );
};

export default WebAuthnFingerprintDemo;
