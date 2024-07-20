import { Component ,OnInit} from '@angular/core';

@Component({
  selector: 'app-driverworkreportpage',
  templateUrl: './driverworkreportpage.component.html',
  styleUrls: ['./driverworkreportpage.component.scss'],
})
export class DriverworkreportpageComponent implements OnInit {
  // public ApiKey ="AIzaSyDZPeo_9pqKyrx62nYK5Zel7yQEyCH0omg"
  display:any;
  center:google.maps.LatLngLiteral ={lat:13.678558,lng:100.636596};
  zoom=6;

  ngOnInit(): void {
  
  }
  moveMap(even:google.maps.MapMouseEvent){
    if(even.latLng!=null){
      this.center = even.latLng.toJSON();
    }    
  }
  move(even:google.maps.MapMouseEvent){
    if(even.latLng!=null){
      this.display = even.latLng.toJSON();
    }    
  }
}
