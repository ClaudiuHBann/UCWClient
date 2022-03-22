import { HttpClient } from '@angular/common/http'
import { Component } from '@angular/core'
import { ActivatedRoute, Params, Router } from '@angular/router'
import { isNumeric } from 'jquery'
import { skip } from 'rxjs'
import { ConvertInfo } from './models/convert-info'

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})

export class AppComponent {
	constructor(private http: HttpClient, private _route: ActivatedRoute, private _router: Router) {
		for (let index = 0; index < ConvertInfo.categoriesFromTo.length; index++) {
			if (isNumeric(ConvertInfo.categoriesFromTo[index][0])) {
				continue
			}

			ConvertInfo.categoriesFromTo[index] = ConvertInfo.categoriesFromTo[index].sort()
		}
	}

	ngOnInit() {
		this._route.queryParamMap
			.pipe(skip(1))
			.subscribe(params => {
				let queryParams: Params = {}

				let keyCategory, keyFrom, keyTo: string | null = null
				params.keys.forEach(key => {
					let keyLowerCase = key.toLowerCase()

					if (keyLowerCase == "category") {
						keyCategory = key
					} else if (keyLowerCase == "from") {
						keyFrom = key
					} else if (keyLowerCase == "to") {
						keyTo = key
					}
				})

				if (keyCategory != null && keyFrom == null && keyTo == null) {
					localStorage.removeItem("tait")
				}

				if (keyCategory != null) {
					let category = params.get(keyCategory)
					let indexOfCategory = ConvertInfo.categories.findIndex(item => category?.toLowerCase() === item.toLowerCase());
					if (category != null && indexOfCategory != -1) {
						queryParams["category"] = category.toLowerCase()

						this.OnClickButtonCategory(indexOfCategory + 1)

						ConvertInfo.category = indexOfCategory
					}
				}

				if (keyFrom != null) {
					let from = params.get(keyFrom)
					let indexOfFrom = ConvertInfo.categoriesFromTo[ConvertInfo.category].findIndex(item => from?.toLowerCase() === item.toLowerCase());
					if (from != null && indexOfFrom != -1) {
						queryParams["from"] = from.toLowerCase()

						var element = document.getElementById("dropdownMenuButtonFrom")
						if (element) {
							element.textContent = ConvertInfo.categoriesFromTo[ConvertInfo.category][indexOfFrom]
							ConvertInfo.from = indexOfFrom
						}
					}
				}

				if (keyTo != null) {
					let to = params.get(keyTo)
					let indexOfTo = ConvertInfo.categoriesFromTo[ConvertInfo.category].findIndex(item => to?.toLowerCase() === item.toLowerCase());
					if (to != null && indexOfTo != -1) {
						queryParams["to"] = to.toLowerCase()

						var element = document.getElementById("dropdownMenuButtonTo")
						if (element) {
							element.textContent = ConvertInfo.categoriesFromTo[ConvertInfo.category][indexOfTo]
							ConvertInfo.to = indexOfTo
						}
					}
				}

				this._router.navigate([], {
					relativeTo: this._route,
					queryParams: queryParams
				});


				this.SetTextAreaInputText()
			})
	}

	title = "Universal Converter"
	currentCategory = "Choose a category..."

	textAreaInputText = ""
	textAreaOutputText = ""
	lastContactMeInfo = ""

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

