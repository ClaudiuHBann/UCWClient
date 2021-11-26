import { Component, OnInit } from '@angular/core'

import { HttpClient } from '@angular/common/http'
import { ConvertInfoComponent } from '../convert-info/convert-info.component'

@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.css']
})
export class RequestComponent implements OnInit {
  constructor(private http: HttpClient) { }

  ngOnInit(): void { }

  Post<T>(url: string) { }
}
