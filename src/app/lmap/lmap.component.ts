import { Component, OnInit  } from '@angular/core';
import * as L from 'leaflet'

@Component({
  selector: 'app-lmap',
  templateUrl: './lmap.component.html',
  styleUrls: ['./lmap.component.scss']
})
export class LmapComponent implements OnInit {
  private map:any;
  private centroid : L.LatLngExpression=[13.678598, 100.636158];
  listmarker:any =[];
  poly:any=[
    {lat:13.681323, lng:100.648037},
    {lat:13.678413, lng:100.644082},
    {lat:13.684619, lng:100.643851},
    {lat:13.682850, lng:100.649427},
  ]
  currencePosition:any;
  currenceMarker:any =null;
  curentRoute:any=null;
  listCurentpoint:L.LatLng[]=[];
  
  mousePosition={lat:0,lng:0};
  constructor(){}

  ngOnInit(): void {
    this.initMap();
    var temp = {lat:13.678598,lng:100.636158,header:"Home",description:"description",image:"../../assets/images/logo.png"};
    this.listmarker.push(temp);
    this.makeMarker(this.listmarker);
    this.createCycle(13.679201, 100.632169,100,'red',0.5,"I'm Cycle");
    this.createPolygon(this.poly,"I'm Polygon");
    this.createPolyline(this.poly,"I'm Polyline");
    var point=this.listmarker[0];
    this.showMapPopup(point.lat+0.05,point.lng+0.05,point.header,point.description,point.image);
    this.getCurenceLocation();
  }

  // ngAfterViewInit() {
  //   this.initMap();
  //   this.getCurenceLocation();
  // }

  private  getCurenceLocation(){
    if(!navigator.geolocation){
      console.log("Not support geolocation");
    }else{
      this.currencePosition = navigator.geolocation.getCurrentPosition((position)=>{
        const coords = position.coords;
        const LatLng = new L.LatLng(coords.latitude, coords.longitude);
        const locationtime = new Date(position.timestamp) ;
        this.UpdateCurentPosition(LatLng,locationtime)
      })
      // console.log("this.currencePosition :",this.currencePosition);
      this.watchPosition();
    }
  }

  private watchPosition(){
    let desLat=0;
    let desLng=0;
    let id=navigator.geolocation.watchPosition((position)=>{
      // console.log("watchPosition :",position);
      const coords = position.coords;
      const LatLng = new L.LatLng(coords.latitude, coords.longitude);
      const locationtime = new Date(position.timestamp) ;
      this.UpdateCurentPosition(LatLng,locationtime)
    },(err)=>{
      console.log("watchPosition Error ",err);
    },{
      enableHighAccuracy:true,
      timeout:5000,
      maximumAge:0,
    });
  }

  public UpdateCurentPosition(LatLng:L.LatLng,locationtime:Date){
    var updatetime = locationtime.toLocaleTimeString();
    const customIcon = L.icon({
      iconUrl: '../../assets/images/user-ic.png',
      iconSize: [38, 38], // size of the icon
      iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
      popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
    });
    if(this.currenceMarker==null){
      // this.currenceMarker =L.marker(LatLng,{ icon: customIcon }).addTo(this.map); 
      this.currenceMarker =L.marker(LatLng).addTo(this.map); 
      this.currenceMarker.bindPopup(updatetime).openPopup();
      this.curentRoute = L.polyline([LatLng,LatLng], { color: 'blue' }).addTo(this.map);
      // console.log("this.curentRoute.getLength() ",this.curentRoute.getLength()); 
    }else{
      this.currenceMarker.setLatLng(LatLng);
      this.currenceMarker.bindPopup(updatetime).openPopup();
      this.updatePolyline(LatLng);
    }
    this.setCurentRoute(LatLng);

    this.moveMap(LatLng);
    setTimeout(() => { this.currenceMarker.closePopup(); }, 3000);
  }
  private setCurentRoute(LatLng:L.LatLng,):void{
    this.listCurentpoint.push(LatLng);
    console.log("this.listCurentpoint;",this.listCurentpoint);
    // clear route
    if (this.map && this.curentRoute) { this.map.removeLayer(this.curentRoute); }

    // check Lenght of Route (หางยาว 5 จุด)
    if(this.listCurentpoint.length>5){
      var n =  this.listCurentpoint.length-5
      this.listCurentpoint.splice(0, n);
    }
    
    // cCreate Route (มากกว่า 3 จุด)
    if(this.listCurentpoint.length>2){
      var listpoints = [];
      for(const latLng of this.listCurentpoint){
        let latLngExpression  = new L.LatLng(latLng.lat, latLng.lng);
        listpoints.push(latLngExpression);
      }
      this.curentRoute = L.polyline(listpoints,{color:'red'}).addTo(this.map);
      console.log("this.curentRoute : ",this.curentRoute);  
    }
  }


