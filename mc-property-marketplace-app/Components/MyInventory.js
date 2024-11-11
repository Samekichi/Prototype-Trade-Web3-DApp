import InventoryItemEntry from "./InventoryItemEntry"

function MyInventory({getInventoryHandler, putOnSaleHandler, takeOffSaleHandler, inventory}) {
    console.log("MyInventory")
    // helper function to dynamically add ItemEntry for each inventory item
    function renderInventoryEntries() {
        console.log("\trenderInventoryEntries")
        return inventory.map(
            (item) => {
                return (<InventoryItemEntry itemID={item.itemID} itemName={item.itemName} itemType={item.itemType} itemDesc={item.itemDesc} itemPrice={item.itemPrice} itemSeller={item.itemSeller} itemIsOnSale={item.itemIsOnSale} putOnSaleHandler={putOnSaleHandler} takeOffSaleHandler={takeOffSaleHandler}/>);
            }
        )
    }
    return (
        <div class="p-4">
            <h2 class="p-4 text-green-700 font-minecraft font-semibold">My Inventory</h2>
            <button class="m-4 px-4 py-2 text-white font-minecraft bg-green-600 btn hover:bg-green-700 font-semibold" onClick={getInventoryHandler}>Get Inventory</button>
            <div class="flex-wrap justify-start overflow-y-scroll">
                {renderInventoryEntries()}
            </div>
            
        </div>
    );
}

export default MyInventory;