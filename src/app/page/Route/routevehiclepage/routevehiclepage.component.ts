import { Component, OnInit, Input ,EventEmitter, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RouteModel, CompanyModel } from '../../../models/datamodule.module'
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { variable } from '../../../variable';
import * as L from 'leaflet';



@Component({
  selector: 'app-routevehiclepage',
  templateUrl: './routevehiclepage.component.html',
  styleUrls: ['./routevehiclepage.component.scss']
})

export class RoutevehiclepageComponent implements OnInit {
  constructor(private modalService: NgbModal,public va: variable, private dialog: MatDialog, private snacbar: MatSnackBar){ }
  @Input() modal: any;
  @Input() company: CompanyModel = new CompanyModel();
  @Input() activeroute: RouteModel = new RouteModel();
  @Output() talk: EventEmitter<any> = new EventEmitter<any>();
  show = {Spinner: true};
  private map: L.Map | undefined;
  private mapIconSize = 30;
  private cmarkers: L.Marker | undefined;

  ngOnInit(){
    this.initMap();
    // console.log("activeroute :",this.activeroute)
    this.show.Spinner=false;
  }


   //--------------------- Leaflet  Map------------------------
   async initMap() {
    try {
      // console.log("this.map : ", this.map);
      this.map = L.map('dpinroutetmap', {
        center: [13.6140328, 100.6162229], // Latitude and longitude of the center point
        zoom: 13, // Initial zoom level
        layers: [
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap',
          }),
        ],
      });
      this.PlotRoute();
      return true;
    }
    catch (ex) { console.log("initMap error : ", ex); }
    return false
  }

  async PlotRoute() {
    var lastpoint: any = [13, 100];
    this.activeroute.dpinroute.forEach(item => {
      if (item.lat != 0 && item.lng != 0) {
        var marker = this.plotMarker(item.lat, item.lng, item.pointname);
        lastpoint = [item.lat, item.lng];
      }
    });
    if (this.map) { this.map.panTo(lastpoint); }
    return true;
  }

  private plotMarker(lat: any, lng: any, header: string) {
    if (this.map) {
      const customIcon = L.divIcon({
        html: `<div style="position: relative; width:${this.mapIconSize}px; height:${(this.mapIconSize * 2)}px; display: flex;">
                <img src="${this.va.icon.dpoi}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 1;" />
              </div>`,
        className: '', // Remove default styling
        iconSize: [this.mapIconSize, this.mapIconSize * 2], // Adjust size for side-by-side images
      });
      var htmlPopup: string = `<div class='container'>   
                                <div class'row no-gutter' style='display: flex;'>
                                  <center><p><strong>${header}</strong></p></center>
                                </div> 
                              </div>`
      const marker = L.marker([lat, lng], { icon: customIcon }).addTo(this.map)
        .bindPopup(htmlPopup);

      marker.on('popupopen', function () {
        setTimeout(() => { marker.closePopup(); }, 3000); // 3000ms = 3 seconds
      });
      const resizeMarkerIcon = () => {
        const zoomLevel = this.map?.getZoom();

        // Calculate new size based on zoom level (adjust the scaling factor as needed)
        const zl = zoomLevel ? zoomLevel : 13;
        const newSize = this.mapIconSize * (zl / 13); // Assuming zoom level 13 as base level

        // Update the marker icon size
        marker.setIcon(
          L.divIcon({
            html: `<div style="position: relative; width:${newSize}px; height:${(newSize * 2)}px; display: flex;">
                    <img src="${this.va.icon.dpoi}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 1;" />
                  </div>`,
            className: '', // Remove default styling
            iconSize: [newSize, newSize * 2], // Adjust size for side-by-side images
          })
        );
      };

      this.map.on('zoom', resizeMarkerIcon);
      return marker;
    }
    return null;
  }

  public async ShowCurrentPosition(lat: any, lng: any) {
    try {
      if (this.map) {
        if (this.cmarkers) {
          this.cmarkers.setLatLng([lat, lng]);
        }
        else {
          const zoomLevel = this.map?.getZoom();
          const zl = zoomLevel ? zoomLevel : 13;
          const newSize = this.mapIconSize * (zl / 13);
          const customIcon = L.divIcon({
            html: `<div style="position: relative; width:${newSize}px; height:${newSize}px; display: flex;  z-index: 100;">
                    <img src="${this.va.icon.thispoint}" style="position: absolute; top: 0; left: 0; width: ${newSize}px; height: ${newSize}px;" />
                  </div>`,
            className: '', // Remove default styling
            iconSize: [this.mapIconSize, this.mapIconSize], // Adjust size for side-by-side images
            iconAnchor: [newSize, newSize], // Top-left corner will be the anchor (x, y)
          });
          this.cmarkers = L.marker([lat, lng], { icon: customIcon }).addTo(this.map);

          setTimeout(() => {
            if (this.cmarkers) {
              this.cmarkers.remove();
              this.cmarkers = undefined;
            }
          }, 3000); // 3000 milliseconds = 3 seconds
        }
        this.map.setZoom(17);
        this.map.panTo([lat, lng]);

      }
      else {
        await this.initMap();
      }
    } catch (ex) { console.log("ShowCurrentPosition error : ", ex) }

  }

}