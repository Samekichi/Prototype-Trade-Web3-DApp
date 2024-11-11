
function BuyButton({itemID, itemPrice, buyItemHandler}) {
    
    return (
        <button class='mt-2 p-2 text-white font-minecraft font-semibold bg-green-500 btn hover:bg-green-600' onClick={ () => buyItemHandler(itemID, itemPrice) }>
            Buy
        </button>
    );
}

export default BuyButton;