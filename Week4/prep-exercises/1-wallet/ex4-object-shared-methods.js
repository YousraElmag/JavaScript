import eurosFormatter from './euroFormatter.js';

function deposit(amount) {
  this._cash += amount;
  this.resetDailyAllowance(); // Reset daily allowance on deposit
}

function withdraw(amount) {
  if (this._cash - amount < 0 || this._dayTotalWithdrawals + amount > this._dailyAllowance) {
    console.log(`Insufficient funds or reached daily withdrawal limit!`);
    return 0;
  }

  this._cash -= amount;
  this._dayTotalWithdrawals += amount;
  return amount;
}

function transferInto(wallet, amount) {
  if (amount > this._dailyAllowance || amount > this._cash || amount > wallet._dailyAllowance) {
    console.log(`Transfer amount exceeds daily allowance or available balance!`);
    return;
  }

  console.log(
    `Transferring ${eurosFormatter.format(amount)} from ${
      this._name
    } to ${wallet.getName()}`
  );
  const withdrawnAmount = this.withdraw(amount);
  wallet.deposit(withdrawnAmount);
}

function reportBalance() {
  console.log(
    `Name: ${this._name}, balance: ${eurosFormatter.format(this._cash)}, daily allowance: ${eurosFormatter.format(this._dailyAllowance)}, total withdrawals today: ${eurosFormatter.format(this._dayTotalWithdrawals)}`
  );
}

function resetDailyAllowance() {
  this._dayTotalWithdrawals = 0;
}

function setDailyAllowance(newAllowance) {
  this._dailyAllowance = newAllowance;
}

function getName() {
  return this._name;
}

function createWallet(name, cash = 0, dailyAllowance = 40) {
  return {
    _name: name,
    _cash: cash,
    _dailyAllowance: dailyAllowance,
    _dayTotalWithdrawals: 0,
    deposit,
    withdraw,
    transferInto,
    reportBalance,
    resetDailyAllowance,
    setDailyAllowance,
    getName,
  };
}

function main() {
  const walletJack = createWallet('Jack', 100);
  const walletJoe = createWallet('Joe', 10);
  const walletJane = createWallet('Jane', 20);

  walletJack.transferInto(walletJoe, 50);
  walletJane.transferInto(walletJoe, 25);

  walletJane.deposit(20);
  walletJane.transferInto(walletJoe, 25);

  walletJack.reportBalance();
  walletJoe.reportBalance();
  walletJane.reportBalance();

  // Reset daily allowance for all wallets (start of a new day)
  walletJack.resetDailyAllowance();
  walletJoe.resetDailyAllowance();
  walletJane.resetDailyAllowance();

  // Example of updating daily allowance for a wallet
  walletJack.setDailyAllowance(60);
}

main();
