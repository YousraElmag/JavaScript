import eurosFormatter from './euroFormatter.js';

function Wallet(name, cash, dailyAllowance = 40) {
  this._name = name;
  this._cash = cash;
  this._dailyAllowance = dailyAllowance;
  this._dayTotalWithdrawals = 0;
}

Wallet.prototype.deposit = function (amount) {
  this._cash += amount;
  this.resetDailyAllowance(); // Reset daily allowance on deposit
};

Wallet.prototype.withdraw = function (amount) {
  if (this._cash - amount < 0 || this._dayTotalWithdrawals + amount > this._dailyAllowance) {
    console.log(`Insufficient funds or reached daily withdrawal limit!`);
    return 0;
  }

  this._cash -= amount;
  this._dayTotalWithdrawals += amount;
  return amount;
};

Wallet.prototype.transferInto = function (wallet, amount) {
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
};

Wallet.prototype.reportBalance = function () {
  console.log(
    `Name: ${this._name}, balance: ${eurosFormatter.format(this._cash)}, daily allowance: ${eurosFormatter.format(this._dailyAllowance)}, total withdrawals today: ${eurosFormatter.format(this._dayTotalWithdrawals)}`
  );
};

Wallet.prototype.resetDailyAllowance = function () {
  this._dayTotalWithdrawals = 0;
};

Wallet.prototype.setDailyAllowance = function (newAllowance) {
  this._dailyAllowance = newAllowance;
};

Wallet.prototype.getName = function () {
  return this._name;
};

function main() {
  const walletJack = new Wallet('Jack', 100);
  const walletJoe = new Wallet('Joe', 10);
  const walletJane = new Wallet('Jane', 20);

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