		this._router.navigate([], {
			relativeTo: this._route,
			queryParams: {
				category: ConvertInfo.categories[categoryNumber - 1]
			},
			queryParamsHandling: 'merge'
		});
	}

	OnClickModal() {
		if (this.lastContactMeInfo != "") {
			navigator.clipboard.writeText(this.lastContactMeInfo)
		}
	}

	OnClickButtonContactMe(contactMeType: string) {
		var contactMeButton = document.getElementById(contactMeType)
		if (contactMeButton != null && contactMeButton.textContent != null) {
			this.lastContactMeInfo = contactMeButton.textContent.substring(1)
		}
	}

	OnClickButtonSearch() {
		var search = document.getElementById("buttonSearch")
		console.log("OnClickButtonSearch")
	}

	OnClickButtonSwitch() {
		if (ConvertInfo.categories.indexOf(this.currentCategory.split(' ')[0]) == -1) {
			return
		}

		if (ConvertInfo.from == -1 && ConvertInfo.to == -1) {
			return
		}

		this.SaveTextAreaInputText()

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

		this._router.navigate([], {
			relativeTo: this._route,
			queryParams: {
				from: ConvertInfo.categoriesFromTo[ConvertInfo.category][ConvertInfo.from],
				to: ConvertInfo.categoriesFromTo[ConvertInfo.category][ConvertInfo.to]
			},
			queryParamsHandling: 'merge',

		});
	}

	SaveTextAreaInputText() {
		localStorage.setItem("tait", this.textAreaInputText);
	}

	SetTextAreaInputText() {
		var tait = localStorage.getItem("tait");
		if (tait != null) {
			this.textAreaInputText = tait;
		}
		//localStorage.removeItem("tait")
	}

	FromTo(index: number) {
		let indexOfCurrentCategory = ConvertInfo.categories.indexOf(this.currentCategory.split(' ')[0])

		this.SaveTextAreaInputText()

		if (index < 0) {
			var element = document.getElementById("dropdownMenuButtonFrom")

			if (element) {
				element.textContent = ConvertInfo.categoriesFromTo[indexOfCurrentCategory][-index - 1]
				ConvertInfo.from = -index - 1
			}

			this._router.navigate([], {
				relativeTo: this._route,
				queryParams: {
					from: ConvertInfo.categoriesFromTo[ConvertInfo.categories.indexOf(this.currentCategory.split(' ')[0])][ConvertInfo.from]
				},
				queryParamsHandling: 'merge'
			});
		}
		else {
			var element = document.getElementById("dropdownMenuButtonTo")

			if (element) {
				element.textContent = ConvertInfo.categoriesFromTo[indexOfCurrentCategory][index - 1]
				ConvertInfo.to = index - 1
			}

			this._router.navigate([], {
				relativeTo: this._route,
				queryParams: {
					to: ConvertInfo.categoriesFromTo[ConvertInfo.categories.indexOf(this.currentCategory.split(' ')[0])][ConvertInfo.to]
				},
				queryParamsHandling: 'merge'
			});
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

	AppendLIWithAToUL(id: string, cles: string, textContent: string, index: number) {
		var ul = document.getElementById(id)
		var li = document.createElement("li")

		const a = document.createElement('a')
		a.textContent = textContent;

		a.setAttribute("class", cles)

		a.setAttribute("style", "color: wheat;") // temporary

		a.setAttribute("onclick", "FromTo(index)")
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
			this.AppendLIWithAToUL(elementID, "dropdown-item", element, negative ? index-- : index++)
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
		if (ConvertInfo.from == -1 || ConvertInfo.to == -1 || ConvertInfo.categories.indexOf(this.currentCategory.split(' ')[0]) == -1) {
			return
		}

		this.textAreaOutputText = ""
		this.FormatInputTextAndChangeCIItems()

		ConvertInfo.category = ConvertInfo.categories.indexOf(this.currentCategory.split(' ')[0])

		console.log({
			"category": ConvertInfo.category,
			"items": ConvertInfo.items,
			"from": ConvertInfo.from,
			"to": ConvertInfo.to
		});

		// http://162.55.32.18:8/ConvertInfo/Post
		this.http.post<any>("http://localhost:5212/ConvertInfo/Post", {
			"category": ConvertInfo.category,
			"items": ConvertInfo.items,
			"from": ConvertInfo.from,
			"to": ConvertInfo.to
		}, {
			headers: { "Content-Type": "application/json" }
		}).subscribe({
			next: result => {
				console.log(result)

				result.forEach((item: string) => {
					this.textAreaOutputText += item + '\n'
				})
			},
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