import { Directive } from "@angular/core"

@Directive()
export class ConvertInfo {
    constructor() { }
  
    ngOnInit(): void { }
  
    public static categories = ["Currency", "Temperature", "Number.Base"]
    public static categoriesFromTo: string[][] = [
      ["USD", "JPY", "BGN", "CZK", "DKK", "GBP", "HUF", "PLN", "RON", "SEK", "CHF", "ISK", "NOK", "HRK", "RUB", "TRY", "AUD", "BRL", "CAD", "CNY", "HKD", "IDR", "ILS", "INR", "KRW", "MXN", "MYR", "NZD", "PHP", "SGD", "THB", "ZAR"],
      ["Celsius", "Fahrenheit", "Kelvin"],
      ["2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36"]
    ]
  
    public static category = -1
    public static items: Array<string>
    public static from = -1
    public static to = -1
  }