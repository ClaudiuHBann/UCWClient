import { HttpClient } from '@angular/common/http'
import { Component } from '@angular/core'
import { ConvertInfo } from './models/convert-info'

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})

export class AppComponent {
	constructor(private http: HttpClient) { }

	title = "Universal Converter"
	currentCategory = "Choose a category..."

	textAreaInputText = ""
	textAreaOutputText = ""

	OnClickButtonCategory(categoryNumber: number) {
		this.currentCategory = ConvertInfo.categories[categoryNumber - 1] + " Converter"

		var element = document.getElementById("dropdownMenuButtonFrom")
		if (element) {
			element.textContent = "From"
		}

		var element = document.getElementById("dropdownMenuButtonTo")
		if (element) {
			element.textContent = "To"
		}

		this.textAreaInputText = ""
		this.textAreaOutputText = ""
	}

	OnClickButtonSwitch() {
		var from = document.getElementById("dropdownMenuButtonFrom")
		var to = document.getElementById("dropdownMenuButtonTo")

		if (from && to) {
			var swap = from.textContent
			from.textContent = to.textContent
			to.textContent = swap
		}

		var fromValue = ConvertInfo.from
		ConvertInfo.from = ConvertInfo.to
		ConvertInfo.to = fromValue
	}

	FromTo(index: number) {
		let indexOfCurrentCategory = ConvertInfo.categories.indexOf(this.currentCategory.split(' ')[0])

		if (index < 0) {
			var element = document.getElementById("dropdownMenuButtonFrom")

			if (element) {
				element.textContent = ConvertInfo.categoriesFromTo[indexOfCurrentCategory][-index - 1]
				ConvertInfo.from = -index - 1
			}
		}
		else {
			var element = document.getElementById("dropdownMenuButtonTo")

			if (element) {
				element.textContent = ConvertInfo.categoriesFromTo[indexOfCurrentCategory][index - 1]
				ConvertInfo.to = index - 1
			}
		}

		if (this.currentCategory.split(' ')[0] == ConvertInfo.categories[2]) {
			var element1 = document.getElementById("dropdownMenuButtonFrom")
			var element2 = document.getElementById("dropdownMenuButtonTo")

			if (element1 && element2) {
				ConvertInfo.from = Number(element1.textContent)
				ConvertInfo.to = Number(element2.textContent)
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

	GenerateLIElements(elementID: string, index: number, negative: boolean) {
		var fromUL = document.getElementById(elementID)
		if (fromUL) {
			while (fromUL.firstChild) {
				fromUL.removeChild(fromUL.firstChild)
			}
		}

		ConvertInfo.categoriesFromTo[ConvertInfo.categories.indexOf(this.currentCategory.split(' ')[0])].forEach(element => {
			this.AppendLIWithAToUL(elementID, '#', "dropdown-item", element, negative ? index-- : index++)
		})
	}

	OnClickButtonFrom() {
		var fromUL = document.getElementById('dropdownMenuFromUL')
		if (fromUL) {
			let index = -1
			this.GenerateLIElements("dropdownMenuFromUL", index, true)
		}
	}

	OnClickButtonTo() {
		var toUL = document.getElementById('dropdownMenuToUL')
		if (toUL) {
			let index = 1
			this.GenerateLIElements("dropdownMenuToUL", index, false)
		}
	}

	replaceAll(str: string, find: string, replace: string) {
		return str.replace(new RegExp(find, 'g'), replace);
	}

	FormatInputTextAndChangeCIItems() {
		let formattedInputText: string = this.textAreaInputText
		formattedInputText = this.replaceAll(formattedInputText, ',', ' ')
		formattedInputText = this.replaceAll(formattedInputText, '\n', ' ')
		formattedInputText = formattedInputText.replace(/\s+/g, ' ')

		ConvertInfo.items = []
		formattedInputText.split(' ').forEach(element => {
			ConvertInfo.items.push(element)
		})
	}

	OnClickButtonConvert() {
		this.textAreaOutputText = ""
		this.FormatInputTextAndChangeCIItems()

		ConvertInfo.category = ConvertInfo.categories.indexOf(this.currentCategory.split(' ')[0])

		this.http.post<any>("http://162.55.32.18:8/ConvertInfo/Post", {
			"category": ConvertInfo.category,
			"items": ConvertInfo.items,
			"from": ConvertInfo.from,
			"to": ConvertInfo.to
		}, {
			headers: { "Content-Type": "application/json" }
		}).subscribe({
			next: result => result.forEach((item: string) => {
				this.textAreaOutputText += item + '\n'
			}),
			error: error => console.error(error)
		})
	}

	OnClickButtonCTC() {
		navigator.clipboard.writeText(this.textAreaOutputText)

		var x = document.getElementById("toastID");

		if (x != null) {
			x.className = "show";

			setTimeout(function () {
				if (x != null) {
					x.className = x.className.replace("show", "");
				}
			}, 3000);
		}
	}
}