import { Component , OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-loginpage',
  templateUrl: './loginpage.component.html',
  styleUrls: ['./loginpage.component.scss']
})
export class LoginpageComponent implements OnInit {
  constructor(private router: Router) {}
  public user = {
    email: "",
    pwd: "",
    md5: "",
    ipaddress: "",
    deviceid: "",
    uuid: "",
    showpwd: false,
  }
  ngOnInit(): void {
  }
  async onSubmit() {
    this.router.navigate(["company"]);
  }

}
