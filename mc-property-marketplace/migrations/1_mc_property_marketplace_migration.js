const MCPropertyMarketplace = artifacts.require("MCPropertyMarketplace");

module.exports = function (deployer) {
    deployer.deploy(MCPropertyMarketplace);
}