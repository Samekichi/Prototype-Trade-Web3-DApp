
function SaleButton({itemID, itemIsOnSale, putOnSaleHandler, takeOffSaleHandler}) {
    
    return (
        <button class={['mt-2 p-2 text-white font-minecraft font-semibold', itemIsOnSale ? 'bg-red-500 btn hover:bg-red-600' : 'bg-green-500 btn hover:bg-green-600'].join(' ')} onClick={ itemIsOnSale ? () => takeOffSaleHandler(itemID) : () => putOnSaleHandler(itemID) }>
            {itemIsOnSale ? "Take Off Sale" : "Put On Sale"}
        </button>
    );
}

export default SaleButton;