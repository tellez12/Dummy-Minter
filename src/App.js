import './App.css';
import { useMoralis } from "react-moralis";
import { useEffect, useState } from "react";
import Moralis from "moralis";
import { Buffer } from 'buffer';
import { contractABI, contractAddress } from "./contracts/contract";
import web3 from './web3';



function App() {
  const { authenticate, isAuthenticated, logout, user } = useMoralis();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [reciever, setReciever] = useState("");
  const [beneficiary, setBeneficiary] = useState(0);
  const [feeNumerator, setFeeNumerator] = useState(0);

  const [file, setFile] = useState(null);
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      // Attempt to save image to IPFS
      const file1 = new Moralis.File(file.name, file);
      await file1.saveIPFS();
      const file1url = file1.ipfs();
      // Generate metadata and save to IPFS
      const metadata = {
        name,
        description,
        image: file1url,
      };
      const file2 = new Moralis.File(`${name}metadata.json`, {
        base64: Buffer.from(JSON.stringify(metadata)).toString("base64"),
      });
      await file2.saveIPFS();
      const metadataurl = file2.ipfs();

      // Interact with smart contract
      const contract = new web3.eth.Contract(contractABI, contractAddress);
      let address = "0xb4d2Ba416F6343B03220C2dFbE3492005336026b";
      const response = await contract.methods
        .mint( reciever, beneficiary, feeNumerator, metadataurl)
        .send({ from: user.get("ethAddress") });
      // Get token id
      const tokenId = response.events.Transfer.returnValues.tokenId;
      // Display alert
      alert(
        `NFT successfully minted. Contract address - ${contractAddress} and Token ID - ${tokenId}`
      );
    } catch (err) {
      console.error(err);
      alert("An error occured!");
    }
  };

  if (!isAuthenticated) return (
    <div>
    <head>
      <title>NFT Minter</title>
      <link rel="icon" href="/favicon.ico" />
    </head>
    <button
      onClick={authenticate}
      className=""
    >
      Login using MetaMask
    </button>
    </div>
    );
    


  return (
    <div className="">
      <form onSubmit={onSubmit}>
        <div>
          <input
            type="text"
            className=""
            value={name}
            placeholder="Name"
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="">
          <input
            type="text"
            className=""
            value={description}
            placeholder="Description"
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="">
          <input
            type="text"
            className=""
            value={reciever}
            placeholder="NFT reciever"
            onChange={(e) => setReciever(e.target.value)}
          />
        </div>

        <div className="">
          <input
            type="text"
            className=""
            value={beneficiary}
            placeholder="Fee beneficiary"
            onChange={(e) => setBeneficiary(e.target.value)}
          />
        </div>
        <div className="">
          <input
            type="text"
            className=""
            value={feeNumerator}
            placeholder="Fee Numerator "
            onChange={(e) => setFeeNumerator(e.target.value)}
          />
        </div>
        <div className="">
          <input
            type="file"
            className=""
            onChange={(e) => setFile(e.target.files[0])}
          />
        </div>
        <button
          type="submit"
          className=""
        >
          Mint now!
        </button>
        <button
          onClick={logout}
          className=""
        >
          Logout
        </button>
      </form>
    </div>
  );
}

export default App;