  private moveMap(LatLng:L.LatLng) {
    try{
      if (this.map) {
        this.map.setView(LatLng, this.map.getZoom());
      }
      }catch(ex){
        console.log("moveMap error :",ex);
      }
  }
 
  private initMap():void{
    this.map = L.map('leafmap').setView([13.678598, 100.636158],15);
    const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', 
      { maxZoom:20,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
    tiles.addTo(this.map);
    this.map.on('click', (e: L.LeafletMouseEvent) => {
      this.UpdateCurentPosition(e.latlng,new Date())
    });
    this.map.on('mousemove', (e: L.LeafletMouseEvent) => {
      this.mousePosition.lat = e.latlng.lat;
      this.mousePosition.lng = e.latlng.lng;
    });
  }

  private showMapPopup(lat:any,lng:any,header:string,description:string,image:any){
    var popup = L.popup()
    .setLatLng([lat,lng])
    .setContent("<center><p><strong>"+ header + "</strong></p></center>" +
      "<img style='max-width:-webkit-full-available; width:50px;' src='"+ image + "'/><br />"+
      "<p>" + description +"</p>")
    .openOn(this.map);
  }

  private makeMarker(listmarker:any){
    for(const point of listmarker){
      // console.log("listmarker : ", c.lat+","+c.lng+","+c.header+","+c.description+","+c.image);
       this.plotMarker(point.lat,point.lng,point.header,point.description,point.image);
      // const marker = L.marker( [c.lat,c.lng]).addTo(this.map)
      // .bindPopup("<center><p><strong>"+c.header + "</strong></p></center>" +
      //   "<img style='max-width:-webkit-full-available; width:50px;' src='"+ c.image + "'/><br />"+
      //   "<p>" + c.description +"</p>")
      // .openPopup();
    }
  }

  private plotMarker(lat:any,lng:any,header:string,description:string,image:any):void{
    // console.log("listmarker : ", lat+","+lng+","+header+","+description+","+image);
    var htmlPopup:string ="<center><p><strong>"+ header + "</strong></p></center>" +
      "<img style='max-width:-webkit-full-available; width:50px;' src='"+ image + "'/><br />"+
      "<p>" + description +"</p>";
    const marker =L.marker([lat,lng]).addTo(this.map)
    .bindPopup(htmlPopup)
    .openPopup();
  }

  private createCycle(lat:any,lng:any,r:number,cor:any,Opacity:any,description:string):void{
    var circle = L.circle([lat,lng], {
      color: cor,
      fillColor: '#f03',
      fillOpacity: Opacity,
      radius: r
    }).addTo(this.map);
    circle.bindPopup(description);
  }

  private createPolygon(listmarker:any,description:string):void{
    var listpoints = [];

    for(const latLng of listmarker){
      let latLngExpression  = new L.LatLng(latLng.lat, latLng.lng);
      listpoints.push(latLngExpression);
    }
    var polygon = L.polygon(listpoints,{color:'blue'}).addTo(this.map);
    polygon.bindPopup(description);
  }
  private createPolyline(listmarker:any,description:string):void{
    var listpoints = [];

    for(const latLng of listmarker){
      let latLngExpression  = new L.LatLng(latLng.lat, latLng.lng);
      listpoints.push(latLngExpression);
    }
    var polyline = L.polyline(listpoints,{color:'red'}).addTo(this.map);
    polyline.bindPopup(description);
  }
  private updatePolyline(newCoords: L.LatLng): void {
    this.curentRoute.setLatLngs(newCoords);
    // console.log("this.curentRoute. Length :",this.curentRoute.getLength()); 

    // console.log("this.curentRoute :",this.curentRoute);
  }

  // public onMapClick(event:PointerEvent){
    public onMapClick(){
        
    // console.log("onMapClick :");
    // console.log("onMapClick :",event);
    // console.log("onMapClick :",event.lat);
        
  }



}
