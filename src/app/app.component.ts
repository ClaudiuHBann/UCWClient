import { Component } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { ConvertInfoComponent } from './UConverter/convert-info/convert-info.component'

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})

export class AppComponent {
	title = "Universal Converter"
	currentCategory = "Choose a category..."
	isFromInit = false
	isToInit = false
	index = 0
	textAreaInputText = ""
	textAreaOutputText = ""

	constructor(private http: HttpClient) { }

	OnClickButtonCategory(categoryNumber: number) {
		this.currentCategory = ConvertInfoComponent.categories[categoryNumber - 1] + " Converter"
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
		if (index < ConvertInfoComponent.categoriesTemperature.length) {
			var element = document.getElementById("dropdownMenuButtonFrom")

			if (element) {
				element.textContent = ConvertInfoComponent.categoriesTemperature[index]
			}
		}
		else {
			var element = document.getElementById("dropdownMenuButtonTo")

			if (element) {
				element.textContent = ConvertInfoComponent.categoriesTemperature[index - ConvertInfoComponent.categoriesTemperature.length]
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
			ConvertInfoComponent.categoriesTemperature.forEach(element => {
				this.AppendLIWithAToUL("dropdownMenuFromUL", '#', "dropdown-item", element, this.index++)
			})

			this.isFromInit = true
		}
	}

	OnClickButtonTo() {
		if (this.isToInit == false) {
			ConvertInfoComponent.categoriesTemperature.forEach(element => {
				this.AppendLIWithAToUL("dropdownMenuToUL", '#', "dropdown-item", element, this.index++)
			})

			this.isToInit = true
		}
	}

	OnClickButtonConvert() {
		this.http.post<any>("https://localhost:7212/ConvertInfo/Post", {
			"category": 1,
			"items": [
				"string1",
				"string2",
				"string3",
				"string3"
			],
			"from": 2,
			"to": 3
		}, {
			headers: { "Content-Type": "application/json" }
		}).subscribe({
			next: result => {
				console.log(result)
			},
			error: error => {
				console.error(error)
			}
		})
	}

	OnClickButtonCTC() {
		navigator.clipboard.writeText(this.textAreaOutputText)
	}
}