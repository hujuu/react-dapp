import './App.css';
import { useState } from 'react';
// import { ethers } from 'ethers'   // acts like a backend for our Web3/DApp 
import Greeter from './artifacts/contracts/Greeter.sol/Greeter.json'

const ethers = require("ethers")
const greeterAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"

function App() {
  // store greeting in local state of react. Has nothing to do with the smart contract at the moment
  const [greeting, setGreetingValue] = useState()

  // request access to the user's account. This works regardless of the wallet you're using. 
  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }

  // call the smart contract, read the current greeting value
  async function fetchGreeting() {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, provider)
      try {
        const data = await contract.greet()
        console.log('data: ', data)
      } catch (err) {
        console.log("Error: ", err)
      }
    }    
  }

  async function setGreeting() {
    if (!greeting) {
      console.log("Greeting is empty.");
      return;
    }
    if (typeof window.ethereum !== 'undefined') {
      try {
        await requestAccount();
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(greeterAddress, Greeter.abi, signer);
        const transaction = await contract.setGreeting(greeting);
        await transaction.wait();
        console.log("Greeting updated successfully.");
        fetchGreeting();
      } catch (err) {
        console.error("Error in setGreeting:", err);
      }
    } else {
      console.log("Ethereum object not found.");
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={fetchGreeting}>Fetch Greeting</button>
        <button onClick={setGreeting}>Set Greeting</button>
        <input onChange={e => setGreetingValue(e.target.value)} placeholder="Set greeting" />
      </header>
    </div>
  );
}

export default App;
