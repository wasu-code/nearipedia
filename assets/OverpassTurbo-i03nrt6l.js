import{l as c}from"./index-BpTa-bTP.js";import"./index-D3P0sOPd.js";import v from"./APIService-C7cA8nIs.js";const l={id:"service2",name:"OpenStreetMap Tags",description:"Displays OSM tags using Overpass API",hint:"Enter a valid tag: key=value",baseURL:"https://overpass-api.de/api/interpreter?"},f={maxClusterRadius:40,disableClusteringAtZoom:16},$=p=>c.divIcon({iconSize:[32,32],iconAnchor:[16,22],popupAnchor:[0,-32],className:"material-icons",html:p});class w extends v{constructor(){super(),this.setMetadata(l),this.setTags([{value:"amenity=shelter",label:"Shelter",icon:"roofing",isActive:!0},{value:"amenity=toilets",label:"Toilets",icon:"wc",isActive:!0}])}async getLayers({bbox:e}){let u=[];e=`
      ${e._southWest.lat},
      ${e._southWest.lng},
      ${e._northEast.lat},
      ${e._northEast.lng}
    `;for(const t of this.getTags())if(t.isActive)try{const h=await(await fetch(l.baseURL,{method:"POST",headers:{Accept:"application/json","Content-Type":"application/json"},body:`[out:json];
                  (
                    node[${t.value}](${e});
                    way[${t.value}](${e});
                    relation[${t.value}](${e});
                  );
                  out center;`})).json(),a=c.markerClusterGroup(f);for(const s of h.elements){let r="";for(const i in s.tags)if(Object.hasOwnProperty.call(s.tags,i)){const g=s.tags[i],y=`${i}: ${g} <br/> `;r+=y}let o,n;s.type==="node"?(o=s.lat,n=s.lon):(o=s.center.lat,n=s.center.lon,r+="<br/> Center of way/polygon is shown");const d=c.marker([o,n],{icon:$(t.icon)}).bindPopup(`Type: ${t.label} <br/> <br/> ${r}`);a.addLayer(d)}a.customLayerName=`${l.name}:${t.label}`,u.push(a)}catch(m){console.error(`Error fetching data for ${t.value}:`,m)}return u}}export{w as default};
