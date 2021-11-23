import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-convert-info',
	templateUrl: './convert-info.component.html',
	styleUrls: ['./convert-info.component.css']
})

export class ConvertInfoComponent implements OnInit {
	public static categories = ["Currency", "Temperature", "Number.Base"]
	public static categoriesTemperature = ["Celsius", "Fahrenheit", "Kelvin"]

	constructor() { }

	ngOnInit(): void { }
}
