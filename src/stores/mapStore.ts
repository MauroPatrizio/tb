import { create } from "zustand";
import type { MapBounds, MapViewport } from "../types";

interface MapState {
	viewport: MapViewport;
	bounds: MapBounds | null;
	selectedLocation: string | null;
	isMapVisible: boolean;

	// Actions
	setViewport: (viewport: MapViewport) => void;
	setBounds: (bounds: MapBounds) => void;
	setSelectedLocation: (location: string | null) => void;
	toggleMapVisibility: () => void;
	setMapVisibility: (visible: boolean) => void;
}

export const useMapStore = create<MapState>((set) => ({
	viewport: {
		center: [-32.89084, -68.82717], // ✅ Mendoza, Argentina como centro por defecto
		zoom: 12,
	},
	bounds: null,
	selectedLocation: null,
	isMapVisible: false,

	setViewport: (viewport) => set({ viewport }),
	setBounds: (bounds) => set({ bounds }),
	setSelectedLocation: (location) => set({ selectedLocation: location }),
	toggleMapVisibility: () => set((state) => ({ isMapVisible: !state.isMapVisible })),
	setMapVisibility: (visible) => set({ isMapVisible: visible }),
}));
