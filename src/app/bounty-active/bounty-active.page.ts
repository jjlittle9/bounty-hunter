import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Plugins } from '@capacitor/core';

const { Geolocation } = Plugins;

declare var google

@Component({
  selector: 'app-bounty-active',
  templateUrl: './bounty-active.page.html',
  styleUrls: ['./bounty-active.page.scss'],
})
export class BountyActivePage implements OnInit {
  
  @ViewChild('mapCanvas', { static: true}) mapElement: ElementRef;

  public map: any

  public userLocation: any
  public bountyLocation: any = {
    latitude: 41.43622019947232, 
    longitude: -96.49302303051182
  }
  constructor() { }

  ngOnInit() {

    this.loadMap();
  }

  loadMap() {

    this.userLocation = Geolocation.getCurrentPosition().then( userLocation => {
      console.log('position', userLocation);
    

      const userLocationObject = new google.maps.LatLng(userLocation.coords.latitude, userLocation.coords.longitude)
      

      const mapOptions = {
        zoom: 14.1,
        center: userLocationObject
      }
  
      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions)

      const userMarker = new google.maps.Marker({
        map: this.map,
        position: userLocationObject,
        animation: google.maps.Animation.DROP
      })

      const bountyLocationObject = new google.maps.LatLng(this.bountyLocation.latitude, this.bountyLocation.longitude)

      const distanceToBounty = Math.round(google.maps.geometry.spherical.computeDistanceBetween(userLocationObject, bountyLocationObject))

      console.log(distanceToBounty);

      let radius
      if (distanceToBounty > 1000) {
        radius = 500
      } else if (distanceToBounty <= 1000 && distanceToBounty > 500) {
        radius = 300
      } else if (distanceToBounty <= 500 && distanceToBounty > 100) {
        radius = 100
      } else {
        radius = 25
      }

      const bountyCircle = new google.maps.Circle({
        strokeColor: "#FF0000",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#FF0000",
        fillOpacity: 0.35,
        map: this.map,
        center: bountyLocationObject,
        radius: 100,
      });

    })
    // 41.4287643, -96.48232829999999
  }

}
