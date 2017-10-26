# CryptoMon Bot

## Desciption
```@CryptoMon_Bot``` helps tracking of your cryptocurrency investments and making smart, informed buy/sell decisions.
Follow the price movements and trends using signals, and get informed about key changes by setting alarms.
Soon the bot will also be able to trade on your behalf so you won't miss on any golden opportunities.

## Commands

### Information commands

Command | Description | Example
------- | ----------- | -------
```/exchanges``` | List all exchanges |
```/exchanges {symbol}``` | List exchanges trading a symbol | ```/exchanges NEO/BTC```
```/exchanges {coin}``` | List exchanges trading a coin | ```/exchanges NEO```
```/exchange {exchange}``` | Show details about an exchange | ```/exchange binance```
```/markets``` | List all markets in all exchanges |
```/markets {exchange}``` | List markets in an exchange | ```/markets binance```
```/markets {coin}``` | List markets trading a coin | ```/markets NEO```
```/markets {coin}@{exchange}``` | List markets in an exchange trading a coin | ```/markets NEO@binance```
```/market {symbol}@{exchange}``` | Show details about a market in an exchange | ```/market NEO/BTC@binance```
```/symbols``` | List all symbols in all exchanges | |
```/symbols {exchange}``` | List symbols in an exchange | ```/symbols binance```
```/symbols {coin}``` | List symbols containing a coin | ```/symbols NEO```
```/symbols {coin}@{exchange}``` | List symbols containing a coin in an exchange | ```/symbols NEO@binance```
```/symbol {symbol}``` | Show details about a symbol | ```/symbol NEO```
```/coins``` | List all coins in all exchanges/markets |
```/coins {exchange}``` | List coins traded in an exchange | ```/coins binance```
```/coin {coin}``` | Show details about a coin in an exchange | ```/coin NEO```
```/ticker {symbol}``` | Show current ticker (OHLCV) of symbol in all exchanges | ```/ticker NEO/BTC```
```/ticker {symbol}@{exchange}``` | Show current ticker (OHLCV) of symbol in an exchange | ```/ticker NEO@binance```
```/price {symbol}``` | Show current price of symbol in all exchanges | ```/price NEO/BTC```
```/price {symbol}@{exchange}``` | Show current price of symbol in an exchange | ```/price NEO@binance```
```/volume {symbol}``` | Show current traded volume for symbol in all exchanges | ```/volume NEO/BTC```
```/volume {symbol}@{exchange}``` | Show current traded volume for symbol in an exchange | ```/volume NEO@binance```
```/change {symbol}``` | Show current % change for symbol in all exchanges | ```/change NEO/BTC```
```/change {symbol}@{exchange}``` | Show current % change for symbol in an exchange | ```/change NEO@binance```
```/chart {symbol}@{exchange} {period}``` | Draw candlestick chart (OHLCV) of symbol in an exchange for period (1m,15m,30m,1h,1d,1w,1M) | ```/chart NEO@binance 15m```

**Hierrarchy:** Exchange ➜ Market ➜ Symbol ➜ Coin

**Note:** If just a **coin** is specified instead of **symbol**, a BTC pair counterpart is assumed.

### Watch commands

Command | Description | Example
------- | ----------- | -------
```/watch``` | List all currently set watches |
```/watch {symbol}``` | Show watches for symbol in all exchanges | ```/watch NEO/BTC```
```/watch {symbol}@{exchange}``` | Show watches for symbol in an exchange | ```/watch NEO/BTC@binance```
```/watch {symbol}@{exchange}={low}:{high}``` | Set a watches for symbol in an exchange at low:high price range | ```/watch NEO/BTC@binance=0.0050:0.0070```
```/watch {symbol}@{exchange} price|volume|change={low}:{high}``` | Set a watches for symbol in an exchange at low:high price/volume/change % range | ```/watch NEO/BTC@binance change=-10:10```
```/unwatch``` | Remove all currently set watches |
```/unwatch {symbol}``` | Remove watches for symbol in all exchanges | ```/unwatch NEO/BTC```
```/unwatch {symbol}@{exchange}``` | Remove watches for symbol in an exchange | ```/unwatch NEO/BTC@binance```
```/unwatch {symbol}@{exchange} price|volume|change``` | Remove watches for symbol in an exchange at price/volume/change % level| ```/unwatch NEO/BTC@binance volume```

### Portfolio commands

Command | Description | Example
------- | ----------- | -------
```/portfolio``` | Show current portfolio |
```/portfolio {coin}``` | Show details about a coin in portfolio | ```/portfolio NEO```
```/portfolio add|+ {amount} {symbol}@{price}``` | Add to portfolio an amount of symbol at price | ```/portfolio add 100 NEO/BTC@0.0060``` or ```/portfolio +100 NEO/BTC@0.0060```
```/portfolio remove|- {amount} {symbol}``` | Remove from portfolio an amount of symbol | ```/portfolio remove 100 NEO``` or ```/portfolio -100 NEO```

### Trading commands

Command | Description | Example
------- | ----------- | -------
```/buy {amount} {symbol}@{exchange} {price}``` | Buy an amount of symbol at exchange at a given price | ```/```
```/sell {amount} {symbol}@{exchange} {price}``` | Sell an amount of symbol at exchange at a given price |

### Settings commands

Command | Description | Example
------- | ----------- | -------
```/set``` | Show all currently set user parameters |
```/set {param}``` | Show current parameter value | ```/set exchanges``` 
```/set {param}={value}``` | Set a user parameter (personalization) to a value (or list of values) | ```/set fiat=EUR``` or ```/set exchanges=binance,bittrex,bitfinex,kraken``` 
```/unset``` | Remove all current user parameters |
```/unset {param}``` | Remove stored user parameter | ```/remove exchanges```

### Command shortcuts

Command | Shortcut
------- | -----------
```/exchange``` | ```/e```
```/market``` | ```/m```
```/symbol``` | ```/s```
```/ticker``` | ```/t```
```/price``` | ```/p```
```/volume``` | ```/v```
```/change``` | ```/%```
```/chart``` | ```/c```
```/chart``` | ```/c```
```/unwatch``` | ```/uw```
```/portfolio``` | ```/pf```
