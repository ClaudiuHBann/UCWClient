import { Component } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { ConvertInfoComponent } from './UConverter/convert-info/convert-info.component'
import * as $ from 'jquery'

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})

export class AppComponent {
	title = "Universal Converter"
	currentCategory = "Choose a category..."
	lastCategory1 = "Choose a category..."
	lastCategory2 = "Choose a category..."

	isFromInit = false
	isToInit = false
	index = 0

	from = 0
	to = 0

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
		if (index < ConvertInfoComponent.categoriesFromTo[ConvertInfoComponent.categories.indexOf(this.currentCategory.split(' ')[0])].length) {
			var element = document.getElementById("dropdownMenuButtonFrom")

			if (element) {
				element.textContent = ConvertInfoComponent.categoriesFromTo[ConvertInfoComponent.categories.indexOf(this.currentCategory.split(' ')[0])][index]
				this.from = index
			}
		}
		else {
			var element = document.getElementById("dropdownMenuButtonTo")

			if (element) {
				element.textContent = ConvertInfoComponent.categoriesFromTo[ConvertInfoComponent.categories.indexOf(this.currentCategory.split(' ')[0])][index - ConvertInfoComponent.categoriesFromTo[ConvertInfoComponent.categories.indexOf(this.currentCategory.split(' ')[0])].length]
				this.to = index - ConvertInfoComponent.categoriesFromTo[ConvertInfoComponent.categories.indexOf(this.currentCategory.split(' ')[0])].length
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
		if (this.lastCategory1 != this.currentCategory) {
			var ul = document.getElementById('dropdownMenuFromUL')
			if (ul) {
				while (ul.firstChild) {
					ul.removeChild(ul.firstChild)
				}
			}

			this.isFromInit = false
		}

		if (this.isFromInit == false) {
			ConvertInfoComponent.categoriesFromTo[ConvertInfoComponent.categories.indexOf(this.currentCategory.split(' ')[0])].forEach(element => {
				this.AppendLIWithAToUL("dropdownMenuFromUL", '#', "dropdown-item", element, this.index++)
			})

			this.isFromInit = true
			this.lastCategory1 = this.currentCategory
		}
	}

	OnClickButtonTo() {
		if (this.lastCategory2 != this.currentCategory) {
			var ul = document.getElementById('dropdownMenuToUL')
			if (ul) {
				while (ul.firstChild) {
					ul.removeChild(ul.firstChild)
				}
			}

			this.isToInit = false
		}

		if (this.isToInit == false) {
			ConvertInfoComponent.categoriesFromTo[ConvertInfoComponent.categories.indexOf(this.currentCategory.split(' ')[0])].forEach(element => {
				this.AppendLIWithAToUL("dropdownMenuToUL", '#', "dropdown-item", element, this.index++)
			})

			this.isToInit = true
			this.lastCategory2 = this.currentCategory
		}
	}

	replaceAll(str: string, find: string, replace: string) {
		return str.replace(new RegExp(find, 'g'), replace);
	  }

	OnClickButtonConvert() {
		let items = new Array()

		this.textAreaInputText.split(',').forEach(element => {
			element = this.replaceAll(element, " ", "")
			element = this.replaceAll(element, ",", "")
			element = this.replaceAll(element, "\n", "")
			items.push(element)
		})

		console.log(items)

		this.http.post<any>("https://localhost:7212/ConvertInfo/Post", {
			"category": ConvertInfoComponent.categories.indexOf(this.currentCategory.split(' ')[0]),
			"items": JSON.stringify(items),
			"from": this.from,
			"to": this.to
		}, {
			headers: { "Content-Type": "application/json" }
		}).subscribe({
			next: result => {
				result.forEach((item: string) => {
					this.textAreaOutputText += item + '\n'
				})
			},
			error: error => {
				console.error(error)
			}
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