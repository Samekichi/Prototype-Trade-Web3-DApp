import MarketplaceItemEntry from "./MarketplaceItemEntry"

function Marketplace({getMarketplaceHandler, buyItemHandler, marketplace}) {
    console.log("Marketplace")
    // helper function to dynamically add ItemEntry for each marketplace item
    function renderMarketplaceEntries() {
        console.log("\trenderInventoryEntries")
        return marketplace.map(
            (item) => {
                return (<MarketplaceItemEntry itemID={item.itemID} itemName={item.itemName} itemType={item.itemType} itemDesc={item.itemDesc} itemPrice={item.itemPrice} itemSeller={item.itemSeller} itemIsOnSale={item.itemIsOnSale} buyItemHandler={buyItemHandler}/>);
            }
        )
    }
    return (
        <div class="p-4">
            <h2 class="p-4 text-green-700 font-minecraft font-semibold">Marketplace</h2>
            <button class="m-4 px-4 py-2 text-white font-minecraft bg-green-600 btn hover:bg-green-700 font-semibold" onClick={getMarketplaceHandler}>View Marketplace</button>
            <div class="flex-wrap justify-start overflow-y-scroll">
                {renderMarketplaceEntries()}
            </div>
            
        </div>
    );
}

export default Marketplace;