import SaleButton from "./SaleButton";

function InventoryItemEntry({itemID, itemName, itemType, itemDesc, itemPrice, itemSeller, itemIsOnSale, putOnSaleHandler, takeOffSaleHandler}) {
    
    return (
        <div class="flex-row inline-block min-h-min min-w-min m-2 p-2 rounded-md bg-green-50 border-4 border-green-100 text-green-700 font-minecraft overflow-y-auto">
            <p class="inline-block">ID: {itemID}<br/>Name: {itemName}<br/>Type: {itemType}<br/>Desc: {itemDesc}<br/>Price: {itemPrice}<br/><SaleButton itemID={itemID} itemIsOnSale={itemIsOnSale} putOnSaleHandler={putOnSaleHandler} takeOffSaleHandler={takeOffSaleHandler}/></p>
            
        </div>
    );
}

export default InventoryItemEntry;