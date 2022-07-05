import React, { useState } from "react";
import Greeter from "../artifacts/contracts/Greeter.sol/Greeter.json";
import { ethers } from "ethers";
function Test() {
  const greeterAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  const [localGreeting, setLocalGreeting] = useState("");

  const requestAccount = async () => {
    const accs = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    console.log("accs :>> ", accs);
  };
  const fetchGreeting = async () => {
    console.log("typeof window.ethereum :>> ", typeof window.ethereum);

    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      // const code = await provider.getCode(greeterAddress);

      // console.log("code :>> ", code);
      const contract = new ethers.Contract(
        greeterAddress,
        Greeter.abi,
        provider
      );

      console.log("provider :>> ", provider);
      console.log("contract :>> ", contract);
      try {
        const greeting = await contract.getGreeting();
        setLocalGreeting(greeting);
      } catch (error) {
        console.log(error);
      }
    }
  };
  const sendGreeting = async () => {
    if (!localGreeting) return;

    if (typeof window.ethereum !== "undefined") {
      await requestAccount();

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      const contract = new ethers.Contract(greeterAddress, Greeter.abi, signer);

      const transaction = await contract.setGreeting(localGreeting);
      await transaction.wait();
      fetchGreeting();

      console.log("set - provider :>> ", provider);
      console.log("set - contract :>> ", contract);
      console.log("set - signer :>> ", signer);
      console.log("set - transaction :>> ", transaction);
      try {
        await contract.setGreeting(localGreeting);
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <>
      <button onClick={requestAccount}>Request Account</button>
      <button onClick={fetchGreeting}>Fetch Greeting</button>
      <input
        type="text"
        value={localGreeting}
        onChange={(e) => setLocalGreeting(e.target.value)}
      />
      <button onClick={sendGreeting}>Send Greeting</button>
    </>
  );
}

export default Test;
