// src/react-leaflet-overrides.d.ts
import 'react-leaflet';
import { LatLngExpression } from 'leaflet';

declare module 'react-leaflet' {
    interface MapContainerProps {
        center?: LatLngExpression;
        zoom?: number;
        scrollWheelZoom?: boolean;
        className?: string;
        // add other props if needed
    }
    interface TileLayerProps {
        attribution?: string;
        url?: string;
    }
    interface MarkerProps {
        position?: LatLngExpression;
    }
    // You can augment more interfaces if similar errors appear
}









