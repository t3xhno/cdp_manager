import Web3, { type ContractAbi } from "web3";

class Web3Service {
  public provider: Web3;

  constructor() {
    this.provider = new Web3(window.ethereum);
  }

  public getProvider() {
    if (this.provider) return this.provider;
    this.provider = new Web3(window.ethereum);
    return this.provider;
  }

  public disconnectProvider() {
    this.provider.currentProvider?.disconnect();
  }

  public async isMetaMaskConnected() {
    const accounts = await this.provider.eth.getAccounts();
    return accounts.length > 0;
  }

  public async getAccount() {
    const accounts = await this.provider.eth.getAccounts();
    return accounts[0];
  }

  public async getBalance() {
    const account = await this.getAccount();
    return await this.provider.eth.getBalance(account);
  }

  public async connectNetwork() {
    const accounts = await this.provider.eth.requestAccounts();
    return accounts[0];
  }

  public async connectContract(abi: ContractAbi, address: string) {
    const contract = new this.provider.eth.Contract(abi, address);
    return contract;
  }

  public async onAccountChanged(
    handleAccountChange: (accounts: string[]) => void
  ) {
    this.provider.currentProvider?.on("accountsChanged", (accounts) =>
      handleAccountChange(accounts)
    );
  }
}

export default Web3Service;
