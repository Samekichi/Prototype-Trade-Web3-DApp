import BuyButton from "./BuyButton";

function MarketplaceItemEntry({itemID, itemName, itemType, itemDesc, itemPrice, itemSeller, itemIsOnSale, buyItemHandler}) {
    
    return (
        <div class="flex-row inline-block min-h-min min-w-min m-2 p-2 rounded-md bg-green-50 border-4 border-green-100 text-green-700 font-minecraft overflow-y-auto">
            <p class="inline-block">ID: {itemID}<br/>Name: {itemName}<br/>Type: {itemType}<br/>Desc: {itemDesc}<br/>Price: {itemPrice}<br/>Seller: {itemSeller}<br/><BuyButton itemID={itemID} itemPrice={itemPrice} buyItemHandler={buyItemHandler}/></p>
            
        </div>
    );
}

export default MarketplaceItemEntry;