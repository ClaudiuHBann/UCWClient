import { Component } from '@angular/core';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})

export class AppComponent {
	title = "Client"
	currentCategory = "Choose a category..."
	categories = ["Currency", "Temperature", "Number.Base"]
	categoriesTemperature = ["Celsius", "Fahrenheit", "Kelvin"]
	isFromInit = false
	isToInit = false
	index = 0
	textAreaInputText = ""
	textAreaOutputText = ""

	OnClickButtonCategory(categoryNumber: number) {
		this.currentCategory = this.categories[categoryNumber - 1] + " Converter"
	}

	OnClickButtonSwitch() {
		var from = document.getElementById("dropdownMenuButtonFrom")
		var to = document.getElementById("dropdownMenuButtonTo")

		if (from && to) {
			var swap = from.textContent
			from.textContent = to.textContent
			to.textContent = swap
		}
	}

	FromTo(index: number) {
		if (index < this.categoriesTemperature.length) {
			var element = document.getElementById("dropdownMenuButtonFrom")

			if (element) {
				element.textContent = this.categoriesTemperature[index]
			}
		}
		else {
			var element = document.getElementById("dropdownMenuButtonTo")

			if (element) {
				element.textContent = this.categoriesTemperature[index - this.categoriesTemperature.length]
			}
		}
	}

	AppendLIWithAToUL(id: string, href: string, cles: string, textContent: string, index: number) {
		var ul = document.getElementById(id)
		var li = document.createElement("li")

		const a = document.createElement('a')
		a.textContent = textContent;

		a.setAttribute("href", href)
		a.setAttribute("class", cles)



		a.setAttribute("onclic", "FromTo(index)")
		a.onclick = () => this.FromTo(index)



		li.append(a)
		ul?.appendChild(li)
	}

	OnClickButtonFrom() {
		if (this.isFromInit == false) {
			this.categoriesTemperature.forEach(element => {
				this.AppendLIWithAToUL("dropdownMenuFromUL", '#', "dropdown-item", element, this.index++)
			})

			this.isFromInit = true
		}
	}

	OnClickButtonTo() {
		if (this.isToInit == false) {
			this.categoriesTemperature.forEach(element => {
				this.AppendLIWithAToUL("dropdownMenuToUL", '#', "dropdown-item", element, this.index++)
			})

			this.isToInit = true
		}
	}

	OnClickButtonConvert() {
		this.textAreaOutputText = this.textAreaInputText
	}

	OnClickButtonCTC() {
		navigator.clipboard.writeText(this.textAreaOutputText)
	}
}
