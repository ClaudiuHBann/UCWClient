import { Component, OnInit } from '@angular/core'

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.css']
})
export class ToastComponent implements OnInit {
  constructor() { }
  ngOnInit(): void { }

  static Show(text: string) {
    var toast = document.getElementById("toast")
    if (toast != null) {
      toast.children[0].textContent = text
      toast.className += " show"

      setTimeout(
        function () {
          if (toast != null) {
            toast.className = toast.className.replace(" show", "")
          }
        },
        3000)
    }
  }
}
