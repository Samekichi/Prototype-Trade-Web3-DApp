
function AddItem({addItemHandler, itemName, itemType, itemDesc, itemPrice, setItemName, setItemType, setItemDesc, setItemPrice}) {
    return (
        <div class="mx-auto p-4">
            <h2 class="p-4 text-green-700 font-minecraft font-semibold">Add Item</h2>
            <form onSubmit={addItemHandler}>
                <label class="p-4 text-green-600 font-minecraft">Item Name: </label>
                    <input class="bg-gray-100 border-2 border-gray-300 hover:border-2 hover:bg-gray-50 hover:border-gray-200 focus:border-2 focus:border-gray-100 focus:bg-white focus:outline-none text-green-900 font-minecraft m-1 align-middle" type="text" placeholder="enter item name" value={itemName} onChange={(event) => setItemName(event.target.value)}/>
                <br/>
                <label class="p-4 text-green-600 font-minecraft">Item Type: </label>
                    <select class="text-green-900 font-minecraft" value={itemType} onChange={(event) => setItemType(event.target.value)}>
                        <option value="territory">Territory</option>
                        <option value="loot">Loot</option>
                        <option value="collectible">Collectible</option>
                    </select>
                <br/>
                <label class="p-4 text-green-600 font-minecraft align-middle">Item Description: </label>
                    <input class="bg-gray-100 border-2 border-gray-300 hover:border-2 hover:bg-gray-50 hover:border-gray-200 focus:border-2 focus:border-gray-100 focus:bg-white focus:outline-none text-green-900 font-minecraft m-1 align-middle" type="text" placeholder="enter item desc" value={itemDesc} onChange={(event) => setItemDesc(event.target.value)}/>
                <br/>
                <label class="p-4 text-green-600 font-minecraft">Item Price: </label>
                    <input class="bg-gray-100 border-2 border-gray-300 hover:border-2 hover:bg-gray-50 hover:border-gray-200 focus:border-2 focus:border-gray-100 focus:bg-white focus:outline-none text-green-900 font-minecraft m-1 align-middle" type="number" min="0" step="0.0001" placeholder="enter item price" value={itemPrice} onChange={(event) => setItemPrice(event.target.value)}/>
                <br/>
                <button class="m-4 px-4 py-2 text-white font-minecraft bg-green-600 btn hover:bg-green-700 font-semibold">Upload</button>
            </form>
        </div>
    );
}

export default AddItem;