import { HttpClient } from '@angular/common/http'
import { Component } from '@angular/core'
import { ConvertInfoComponent } from './convert-info/convert-info.component'

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
		this.currentCategory = ConvertInfoComponent.categories[categoryNumber - 1] + " Converter"

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

		var fromValue = ConvertInfoComponent.from
		ConvertInfoComponent.from = ConvertInfoComponent.to
		ConvertInfoComponent.to = fromValue
	}

	FromTo(index: number) {
		let indexOfCurrentCategory = ConvertInfoComponent.categories.indexOf(this.currentCategory.split(' ')[0])

		if (index < 0) {
			var element = document.getElementById("dropdownMenuButtonFrom")

			if (element) {
				element.textContent = ConvertInfoComponent.categoriesFromTo[indexOfCurrentCategory][-index - 1]
				ConvertInfoComponent.from = -index - 1
			}
		}
		else {
			var element = document.getElementById("dropdownMenuButtonTo")

			if (element) {
				element.textContent = ConvertInfoComponent.categoriesFromTo[indexOfCurrentCategory][index - 1]
				ConvertInfoComponent.to = index - 1
			}
		}

		if (this.currentCategory.split(' ')[0] == ConvertInfoComponent.categories[2]) {
			var element1 = document.getElementById("dropdownMenuButtonFrom")
			var element2 = document.getElementById("dropdownMenuButtonTo")

			if (element1 && element2) {
				ConvertInfoComponent.from = Number(element1.textContent)
				ConvertInfoComponent.to = Number(element2.textContent)
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

		ConvertInfoComponent.categoriesFromTo[ConvertInfoComponent.categories.indexOf(this.currentCategory.split(' ')[0])].forEach(element => {
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

		ConvertInfoComponent.items = []
		formattedInputText.split(' ').forEach(element => {
			ConvertInfoComponent.items.push(element)
		})
	}

	OnClickButtonConvert() {
		this.textAreaOutputText = ""
		this.FormatInputTextAndChangeCIItems()

		ConvertInfoComponent.category = ConvertInfoComponent.categories.indexOf(this.currentCategory.split(' ')[0])

		this.http.post<any>("http://162.55.32.18:8/ConvertInfo/Post", {
			"category": ConvertInfoComponent.category,
			"items": ConvertInfoComponent.items,
			"from": ConvertInfoComponent.from,
			"to": ConvertInfoComponent.to
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