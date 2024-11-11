/* denepndencies */
import Head from 'next/head'
import Web3 from 'web3'
import { useState, useEffect } from 'react'
import MCPropertyMarketplaceContract from '../blockchain/MCPropertyMarketplace_ABI.js'
/* font */
require("@south-paw/typeface-minecraft");
/* react components */
import AddItem from "../Components/AddItem"
import MyInventory from "../Components/MyInventory"
import Marketplace from "../Components/Marketplace"

export default function MCPropertyMarketplace() {
    const [error, setError] = useState('');
    const [display, setDisplay] = useState('addItem');
    const [inventory, setInventory] = useState([]);
    const [marketplace, setMarketplace] = useState([]);
    const [web3, setWeb3] = useState(null);
    const [address, setAddress] = useState(null);
    const [balance, setBalance] = useState(null);
    const [mcContract, setMCContract] = useState(null);
    const [successMsg, setSuccessMsg] = useState('');
    const [itemName, setItemName] = useState('');
    const [itemDescription, setItemDesc] = useState('');
    const [itemType, setItemType] = useState('territory');
    const [itemPrice, setItemPrice] = useState(9999);
    
    // update when contract emits an event / tab switched
    useEffect( () => {
        const fetchData = async () => {
            console.log("useEffect(): mcContract/display changed")
            refreshDisplay();
            if (mcContract) {
                // handle emitted events 
                mcContract.events.ItemAdded()
                    .on('data', event => {
                        // print result
                        const result = event.returnValues;
                        console.log('\tItemAdded event:', result);
                        // update display
                        refreshDisplay();
                        setSuccessMsg(`Successfully added item "${result.name}" as Item #${result.id}!  
                        - Type: ${result.itemType}  
                        - Description: ${result.description}  
                        - Price: ${result.price}`);
                    })
                    .on('error', error => {
                        console.error('\tError (ItemAdded event):', error);
                        setError("Error: ItemAdded().");
                    });
                mcContract.events.ItemPutOnSale()
                    .on('data', event => {
                        // print result
                        const result = event.returnValues;
                        console.log('\tItemPutOnSale event:', result);
                        // update display
                        getInventoryHandler();
                        // refreshDisplay();
                        setSuccessMsg(`Successfully put Item #${result.id} on sale!`);
                    })
                    .on('error', error => {
                        console.error('\tError (ItemPutOnSale event):', error);
                        setError("Error: ItemPutOnSale().");
                    });
                mcContract.events.ItemTakenOffSale()
                    .on('data', event => {
                        // print result
                        const result = event.returnValues;
                        console.log('\tItemTakenOffSale event:', result);
                        // update display
                        getInventoryHandler();
                        // refreshDisplay();
                        setSuccessMsg(`Successfully taken Item #${result.id} off sale!`);
                    })
                    .on('error', error => {
                        console.error('\tError (ItemPutOnSale event):', error);
                        setError("Error: ItemPutOnSale().");
                    });
                mcContract.events.ItemPurchased()
                    .on('data', event => {
                        // print result
                        const result = event.returnValues;
                        console.log('\tItemPurchased event:', result);
                        // update display
                        getMarketplaceHandler();
                        // refreshDisplay();
                        setSuccessMsg(`Successfully bought Item #${result.id} from seller ${result.seller}!`);
                    })
                    .on('error', error => {
                        console.error('\tError (ItemPutOnSale event):', error);
                        setError("Error: ItemPutOnSale().");
                    });
            }
        }
        fetchData();
    }, [mcContract, display]);

    function refreshDisplay() {
        // update display
        setError('');
        setSuccessMsg('');
        switch(display) {
            case 'addItem':
                setItemName('');
                setItemDesc('');
                setItemPrice(9999);
                console.log("\tcase: addItem")
                break;
            case 'inventory':
                getInventoryHandler();
                console.log("\tcase: inventory")
                break;
            case 'marketplace':
                getMarketplaceHandler();
                console.log("\tcase: marketplace")
                break;
            case 'mySale':
                console.log("\tcase: mySale")
                break;
            case 'bought':
                console.log("\tcase: bought")
                break;
        }
    }


    /* Connect Wallet */
    const connectWalletHandler = async () => {
        if (window.ethereum) {
            try {
                // get account
                await window.ethereum.request({ method: "eth_requestAccounts" })
                const web3 = new Web3(window.ethereum)
                setWeb3(web3)
                const accounts = await web3.eth.getAccounts();
                setAddress(web3.utils.toChecksumAddress(accounts[0]))
                // get balance
                const addressChecksum = web3.utils.toChecksumAddress(accounts[0]);
                const balance = web3.utils.fromWei(await web3.eth.getBalance(addressChecksum));
                console.log(balance)
                setBalance(balance);
                // get smart contract
                const mc = await MCPropertyMarketplaceContract(web3);
                setMCContract(mc)
                setError('')
                setSuccessMsg('')
            } catch(err) {  // failed to connect wallet
                setError(err.message)
            }
        } else {  // MemaMask not installed
            console.log("Please install MetaMask")
            setError("Please install MetaMask")
        }
    }
    

    /* Add Item */
    async function addItemHelper() {
        console.log(itemName, itemType, itemDescription, itemPrice);
        if (address === null) {
            setError("Not login yet");
            console.log("Not login yet");
            return;
        }
        console.log(address)
        console.log(mcContract.methods)
        // interact w/ contract
        const result = await mcContract.methods.addItem(itemName, itemType, itemDescription, itemPrice).send({from: address});
        console.log('called addItem()', result);
    }

    const addItemHandler = async (event) => {
        event.preventDefault();  // prevent page refresh before methods of mcContract returns
        await addItemHelper();
    }


    /* My Inventory */
    async function getInventoryHandler() {
        console.log("getInventoryHandler")
        if (address === null) {
            setError("Not login yet");
            console.log("Not login yet");
            return;
        }
        const inventoryItems = []
        // get IDs of all inventory items
        const itemIDs = await mcContract.methods.getInventory(address).call();
        console.log(itemIDs)
        // get each item's data by item ID
        for (let i = 0; i < itemIDs.length; i++) {
            const item = await mcContract.methods.getItemById(itemIDs[i]).call();
            console.log(
                item.name,
                item.itemType,
                item.description,
                item.seller,
                item.price,
                item.isOnSale
            )
            inventoryItems.push({itemID: itemIDs[i], itemName: item.name, itemType: item.itemType, itemDesc: item.description, itemSeller: item.seller, itemPrice: item.price, itemIsOnSale: item.isOnSale})
        }
        console.log(inventoryItems)
        // update state of inventory
        setInventory(inventoryItems)
        setError('')
        setSuccessMsg('')
    }

    async function putOnSaleHandler(itemID) {
        console.log("putOnSaleHandler")
        if (address === null) {
            setError("Not login yet");
            console.log("Not login yet");
            return;
        }
        await mcContract.methods.putItemOnSale(parseInt(itemID)).send({from: address});
        setError('')
        setSuccessMsg('')
    }

    async function takeOffSaleHandler(itemID) {
        console.log("putOnSaleHandler")
        if (address === null) {
            setError("Not login yet");
            console.log("Not login yet");
            return;
        }
        await mcContract.methods.takeItemOffSale(parseInt(itemID)).send({from: address});
        setError('')
        setSuccessMsg('')
    }


    /* Marketplace */
    async function getMarketplaceHandler() {
        console.log("getMarketplaceHandler")
        if (address === null) {
            setError("Not login yet");
            console.log("Not login yet");
            return;
        }
        const marketplaceItems = []
        // get IDs of all marketplace items
        const itemIDs = await mcContract.methods.getAllOnSaleItems().call();
        console.log(itemIDs)
        // get each item's data by item ID
        for (let i = 0; i < itemIDs.length; i++) {
            const item = await mcContract.methods.getItemById(itemIDs[i]).call();
            console.log(
                item.name,
                item.itemType,
                item.description,
                item.seller,
                item.price,
                item.isOnSale
            )
            marketplaceItems.push({itemID: itemIDs[i], itemName: item.name, itemType: item.itemType, itemDesc: item.description, itemSeller: item.seller, itemPrice: item.price, itemIsOnSale: item.isOnSale})
        }
        console.log(marketplaceItems)
        // update state of inventory
        setMarketplace(marketplaceItems)
        setError('')
        setSuccessMsg('')
    }

    async function buyItemHandler(itemID, price) {
        console.log("buyItemHandler")
        console.log(itemID, price)
        if (address === null) {
            setError("Not login yet");
            console.log("Not login yet");
            return;
        }
        // buy item
        await mcContract.methods.buyItem(parseInt(itemID)).send({from: address, value: parseInt(price)});
        setError('')
        setSuccessMsg('')
    }

    /* Bought */
    const getBoughtItemsHandler = async () => {
        // const itemIDs = await mcContract.methods.getBuyerItems(address).call();
        // for (let i = 0; i < length(itemIDs); i++) {
            // const item = mcContract.methods.getItemByID(itemIDs[i]).call();
            // console.log(
            //     item.name,
            //     item.itemType,
            //     item.description,
            //     item.seller,
            //     item.price,
            //     item.isOnSale
            // )
        // } 
        // return;
    }


    /* components of subpages */
    const CONTENTS = {
        addItem: (
            <AddItem
                addItemHandler={addItemHandler}
                itemName={itemName} 
                itemType={itemType} 
                itemDesc={itemDescription}
                itemPrice={itemPrice} 
                setItemName={setItemName}
                setItemType={setItemType}
                setItemDesc={setItemDesc}
                setItemPrice={setItemPrice}
            />
        ),
        inventory: (
            <MyInventory
                getInventoryHandler={getInventoryHandler}
                putOnSaleHandler={putOnSaleHandler}
                takeOffSaleHandler={takeOffSaleHandler}
                inventory={inventory}/>
        ),
        marketplace: (
            <Marketplace
                getMarketplaceHandler={getMarketplaceHandler}
                buyItemHandler={buyItemHandler}
                marketplace={marketplace}/>
        ),
        mySale: (
            <section>
                <div class="mx-auto">
                    <h2 class="p-4 text-green-700 font-minecraft font-semibold">My Sale</h2>
                    {/* {getMySaleHandler} */}
                </div>
            </section>
        ),
        bought: (
            <section>
                <div class="mx-auto">
                    <h2 class="p-4 text-green-700 font-minecraft font-semibold">Bought</h2>
                    {getBoughtItemsHandler}
                </div>
            </section>
        ),
        debug: (
            <div>
                <section>
                    {error && (
                        <div class="mx-auto p-4 bg-red-100 text-red-950 font-minecraft">
                            <p>{error}</p>
                        </div>
                    )}
                </section>
                <section>
                    {successMsg && (
                        <div class="mx-auto p-4 bg-green-100 text-green-950 font-minecraft">
                            <p>{successMsg}</p>
                        </div>
                    )}
                </section>
            </div>
        ),
    };


    return (
        <div class="h-screen">
            <Head>
                <title>MC Property Marketplace</title>
                <meta name="description" content="A property documenting and trading app" />
            </Head>
            <nav class="flex flex-col justify-between px-4 py-4 fixed top-0 left-0 bottom-0 sm:max-w-xs bg-lime-50 overflow-y-auto">
                <div class="mb-auto">
                    <h1 class="pb-4 text-4xl text-yellow-900 font-semibold font-minecraft-cap-bold">MC Property Marketplace</h1>
                    <p class="pb-1 break-all text-amber-700 font-minecraft font-semibold">Address</p>
                    <p class="pb-4 break-all text-amber-600 font-minecraft">{address === null ? "(Login to show)" : address}</p>
                    <p class="pb-1 break-all text-amber-700 font-minecraft font-semibold">Balance</p>
                    <p class="pb-4 break-all text-amber-600 font-minecraft">{balance === null ? "(Login to show)" : balance}</p>
                </div>
                <div>
                    
                </div>
                <div class="mt-auto">
                    <button onClick={connectWalletHandler} class="w-full px-2 py-2 text-white font-minecraft bg-green-600 btn hover:bg-green-700 font-semibold">Connect Wallet</button>
                </div>
            </nav>
            <section>
                <div class="flex justify-start fixed top-0 left-0 right-0 lg:ml-80 bg-green-50 overflow-x-auto">
                    <button onClick={() => setDisplay("addItem")} class="h-full px-6 py-4 text-green-700 font-minecraft btn hover:bg-green-100 font-semibold">Add Item</button>
                    <button onClick={() => setDisplay("inventory")} class="h-full px-6 py-4 text-green-700 font-minecraft  btn hover:bg-green-100 font-semibold">My Inventory</button>
                    <button onClick={() => setDisplay("marketplace")} class="h-full px-6 py-4 text-green-700 font-minecraft btn hover:bg-green-100 font-semibold">Marketplace</button>
                    <button onClick={() => setDisplay("mySale")} class="h-full px-6 py-4 text-green-700 font-minecraft btn hover:bg-green-100 font-semibold">My Sale</button>
                    <button onClick={() => setDisplay("bought")} class="h-full px-6 py-4 text-green-700 font-minecraft btn hover:bg-green-100 font-semibold">Bought</button>
                </div>
            </section>
            <section class="top-0 bottom-0 left-0 right-0 lg:mt-10 lg:ml-80">
                {CONTENTS[display]}
            </section>
            <section class="bottom-0 left-0 right-0 lg:ml-80 fixed">
                {CONTENTS["debug"]}
            </section>
        </div>
    )
}