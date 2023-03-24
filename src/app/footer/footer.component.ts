import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
    constructor() { }
    ngOnInit(): void { }

    lastContactMeInfo = ""

    OnClickModal() {
        if (this.lastContactMeInfo != "") {
            navigator.clipboard.writeText(this.lastContactMeInfo)
        }
    }

    OnClickButtonContactMe(contactMeType: string) {
        var contactMeButton = document.getElementById(contactMeType)
        if (contactMeButton != null &&
            contactMeButton.textContent != null) {
            this.lastContactMeInfo = contactMeButton.textContent.substring(1)
        }
    }
}
